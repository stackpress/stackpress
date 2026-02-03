//modules
import type { Directory } from 'ts-morph';
//stackpress
import { renderCode } from '../../helpers.js';
//stackpress/schema
import type Schema from '../../schema/Schema.js';
import type Fieldset from '../../schema/fieldset/Fieldset.js';
import type Column from '../../schema/column/Column.js';

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
      const attribute = column.component.viewFormat;
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
      const attribute = column.component.viewFormat;
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
  const attribute = column.component.viewFormat;
  const columnFieldset = column.type.fieldset;
  //skip if no form field 
  if (!attribute?.component.defined || !columnFieldset) return;
  //get the path where this should be saved
  const path = renderCode(TEMPLATE.FILE_PATH, {
    fieldset: fieldset.name.toPathName(),
    component: column.name.toComponentName('%sViewFormat')
  });
  const source = directory.createSourceFile(path, '', { overwrite: true });

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
  //import xViewFormat from '../../Address/components/view/xViewFormat.js'; 
  for (const column of columnFieldset.component.viewFormats.values()) {
    //NOTE: column.view is a computed getter, 
    // so dont keep computing it multiple times
    const viewFormat = column.component.viewFormat;
    //skip if no view component
    if (!viewFormat) return;
    source.addImportDeclaration({
      moduleSpecifier: renderCode(TEMPLATE.RELATIVE_VIEW_FORMAT_PATH, {
        fieldset: columnFieldset.name.toPathName(),
        component: column.name.toComponentName('%sViewFormat')
      }),
      defaultImport: column.name.toComponentName('%sViewFormat')
    });
  }
  //export function AddressViewFormat() {
  source.addFunction({
    isDefaultExport: true,
    name: column.name.toComponentName('%sViewFormat'),
    parameters: [ 
      { 
        name: 'props', 
        type: renderCode(TEMPLATE.VIEW_PROPS, {
          data: fieldset.name.toTypeName('%sExtended'),
          value: columnFieldset.name.toTypeName(),
          multiple: column.type.multiple ? '[]' : ''
        }) 
      } 
    ],
    statements: renderCode(TEMPLATE.FIELDSET_TABLE, {
      rows: columnFieldset.component.viewFormats.toArray().map(
        column => renderCode(TEMPLATE.FIELDSET_TABLE_ROW, {
          label: column.name.label,
          value: column.type.required
            ? renderCode(TEMPLATE.FIELDSET_TABLE_VALUE, {
              component: column.name.toComponentName('%sViewFormat'),
              column: column.name.toURLPath()
            })
            : renderCode(TEMPLATE.FIELDSET_TABLE_VALUE_OPTIONAL, {
              component: column.name.toComponentName('%sViewFormat'),
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
  const attribute = column.component.viewFormat;
  const columnFieldset = column.type.fieldset;
  //skip if no form field 
  if (!attribute?.component.defined || !columnFieldset) return;
  //get the path where this should be saved
  const path = renderCode(TEMPLATE.FILE_PATH, {
    fieldset: fieldset.name.toPathName(),
    component: column.name.toComponentName('%sViewFormat')
  });
  const source = directory.createSourceFile(path, '', { overwrite: true });
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
  //import xViewFormat from '../../Address/components/view/xViewFormat.js'; 
  columnFieldset.component.viewFormats.forEach(column => {
    source.addImportDeclaration({
      moduleSpecifier: renderCode(TEMPLATE.RELATIVE_VIEW_FORMAT_PATH, { 
        fieldset: columnFieldset.name.toPathName(),
        component: column.name.toComponentName('%sViewFormat')
      }),
      defaultImport: column.name.toComponentName('%sViewFormat')
    });
  });
  //export function AddressViewFormat() {
  source.addFunction({
    isDefaultExport: true,
    name: `${column.name.titleCase}ViewFormat`,
    parameters: [ 
      { 
        name: 'props', 
        type: renderCode(TEMPLATE.VIEW_PROPS, {
          data: fieldset.name.toTypeName('%sExtended'),
          value: columnFieldset.name.toTypeName(),
          multiple: column.type.multiple ? '[]' : ''
        })
      } 
    ],
    statements: renderCode(TEMPLATE.FIELDSET_TABLE, {
      rows: columnFieldset.component.viewFormats.map(
        column => renderCode(TEMPLATE.FIELDSET_TABLE_ROW, {
          label: column.name.label,
          value: column.type.required
            ? renderCode(TEMPLATE.FIELDSET_TABLE_VALUE, {
              component: column.name.toComponentName('%sViewFormat'),
              column: column.name.toURLPath()
            })
            : renderCode(TEMPLATE.FIELDSET_TABLE_VALUE_OPTIONAL, {
              component: column.name.toComponentName('%sViewFormat'),
              column: column.name.toURLPath()
            })
        })
      )
    })
  });
};

export function generateFormat(
  directory: Directory, 
  fieldset: Fieldset,
  column: Column
) {
  //get the form field attribute
  const attribute = column.component.viewFormat;
  //skip if no form field 
  if (!attribute?.component.defined) return;
  //this is the component definition token...
  const component = attribute.component.definition!;
  //this is the component props from the pre-defined 
  // definitions and the value set in the attribute.
  const props = attribute.component.props;
  //get the path where this should be saved
  const path = renderCode(TEMPLATE.FILE_PATH, {
    fieldset: fieldset.name.toPathName(),
    component: column.name.toComponentName('%sViewFormat')
  });
  const source = directory.createSourceFile(path, '', { overwrite: true });
  //import Text from 'frui/view/Text';
  source.addImportDeclaration({
    //component token will have import
    //info. just use that as is...
    moduleSpecifier: component.import.from,
    defaultImport: component.import.default ? component.name : undefined,
    namedImports: !component.import.default ? [ component.name ] : []
  });
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
          type: renderCode(TEMPLATE.VIEW_PROPS, {
            data: fieldset.name.toTypeName('%sExtended'),
            value: formatType[column.type.name],
            multiple: column.type.multiple ? '[]' : ''
          })
        }
      ],
      statements: renderCode(TEMPLATE.FORMAT_TEMPLATE_VIEW, {
        template: props.template,
        component: component.name
      })
    });
    return;
  }
  //export function NameViewFormat() {
  source.addFunction({
    isDefaultExport: true,
    name: `${column.name.titleCase}ViewFormat`,
    parameters: [
      { 
        name: 'props', 
        type: renderCode(TEMPLATE.VIEW_PROPS, {
          data: fieldset.name.toTypeName('%sExtended'),
          value: formatType[column.type.name],
          multiple: column.type.multiple ? '[]' : ''
        })
      }
    ],
    statements: renderCode(TEMPLATE.FORMAT_VIEW, { 
      props: JSON.stringify(props),
      component: component.name
    })
  });
};

export const TEMPLATE = {

FILE_PATH:
'<%fieldset%>/components/view/<%component%>.tsx',

RELATIVE_VIEW_FORMAT_PATH:
'../../../<%fieldset%>/components/view/<%component%>.js',

VIEW_PROPS:
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
    <%rows%>
  </Table>
);`,

FIELDSET_TABLE_ROW:
`<Table.Row>
  <Table.Col noWrap addClassName="font-bold">
    {_('<%label%>')}
  </Table.Col>
  <Table.Col>
    <%value%>
  </Table.Col>
</Table.Row>`, 

FIELDSET_TABLE_VALUE:
`<<%component%> data={value} value={value['<%column%>']} />`,

FIELDSET_TABLE_VALUE_OPTIONAL:
`{value['<%column%>'] ? (<<%component%> data={value} value={value['<%column%>']} />) : ''}`,

FORMAT_TEMPLATE_VIEW:
`//props
const { data } = props;
const value = mustache.render(
  '<%template%>',
  data
);
//render
return (
  <<%component%> value={value} />
);`,

FORMAT_VIEW:
`//props
const { data, value } = props;
const attributes = { data, ...<%props%> };
//render
return (
  <<%component%> {...attributes} value={value} />
);`

};