//modules
import type { Directory } from 'ts-morph';
//stackpress/schema
import type Column from '../../../schema/Column.js';
import type Model from '../../../schema/Model.js';
import { 
  loadProjectFile, 
  renderCode 
} from '../../../schema/transform/helpers.js';

export default function generate(
  directory: Directory, 
  model: Model,
  column: Column
) {
  //get the filter field attribute
  const attribute = column.component.filterField;
  //skip if no filter field 
  if (!attribute?.component.defined) return;
  //this is the component definition token...
  const component = attribute.component.definition!;
  //this is the component props from the pre-defined 
  // definitions and the value set in the attribute.
  const props = attribute.component.props;

  //------------------------------------------------------------------//
  // Profile/components/filter/NameFilterField.tsx
  
  //get the path where this should be saved
  const filepath = renderCode('<%model%>/components/filter/<%component%>.tsx', {
    model: model.name.toPathName(),
    component: column.name.toComponentName('%sFilterField')
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

  //export function NameFiter(props: FieldProps) {
  source.addFunction({
    isExported: true,
    name: column.name.toComponentName('%sFilterField'),
    parameters: [
      { name: 'props', type: 'FieldProps' }
    ],
    statements: renderCode(TEMPLATE.FIELD, {
      props: JSON.stringify(props),
      component: component.name,
      column: column.name.toString(),
      multiple: column.type.multiple ? '[]': ''
    })
  });
  //export function NameFilterControl(props: ControlProps) {
  source.addFunction({
    isExported: true,
    name: column.name.toComponentName('%sFilterFieldControl'),
    parameters: [
      { name: 'props', type: 'ControlProps' }
    ],
    statements: renderCode(TEMPLATE.CONTROL, {
      label: column.name.label,
      component: column.name.toComponentName('%sFilterField')
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
//render
return (
  <<%component%> 
    {...attributes}
    name="filter[<%column%>]<%multiple%>"
    className={className}
    error={error} 
    defaultValue={value} 
    onUpdate={value => onUpdate && onUpdate('filter[<%column%>]<%multiple%>', value)}
  />
);`,

CONTROL:
`//props
const { className, value, onUpdate, error } = props;
//hooks
const { _ } = useLanguage();
//render
return (
  <FieldControl label={_('<%label%>')} error={error} className={className}>
    <<%component%>
      error={!!error} 
      value={value} 
      onUpdate={onUpdate}
    />
  </FieldControl>
);`

};