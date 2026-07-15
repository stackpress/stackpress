//modules
import type { Directory } from 'ts-morph';
//stackpress-schema
import type Schema from 'stackpress-schema/Schema';
import {
  loadProjectFile
} from 'stackpress-schema/transform/helpers';

export default function generate(directory: Directory, schema: Schema) {
  const filepath = 'tests.ts';
  //load tests.ts if it exists, if not create it
  const source = loadProjectFile(directory, filepath);
  //clear source file for idempotent regeneration
  source.replaceWithText('');

  //------------------------------------------------------------------//
  // Import runAll*Tests from each model

  for (const model of schema.models.values()) {
    //import runAll<Model>Tests from './<Model>/tests.js';
    source.addImportDeclaration({
      moduleSpecifier: model.name.toPathName('./%s/tests.js'),
      defaultImport: model.name.toPropertyName('runAll%sTests', true)
    });
  }

  //------------------------------------------------------------------//
  // Default Export

  const modelNames = Array.from(schema.models.values());

  //export default function runAllTests(engine?: any) { ... }
  source.addFunction({
    isExported: true,
    isDefaultExport: true,
    name: 'runAllTests',
    parameters: [{ name: 'engine', type: 'any', hasQuestionToken: true }],
    statements: modelNames.map(
      model => `${model.name.toPropertyName('runAll%sTests', true)}(engine);`
    ).join('\n')
  });
};
