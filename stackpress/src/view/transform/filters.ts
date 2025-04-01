//modules
import type { Directory } from 'ts-morph';
//registry
import type Registry from '../../schema/Registry';
import type Column from '../../schema/spec/Column';
import type Model from '../../schema/spec/Model';

export default function generate(directory: Directory, registry: Registry) {
  //for each model
  for (const model of registry.model.values()) {
    //generate all column fields
    model.columns.forEach(
      column => generateFilter(directory, model, column)
    );
  }
}

export function generateFilter(
  directory: Directory, 
  model: Model,
  column: Column
) {
  //skip if no format component
  if (typeof column.filter.component !== 'string') return;
  //get the path where this should be saved
  const path = `${model.name}/components/filters/${column.title}Filter.tsx`;
  const source = directory.createSourceFile(path, '', { overwrite: true });

  const BoolComponent = [ 'Checkbox', 'Switch' ].indexOf(column.filter.component) !== -1;

  //import type { FieldProps, ControlProps } from 'stackpress/view';
  source.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: 'stackpress/view',
    namedImports: [ 'FieldProps', 'ControlProps' ]
  });
  //import mustache from 'mustache';
  if (column.field.method === 'relation') {
    source.addImportDeclaration({
      moduleSpecifier: 'mustache',
      defaultImport: 'mustache'
    });
  }
  //import { useLanguage } from 'r22n';
  source.addImportDeclaration({
    moduleSpecifier: 'r22n',
    namedImports: [ 'useLanguage' ]
  });
  //import Control from 'frui/element/Control';
  source.addImportDeclaration({
    moduleSpecifier: 'frui/element/Control',
    defaultImport: 'Control'
  });
  //import Text from 'frui/fields/Text';
  source.addImportDeclaration({
    moduleSpecifier: `frui/field/${column.filter.component}`,
    defaultImport: column.filter.component
  });
  //export function NameFiter(props: FieldProps) {
  source.addFunction({
    isExported: true,
    name: `${column.title}Filter`,
    parameters: [
      { name: 'props', type: 'FieldProps' }
    ],
    statements: (`
      //props
      const { className, value, change, error = false } = props;
      ${column.filter.method === 'relation' ? (`
        //render
        return (
          <${column.filter.component} 
            name="filter[${column.name}]${column.multiple ? '[]': ''}"
            className={className}
            error={error} 
            defaultValue={value} 
            searchable={true}
            onQuery={async (query, update) => {
              const response = await fetch(\`${
                (column.filter.attributes.search as string)?.includes('?')
                  ? column.filter.attributes.search + '&q=${query}'
                  : column.filter.attributes.search + '?q=${query}'
              }\`);
              const json = await response.json();
              const options = json.results.map(row => ({
                label: mustache.render('${column.filter.attributes.template}', row),
                value: row.${column.filter.attributes.id}
              }));
              update(options);
            }}
          />
        );
      `) : (`
        const attributes = ${JSON.stringify(column.filter.attributes)};
        //render
        return (
          <${column.filter.component} 
            {...attributes}
            name="filter[${column.name}]${column.multiple ? '[]': ''}"
            className={className}
            error={error} 
            ${BoolComponent ? (`
              defaultValue="1"
              defaultChecked={!!value}
            `): (`
              defaultValue={value} 
            `)}
            onUpdate={value => change && change('filter[${column.name}]${column.multiple ? '[]': ''}', value)}
          />
        );
      `)}
      
    `)
  });
  //export function NameFilterControl(props: ControlProps) {
  source.addFunction({
    isExported: true,
    name: `${column.title}FilterControl`,
    parameters: [
      { name: 'props', type: 'ControlProps' }
    ],
    statements: (`
      //props
      const { className, value, change, error } = props;
      //hooks
      const { _ } = useLanguage();
      //render
      return (
        <Control label={_('${column.label}')} error={error} className={className}>
          ${BoolComponent ? `<input type="hidden" name="filter[${column.name}]${column.multiple ? '[]': ''}" value="0" />`: ''}
          <${column.title}Filter
            error={!!error} 
            value={value} 
            change={change}
          />
        </Control>
      );
    `)
  });
}