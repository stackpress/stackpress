//modules
import type { Directory } from 'ts-morph';
//stackpress/schema
import type Schema from '../../schema/Schema.js';
import type Column from '../../schema/Column.js';
import type Model from '../../schema/Model.js';
import { 
  loadProjectFile, 
  renderCode 
} from '../../schema/transform/helpers.js';

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
  
  //------------------------------------------------------------------//
  // Profile/components/span/NameSpanField.tsx

  //get the path where this should be saved
  const filepath = renderCode('<%model%>/components/span/<%component%>.tsx', {
    model: model.name.toPathName(),
    component: column.name.toComponentName('%sSpanField')
  });
  //load file if it exists, if not create it
  const source = loadProjectFile(directory, filepath);

  //------------------------------------------------------------------//
  // Import Modules

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

  //------------------------------------------------------------------//
  // Import Stackpress

  //import type { FieldProps, ControlProps } from 'stackpress/view/client';
  source.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: 'stackpress/view/client',
    namedImports: [ 'FieldProps', 'ControlProps' ]
  });
  
  //------------------------------------------------------------------//
  // Import Client
  //------------------------------------------------------------------//
  // Exports
  
  //export function NameSpanField(props: FieldProps) {
  source.addFunction({
    isExported: true,
    name: `${column.name.titleCase}SpanField`,
    parameters: [
      { name: 'props', type: 'FieldProps' }
    ],
    statements: renderCode(TEMPLATE.FIELD, {
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
    statements: renderCode(TEMPLATE.CONTROL, {
      label: column.name.label,
      component: column.name.titleCase
    })
  });
};

//------------------------------------------------------------------//
// Templates

export const TEMPLATE = {

FIELD:
`//props
const { className, value, onUpdate, error = false } = props;
const attributes = <%props%>;
const values = Array.isArray(value) ? value : [];
//render
return (
  <>
    <<%component%>
      {...attributes}
      name="ge[<%column%>]"
      className={className}
      error={error} 
      defaultValue={values[0]} 
      onUpdate={value => onUpdate && onUpdate('ge[<%column%>]', value)}
    />
    <br />
    <<%component%>
      {...attributes}
      name="le[<%column%>]"
      className={className}
      error={error} 
      defaultValue={values[1]} 
      onUpdate={value => onUpdate && onUpdate('le[<%column%>]', value)}
    />
  </>
);`,

CONTROL:
`//props
const { className, value, onUpdate, error } = props;
//hooks
const { _ } = useLanguage();
//render
return (
  <FieldControl label={_('<%label%>')} error={error} className={className}>
    <<%component%>SpanField
      className="!border-b2 dark:bg-gray-300 outline-none"
      error={!!error} 
      value={value} 
      onUpdate={onUpdate}
    />
  </FieldControl>
);`

};