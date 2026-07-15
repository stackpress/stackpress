//modules
import type { Directory } from 'ts-morph';
//stackpress-schema
import type Model from 'stackpress-schema/Model';
import {
  loadProjectFile
} from 'stackpress-schema/transform/helpers';

export default function generate(directory: Directory, model: Model) {
  //only primitive columns (not model-backed, not fieldset-backed) get test files
  const columns = model.columns.filter(
    column => !column.type.model && !column.type.fieldset
  );

  const filepath = model.name.toPathName('%s/tests.ts');
  //load <Model>/tests.ts if it exists, if not create it
  const source = loadProjectFile(directory, filepath);
  //clear source file for idempotent regeneration
  source.replaceWithText('');

  //------------------------------------------------------------------//
  // Import Modules

  //import <Model>ActionTests from './tests/<Model>Actions.test.js';
  source.addImportDeclaration({
    moduleSpecifier: model.name.toPathName('./tests/%sActions.test.js'),
    defaultImport: model.name.toClassName('%sActionTests')
  });
  //import <Model>SchemaTests from './tests/<Model>Schema.test.js';
  source.addImportDeclaration({
    moduleSpecifier: model.name.toPathName('./tests/%sSchema.test.js'),
    defaultImport: model.name.toClassName('%sSchemaTests')
  });
  //import <Model>StoreTests from './tests/<Model>Store.test.js';
  source.addImportDeclaration({
    moduleSpecifier: model.name.toPathName('./tests/%sStore.test.js'),
    defaultImport: model.name.toClassName('%sStoreTests')
  });

  //------------------------------------------------------------------//
  // Import Column Tests (sorted alphabetically by column name)

  const sortedColumns = Array.from(columns.values()).sort(
    (a, b) => a.name.toPathName().localeCompare(b.name.toPathName())
  );

  for (const column of sortedColumns) {
    //import <Col>ColumnTests from './tests/columns/<Col>Column.test.js';
    source.addImportDeclaration({
      moduleSpecifier: column.name.toPathName('./tests/columns/%sColumn.test.js'),
      defaultImport: column.name.toClassName('%sColumnTests')
    });
  }

  //------------------------------------------------------------------//
  // Import Events Tests

  //import <Model>EventsTests from './tests/events.test.js';
  source.addImportDeclaration({
    moduleSpecifier: './tests/events.test.js',
    defaultImport: model.name.toClassName('%sEventsTests')
  });

  //------------------------------------------------------------------//
  // Type and Helper

  //type TestRunner = (engine?: any) => void;
  source.addTypeAlias({
    isExported: false,
    name: 'TestRunner',
    type: '(engine?: any) => void'
  });
  //function runTestRunner(testRunner: TestRunner, engine?: any) { ... }
  source.addFunction({
    isExported: false,
    name: 'runTestRunner',
    parameters: [
      { name: 'testRunner', type: 'TestRunner' },
      { name: 'engine', type: 'any', hasQuestionToken: true }
    ],
    statements: 'testRunner(engine);'
  });

  //------------------------------------------------------------------//
  // Named + Default Export

  const runAllName = model.name.toClassName('runAll%sTests');

  const runTestCalls = [
    model.name.toClassName('%sActionTests'),
    model.name.toClassName('%sSchemaTests'),
    model.name.toClassName('%sStoreTests'),
    ...sortedColumns.map(
      column => column.name.toClassName('%sColumnTests')
    ),
    model.name.toClassName('%sEventsTests')
  ];

  //export function runAll<Model>Tests(engine?: any) { ... }
  source.addFunction({
    isExported: true,
    name: runAllName,
    parameters: [{ name: 'engine', type: 'any', hasQuestionToken: true }],
    statements: runTestCalls.map(
      name => `runTestRunner(${name} as unknown as TestRunner, engine);`
    ).join('\n')
  });

  //export default runAll<Model>Tests;
  source.addExportAssignment({
    expression: runAllName,
    isExportEquals: false
  });
};
