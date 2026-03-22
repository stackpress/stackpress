//modules
import type { Directory } from 'ts-morph';
//stackpress/schema
import type Column from '../../../schema/Column.js';
import type Fieldset from '../../../schema/Fieldset.js';
import Model from '../../../schema/Model.js';
import { 
  loadProjectFile, 
  renderCode 
} from '../../../schema/transform/helpers.js';

const formatType: Record<string, string> = {
  String: 'string',
  Text: 'string',
  Number: 'number',
  Integer: 'number',
  Float: 'number',
  Boolean: 'boolean',
  Date: 'string|number|Date',
  Time: 'string|number|Date',
  Datetime: 'string|number|Date',
  Json: 'Record<string, any>',
  Object: 'Record<string, any>',
  Hash: 'Record<string, any>'
};

export default function generate(
  directory: Directory, 
  fieldset: Fieldset,
  column: Column
) {
  const isModel = fieldset instanceof Model;
  //get the form field attribute
  const attribute = column.component.listFormat;
  //skip if no form field 
  if (!attribute?.component.defined) return;
  //this is the component definition token...
  const component = attribute.component.definition!;
  //this is the component props from the pre-defined 
  // definitions and the value set in the attribute.
  const props = attribute.component.props;
  
  //------------------------------------------------------------------//
  // Profile/components/list/NameListFormat.tsx

  //get the path where this should be saved
  const filepath = renderCode('<%fieldset%>/components/list/<%component%>.tsx', {
    fieldset: fieldset.name.toPathName(),
    component: column.name.toComponentName('%sListFormat')
  });
  //load file if it exists, if not create it
  const source = loadProjectFile(directory, filepath);

  //------------------------------------------------------------------//
  // Import Modules

  //import mustache from 'mustache';
  source.addImportDeclaration({
    moduleSpecifier: 'mustache',
    defaultImport: 'mustache'
  });
  //import Text from 'frui/list/Text';
  if (!attribute.component.isVirtual) {
    source.addImportDeclaration({
      //component token will have import
      //info. just use that as is...
      moduleSpecifier: component.import.from,
      defaultImport: component.import.default ? component.name : undefined,
      namedImports: !component.import.default ? [ component.name ] : []
    });
  }

  //------------------------------------------------------------------//
  // Import Stackpress
  //------------------------------------------------------------------//
  // Import Client

  //import type { ProfileExtended } from '../../types.js';
  source.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: '../../types.js',
    namedImports: [ isModel
      ? fieldset.name.toTypeName('%sExtended')
      : fieldset.name.toTypeName() 
    ]
  });

  //------------------------------------------------------------------//
  // Exports
  
  //export function NameFormat() {
  source.addFunction({
    isDefaultExport: true,
    name: column.name.toComponentName('%sFormat'),
    parameters: [
      { 
        name: 'props', 
        type: renderCode(`{ 
          data: <%data%>,
          value: <%value%><%multiple%> 
        }`, {
          data: fieldset.name.toTypeName('%sExtended'),
          value: column.type.name in formatType 
            ? formatType[column.type.name]
            : column.type.enum
            ? 'string'
            : 'unknown',
          multiple: column.type.multiple ? '[]' : ''
        })
      }
    ],
    statements: renderCode(TEMPLATE.FORMAT, {
      template: String(props.template)
    })
  });
};

//------------------------------------------------------------------//
// Templates

export const TEMPLATE = {

FORMAT:
`//props
const { data } = props;
const value = mustache.render(
  '<%template%>',
  data
);
//render
return (<>{value}</>);`

};