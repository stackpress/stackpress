//modules
import type { Directory, SourceFile } from 'ts-morph';
//stackpress-schema
import type Model from 'stackpress-schema/Model';
import { loadProjectFile } from 'stackpress-schema/transform/helpers';
//stackpress-sql
import type {
  TestAggregateContext,
  TestModule
} from './types.js';

function compare(left: string, right: string) {
  return left < right ? -1 : left > right ? 1 : 0;
}

function normalize(filepath: string) {
  return filepath.replaceAll('\\', '/').replace(/\/$/, '');
}

function getDefaultRunner(source: SourceFile) {
  return source.getFunctions().find(
    declaration => declaration.isDefaultExport()
  )?.getName();
}

function getTestModules(directory: Directory, model: Model) {
  const pwd = normalize(directory.getPath());
  const modelPath = model.name.toPathName();
  const testsPath = `${pwd}/${modelPath}/tests/`;

  return directory.getProject().getSourceFiles()
    .filter(source => {
      const filepath = normalize(source.getFilePath());
      return filepath.startsWith(testsPath)
        && filepath.endsWith('.test.ts');
    })
    .map(source => {
      const name = getDefaultRunner(source);
      if (!name) return null;
      const filepath = normalize(source.getFilePath());
      const relative = filepath
        .slice(`${pwd}/${modelPath}/`.length)
        .replace(/\.ts$/, '.js');
      return {
        moduleSpecifier: `./${relative}`,
        name
      };
    })
    .filter((module): module is TestModule => module !== null)
    .sort((left, right) => compare(
      left.moduleSpecifier,
      right.moduleSpecifier
    ));
}

export function getTestAggregateContext(
  directory: Directory,
  model: Model
): TestAggregateContext {
  return {
    model,
    modules: getTestModules(directory, model)
  };
}

export default function generate(directory: Directory, model: Model) {
  const context = getTestAggregateContext(directory, model);
  const filepath = model.name.toPathName('%s/tests.ts');
  //load Profile/tests.ts if it exists, if not create it
  const source = loadProjectFile(directory, filepath);
  source.replaceWithText('');

  //------------------------------------------------------------------//
  // Import Client

  for (const module of context.modules) {
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
    isDefaultExport: true,
    name: model.name.toClassName('runAll%sTests'),
    parameters: [{ name: 'engine', type: 'any', hasQuestionToken: true }],
    statements: context.modules.map(module => (
      `runTestRunner(${module.name} as unknown as TestRunner, engine);`
    ))
  });
};
