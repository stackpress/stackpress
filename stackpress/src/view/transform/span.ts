//modules
import type { Directory } from 'ts-morph';
//stackpress
import { renderCode } from '../../helpers.js';
//stackpress/schema
import type Schema from '../../schema/Schema.js';
import type Column from '../../schema/column/Column.js';
import type Model from '../../schema/model/Model.js';

export default function generate(directory: Directory, schema: Schema) {
  //for each model
  for (const model of schema.models.values()) {
    //generate all column fields
    model.columns.forEach(
      column => generateSpan(directory, model, column)
    );
  }
};

export function generateSpan(
  directory: Directory, 
  model: Model,
  column: Column
) {
  //get the filter field attribute
  const attribute = column.component.spanField;
  //skip if no filter field 
  if (!attribute?.component.defined) return;
  //this is the component definition token...
  const component = attribute.component.definition!;
  //this is the component props from the pre-defined 
  // definitions and the value set in the attribute.
  const props = attribute.component.props;
  //get the path where this should be saved
  const path = renderCode(TEMPLATE.FILE_PATH, {
    model: model.name.toPathName(),
    component: column.name.toComponentName('%sSpanField')
  });
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
    //component token will have import
    //info. just use that as is...
    moduleSpecifier: component.import.from,
    defaultImport: component.import.default ? component.name : undefined,
    namedImports: !component.import.default ? [ component.name ] : []
  });
  //export function NameSpanField(props: FieldProps) {
  source.addFunction({
    isExported: true,
    name: `${column.name.titleCase}SpanField`,
    parameters: [
      { name: 'props', type: 'FieldProps' }
    ],
    statements: renderCode(TEMPLATE.FIELD_FIELD, {
      props: JSON.stringify(props),
      component: component.name,
      column: column.name.toString()
    })
  });
  //export function NameSpanFieldControl(props: ControlProps) {
  source.addFunction({
    isExported: true,
    name: `${column.name.titleCase}SpanFieldControl`,
    parameters: [
      { name: 'props', type: 'ControlProps' }
    ],
    statements: renderCode(TEMPLATE.FIELD_CONTROL, {
      label: column.name.label,
      component: column.name.titleCase
    })
  });
};

export const TEMPLATE = {

FILE_PATH: 
'<%model%>/components/span/<%component%>.tsx',

FIELD_FIELD:
`//props
const { className, value, change, error = false } = props;
const attributes = <%props%>;
const values = Array.isArray(value) ? value : [];
//render
return (
  <>
    <<%component%>
      {...attributes}
      name="span[<%column%>][0]}"
      className={className}
      error={error} 
      defaultValue={values[0]} 
      onUpdate={value => change && change('span[<%column%>][0]', value)}
    />
    <br />
    <<%component%>
      {...attributes}
      name="span[<%column%>][1]}"
      className={className}
      error={error} 
      defaultValue={values[1]} 
      onUpdate={value => change && change('span[<%column%>][1]', value)}
    />
  </>
);`,

FIELD_CONTROL:
`//props
const { className, value, change, error } = props;
//hooks
const { _ } = useLanguage();
//render
return (
  <FieldControl label={_('<%label%>')} error={error} className={className}>
    <<%component%>SpanField
      className="!border-b2 dark:bg-gray-300 outline-none"
      error={!!error} 
      value={value} 
      change={change}
    />
  </FieldControl>
);`

};