//node
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
//modules
import { parse } from '@stackpress/idea-parser';
import { expect } from 'chai';
import { describe, it } from 'mocha';
import { createProject } from 'stackpress-schema/transform/helpers';
//client
import generate from '../src/transform/index.js';

/**
 * Cache the parsed blog schema so the suite stays aligned with the live
 * template without reparsing the idea file for every call.
 */
let blogSchema: Record<string, unknown> | null = null;

/**
 * Load the current blog template schema from schema.idea.
 */
function loadBlogSchema() {
  if (blogSchema) {
    return blogSchema;
  }

  const tests = path.dirname(fileURLToPath(import.meta.url));
  const idea = path.resolve(
    tests,
    '../../../templates/blog/schema.idea'
  );
  const source = fs.readFileSync(idea, 'utf-8');

  blogSchema = parse(source) as Record<string, unknown>;
  return blogSchema;
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
    const schema = loadBlogSchema();

    await generate({
      config: {},
      cwd: tmpdir,
      directory,
      project,
      schema,
      terminal: {} as never,
      transformer: {} as never
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
