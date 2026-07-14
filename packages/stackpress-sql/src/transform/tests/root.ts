//modules
import type { Directory } from 'ts-morph';
//stackpress-schema
import type Schema from 'stackpress-schema/Schema';
import { loadProjectFile } from 'stackpress-schema/transform/helpers';

function compare(left: string, right: string) {
  return left < right ? -1 : left > right ? 1 : 0;
}

export default function generate(directory: Directory, schema: Schema) {
  const source = loadProjectFile(directory, 'tests.ts');
  const models = Array.from(schema.models.values()).sort((left, right) => (
    compare(left.name.toPathName(), right.name.toPathName())
  ));
  source.replaceWithText('');

  //------------------------------------------------------------------//
  // Import Client

  for (const model of models) {
    source.addImportDeclaration({
      moduleSpecifier: model.name.toPathName('./%s/tests.js'),
      defaultImport: model.name.toClassName('runAll%sTests')
    });
  }

  //------------------------------------------------------------------//
  // Exports

  source.addFunction({
    isDefaultExport: true,
    name: 'runAllTests',
    parameters: [{ name: 'engine', type: 'any', hasQuestionToken: true }],
    statements: models.map(model => (
      `${model.name.toClassName('runAll%sTests')}(engine);`
    ))
  });
};
