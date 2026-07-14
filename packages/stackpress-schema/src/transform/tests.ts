//modules
import type { Directory } from 'ts-morph';
//stackpress-schema
import type Fieldset from '../Fieldset.js';
import { loadProjectFile } from './helpers.js';

export type TestModule = {
  moduleSpecifier: string,
  name: string
};

function compare(left: string, right: string) {
  return left < right ? -1 : left > right ? 1 : 0;
}

function getExistingModules(directory: Directory, fieldset: Fieldset) {
  const filepath = fieldset.name.toPathName('%s/tests.ts');
  const source = loadProjectFile(directory, filepath);
  return source.getImportDeclarations().map(declaration => {
    const name = declaration.getDefaultImport()?.getText();
    if (!name) return null;
    return {
      moduleSpecifier: declaration.getModuleSpecifierValue(),
      name
    };
  }).filter((module): module is TestModule => module !== null);
}

export function generateTestAggregate(
  directory: Directory,
  fieldset: Fieldset,
  modules: TestModule[]
) {
  const filepath = fieldset.name.toPathName('%s/tests.ts');
  const source = loadProjectFile(directory, filepath);
  const combined = [
    ...getExistingModules(directory, fieldset),
    ...modules
  ].filter((module, index, modules) => (
    modules.findIndex(entry => (
      entry.moduleSpecifier === module.moduleSpecifier
        && entry.name === module.name
    )) === index
  )).sort((left, right) => compare(
    left.moduleSpecifier,
    right.moduleSpecifier
  ));

  source.replaceWithText('');

  //------------------------------------------------------------------//
  // Import Client

  for (const module of combined) {
    source.addImportDeclaration({
      moduleSpecifier: module.moduleSpecifier,
      defaultImport: module.name
    });
  }

  //------------------------------------------------------------------//
  // Exports

  source.addTypeAlias({
    name: 'TestRunner',
    type: '(engine?: any) => void'
  });
  source.addFunction({
    name: 'runTestRunner',
    parameters: [
      { name: 'testRunner', type: 'TestRunner' },
      { name: 'engine', type: 'any', hasQuestionToken: true }
    ],
    statements: 'testRunner(engine);'
  });
  source.addFunction({
    isExported: true,
    name: fieldset.name.toClassName('runAll%sTests'),
    parameters: [{ name: 'engine', type: 'any', hasQuestionToken: true }],
    statements: combined.map(module => (
      `runTestRunner(${module.name} as unknown as TestRunner, engine);`
    ))
  });
  source.addExportAssignment({
    expression: fieldset.name.toClassName('runAll%sTests'),
    isExportEquals: false
  });
};

export default function generate(directory: Directory, fieldset: Fieldset) {
  const columns = fieldset.columns.filter(
    column => !column.type.model && !column.type.fieldset
  );
  generateTestAggregate(directory, fieldset, [
    {
      moduleSpecifier: fieldset.name.toPathName('./tests/%sSchema.test.js'),
      name: fieldset.name.toClassName('%sSchemaTests')
    },
    ...columns.map(column => ({
      moduleSpecifier: column.name.toPathName('./tests/columns/%sColumn.test.js'),
      name: column.name.toClassName('%sColumnTests')
    })).toArray()
  ]);
};
