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
      column => generateSpan(directory, model, column)
    );
  }
}

export function generateSpan(
  directory: Directory, 
  model: Model,
  column: Column
) {
  //skip if no format component
  if (typeof column.span.component !== 'string') return;
  //get the path where this should be saved
  const path = `${model.name}/components/spans/${column.title}Span.tsx`;
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
  //import Control from 'frui/form/Control';
  source.addImportDeclaration({
    moduleSpecifier: 'frui/form/Control',
    defaultImport: 'Control'
  });
  //import Text from 'frui/fields/Text';
  source.addImportDeclaration({
    moduleSpecifier: `frui/field/${column.span.component}`,
    defaultImport: column.span.component
  });
  //export function NameSpan(props: FieldProps) {
  source.addFunction({
    isExported: true,
    name: `${column.title}Span`,
    parameters: [
      { name: 'props', type: 'FieldProps' }
    ],
    statements: (`
      //props
      const { className, value, change, error = false } = props;
      const attributes = ${JSON.stringify(column.span.attributes)};
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
  //export function NameSpanControl(props: ControlProps) {
  source.addFunction({
    isExported: true,
    name: `${column.title}SpanControl`,
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
        <Control label={_('${column.label}')} error={error} className={className}>
          <${column.title}Span
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