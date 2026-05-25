//modules
import type { Directory } from 'ts-morph';
import { VariableDeclarationKind } from 'ts-morph';
//stackpress-schema
import type Model from 'stackpress-schema/Model';
import type Schema from 'stackpress-schema/Schema';
import { loadProjectFile } from 'stackpress-schema/transform/helpers';
//client
import type { GeneratedModelToolOperation } from './helpers.js';
import {
  makeGeneratedTool,
  OPERATIONS
} from './helpers.js';

//--------------------------------------------------------------------//
// Functions

/**
 * Generate every per-model MCP tool file plus the top-level tools registry.
 */
export default function generate(directory: Directory, schema: Schema) {
  //walk each generated model and write its tool files beside the model files
  for (const model of schema.models.values()) {
    for (const operation of OPERATIONS) {
      generateTool(directory, model, operation);
    }

    generateModelTools(directory, model);
  }

  //once every model has its own registry, generate the root tools export
  generateRootTools(directory, schema);
}

/**
 * Generate one tool config module for a model operation pair.
 */
export function generateTool(
  directory: Directory,
  model: Model,
  operation: GeneratedModelToolOperation
) {
  //start by asking the helper for the final serializable tool config
  const tool = makeGeneratedTool(model, operation);
  if (!tool) {
    return;
  }

  //turn the operation into a stable PascalCase handler name for the file
  const operationName = operation[0].toUpperCase() + operation.slice(1);
  const handlerName = [
    model.name.toPropertyName('%s', true),
    `${operationName}ToolEvent`
  ].join('');

  //load or create the target tool file, then replace any previous output
  const filepath = model.name.toPathName(`%s/tools/${operation}.ts`);
  const source = loadProjectFile(directory, filepath);
  source.replaceWithText('');

  //import type { RouteProps } from 'stackpress-server';
  source.addImportDeclaration({
    isTypeOnly: true,
    namedImports: [ 'RouteProps' ],
    moduleSpecifier: 'stackpress-server'
  });

  //import { action } from 'stackpress-server';
  source.addImportDeclaration({
    namedImports: [ 'action' ],
    moduleSpecifier: 'stackpress-server'
  });

  //import type { ToolConfig } from 'stackpress-ai/types';
  source.addImportDeclaration({
    isTypeOnly: true,
    namedImports: [ 'ToolConfig' ],
    moduleSpecifier: 'stackpress-ai/types'
  });

  //export const config: ToolConfig = {};
  source.addVariableStatement({
    declarationKind: VariableDeclarationKind.Const,
    declarations: [{
      name: 'config',
      type: 'ToolConfig',
      initializer: JSON.stringify(tool, null, 2)
    }],
    isExported: true
  });

  //export default action(ArticleDetailToolEvent);
  source.addFunction({
    isAsync: true,
    name: handlerName,
    parameters: [{ name: '{ res }', type: 'RouteProps' }],
    statements: 'res.results(config);'
  });
  source.addStatements(`export default action(${handlerName});`);
}

/**
 * Generate one per-model tools registry and resolver listener.
 */
export function generateModelTools(directory: Directory, model: Model) {
  //load the per-model tools registry and clear any older generated content
  const filepath = model.name.toPathName('%s/tools/index.ts');
  const source = loadProjectFile(directory, filepath);
  source.replaceWithText('');

  //import create from './create.js';
  for (const operation of OPERATIONS) {
    source.addImportDeclaration({
      defaultImport: operation,
      moduleSpecifier: `./${operation}.js`
    });
  }

  //export { create, detail, search, update };
  source.addExportDeclaration({
    namedExports: [ ...OPERATIONS ]
  });

  //export function listen(emitter: Record<string, any> & { on: ... }) {}
  source.addFunction({
    isExported: true,
    name: 'listen',
    parameters: [{
      name: 'emitter',
      type: [
        'Record<string, any>',
        '& { on: (event: string, listener: Function) => any }'
      ].join(' ')
    }],
    statements: OPERATIONS.map(operation => {
      return `emitter.on(
  '${model.name.toEventName(`%s-${operation}-tool`)}',
  ${operation}
);`;
    }).join('\n\n')
  });

  //export default { create, detail, listen, search, update };
  source.addStatements(`
    const factory = {
      ${OPERATIONS.join(', ')},
      listen
    };
    export default factory;
  `);
}

/**
 * Generate the top-level client tools registry.
 */
export function generateRootTools(directory: Directory, schema: Schema) {
  //load the root tools registry that the generated client package exports
  const source = loadProjectFile(directory, 'tools.ts');
  source.replaceWithText('');

  //import ArticleTools from './Article/tools/index.js';
  for (const model of schema.models.values()) {
    source.addImportDeclaration({
      defaultImport: model.name.toPropertyName('%sTools', true),
      moduleSpecifier: model.name.toPathName('./%s/tools/index.js')
    });
  }

  //export function listen(emitter: Record<string, any> & { on: ... }) {}
  source.addFunction({
    isExported: true,
    name: 'listen',
    parameters: [{
      name: 'emitter',
      type: [
        'Record<string, any>',
        '& { on: (event: string, listener: Function) => any }'
      ].join(' ')
    }],
    statements: Array.from(schema.models.values()).map(model => {
      return `${model.name.toPropertyName('%sTools', true)}.listen(emitter);`;
    }).join('\n')
  });

  //export default { listen };
  source.addStatements(`
    const factory = { listen };
    export default factory;
  `);
}
