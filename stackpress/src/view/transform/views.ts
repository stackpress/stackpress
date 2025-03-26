//modules
import type { Directory } from 'ts-morph';
//registry
import type Registry from '../../schema/Registry';
import type Column from '../../schema/spec/Column';
import type Model from '../../schema/spec/Model';
import { capitalize, camelize, formatCode } from '../../schema/helpers';
//config
import { formats } from './config';

export type ColumnOption = { 
  component: string|false, 
  attributes: Record<string, any>
};

export const typemap: Record<string, string> = {
  String: 'string',
  Text: 'string',
  Number: 'number',
  Integer: 'number',
  Float: 'number',
  Boolean: 'boolean',
  Date: 'Date',
  Time: 'Date',
  Datetime: 'Date',
  Json: 'Record<string, string|number|boolean|null>',
  Object: 'Record<string, string|number|boolean|null>',
  Hash: 'Record<string, string|number|boolean|null>'
};

export default function generate(directory: Directory, registry: Registry) {
  //for each model
  for (const model of registry.model.values()) {
    //generate all column formats
    model.columns.forEach(
      column => generateFormat(directory, model, column)
    );
  }
}

export function generateFormat(
  directory: Directory, 
  model: Model,
  column: Column
) {
  //get the column format
  const view = column.view;
  const format = formats[view.method];
  //skip if no format component
  if (!format || !format.component) return;
  //get the path where this should be saved
  const capital = capitalize(camelize(column.name));
  const path = `${model.name}/components/views/${capital}Format.tsx`;
  const source = directory.createSourceFile(path, '', { overwrite: true });
  //import Text from 'frui/formats/Text';
  source.addImportDeclaration({
    moduleSpecifier: `frui/formats/${format.component}`,
    defaultImport: format.component
  });
  const props = `{ value: ${
    typemap[column.type]}${column.multiple ? '[]': ''
  } }`;
  //export function NameFormat() {
  source.addFunction({
    isDefaultExport: true,
    name: `${capital}Format`,
    parameters: [
      { name: 'props', type: `{ value: ${props} }` }
    ],
    statements: formatCode(`
      //props
      const { value } = props;
      const attributes = ${JSON.stringify({
        ...format.attributes,
        ...view.attributes
      })};
      //render
      return (
        <${format.component} {...attributes} value={value} />
      );
    `)
  });
}