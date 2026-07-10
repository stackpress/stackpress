//modules
import type { Directory } from 'ts-morph';
//stackpress-schema
import type Fieldset from '../../Fieldset.js';
import type Model from '../../Model.js';
import { loadProjectFile } from '../helpers.js';

type TestTarget = Fieldset | Model;

function getColumns(model: TestTarget) {
  //dont include columns that are models or fieldsets
  //(those are generated as their own test groups)
  return model.columns
    .filter(column => !column.type.model && !column.type.fieldset)
    .toArray();
};

function getRunnerName(model: TestTarget) {
  return model.name.toClassName('%sTests');
};

function addSharedUtilities(source: ReturnType<typeof loadProjectFile>) {
  //type TestRunner = (engine?: any) => void;
  if (!source.getTypeAlias('TestRunner')) {
    source.addTypeAlias({
      name: 'TestRunner',
      type: '(engine?: any) => void'
    });
  }

  //function runTestRunner(testRunner: TestRunner, engine: any) {}
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

function addDefaultImportIfMissing(
  source: ReturnType<typeof loadProjectFile>,
  moduleSpecifier: string,
  defaultImport: string
) {
  //dont import the same test runner twice when schema and sql both contribute
  //to the same generated tests.ts file
  const hasImport = source.getImportDeclarations().some(declaration => (
    declaration.getModuleSpecifierValue() === moduleSpecifier
    && declaration.getDefaultImport()?.getText() === defaultImport
  ));

  if (!hasImport) {
    source.addImportDeclaration({
      moduleSpecifier,
      defaultImport
    });
  }
};

function removeDuplicateImports(source: ReturnType<typeof loadProjectFile>) {
  const seen = new Set<string>();

  for (const declaration of source.getImportDeclarations()) {
    const key = [
      declaration.getModuleSpecifierValue(),
      declaration.getDefaultImport()?.getText() || '',
      declaration.getNamedImports().map(item => item.getName()).join(',')
    ].join('|');

    if (seen.has(key)) {
      declaration.remove();
      continue;
    }

    seen.add(key);
  }
};

export function generateSchemaModelTests(directory: Directory, model: TestTarget) {
  const columns = getColumns(model);
  const schemaTestName = model.name.toClassName('%sSchemaTests');
  const filepath = model.name.toPathName('%s/tests.ts');
  //load Profile/tests.ts if it exists, if not create it
  const source = loadProjectFile(directory, filepath);

  //------------------------------------------------------------------//
  // Shared Utilities

  //type TestRunner = (engine?: any) => void;
  //function runTestRunner(testRunner: TestRunner, engine: any) {}
  addSharedUtilities(source);

  //------------------------------------------------------------------//
  // Import Client

  //import ProfileSchemaTests from './tests/ProfileSchema.test.js';
  addDefaultImportIfMissing(
    source,
    model.name.toPathName('./tests/%sSchema.test.js'),
    schemaTestName
  );

  //import IdColumnTests from './tests/columns/IdColumn.test.js';
  for (const column of columns) {
    addDefaultImportIfMissing(
      source,
      column.name.toPathName('./tests/columns/%sColumn.test.js'),
      column.name.toClassName('%sColumnTests')
    );
  }

  //clean up duplicate imports left by older generated output
  removeDuplicateImports(source);

  //------------------------------------------------------------------//
  // Exports

  //export function runSchemaTests(engine: any) {}
  if (!source.getFunction('runSchemaTests')) {
    source.addFunction({
      isExported: true,
      name: 'runSchemaTests',
      parameters: [{ name: 'engine', type: 'any' }],
      statements: [
        `runTestRunner(${schemaTestName} as unknown as TestRunner, engine);`,
        ...columns.map(column => (
          `runTestRunner(${column.name.toClassName('%sColumnTests')} as unknown as TestRunner, engine);`
        ))
      ].join('\n')
    });
  }

  //export default function runAllTests(engine: any) {}
  const runAllTests = source.getFunction('runAllTests');
  if (runAllTests) {
    const existing = runAllTests.getBodyText() || '';
    const next = existing.includes('runSchemaTests(engine);')
      ? existing
      : `runSchemaTests(engine);\n${existing}`.trim();
    runAllTests.setBodyText(next);
  } else {
    source.addFunction({
      isExported: true,
      isDefaultExport: true,
      name: 'runAllTests',
      parameters: [{ name: 'engine', type: 'any' }],
      statements: 'runSchemaTests(engine);'
    });
  }
};

export function generateSqlModelTests(directory: Directory, model: TestTarget) {
  const storeTestName = model.name.toClassName('%sStoreTests');
  const actionsTestName = model.name.toClassName('%sActionTests');
  const eventsTestName = model.name.toClassName('%sEventsTests');
  const filepath = model.name.toPathName('%s/tests.ts');
  //load Profile/tests.ts if it exists, if not create it
  const source = loadProjectFile(directory, filepath);

  //------------------------------------------------------------------//
  // Shared Utilities

  //type TestRunner = (engine?: any) => void;
  //function runTestRunner(testRunner: TestRunner, engine: any) {}
  addSharedUtilities(source);

  //------------------------------------------------------------------//
  // Import Client

  //import ProfileStoreTests from './tests/ProfileStore.test.js';
  addDefaultImportIfMissing(
    source,
    model.name.toPathName('./tests/%sStore.test.js'),
    storeTestName
  );
  //import ProfileActionTests from './tests/ProfileActions.test.js';
  addDefaultImportIfMissing(
    source,
    model.name.toPathName('./tests/%sActions.test.js'),
    actionsTestName
  );
  //import ProfileEventsTests from './tests/events.test.js';
  addDefaultImportIfMissing(
    source,
    model.name.toPathName('./tests/events.test.js'),
    eventsTestName
  );

  //clean up duplicate imports left by older generated output
  removeDuplicateImports(source);

  //------------------------------------------------------------------//
  // Exports

  //export function runSqlTests(engine: any) {}
  if (!source.getFunction('runSqlTests')) {
    source.addFunction({
      isExported: true,
      name: 'runSqlTests',
      parameters: [{ name: 'engine', type: 'any' }],
      statements: [
        `runTestRunner(${storeTestName} as unknown as TestRunner, engine);`,
        `runTestRunner(${actionsTestName} as unknown as TestRunner, engine);`,
        `runTestRunner(${eventsTestName} as unknown as TestRunner, engine);`
      ].join('\n')
    });
  }

  //export default function runAllTests(engine: any) {}
  const runAllTests = source.getFunction('runAllTests');
  if (runAllTests) {
    const existing = runAllTests.getBodyText() || '';
    const next = existing.includes('runSqlTests(engine);')
      ? existing
      : `${existing}\nrunSqlTests(engine);`.trim();
    runAllTests.setBodyText(next);
  } else {
    source.addFunction({
      isExported: true,
      isDefaultExport: true,
      name: 'runAllTests',
      parameters: [{ name: 'engine', type: 'any' }],
      statements: 'runSqlTests(engine);'
    });
  }
};

export function generateTestsIndex(directory: Directory, models: TestTarget[]) {
  const filepath = 'tests.ts';
  //load tests.ts if it exists, if not create it
  const source = loadProjectFile(directory, filepath);

  //------------------------------------------------------------------//
  // Import Client

  //import ProfileTests from './Profile/tests.js';
  for (const model of models) {
    addDefaultImportIfMissing(
      source,
      model.name.toPathName('./%s/tests.js'),
      getRunnerName(model)
    );
  }

  //------------------------------------------------------------------//
  // Exports

  //export default function runAllTests(engine: any) {}
  if (!source.getFunction('runAllTests')) {
    source.addFunction({
      isExported: true,
      isDefaultExport: true,
      name: 'runAllTests',
      parameters: [{ name: 'engine', type: 'any' }],
      statements: models
        .map(model => `${getRunnerName(model)}(engine);`)
        .join('\n')
    });
  }

  removeDuplicateImports(source);
};
