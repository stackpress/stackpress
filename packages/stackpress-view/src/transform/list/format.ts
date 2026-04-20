//modules
import type { Directory } from 'ts-morph';
//stackpress-schema
import type Column from 'stackpress-schema/Column';
import type Fieldset from 'stackpress-schema/Fieldset';
import Model from 'stackpress-schema/Model';
import { 
  loadProjectFile, 
  renderCode 
} from 'stackpress-schema/transform/helpers';

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

  //import type { Address } from '../../../Address/types.js';
  if (column.type.fieldset 
    && column.type.name !== fieldset.name.toString()
  ) {
    source.addImportDeclaration({
      isTypeOnly: true,
      moduleSpecifier: column.type.fieldset.name.toPathName('../../../%s/types.js'),
      namedImports: [ column.type.fieldset.name.toTypeName() ]
    });
  }

  //------------------------------------------------------------------//
  // Exports

  //export type AddressListFormatProps = {};
  source.addTypeAlias({
    isExported: true,
    name: column.name.toComponentName('%sListFormatProps'),
    type: renderCode(`{ 
      data: <%data%>,
      value: <%value%><%multiple%> 
    }`, {
      data: isModel
        ? fieldset.name.toTypeName('%sExtended')
        : fieldset.name.toTypeName(),
      value: column.type.name in formatType 
        ? formatType[column.type.name]
        : column.type.enum
        ? 'string'
        : column.type.fieldset
        ? column.type.fieldset.name.toTypeName()
        : 'unknown',
      multiple: column.type.multiple ? '[]' : ''
    })
  });
  
  //export function NameListFormat() {
  source.addFunction({
    isDefaultExport: true,
    name: `${column.name.titleCase}ListFormat`,
    parameters: [{ 
      name: 'props', 
      type: column.name.toComponentName('%sListFormatProps')
    }],
    statements: renderCode(TEMPLATE.FORMAT, { 
      props: JSON.stringify(props),
      component: component.name
    })
  });
};

//------------------------------------------------------------------//
// Templates

export const TEMPLATE = {

FORMAT:
`//props
const { data, value } = props;
const attributes = { data, ...<%props%> };
//render
return (
  <<%component%> {...attributes} value={value} />
);`

};