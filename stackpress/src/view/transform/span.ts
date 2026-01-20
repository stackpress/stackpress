//modules
import type { Directory } from 'ts-morph';
//registry
import type Registry from '../../schema/Registry.js';
import type Column from '../../schema/spec/Column.js';
import type Model from '../../schema/spec/Model.js';

export default function generate(directory: Directory, registry: Registry) {
  //for each model
  for (const model of registry.model.values()) {
    //generate all column fields
    model.columns.forEach(
      column => generateSpan(directory, model, column)
    );
  }
}

export function generateSpan(
  directory: Directory, 
  model: Model,
  column: Column
) {
  //NOTE: column.list is a computed getter, 
  // so dont keep computing it multiple times
  const span = column.span;
  //skip if no field component
  if (!span) return;
  //get the path where this should be saved
  const path = `${model.name}/components/span/${column.titleCase}SpanField.tsx`;
  const source = directory.createSourceFile(path, '', { overwrite: true });

  //import type { FieldProps, ControlProps } from 'stackpress/view/client';
  source.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: 'stackpress/view/client',
    namedImports: [ 'FieldProps', 'ControlProps' ]
  });
  //import { useLanguage } from 'r22n';
  source.addImportDeclaration({
    moduleSpecifier: 'r22n',
    namedImports: [ 'useLanguage' ]
  });
  //import FieldControl from 'frui/form/FieldControl';
  source.addImportDeclaration({
    moduleSpecifier: 'frui/form/FieldControl',
    defaultImport: 'FieldControl'
  });
  //import Text from 'frui/form/Text';
  source.addImportDeclaration({
    moduleSpecifier: `frui/form/${column.span.component}`,
    defaultImport: column.span.component
  });
  //export function NameSpanField(props: FieldProps) {
  source.addFunction({
    isExported: true,
    name: `${column.titleCase}SpanField`,
    parameters: [
      { name: 'props', type: 'FieldProps' }
    ],
    statements: (`
      //props
      const { className, value, change, error = false } = props;
      const attributes = ${JSON.stringify(column.span.props)};
      const values = Array.isArray(value) ? value : [];
      //render
      return (
        <>
          <${column.span.component} 
            {...attributes}
            name="span[${column.name}][0]}"
            className={className}
            error={error} 
            defaultValue={values[0]} 
            onUpdate={value => change && change('span[${column.name}][0]', value)}
          />
          <br />
          <${column.span.component} 
            {...attributes}
            name="span[${column.name}][1]}"
            className={className}
            error={error} 
            defaultValue={values[1]} 
            onUpdate={value => change && change('span[${column.name}][1]', value)}
          />
        </>
      );
    `)
  });
  //export function NameSpanFieldControl(props: ControlProps) {
  source.addFunction({
    isExported: true,
    name: `${column.titleCase}SpanFieldControl`,
    parameters: [
      { name: 'props', type: 'ControlProps' }
    ],
    statements: (`
      //props
      const { className, value, change, error } = props;
      //hooks
      const { _ } = useLanguage();
      //render
      return (
        <FieldControl label={_('${column.label}')} error={error} className={className}>
          <${column.titleCase}SpanField
            className="!border-b2 dark:bg-gray-300 outline-none"
            error={!!error} 
            value={value} 
            change={change}
          />
        </FieldControl>
      );
    `)
  });
}