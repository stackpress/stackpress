//modules
import type { Directory } from 'ts-morph';
//stackpress/schema
import type Fieldset from '../../../schema/Fieldset.js';
import type Column from '../../../schema/Column.js';
import { 
  loadProjectFile, 
  renderCode 
} from '../../../schema/transform/helpers.js';

export default function generate(
  directory: Directory, 
  fieldset: Fieldset,
  column: Column
) {
  //get the form field attribute
  const attribute = column.component.formField;
  //skip if no form field 
  if (!attribute?.component.defined) return;
  //this is the component definition token...
  const component = attribute.component.definition!;
  //this is the component props from the pre-defined 
  // definitions and the value set in the attribute.
  const props = attribute.component.props;
  
  //------------------------------------------------------------------//
  // Profile/components/form/NameFormField.tsx
  
  //get the path where this should be saved
  const filepath = renderCode('<%fieldset%>/components/form/<%component%>.tsx', {
    fieldset: fieldset.name.toPathName(),
    component: column.name.toComponentName('%sFormField')
  });
  //load file if it exists, if not create it
  const source = loadProjectFile(directory, filepath);

  //------------------------------------------------------------------//
  // Import Modules

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

  //------------------------------------------------------------------//
  // Import Stackpress
  //------------------------------------------------------------------//
  // Import Client
  //------------------------------------------------------------------//
  // Exports

  //export function NameFormField(props: FieldProps) {
  source.addFunction({
    isExported: true,
    name: column.name.toComponentName('%sFormField'),
    parameters: [
      { name: 'props', type: 'FieldProps' }
    ],
    statements: renderCode(TEMPLATE.FIELD, {
      column: column.name.toURLPath(),
      multiple: column.type.multiple ? '[]': '',
      default: column.value.default && !column.value.generator 
        ? '=' + JSON.stringify(column.value.default) 
        : '',
      props: JSON.stringify(props),
      component: component.name,
      metadata: component.name === 'Metadata',
      value: component.name === 'Metadata'
        ? 'entries'
        : 'value'
    })
  });
  //export function NameFormFieldControl(props: ControlProps) {
  source.addFunction({
    isExported: true,
    name: `${column.name.titleCase}FormFieldControl`,
    parameters: [
      { name: 'props', type: 'ControlProps' }
    ],
    statements: renderCode(TEMPLATE.CONTROL, {
      label: column.name.label,
      required: column.type.required && !column.type.multiple
        ? ` + '*'`
        : '',
      component: column.name.toComponentName('%sFormField')
    })
  });
};

//------------------------------------------------------------------//
// Templates

export const TEMPLATE = {

FIELD:
`//props
const { 
  className, 
  name = '<%column%><%multiple%>', 
  value<%default%>, 
  onUpdate, 
  error = false 
} = props;
const attributes = <%props%>;
<%#metadata%>
const entries = typeof value === 'object' && value !== null
  ? Object.entries(value).map(([ key, val ]) => [ key, String(val) ])
  : value;
<%/metadata%>
//renderCode
return (
  <<%component%> 
    {...attributes}
    name={name}
    className={className}
    error={error} 
    defaultValue={<%value%>} 
    onUpdate={value => onUpdate && onUpdate('<%column%><%multiple%>', value)}
  />
);`,

CONTROL:
`//props
const { className, name, value, onUpdate, error } = props;
//hooks
const { _ } = useLanguage();
//determine label
const label = _('<%label%>')<%required%>;
//renderCode
return (
  <FieldControl label={label} error={error} className={className}>
    <<%component%>
      error={typeof error === 'string'} 
      name={name}
      value={value} 
      onUpdate={onUpdate}
    />
  </FieldControl>
);`

};