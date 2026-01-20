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
      const view = column.view;
      if (!view) continue;
      view.component === 'Fieldset'
        ? (column.multiple 
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
      const view = column.view;
      if (!view) continue;
      view.component === 'Fieldset'
        ? (column.multiple 
          ? generateFieldsetTable(directory, fieldset, column) 
          : generateFieldsetInfo(directory, fieldset, column)
        )
        : generateFormat(directory, fieldset, column);
    }
  }
}

export function generateFieldsetTable(
  directory: Directory, 
  fieldset: Fieldset,
  column: Column
) {
  //NOTE: column.view is a computed getter, 
  // so dont keep computing it multiple times
  const view = column.view;
  const columnFieldset = column.fieldset;
  //skip if no view component
  if (!view || !columnFieldset) return;
  const views = columnFieldset.views.filter(column => column.view);
  //get the path where this should be saved
  const path = `${fieldset.name}/components/view/${column.titleCase}ViewFormat.tsx`;
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
  //export function AddressViewFormat() {}
  views.forEach(column => {
    source.addImportDeclaration({
      moduleSpecifier: `../../../${
        columnFieldset.name
      }/components/view/${
        column.titleCase
      }ViewFormat.js`,
      defaultImport: `${column.titleCase}ViewFormat`
    });
  });
  const props = `{ 
    data: ${fieldset.titleCase}Extended,
    value: ${columnFieldset.titleCase}${column.multiple ? '[]': ''} 
  }`;
  //export function AddressFormat() {
  source.addFunction({
    isDefaultExport: true,
    name: `${column.titleCase}Format`,
    parameters: [ { name: 'props', type: props } ],
    statements: (`
      const { value } = props;
      const { _ } = useLanguage();
      const stripe = useStripe('theme-bg-bg0', 'theme-bg-bg1');
      if (!Array.isArray(value) || !value.length) return null;
      return (
        <Table>
          ${views.map(column => (`
            <Thead noWrap stickyTop className="!theme-bc-bd2 theme-bg-bg2 text-left">
              {_('${column.label}')}
            </Thead>
          `)).join('\n')}
          {value.map((row, index) => (
            <Trow key={index}>
              ${views.map(column => {
                const value = column.required
                  ? `<${column.titleCase}ViewFormat data={row} value={row.${column.name}} />`
                  : `{row.${column.name} ? (<${column.titleCase}ViewFormat data={row} value={row.${column.name}} />) : ''}`;
                const align = column.sortable ? 'text-right' : 'text-left';
                return (`
                  <Tcol noWrap className={\`!theme-bc-bd2 ${align} \${stripe(index)}\`}>
                    ${value}
                  </Tcol>
                `);
              }).join('\n')}
            </Trow>
          ))}
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
  //NOTE: column.view is a computed getter, 
  // so dont keep computing it multiple times
  const view = column.view;
  const columnFieldset = column.fieldset;
  //skip if no view component
  if (!view || !columnFieldset) return;
  const views = columnFieldset.views.filter(column => column.view);
  //get the path where this should be saved
  const path = `${fieldset.name}/components/view/${column.titleCase}ViewFormat.tsx`;
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
  //export function AddressViewFormat() {}
  views.forEach(column => {
    //skip if no component
    if (typeof column.view!.component !== 'string') return;
    source.addImportDeclaration({
      moduleSpecifier: `../../../${columnFieldset.name}/components/view/${column.titleCase}ViewFormat.js`,
      defaultImport: `${column.titleCase}ViewFormat`
    });
  });
  const props = `{ 
    data: ${fieldset.titleCase}Extended,
    value: ${columnFieldset.titleCase}${column.multiple ? '[]': ''} 
  }`;
  //export function AddressFormat() {
  source.addFunction({
    isDefaultExport: true,
    name: `${column.titleCase}Format`,
    parameters: [ { name: 'props', type: props } ],
    statements: (`
      const { value } = props;
      const { _ } = useLanguage();
      const stripe = useStripe('theme-bg-bg0', 'theme-bg-bg1');
      if (typeof value !== 'object' 
        || value?.constructor?.name !== 'Object'
      ) return null;
      return (
        <Table>
          ${views.map(column => {
            return (`
              <Trow>
                <Tcol noWrap className={\`!theme-bc-bd2 font-bold \${stripe(true)}\`}>
                  {_('${column.label}')}
                </Tcol>
                <Tcol noWrap className={\`!theme-bc-bd2 \${stripe()}\`}>
                  ${column.required
                    ? `<${column.titleCase}ViewFormat data={value} value={value.${column.name}} />`
                    //!column.required && column.view.component
                    : `{value.${column.name} ? (<${column.titleCase}ViewFormat data={value} value={value.${column.name}} />) : ''}`
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
  //NOTE: column.view is a computed getter, 
  // so dont keep computing it multiple times
  const view = column.view;
  //skip if no view component
  if (!view) return;
  //skip if no format component
  if (typeof column.view.component !== 'string') return;
  //get the path where this should be saved
  const path = `${fieldset.name}/components/view/${column.titleCase}ViewFormat.tsx`;
  const source = directory.createSourceFile(path, '', { overwrite: true });
  //import Text from 'frui/view/Text';
  source.addImportDeclaration({
    moduleSpecifier: `frui/view/${column.view.component}`,
    defaultImport: column.view.component
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
  if (view.component === 'Template') {
    //import mustache from 'mustache';
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
          '${view.props.template}',
          data
        );
        //render
        return (
          <${view.component} value={value} />
        );
      `)
    });
    return;
  }
  //export function NameViewFormat() {
  source.addFunction({
    isDefaultExport: true,
    name: `${column.titleCase}ViewFormat`,
    parameters: [ { name: 'props', type: props } ],
    statements: (`
      //props
      const { data, value } = props;
      const attributes = { data, ...${JSON.stringify(view.props)} };
      //render
      return (
        <${view.component} {...attributes} value={value} />
      );
    `)
  });
}