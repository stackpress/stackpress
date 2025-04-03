//modules
import type { Directory } from 'ts-morph';
//registry
import type Registry from '../../schema/Registry';
import type Fieldset from '../../schema/spec/Fieldset';
import type Column from '../../schema/spec/Column';

export default function generate(directory: Directory, registry: Registry) {
  //for each model
  for (const model of registry.model.values()) {
    //generate all column formats
    model.columns.forEach(
      column => generateFormat(directory, model, column)
    );
  }
  //for each fieldset
  for (const fieldset of registry.fieldset.values()) {
    //generate all column formats
    fieldset.columns.forEach(
      column => generateFormat(directory, fieldset, column)
    );
  }
}

export function generateFormat(
  directory: Directory, 
  fieldset: Fieldset,
  column: Column
) {
  //skip if no format component
  if (typeof column.view.component !== 'string') return;
  //get the path where this should be saved
  const path = `${fieldset.name}/components/views/${column.title}ViewFormat.tsx`;
  const source = directory.createSourceFile(path, '', { overwrite: true });
  //import Text from 'frui/format/Text';
  source.addImportDeclaration({
    moduleSpecifier: `frui/format/${column.view.component}`,
    defaultImport: column.view.component
  });
  const props = `{ 
    data: ${fieldset.title}Extended,
    value: ${column.typemap.format}${column.multiple ? '[]': ''} 
  }`;
  if (column.view.method === 'template') {
    //import mustache from 'mustache';
    source.addImportDeclaration({
      moduleSpecifier: 'mustache',
      defaultImport: 'mustache'
    });
    //import type { ProfileExtended } from '../../types';
    source.addImportDeclaration({
      isTypeOnly: true,
      moduleSpecifier: '../../types',
      namedImports: [ `${fieldset.title}Extended` ]
    });
    //export function NameFormat() {
    source.addFunction({
      isDefaultExport: true,
      name: `${column.title}Format`,
      parameters: [ { name: 'props', type: props } ],
      statements: (`
        //props
        const { data } = props;
        const value = mustache.render(
          '${column.view.attributes.template}',
          data
        );
        //render
        return (
          <${column.view.component} value={value} />
        );
      `)
    });
    return;
  }
  //export function NameFormat() {
  source.addFunction({
    isDefaultExport: true,
    name: `${column.title}Format`,
    parameters: [ { name: 'props', type: props } ],
    statements: (`
      //props
      const { data, value } = props;
      const attributes = ${JSON.stringify(column.view.attributes)};
      //render
      return (
        <${column.view.component} {...attributes} data={data} value={value} />
      );
    `)
  });
}