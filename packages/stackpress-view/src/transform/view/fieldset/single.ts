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
  const attribute = column.component.viewFormat;
  const columnFieldset = column.type.fieldset;
  //skip if no form field 
  if (!attribute?.component.defined || !columnFieldset) return;
  
  //------------------------------------------------------------------//
  // Profile/components/view/NameViewFormat.tsx

  //get the path where this should be saved
  const filepath = renderCode('<%fieldset%>/components/view/<%component%>.tsx', {
    fieldset: fieldset.name.toPathName(),
    component: column.name.toComponentName('%sViewFormat')
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
  //import xViewFormat from '../../Address/components/view/xViewFormat.js'; 
  for (const column of columnFieldset.component.viewFormats.values()) {
    source.addImportDeclaration({
      moduleSpecifier: renderCode(
        '../../../<%fieldset%>/components/view/<%component%>.js', 
        {
          fieldset: columnFieldset.name.toPathName(),
          component: column.name.toComponentName('%sViewFormat')
        }
      ),
      defaultImport: column.name.toComponentName('%sViewFormat')
    });
  }
  
  //------------------------------------------------------------------//
  // Exports

  //export type AddressViewFormatProps = {};
  source.addTypeAlias({
    isExported: true,
    name: column.name.toComponentName('%sViewFormatProps'),
    type: renderCode(`{ 
      data: <%data%>,
      value: <%value%><%multiple%> 
    }`, {
      data: fieldset.name.toTypeName('%sExtended'),
      value: columnFieldset.name.toTypeName(),
      multiple: column.type.multiple ? '[]' : ''
    })
  });


  //export function AddressViewFormat() {
  source.addFunction({
    isDefaultExport: true,
    name: `${column.name.titleCase}ViewFormat`,
    parameters: [{ 
      name: 'props', 
      type: column.name.toComponentName('%sViewFormatProps')
    }],
    statements: renderCode(TEMPLATE.INFO, {
      rows: columnFieldset.component.viewFormats.toArray().map((column, index) =>
        renderCode(TEMPLATE.ROW, {
          index,
          label: column.name.label,
          value: column.type.required
            ? renderCode(TEMPLATE.VALUE, {
              component: column.name.toComponentName('%sViewFormat'),
              column: column.name.toURLPath()
            })
            : renderCode(TEMPLATE.OPTIONAL, {
              component: column.name.toComponentName('%sViewFormat'),
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
`<<%component%> data={value} value={value.<%column%>} />`,

OPTIONAL:
`{value.<%column%> ? (
  <<%component%> data={value} value={value.<%column%>} />
) : ''}`,

INFO:
`const { value } = props;
const { _ } = useLanguage();
return (
  <Table
    column={[ 'admin-table-odd', 'admin-table-even' ]}
    head="admin-table-head frui-tx-left"
  >
    <%rows%>
  </Table>
);`,

ROW:
`<Table.Row index={<%index%>}>
  <Table.Col noWrap addClassName="font-bold">
    {_('<%label%>')}
  </Table.Col>
  <Table.Col>
    <%value%>
  </Table.Col>
</Table.Row>`

};