//modules
import type { Directory } from 'ts-morph';
//config
import { fields } from './config';
//registry
import type Registry from '../../schema/Registry';
import type Column from '../../schema/spec/Column';
import type Model from '../../schema/spec/Model';
import { capitalize, camelize, formatCode } from '../../schema/helpers';

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
    //generate all column fields
    model.columns.forEach(
      column => generateField(directory, model, column)
    );
  }
}

export function generateField(
  directory: Directory, 
  model: Model,
  column: Column
) {
  //get the column field
  const field = fields[column.field.method];
  //skip if no format component
  if (!field || !field.component) return;
  //get the path where this should be saved
  const capital = capitalize(camelize(column.name));
  const path = `${model.name}/components/fields/${capital}Field.tsx`;
  const source = directory.createSourceFile(path, '', { overwrite: true });
  //import type { FieldProps, ControlProps } from 'adent/types';
  source.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: 'adent/types',
    namedImports: [ 'FieldProps', 'ControlProps' ]
  });
  //import { useLanguage } from 'r22n';
  source.addImportDeclaration({
    moduleSpecifier: 'r22n',
    namedImports: [ 'useLanguage' ]
  });
  //import Control from 'frui/Control';
  source.addImportDeclaration({
    moduleSpecifier: 'frui/Control',
    defaultImport: 'Control'
  });
  //import Text from 'frui/fields/Text';
  source.addImportDeclaration({
    moduleSpecifier: `frui/fields/${field.component}`,
    defaultImport: field.component
  });
  //export function NameField(props: FieldProps) {
  source.addFunction({
    isExported: true,
    name: `${capital}Field`,
    parameters: [
      { name: 'props', type: 'FieldProps' }
    ],
    statements: formatCode(`
      //props
      const { className, value, change, error = false } = props;
      const attributes = ${JSON.stringify({
        ...field.attributes,
        ...column.field.attributes
      })};
      //render
      return (
        <${field.component} 
          {...attributes}
          className={className}
          error={error} 
          defaultValue={value} 
          onUpdate={value => change('${column.name}', value)}
        />
      );
    `)
  });
  //export function NameControl(props: ControlProps) {
  source.addFunction({
    isExported: true,
    name: `${capital}Control`,
    parameters: [
      { name: 'props', type: 'ControlProps' }
    ],
    statements: column.required && !column.multiple ? formatCode(`
      //props
      const { className, value, change, error } = props;
      //hooks
      const { _ } = useLanguage();
      //render
      return (
        <Control label={\`\${_('${column.label}')}*\`} error={error} className={className}>
          <${capital}Field
            className="!border-b2 dark:bg-gray-300 outline-none"
            error={!!error} 
            value={value} 
            change={change}
          />
        </Control>
      );
    `): formatCode(`
      //props
      const { className, value, change, error } = props;
      //hooks
      const { _ } = useLanguage();
      //render
      return (
        <Control label={_('${column.label}')} error={error} className={className}>
          <${capital}Field
            className="!border-b2 dark:bg-gray-300 outline-none"
            error={!!error} 
            value={value} 
            change={change}
          />
        </Control>
      );
    `)
  });
}