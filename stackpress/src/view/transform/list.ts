//modules
import type { Directory } from 'ts-morph';
//registry
import type Registry from '../../schema/Registry.js';
import type Fieldset from '../../schema/spec/Fieldset.js';
import type Column from '../../schema/spec/Column.js';

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

export default function generate(directory: Directory, registry: Registry) {
  //for each model
  for (const model of registry.model.values()) {
    //generate all column formats
    for (const column of model.columns.values()) {
      const list = column.list;
      if (!list) continue;
      list.component === 'Fieldset'
        ? (
          column.multiple 
            ? generateFieldsetTable(directory, model, column) 
            : generateFieldsetInfo(directory, model, column)
        )
        : generateFormat(directory, model, column); 
    }
  }
  //for each fieldset
  for (const fieldset of registry.fieldset.values()) {
    //generate all column formats
    for (const column of fieldset.columns.values()) {
      const list = column.list;
      if (!list) continue;
      list.component === 'Fieldset'
        ? (
          column.multiple 
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
  //NOTE: column.list is a computed getter, 
  // so dont keep computing it multiple times
  const list = column.list;
  const columnFieldset = column.fieldset;
  //skip if no field component
  if (!list || !columnFieldset) return;
  //get the path where this should be saved
  const path = `${fieldset.name}/components/list/${column.titleCase}ListFormat.tsx`;
  const source = directory.createSourceFile(path, '', { overwrite: true });

  //import { useLanguage } from 'r22n';
  source.addImportDeclaration({
    moduleSpecifier: 'r22n',
    namedImports: [ 'useLanguage' ]
  });
  //import { useStripe } from 'stackpress/view/client';
  source.addImportDeclaration({
    moduleSpecifier: 'stackpress/view/client',
    namedImports: [ 'useStripe' ]
  });
  //import { Table, Thead, Trow, Tcol } from 'frui/element/Table';
  source.addImportDeclaration({
    moduleSpecifier: 'frui/element/Table',
    namedImports: [ 'Table', 'Thead', 'Trow', 'Tcol' ]
  });
  //export function AddressListFormat() {}
  for (const column of columnFieldset.lists.values()) {
    //NOTE: column.list is a computed getter, 
    // so dont keep computing it multiple times
    const list = column.list;
    //skip if no list component
    if (!list) return;
    source.addImportDeclaration({
      moduleSpecifier: `../../../${
        columnFieldset.name
      }/components/list/${
        column.titleCase
      }ListFormat.js`,
      defaultImport: `${column.titleCase}ListFormat`
    });
  }
  const props = `{ 
    data: ${fieldset.titleCase}Extended,
    value: ${columnFieldset.titleCase}${column.multiple ? '[]': ''} 
  }`;
  //export function AddressListFormat() {
  source.addFunction({
    isDefaultExport: true,
    name: `${column.titleCase}ListFormat`,
    parameters: [ { name: 'props', type: props } ],
    statements: (`
      const { value } = props;
      const { _ } = useLanguage();
      const stripe = useStripe('theme-bg-bg0', 'theme-bg-bg1');
      if (!Array.isArray(value) || !value.length) return null;
      return (
        <Table>
          ${columnFieldset.lists.map(column => {
            const list = column.list!;
            return (`
              <Trow>
                <Tcol noWrap className={\`!theme-bc-bd2 font-bold \${stripe(true)}\`}>
                  {_('${column.label}')}
                </Tcol>
                <Tcol noWrap className={\`!theme-bc-bd2 \${stripe()}\`}>
                  ${column.required && !list.component
                    ? `{value.${column.name}.toString()}`
                    : column.required && list.component
                    ? `<${column.titleCase}ListFormat data={value} value={value.${column.name}} />`
                    : !column.required && !list.component
                    ? `{value.${column.name} ? value.${column.name}.toString() : ''}`
                    //!column.required && column.list.component
                    : `{value.${column.name} ? (<${column.titleCase}ListFormat data={value} value={value.${column.name}} />) : ''}`
                  }
                </Tcol>
              </Trow>
            `);
          })}
        </Table>
      ); 
    `)
  });
};

export function generateFieldsetInfo(
  directory: Directory, 
  fieldset: Fieldset,
  column: Column
) {
  //skip if no format component
  if (!column.fieldset) return;
  const columnFieldset = column.fieldset;
  //get the path where this should be saved
  const path = `${fieldset.name}/components/list/${column.titleCase}ListFormat.tsx`;
  const source = directory.createSourceFile(path, '', { overwrite: true });
  //import { useLanguage } from 'r22n';
  source.addImportDeclaration({
    moduleSpecifier: 'r22n',
    namedImports: [ 'useLanguage' ]
  });
  //import { useStripe } from 'stackpress/view/client';
  source.addImportDeclaration({
    moduleSpecifier: 'stackpress/view/client',
    namedImports: [ 'useStripe' ]
  });
  //import { Table, Trow, Tcol } from 'frui/element/Table';
  source.addImportDeclaration({
    moduleSpecifier: 'frui/element/Table',
    namedImports: [ 'Table', 'Trow', 'Tcol' ]
  });
  //export function AddressListFormat() {}
  columnFieldset.lists.forEach(column => {
    //NOTE: column.list is a computed getter, 
    // so dont keep computing it multiple times
    const list = column.list;
    //skip if no list component
    if (!list) return;
    source.addImportDeclaration({
      moduleSpecifier: `../../../${columnFieldset.name}/components/list/${column.titleCase}ListFormat.js`,
      defaultImport: `${column.titleCase}ListFormat`
    });
  });
  const props = `{ 
    data: ${fieldset.titleCase}Extended,
    value: ${columnFieldset.titleCase}${column.multiple ? '[]': ''} 
  }`;
  //export function AddressListFormat() {
  source.addFunction({
    isDefaultExport: true,
    name: `${column.titleCase}ListFormat`,
    parameters: [ { name: 'props', type: props } ],
    statements: (`
      const { value } = props;
      const { _ } = useLanguage();
      const stripe = useStripe('theme-bg-bg0', 'theme-bg-bg1');
      return (
        <Table>
          ${columnFieldset.lists.map(column => {
            const list = column.list!;
            return (`
              <Trow>
                <Tcol noWrap className={\`!theme-bc-bd2 font-bold \${stripe(true)}\`}>
                  {_('${column.label}')}
                </Tcol>
                <Tcol noWrap className={\`!theme-bc-bd2 \${stripe()}\`}>
                  ${column.required && !list.component
                    ? `{value.${column.name}.toString()}`
                    : column.required && list.component
                    ? `<${column.titleCase}ListFormat data={value} value={value.${column.name}} />`
                    : !column.required && !list.component
                    ? `{value.${column.name} ? value.${column.name}.toString() : ''}`
                    //!column.required && column.list.component
                    : `{value.${column.name} ? (<${column.titleCase}ListFormat data={value} value={value.${column.name}} />) : ''}`
                  }
                </Tcol>
              </Trow>
            `);
          })}
        </Table>
      ); 
    `)
  });
};

export function generateFormat(
  directory: Directory, 
  fieldset: Fieldset,
  column: Column
) {
  //NOTE: column.list is a computed getter, 
  // so dont keep computing it multiple times
  const list = column.list;
  //skip if no field component
  if (!list) return;
  //get the path where this should be saved
  const path = `${fieldset.name}/components/list/${column.titleCase}ListFormat.tsx`;
  const source = directory.createSourceFile(path, '', { overwrite: true });
  //import Text from 'frui/view/Text';
  source.addImportDeclaration({
    moduleSpecifier: `frui/view/${column.list.component}`,
    defaultImport: column.list.component
  });
  //import type { ProfileExtended } from '../../types.js';
  source.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: '../../types.js',
    namedImports: [ `${fieldset.titleCase}Extended` ]
  });
  const props = `{ 
    data: ${fieldset.titleCase}Extended,
    value: ${formatType[column.type]}${column.multiple ? '[]': ''} 
  }`;
  //import mustache from 'mustache';
  if (list.component === 'Template') {
    source.addImportDeclaration({
      moduleSpecifier: 'mustache',
      defaultImport: 'mustache'
    });
    //export function NameFormat() {
    source.addFunction({
      isDefaultExport: true,
      name: `${column.titleCase}Format`,
      parameters: [ { name: 'props', type: props } ],
      statements: (`
        //props
        const { data } = props;
        const value = mustache.render(
          '${list.props.template}',
          data
        );
        //render
        return (
          <${list.component} value={value} />
        );
      `)
    });
    return;
  }
  //export function NameListFormat() {
  source.addFunction({
    isDefaultExport: true,
    name: `${column.titleCase}ListFormat`,
    parameters: [
      { name: 'props', type: props }
    ],
    statements: (`
      //props
      const { data, value } = props;
      const attributes = { data, ...${JSON.stringify(list.props)} };
      //render
      return (
        <${list.component} {...attributes} value={value} />
      );
    `)
  });
};