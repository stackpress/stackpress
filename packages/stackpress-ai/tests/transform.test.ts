//node
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
//modules
import { expect } from 'chai';
import { describe, it } from 'mocha';
import FileLoader from '@stackpress/lib/FileLoader';
import { Transformer } from '@stackpress/idea-transformer';
import { server as http } from '@stackpress/ingest/http';
import { createProject } from 'stackpress-schema/transform/helpers';
//client
import generate from '../src/transform/index.js';

/**
 * Build one transformer pointed at the real blog schema fixture.
 */
async function makeBlogSchema() {
  //point the transformer at the real blog schema so the test exercises the
  // same model metadata the template uses in practice.
  const cwd = process.cwd();
  const idea = path.resolve(
    path.dirname(new URL(import.meta.url).pathname),
    '../../../templates/blog/schema.idea'
  );
  const server = http({ cwd });
  const loader = new FileLoader(server.loader.fs, server.loader.cwd);
  const transformer = new Transformer(idea, loader);

  return {
    schema: await transformer.schema(),
    transformer
  };
}

describe('ai/transform', () => {
  it('should generate client tool registries for blog models', async function() {
    this.timeout(10000);

    //build the transform output in a temp project so the assertions stay
    // isolated from the template's committed generated files.
    const tmpdir = fs.mkdtempSync(
      path.join(os.tmpdir(), 'stackpress-ai-transform-')
    );
    const project = await createProject(tmpdir);
    const directory = project.createDirectory(tmpdir);
    const { schema, transformer } = await makeBlogSchema();

    await generate({
      config: {},
      cwd: tmpdir,
      directory,
      project,
      schema,
      terminal: {} as never,
      transformer
    });

    //inspect the generated registry surface the runtime depends on.
    const tools = directory.getSourceFileOrThrow('tools.ts');
    const index = directory.getSourceFileOrThrow('index.ts');
    const articleTools = directory.getSourceFileOrThrow(
      'Article/tools/index.ts'
    );
    const articleCreate = directory.getSourceFileOrThrow(
      'Article/tools/create.ts'
    );
    const packageJson = JSON.parse(
      fs.readFileSync(path.join(tmpdir, 'package.json'), 'utf-8')
    ) as {
      exports: Record<string, string>
    };

    expect(index.getFullText()).to.match(
      /import tools from ['"]\.\/tools\.js['"];/
    );
    expect(index.getFullText()).to.contain('export { tools };');
    expect(tools.getFullText()).to.contain('ArticleTools.listen(emitter);');
    expect(articleTools.getFullText()).to.contain(
      "'article-detail-tool'"
    );
    expect(articleTools.getFullText()).to.contain(
      "'article-update-tool'"
    );
    expect(articleCreate.getFullText()).to.contain('"event": "article-create"');
    expect(packageJson.exports['./tools']).to.equal('./tools.js');
    expect(packageJson.exports['./Article/tools']).to.equal(
      './Article/tools/index.js'
    );
  });
});
