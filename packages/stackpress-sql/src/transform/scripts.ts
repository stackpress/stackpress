//modules
import type { Directory } from 'ts-morph';
//stackpress-schema
import type Schema from 'stackpress-schema/Schema';
import { 
  loadProjectFile, 
  renderCode 
} from 'stackpress-schema/transform/helpers';
//stackpress-sql
import { arrangeModelSequence } from './helpers.js';

export default function generate(directory: Directory, schema: Schema) {
  const models = schema.models.toArray();
  const sequence = arrangeModelSequence(models);
  const reverse = [ ...sequence ].reverse();
  //load Profile/index.ts if it exists, if not create it
  const source = loadProjectFile(directory, 'scripts.ts');

  //------------------------------------------------------------------//
  // Import Modules
  //------------------------------------------------------------------//
  // Import Stackpress

  //import type Create from "@stackpress/inquire/Create";
  source.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: '@stackpress/inquire/Create',
    defaultImport: 'Create'
  });
  //import type Engine from '@stackpress/inquire/Engine';
  source.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: '@stackpress/inquire/Engine',
    defaultImport: 'Engine'
  });

  //------------------------------------------------------------------//
  // Import Client

  //import ProfileActions from './Profile/ProfileActions.js';
  for (const model of models) {
    source.addImportDeclaration({
      moduleSpecifier: model.name.toPathName('./%s/%sActions.js'),
      defaultImport: model.name.toClassName('%sActions')
    });
  }

  //------------------------------------------------------------------//
  // Exports

  //export function actions(engine: Engine) {}
  source.addFunction({
    isExported: true,
    name: 'actions',
    parameters: [ { name: 'engine', type: 'Engine' } ],
    statements: renderCode(TEMPLATE.ACTIONS, {
      actions: sequence.map(model => ({ 
        name: model.name.toPropertyName(),
        action: model.name.toClassName('%sActions') 
      }))
    })
  });
  //export async function install(engine: Engine) {}
  source.addFunction({
    isExported: true,
    isAsync: true,
    name: 'install',
    parameters: [ { name: 'engine', type: 'Engine' } ],
    statements: renderCode(TEMPLATE.INSTALL, {
      actions: reverse.map(model => ({ 
        name: model.name.toPropertyName()
      }))
    })
  });
  //export async function purge(engine: Engine) {}
  source.addFunction({
    isExported: true,
    isAsync: true,
    name: 'purge',
    parameters: [ { name: 'engine', type: 'Engine' } ],
    statements: renderCode(TEMPLATE.PURGE, {
      actions: reverse.map(model => ({ 
        name: model.name.toPropertyName()
      }))
    })
  });
  //export async function uninstall(engine: Engine) {}
  source.addFunction({
    isExported: true,
    isAsync: true,
    name: 'uninstall',
    parameters: [ { name: 'engine', type: 'Engine' } ],
    statements: renderCode(TEMPLATE.UNINSTALL, {
      actions: sequence.map(model => ({ 
        name: model.name.toPropertyName()
      }))
    })
  });
  //export async function upgrade(engine: Engine, updates: Record<string, Create>) {}
  source.addFunction({
    isExported: true,
    isAsync: true,
    name: 'upgrade',
    parameters: [
      { name: 'engine', type: 'Engine' }, 
      { name: 'updates', type: 'Record<string, Create>' } 
    ],
    statements: renderCode(TEMPLATE.UPGRADE, {
      actions: sequence.map(model => ({ 
        name: model.name.toPropertyName()
      }))
    })
  });
};

export const TEMPLATE = {

ACTIONS:
`return {
  <%#@:actions%>
    <%name%>: new <%action%>(engine),
  <%/@:actions%>
};`,

INSTALL:
`const action = actions(engine);

<%#@:actions%>
  await action.<%name%>.install();
<%/@:actions%>`,

PURGE:
`const action = actions(engine);

<%#@:actions%>
  await action.<%name%>.purge(true);
<%/@:actions%>`,

UNINSTALL:
`const action = actions(engine);

<%#@:actions%>
  await action.<%name%>.uninstall();
<%/@:actions%>`,

UPGRADE:
`const action = actions(engine);

<%#@:actions%>
  if ('<%name%>' in updates) {
    await action.<%name%>.upgrade(updates.<%name%>);
  }
<%/@:actions%>`,

};