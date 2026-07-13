//modules
import type { Directory, SourceFile } from 'ts-morph';
//stackpress-schema
import type Fieldset from '../Fieldset.js';
import type Model from '../Model.js';
import type Schema from '../Schema.js';
import { loadProjectFile } from './helpers.js';

type TestTarget = Fieldset | Model;

type TestModule = {
  moduleSpecifier: string,
  name: string
};

function getTestModules(model: TestTarget) {
  //dont include columns generated as their own model or fieldset groups
  const columns = model.columns
    .filter(column => !column.type.model && !column.type.fieldset)
    .toArray();

  return [
    {
      moduleSpecifier: model.name.toPathName('./tests/%sSchema.test.js'),
      name: model.name.toClassName('%sSchemaTests')
    },
    ...columns.map(column => ({
      moduleSpecifier: column.name.toPathName(
        './tests/columns/%sColumn.test.js'
      ),
      name: column.name.toClassName('%sColumnTests')
    }))
  ];
};

function addDefaultImport(source: SourceFile, module: TestModule) {
  const existing = source.getImportDeclarations().find(declaration => (
    declaration.getModuleSpecifierValue() === module.moduleSpecifier
  ));

  if (existing) {
    existing.setDefaultImport(module.name);
    return;
  }

  source.addImportDeclaration({
    moduleSpecifier: module.moduleSpecifier,
    defaultImport: module.name
  });
};

function addSharedUtilities(source: SourceFile) {
  if (!source.getTypeAlias('TestRunner')) {
    source.addTypeAlias({
      name: 'TestRunner',
      type: '(engine?: any) => void'
    });
  }

  if (!source.getFunction('runTestRunner')) {
    source.addFunction({
      name: 'runTestRunner',
      parameters: [
        { name: 'testRunner', type: 'TestRunner' },
        { name: 'engine', type: 'any' }
      ],
      statements: 'testRunner(engine);'
    });
  }
};

export function generateModelTests(
  directory: Directory,
  model: TestTarget
) {
  const modules = getTestModules(model);
  const filepath = model.name.toPathName('%s/tests.ts');
  //load Profile/tests.ts if it exists, if not create it
  const source = loadProjectFile(directory, filepath);

  //------------------------------------------------------------------//
  // Import Client

  for (const module of modules) {
    addDefaultImport(source, module);
  }

  //------------------------------------------------------------------//
  // Exports

  addSharedUtilities(source);

  const runnerName = model.name.toClassName('runAll%sTests');
  const statements = modules.map(module => (
    `runTestRunner(${module.name} as unknown as TestRunner, engine);`
  )).join('\n');
  const runner = source.getFunction(runnerName)
    || source.getFunction('runAllTests');

  if (runner) {
    runner.rename(runnerName);
    runner.setIsExported(true);
    runner.setIsDefaultExport(true);
    runner.setBodyText(statements);
  } else {
    source.addFunction({
      isExported: true,
      isDefaultExport: true,
      name: runnerName,
      parameters: [{ name: 'engine', type: 'any' }],
      statements
    });
  }
};

export function generateTests(directory: Directory, schema: Schema) {
  //load tests.ts if it exists, if not create it
  const source = loadProjectFile(directory, 'tests.ts');
  //this root entrypoint is schema-owned, so rebuild it deterministically
  source.replaceWithText('');
  const models = Array.from(schema.models.values()).sort((left, right) => (
    left.name.toPathName().localeCompare(right.name.toPathName())
  ));

  //------------------------------------------------------------------//
  // Import Client

  for (const model of models) {
    addDefaultImport(source, {
      moduleSpecifier: model.name.toPathName('./%s/tests.js'),
      name: model.name.toClassName('runAll%sTests')
    });
  }

  //------------------------------------------------------------------//
  // Exports

  const statements = models.map(model => (
    `${model.name.toClassName('runAll%sTests')}(engine);`
  )).join('\n');
  const runner = source.getFunction('runAllTests');

  if (runner) {
    runner.setIsExported(true);
    runner.setIsDefaultExport(true);
    runner.setBodyText(statements);
  } else {
    source.addFunction({
      isExported: true,
      isDefaultExport: true,
      name: 'runAllTests',
      parameters: [{ name: 'engine', type: 'any' }],
      statements
    });
  }
};
