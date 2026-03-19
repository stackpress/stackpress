//modules
import type { Directory } from 'ts-morph';
//stackpress/schema
import type Schema from '../../schema/Schema.js';
import { loadProjectFile } from '../../schema/transform/helpers.js';

/**
 * This is the The params comes form the cli
 */
export default function generate(directory: Directory, schema: Schema) {
  //load Profile/types.ts if it exists, if not create it
  const source = loadProjectFile(directory, 'types.ts');

  //export type * from './module/Profile/types.js';
  for (const model of schema.models.values()) {
    source.addExportDeclaration({
      isTypeOnly: true,
      moduleSpecifier: model.name.toPathName('./%s/types.js'),
      namedExports: [ 
        model.name.toTypeName(),
        model.name.toTypeName('%sInput'), 
        model.name.toTypeName('%sExtended'), 
        model.name.toTypeName('%sSchemaInterface'), 
        model.name.toTypeName('%sStoreInterface'), 
        model.name.toTypeName('%sActionsInterface')
      ]
    });
  }
  //export type * from './module/Profile/types.js';
  for (const fieldset of schema.fieldsets.values()) {
    source.addExportDeclaration({
      isTypeOnly: true,
      moduleSpecifier: fieldset.name.toPathName('./%s/types.js'),
      namedExports: [ 
        fieldset.name.toTypeName(),
        fieldset.name.toTypeName('%sInput'), 
        fieldset.name.toTypeName('%sSchemaInterface')
      ]
    });
  }
};