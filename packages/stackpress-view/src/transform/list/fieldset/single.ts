//modules
import type { Directory } from 'ts-morph';
//stackpress/schema
import type Column from '../../../../schema/Column.js';
import type Fieldset from '../../../../schema/Fieldset.js';
import { 
  loadProjectFile, 
  renderCode 
} from '../../../../schema/transform/helpers.js';

export default function generate(
  directory: Directory, 
  fieldset: Fieldset,
  column: Column
) {
  //get the form field attribute
  const attribute = column.component.listFormat;
  const columnFieldset = column.type.fieldset;
  //skip if no form field 
  if (!attribute?.component.defined || !columnFieldset) return;
  
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

  //import { useLanguage } from 'r22n';
  source.addImportDeclaration({
    moduleSpecifier: 'r22n',
    namedImports: [ 'useLanguage' ]
  });
  //import Table from 'frui/Table';
  source.addImportDeclaration({
    moduleSpecifier: 'frui/Table',
    defaultImport: 'Table'
  });

  //------------------------------------------------------------------//
  // Import Stackpress
  //------------------------------------------------------------------//
  // Import Client

  //import type { Address } from '../../../Address/types.js';
  source.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: columnFieldset.name.toPathName('../../../%s/types.js'),
    namedImports: [ columnFieldset.name.toTypeName() ]
  });
  //import type { ProfileExtended } from '../../types.js';
  source.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: '../../types.js',
    namedImports: [ fieldset.name.toTypeName('%sExtended') ]
  });
  //import xListFormat from '../../Address/components/list/xListFormat.js'; 
  for (const column of columnFieldset.component.listFormats.values()) {
    source.addImportDeclaration({
      moduleSpecifier: renderCode(
        '../../../<%fieldset%>/components/list/<%component%>.js', 
        {
          fieldset: columnFieldset.name.toPathName(),
          component: column.name.toComponentName('%sListFormat')
        }
      ),
      defaultImport: column.name.toComponentName('%sListFormat')
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
      data: fieldset.name.toTypeName('%sExtended'),
      value: columnFieldset.name.toTypeName(),
      multiple: column.type.multiple ? '[]' : ''
    })
  });

  //export function AddressListFormat() {
  source.addFunction({
    isDefaultExport: true,
    name: `${column.name.titleCase}ListFormat`,
    parameters: [{ 
      name: 'props', 
      type: column.name.toComponentName('%sListFormatProps')
    }],
    statements: renderCode(TEMPLATE.INFO, {
      rows: columnFieldset.component.listFormats.toArray().map(
        column => renderCode(TEMPLATE.ROW, {
          label: column.name.label,
          value: column.type.required
            ? renderCode(TEMPLATE.VALUE, {
              component: column.name.toComponentName('%sListFormat'),
              column: column.name.toURLPath()
            })
            : renderCode(TEMPLATE.OPTIONAL, {
              component: column.name.toComponentName('%sListFormat'),
              column: column.name.toURLPath()
            })
        })
      ).join('\n')
    })
  });
};

//------------------------------------------------------------------//
// Templates

export const TEMPLATE = {

VALUE:
`<<%component%> data={value} value={value['<%column%>']} />`,

OPTIONAL:
`{value['<%column%>'] ? (<<%component%> data={value} value={value['<%column%>']} />) : ''}`,

ROW:
`<Table.Row>
  <Table.Col noWrap addClassName="font-bold">
    {_('<%label%>')}
  </Table.Col>
  <Table.Col>
    <%value%>
  </Table.Col>
</Table.Row>`,

INFO:
`const { value } = props;
const { _ } = useLanguage();
if (!Array.isArray(value) || !value.length) return null;
return (
  <Table
    column={[ 'theme-bc-2 theme-bg-2', 'theme-bc-2 theme-bg-1' ]}
    head="theme-bg-3"
  >
    <%rows%>
  </Table>
);`

};