//modules
import type { Directory } from 'ts-morph';
//stackpress-schema
import type Schema from 'stackpress-schema/Schema';
import {
  loadPackageJsonNest,
  savePackageJsonNest
} from 'stackpress-schema/transform/helpers';

/**
 * Patch the generated client package exports for MCP tool registries.
 */
export default function generate(directory: Directory, schema: Schema) {
  //load the generated client package manifest so the transform can extend it
  const pwd = directory.getPath();
  const packageJson = loadPackageJsonNest(pwd);

  //export the root tools registry so the ai runtime can load it from client
  packageJson.set('exports', './tools', './tools.js');
  packageJson.set('typesVersions', '*', './tools', [ './tools.d.ts' ]);

  //export each model tools index and tool modules for direct debugging
  schema.models.forEach(model => {
    const name = model.name.toPathName();
    const tools = `${name}/tools`;

    //export both the per-model tools index and each child tool module
    packageJson.set('exports', `./${tools}`, `./${tools}/index.js`);
    packageJson.set('exports', `./${tools}/*`, `./${tools}/*.js`);

    packageJson.set(
      'typesVersions',
      '*',
      `./${tools}`,
      [ `./${tools}/index.d.ts` ]
    );
    packageJson.set(
      'typesVersions',
      '*',
      `./${tools}/*`,
      [ `./${tools}/*.d.ts` ]
    );
  });

  //save the extended exports back into the generated client package
  savePackageJsonNest(pwd, packageJson);
}
