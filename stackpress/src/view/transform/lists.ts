//modules
import type { Directory } from 'ts-morph';
//registry
import type Registry from '../../schema/Registry';
import type Fieldset from '../../schema/spec/Fieldset';
import type Column from '../../schema/spec/Column';

export default function generate(directory: Directory, registry: Registry) {
  //for each model
  for (const model of registry.model.values()) {
    //generate all column formats
    model.columns.forEach(
      column => column.list.method === 'fieldset'
        ? (
          column.multiple 
            ? generateFieldsetTable(directory, model, column) 
            : generateFieldsetInfo(directory, model, column)
        )
        : generateFormat(directory, model, column)
    );
  }
  //for each fieldset
  for (const fieldset of registry.fieldset.values()) {
    //generate all column formats
    fieldset.columns.forEach(
      column => column.list.method === 'fieldset'
        ? (
          column.multiple 
            ? generateFieldsetTable(directory, fieldset, column) 
            : generateFieldsetInfo(directory, fieldset, column)
        )
        : generateFormat(directory, fieldset, column)
    );
  }
}

export function generateFieldsetTable(
  directory: Directory, 
  fieldset: Fieldset,
  column: Column
) {
  //skip if no format component
  if (!column.fieldset) return;
  const columnFieldset = column.fieldset;
  //get the path where this should be saved
  const path = `${fieldset.name}/components/lists/${column.title}ListFormat.tsx`;
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
  columnFieldset.lists.forEach(column => {
    //skip if no component
    if (typeof column.list.component !== 'string') return;
    source.addImportDeclaration({
      moduleSpecifier: `../../../${columnFieldset.name}/components/lists/${column.title}ListFormat`,
      defaultImport: `${column.title}ListFormat`
    });
  });
  const props = `{ 
    data: ${fieldset.title}Extended,
    value: ${columnFieldset.title}${column.multiple ? '[]': ''} 
  }`;
  //export function AddressListFormat() {
  source.addFunction({
    isDefaultExport: true,
    name: `${column.title}ListFormat`,
    parameters: [ { name: 'props', type: props } ],
    statements: (`
      const { value } = props;
      const { _ } = useLanguage();
      const stripe = useStripe('theme-bg-bg0', 'theme-bg-bg1');
      if (!Array.isArray(value) || !value.length) return null;
      return (
        <Table>
          ${columnFieldset.lists.filter(
            column => column.list.method !== 'hide'
          ).map(column => {
            return (`
              <Trow>
                <Tcol noWrap className={\`!theme-bc-bd2 font-bold \${stripe(true)}\`}>
                  {_('${column.label}')}
                </Tcol>
                <Tcol noWrap className={\`!theme-bc-bd2 \${stripe()}\`}>
                  ${column.required && !column.list.component
                    ? `{value.${column.name}.toString()}`
                    : column.required && column.list.component
                    ? `<${column.title}ListFormat data={value} value={value.${column.name}} />`
                    : !column.required && !column.list.component
                    ? `{value.${column.name} ? value.${column.name}.toString() : ''}`
                    //!column.required && column.list.component
                    : `{value.${column.name} ? (<${column.title}ListFormat data={value} value={value.${column.name}} />) : ''}`
                  }
                </Tcol>
              </Trow>
            `);
          })}
        </Table>
      ); 
    `)
  });
}

export function generateFieldsetInfo(
  directory: Directory, 
  fieldset: Fieldset,
  column: Column
) {
  //skip if no format component
  if (!column.fieldset) return;
  const columnFieldset = column.fieldset;
  //get the path where this should be saved
  const path = `${fieldset.name}/components/lists/${column.title}ListFormat.tsx`;
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
    //skip if no component
    if (typeof column.list.component !== 'string') return;
    source.addImportDeclaration({
      moduleSpecifier: `../../../${columnFieldset.name}/components/lists/${column.title}ListFormat`,
      defaultImport: `${column.title}ListFormat`
    });
  });
  const props = `{ 
    data: ${fieldset.title}Extended,
    value: ${columnFieldset.title}${column.multiple ? '[]': ''} 
  }`;
  //export function AddressListFormat() {
  source.addFunction({
    isDefaultExport: true,
    name: `${column.title}ListFormat`,
    parameters: [ { name: 'props', type: props } ],
    statements: (`
      const { value } = props;
      const { _ } = useLanguage();
      const stripe = useStripe('theme-bg-bg0', 'theme-bg-bg1');
      return (
        <Table>
          ${columnFieldset.lists.filter(
            column => column.list.method !== 'hide'
          ).map(column => {
            return (`
              <Trow>
                <Tcol noWrap className={\`!theme-bc-bd2 font-bold \${stripe(true)}\`}>
                  {_('${column.label}')}
                </Tcol>
                <Tcol noWrap className={\`!theme-bc-bd2 \${stripe()}\`}>
                  ${column.required && !column.list.component
                    ? `{value.${column.name}.toString()}`
                    : column.required && column.list.component
                    ? `<${column.title}ListFormat data={value} value={value.${column.name}} />`
                    : !column.required && !column.list.component
                    ? `{value.${column.name} ? value.${column.name}.toString() : ''}`
                    //!column.required && column.list.component
                    : `{value.${column.name} ? (<${column.title}ListFormat data={value} value={value.${column.name}} />) : ''}`
                  }
                </Tcol>
              </Trow>
            `);
          })}
        </Table>
      ); 
    `)
  });
}

export function generateFormat(
  directory: Directory, 
  fieldset: Fieldset,
  column: Column
) {
  //skip if no format component
  if (typeof column.list.component !== 'string') return;
  //get the path where this should be saved
  const path = `${fieldset.name}/components/lists/${column.title}ListFormat.tsx`;
  const source = directory.createSourceFile(path, '', { overwrite: true });
  //import Text from 'frui/format/Text';
  source.addImportDeclaration({
    moduleSpecifier: `frui/format/${column.list.component}`,
    defaultImport: column.list.component
  });
  const props = `{ 
    data: ${fieldset.title}Extended,
    value: ${column.typemap.format}${column.multiple ? '[]': ''} 
  }`;
  //import mustache from 'mustache';
  if (column.list.method === 'template') {
    source.addImportDeclaration({
      moduleSpecifier: 'mustache',
      defaultImport: 'mustache'
    });

    //import type { ProfileExtended } from '../../types';
    source.addImportDeclaration({
      isTypeOnly: true,
      moduleSpecifier: '../../types',
      namedImports: [ `${fieldset.title}Extended` ]
    });
    //export function NameFormat() {
    source.addFunction({
      isDefaultExport: true,
      name: `${column.title}Format`,
      parameters: [ { name: 'props', type: props } ],
      statements: (`
        //props
        const { data } = props;
        const value = mustache.render(
          '${column.list.attributes.template}',
          data
        );
        //render
        return (
          <${column.list.component} value={value} />
        );
      `)
    });
    return;
  }
  //export function NameListFormat() {
  source.addFunction({
    isDefaultExport: true,
    name: `${column.title}ListFormat`,
    parameters: [
      { name: 'props', type: props }
    ],
    statements: (`
      //props
      const { data, value } = props;
      const attributes = ${JSON.stringify(column.list.attributes)};
      //render
      return (
        <${column.list.component} {...attributes} data={data} value={value} />
      );
    `)
  });
}