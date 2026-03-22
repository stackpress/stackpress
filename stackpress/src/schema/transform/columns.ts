//modules
import type { Directory } from 'ts-morph';
//stackpress/schema
import type Fieldset from '../../schema/Fieldset.js';
import { loadProjectFile } from '../../schema/transform/helpers.js';
import generateColumn from './column/index.js';

export default function generate(directory: Directory, model: Fieldset) {
  //dont include columns that are models 
  //(those are more of relational information)
  const columns = model.columns.filter(column => !column.type.model);

  //------------------------------------------------------------------//
  // Address/columns/index.ts

  const filepath = model.name.toPathName('%s/columns/index.ts');
  //load file if it exists, if not create it
  const source = loadProjectFile(directory, filepath);

  //------------------------------------------------------------------//
  // Import Modules
  //------------------------------------------------------------------//
  // Import Stackpress
  //------------------------------------------------------------------//
  // Import Client

  //import StreetColumn from './columns/StreetColumn.js';
  for (const column of columns.values()) {
    //Address/columns/StreetColumn.ts
    generateColumn(directory, column);
    source.addImportDeclaration({
      moduleSpecifier: column.name.toPathName('./%sColumn.js'),
      defaultImport: column.name.toClassName('%sColumn')
    });
  }
  
  //------------------------------------------------------------------//
  // Exports

  //export { StreetColumn };
  source.addExportDeclaration({
    namedExports: columns.map(
      column => column.name.toClassName('%sColumn')
    ).toArray()
  });
};