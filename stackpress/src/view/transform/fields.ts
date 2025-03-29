//modules
import type { Directory } from 'ts-morph';
//registry
import type Registry from '../../schema/Registry';
import type Column from '../../schema/spec/Column';
import type Model from '../../schema/spec/Model';

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
  //skip if no format component
  if (typeof column.field.component !== 'string') return;
  //get the path where this should be saved
  const path = `${model.name}/components/fields/${column.title}Field.tsx`;
  const source = directory.createSourceFile(path, '', { overwrite: true });

  const BoolComponent = [ 'Checkbox', 'Switch' ].indexOf(column.field.component) !== -1;

  //import type { FieldProps, ControlProps } from 'stackpress/view';
  source.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: 'stackpress/view',
    namedImports: [ 'FieldProps', 'ControlProps' ]
  });
  //import { useLanguage } from 'r22n';
  source.addImportDeclaration({
    moduleSpecifier: 'r22n',
    namedImports: [ 'useLanguage' ]
  });
  //import Control from 'frui/element/Control';
  source.addImportDeclaration({
    moduleSpecifier: 'frui/element/Control',
    defaultImport: 'Control'
  });
  //import Text from 'frui/field/Text';
  source.addImportDeclaration({
    moduleSpecifier: `frui/field/${column.field.component}`,
    defaultImport: column.field.component
  });
  //export function NameField(props: FieldProps) {
  source.addFunction({
    isExported: true,
    name: `${column.title}Field`,
    parameters: [
      { name: 'props', type: 'FieldProps' }
    ],
    statements: (`
      //props
      const { className, value, change, error = false } = props;
      const attributes = ${JSON.stringify(column.field.attributes)};
      //render
      return (
        <${column.field.component} 
          {...attributes}
          name="${column.name}${column.multiple ? '[]': ''}"
          className={className}
          error={error} 
          defaultValue={value} 
          ${BoolComponent ? 'defaultChecked={value}': ''}
          onUpdate={value => change && change('${column.name}${column.multiple ? '[]': ''}', value)}
        />
      );
    `)
  });
  //export function NameFieldControl(props: ControlProps) {
  source.addFunction({
    isExported: true,
    name: `${column.title}FieldControl`,
    parameters: [
      { name: 'props', type: 'ControlProps' }
    ],
    statements: column.required && !column.multiple ? (`
      //props
      const { className, value, change, error } = props;
      //hooks
      const { _ } = useLanguage();
      //render
      return (
        <Control label={\`\${_('${column.label}')}*\`} error={error} className={className}>
          ${BoolComponent ? `<input type="hidden" name="${column.name}" value="false" />`: ''}
          <${column.title}Field
            className="!border-b2 dark:bg-gray-300 outline-none"
            error={!!error} 
            value={value} 
            change={change}
          />
        </Control>
      );
    `): (`
      //props
      const { className, value, change, error } = props;
      //hooks
      const { _ } = useLanguage();
      //render
      return (
        <Control label={_('${column.label}')} error={error} className={className}>
          ${BoolComponent ? `<input type="hidden" name="${column.name}" value="false" />`: ''}
          <${column.title}Field
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