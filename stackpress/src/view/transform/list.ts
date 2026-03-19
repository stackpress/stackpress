//modules
import type { Directory } from 'ts-morph';
//stackpress/schema
import type Schema from '../../schema/Schema.js';
import type Fieldset from '../../schema/Fieldset.js';
import type Column from '../../schema/Column.js';
import { 
  loadProjectFile, 
  renderCode 
} from '../../schema/transform/helpers.js';

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

export default function generate(directory: Directory, schema: Schema) {
  //for each model
  for (const model of schema.models.values()) {
    //and for each column
    for (const column of model.columns.values()) {
      //get the form field attribute
      const attribute = column.component.listFormat;
      //skip if no form field 
      if (!attribute?.component.defined) continue;
      //this is the component definition token...
      const component = attribute.component.definition!;
      component.name === 'Fieldset'
        ? (
          column.type.multiple 
            ? generateFieldsetTable(directory, model, column) 
            : generateFieldsetInfo(directory, model, column)
        )
        : generateFormat(directory, model, column); 
    }
  }
  //for each fieldset
  for (const fieldset of schema.fieldsets.values()) {
    //generate all column formats
    for (const column of fieldset.columns.values()) {
      //get the form field attribute
      const attribute = column.component.listFormat;
      //skip if no form field 
      if (!attribute?.component.defined) continue;
      //this is the component definition token...
      const component = attribute.component.definition!;
      component.name === 'Fieldset'
        ? (
          column.type.multiple 
            ? generateFieldsetTable(directory, fieldset, column) 
            : generateFieldsetInfo(directory, fieldset, column)
        )
        : generateFormat(directory, fieldset, column);
    }
  }
};

export function generateFieldsetTable(
  directory: Directory, 
  fieldset: Fieldset,
  column: Column
) {
  //get the form field attribute
  const attribute = column.component.listFormat;
  const columnFieldset = column.type.fieldset;
  //skip if no form field 
  if (!attribute?.component.defined || !columnFieldset) return;

  //get the path where this should be saved
  const filepath = renderCode('<%fieldset%>/components/list/<%component%>.tsx', {
    fieldset: fieldset.name.toPathName(),
    component: column.name.toComponentName('%sListFormat')
  });
  //load Profile/components/list/NameListFormat.tsx if it exists, if not create it
  const source = loadProjectFile(directory, filepath);

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
      moduleSpecifier: renderCode(TEMPLATE.RELATIVE_LIST_FORMAT_PATH, {
        fieldset: columnFieldset.name.toPathName(),
        component: column.name.toComponentName('%sListFormat')
      }),
      defaultImport: column.name.toComponentName('%sListFormat')
    });
  }
  //export function AddressListFormat() {
  source.addFunction({
    isDefaultExport: true,
    name: column.name.toComponentName('%sListFormat'),
    parameters: [ 
      { 
        name: 'props', 
        type: renderCode(TEMPLATE.LIST_PROPS, {
          data: fieldset.name.toTypeName('%sExtended'),
          value: columnFieldset.name.toTypeName(),
          multiple: column.type.multiple ? '[]' : ''
        }) 
      } 
    ],
    statements: renderCode(TEMPLATE.FIELDSET_TABLE, {
      heads: columnFieldset.component.listFormats.toArray().map(
        column => renderCode(TEMPLATE.FIELDSET_TABLE_HEAD, {
          label: column.name.label
        })
      ).join('\n'),
      rows: columnFieldset.component.listFormats.toArray().map(
        column => renderCode(TEMPLATE.FIELDSET_TABLE_ROW, {
          value: column.type.required
            ? renderCode(TEMPLATE.FIELDSET_TABLE_VALUE, {
              component: column.name.toComponentName('%sListFormat'),
              column: column.name.toURLPath()
            })
            : renderCode(TEMPLATE.FIELDSET_TABLE_VALUE_OPTIONAL, {
              component: column.name.toComponentName('%sListFormat'),
              column: column.name.toURLPath()
            })
        })
      ).join('\n')
    })
  });
};

export function generateFieldsetInfo(
  directory: Directory, 
  fieldset: Fieldset,
  column: Column
) {
  //get the form field attribute
  const attribute = column.component.listFormat;
  const columnFieldset = column.type.fieldset;
  //skip if no form field 
  if (!attribute?.component.defined || !columnFieldset) return;

  //get the path where this should be saved
  const filepath = renderCode('<%fieldset%>/components/list/<%component%>.tsx', {
    fieldset: fieldset.name.toPathName(),
    component: column.name.toComponentName('%sListFormat')
  });
  //load Profile/components/list/NameListFormat.tsx if it exists, if not create it
  const source = loadProjectFile(directory, filepath);

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
      moduleSpecifier: renderCode(TEMPLATE.RELATIVE_LIST_FORMAT_PATH, {
        fieldset: columnFieldset.name.toPathName(),
        component: column.name.toComponentName('%sListFormat')
      }),
      defaultImport: column.name.toComponentName('%sListFormat')
    });
  }
  //export function AddressListFormat() {
  source.addFunction({
    isDefaultExport: true,
    name: `${column.name.titleCase}ListFormat`,
    parameters: [ 
      { 
        name: 'props', 
        type: renderCode(TEMPLATE.LIST_PROPS, {
          data: fieldset.name.toTypeName('%sExtended'),
          value: columnFieldset.name.toTypeName(),
          multiple: column.type.multiple ? '[]' : ''
        })
      } 
    ],
    statements: renderCode(TEMPLATE.FIELDSET_INFO, {
      rows: columnFieldset.component.listFormats.toArray().map(
        column => renderCode(TEMPLATE.FIELDSET_INFO_ROW, {
          label: column.name.label,
          value: column.type.required
            ? renderCode(TEMPLATE.FIELDSET_TABLE_VALUE, {
              component: column.name.toComponentName('%sListFormat'),
              column: column.name.toURLPath()
            })
            : renderCode(TEMPLATE.FIELDSET_TABLE_VALUE_OPTIONAL, {
              component: column.name.toComponentName('%sListFormat'),
              column: column.name.toURLPath()
            })
        })
      ).join('\n')
    })
  });
};

export function generateFormat(
  directory: Directory, 
  fieldset: Fieldset,
  column: Column
) {
  //get the form field attribute
  const attribute = column.component.listFormat;
  //skip if no form field 
  if (!attribute?.component.defined) return;
  //this is the component definition token...
  const component = attribute.component.definition!;
  //this is the component props from the pre-defined 
  // definitions and the value set in the attribute.
  const props = attribute.component.props;

  //get the path where this should be saved
  const filepath = renderCode('<%fieldset%>/components/list/<%component%>.tsx', {
    fieldset: fieldset.name.toPathName(),
    component: column.name.toComponentName('%sListFormat')
  });
  //load Profile/components/list/NameListFormat.tsx if it exists, if not create it
  const source = loadProjectFile(directory, filepath);

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
  //import type { ProfileExtended } from '../../types.js';
  source.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: '../../types.js',
    namedImports: [ fieldset.name.toTypeName('%sExtended') ]
  });
  //import mustache from 'mustache';
  if (component.name === 'Template') {
    source.addImportDeclaration({
      moduleSpecifier: 'mustache',
      defaultImport: 'mustache'
    });
    //export function NameFormat() {
    source.addFunction({
      isDefaultExport: true,
      name: column.name.toComponentName('%sFormat'),
      parameters: [
        { 
          name: 'props', 
          type: renderCode(TEMPLATE.LIST_PROPS, {
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
      statements: renderCode(TEMPLATE.FORMAT_TEMPLATE_LIST, {
        template: String(props.template)
      })
    });
    return;
  }
  
  //export function NameListFormat() {
  source.addFunction({
    isDefaultExport: true,
    name: `${column.name.titleCase}ListFormat`,
    parameters: [
      { 
        name: 'props', 
        type: renderCode(TEMPLATE.LIST_PROPS, {
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
    statements: renderCode(TEMPLATE.FORMAT_LIST, { 
      props: JSON.stringify(props),
      component: component.name
    })
  });
};

export const TEMPLATE = {

RELATIVE_LIST_FORMAT_PATH:
'../../../<%fieldset%>/components/list/<%component%>.js',

LIST_PROPS:
`{ 
  data: <%data%>,
  value: <%value%><%multiple%> 
}`,

FIELDSET_TABLE:
`const { value } = props;
const { _ } = useLanguage();
if (!Array.isArray(value) || !value.length) return null;
return (
  <Table
    column={[ 'theme-bc-2 theme-bg-2', 'theme-bc-2 theme-bg-1' ]}
    head="theme-bg-3"
  >
    <%heads%>
    {value.map((value, index) => (
      <Table.Row key={index}>
        <%rows%>
      </Table.Row>
    ))}
  </Table>
);`,

FIELDSET_TABLE_HEAD:
`<Table.Head noWrap addClassName="font-bold">
  {_('<%label%>')}
</Table.Head>`, 

FIELDSET_TABLE_ROW:
`<Table.Col>
  <%value%>
</Table.Col>`, 

FIELDSET_TABLE_VALUE:
`<<%component%> data={value} value={value['<%column%>']} />`,

FIELDSET_TABLE_VALUE_OPTIONAL:
`{value['<%column%>'] ? (<<%component%> data={value} value={value['<%column%>']} />) : ''}`,

FIELDSET_INFO:
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
);`,

FIELDSET_INFO_ROW:
`<Table.Row>
  <Table.Col noWrap addClassName="font-bold">
    {_('<%label%>')}
  </Table.Col>
  <Table.Col>
    <%value%>
  </Table.Col>
</Table.Row>`, 

FORMAT_TEMPLATE_LIST:
`//props
const { data } = props;
const value = mustache.render(
  '<%template%>',
  data
);
//render
return (<>{value}</>);`,

FORMAT_LIST:
`//props
const { data, value } = props;
const attributes = { data, ...<%props%> };
//render
return (
  <<%component%> {...attributes} value={value} />
);`

};