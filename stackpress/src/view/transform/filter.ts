//modules
import type { Directory } from 'ts-morph';
//registry
import type Registry from '../../schema/Registry.js';
import type Column from '../../schema/spec/Column.js';
import type Model from '../../schema/model/Model.js';

export default function generate(directory: Directory, registry: Registry) {
  //for each model
  for (const model of registry.model.values()) {
    //generate all column fields
    for (const column of model.columns.values()) {
      const filter = column.filter;
      if (!filter) continue;
      filter.component === 'Relation'
        ? generateRelation(directory, model, column)
        : ['Checkbox', 'Switch'].includes(filter.component)
        ? generateBoolean(directory, model, column)
        : generateField(directory, model, column);
    }
  }
};

export function generateRelation(
  directory: Directory, 
  model: Model,
  column: Column
) {
  //NOTE: column.filter is a computed getter, 
  // so dont keep computing it multiple times
  const filter = column.filter;
  //skip if no filter component
  if (!filter) return;
  //get the path where this should be saved
  const path = `${model.name}/components/filter/${column.titleCase}FilterField.tsx`;
  const source = directory.createSourceFile(path, '', { overwrite: true });

  const BoolComponent = [ 'Checkbox', 'Switch' ].indexOf(filter.component) !== -1;

  //import type { FieldProps, ControlProps } from 'stackpress/view/client';
  source.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: 'stackpress/view/client',
    namedImports: [ 'FieldProps', 'ControlProps' ]
  });
  //import mustache from 'mustache';
  source.addImportDeclaration({
      moduleSpecifier: 'mustache',
      defaultImport: 'mustache'
    });
  //import SuggestInput from 'frui/form/SuggestInput';
  source.addImportDeclaration({
    moduleSpecifier: 'frui/form/SuggestInput',
    defaultImport: 'SuggestInput'
  });
  //import { useLanguage } from 'r22n';
  source.addImportDeclaration({
    moduleSpecifier: 'r22n',
    namedImports: [ 'useLanguage' ]
  });
  //import FieldControl from 'frui/form/FieldControl';
  source.addImportDeclaration({
    moduleSpecifier: 'frui/form/FieldControl',
    defaultImport: 'FieldControl'
  });
  //import Text from 'frui/form/Text';
  source.addImportDeclaration({
    moduleSpecifier: `frui/form/${column.filter.component}`,
    defaultImport: column.filter.component
  });
  //export function NameFilterField(props: FieldProps) {
  source.addFunction({
    isExported: true,
    name: `${column.titleCase}FilterField`,
    parameters: [
      { name: 'props', type: 'FieldProps' }
    ],
    statements: (`
      //props
      const { className, value, change, error = false } = props;
      const [ 
        options, 
        updateOptions 
      ] = useState<{ label: string , value: any }[]>([]);
      //render
      return (
        <SuggestInput 
          name={name}
          className={className}
          error={error} 
          defaultValue={value}
          onQuery={async query => {
            const response = await fetch(
              '${String(filter.props.search || '')}'.replace('{{query}}', query)
            );
            const json = await response.json();
            const options = json.results.map(row => ({
              label: mustache.render('${filter.props.template}', row),
              value: row.${filter.props.id}
            }));
            updateOptions(options);
          }}
        >
          {options.map(option => (
            <SuggestInput.Option value={option.value} key={option.value}>
              {option.label}
            </SuggestInput.Option>
          ))}
        </SuggestInput>
      );
    `)
  });
  //export function NameFilterFieldControl(props: ControlProps) {
  source.addFunction({
    isExported: true,
    name: `${column.titleCase}FilterFieldControl`,
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
        <FieldControl label={_('${column.label}')} error={error} className={className}>
          ${BoolComponent ? `<input type="hidden" name="filter[${column.name}]${column.multiple ? '[]': ''}" value="0" />`: ''}
          <${column.titleCase}FilterField
            error={!!error} 
            value={value} 
            change={change}
          />
        </FieldControl>
      );
    `)
  });
};

export function generateBoolean(
  directory: Directory, 
  model: Model,
  column: Column
) {
  //NOTE: column.filter is a computed getter, 
  // so dont keep computing it multiple times
  const filter = column.filter;
  //skip if no filter component
  if (!filter) return;
  //get the path where this should be saved
  const path = `${model.name}/components/filter/${column.titleCase}FilterField.tsx`;
  const source = directory.createSourceFile(path, '', { overwrite: true });

  //import type { FieldProps, ControlProps } from 'stackpress/view/client';
  source.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: 'stackpress/view/client',
    namedImports: [ 'FieldProps', 'ControlProps' ]
  });
  //import { useLanguage } from 'r22n';
  source.addImportDeclaration({
    moduleSpecifier: 'r22n',
    namedImports: [ 'useLanguage' ]
  });
  //import FieldControl from 'frui/form/FieldControl';
  source.addImportDeclaration({
    moduleSpecifier: 'frui/form/FieldControl',
    defaultImport: 'FieldControl'
  });
  //import Text from 'frui/form/Text';
  source.addImportDeclaration({
    moduleSpecifier: `frui/form/${column.filter.component}`,
    defaultImport: column.filter.component
  });
  //export function NameFiter(props: FieldProps) {
  source.addFunction({
    isExported: true,
    name: `${column.titleCase}FilterField`,
    parameters: [
      { name: 'props', type: 'FieldProps' }
    ],
    statements: (`
      //props
      const { className, value, change, error = false } = props;
      const attributes = ${JSON.stringify(filter.props)};
      //render
      return (
        <${filter.component} 
          {...attributes}
          name="filter[${column.name}]${column.multiple ? '[]': ''}"
          className={className}
          error={error} 
          defaultValue="1"
          defaultChecked={!!value}
          onUpdate={value => change && change('filter[${column.name}]${column.multiple ? '[]': ''}', value)}
        />
      );
    `)
  });
  //export function NameFilterFieldControl(props: ControlProps) {
  source.addFunction({
    isExported: true,
    name: `${column.titleCase}FilterFieldControl`,
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
        <FieldControl label={_('${column.label}')} error={error} className={className}>
          <input type="hidden" name="filter[${column.name}]${column.multiple ? '[]': ''}" value="0" />
          <${column.titleCase}FilterField
            error={!!error} 
            value={value} 
            change={change}
          />
        </FieldControl>
      );
    `)
  });
};

export function generateField(
  directory: Directory, 
  model: Model,
  column: Column
) {
  //NOTE: column.filter is a computed getter, 
  // so dont keep computing it multiple times
  const filter = column.filter;
  //skip if no filter component
  if (!filter) return;
  //get the path where this should be saved
  const path = `${model.name}/components/filter/${column.titleCase}FilterField.tsx`;
  const source = directory.createSourceFile(path, '', { overwrite: true });

  //import type { FieldProps, ControlProps } from 'stackpress/view/client';
  source.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: 'stackpress/view/client',
    namedImports: [ 'FieldProps', 'ControlProps' ]
  });
  //import { useLanguage } from 'r22n';
  source.addImportDeclaration({
    moduleSpecifier: 'r22n',
    namedImports: [ 'useLanguage' ]
  });
  //import FieldControl from 'frui/form/FieldControl';
  source.addImportDeclaration({
    moduleSpecifier: 'frui/form/FieldControl',
    defaultImport: 'FieldControl'
  });
  //import Text from 'frui/form/Text';
  source.addImportDeclaration({
    moduleSpecifier: `frui/form/${column.filter.component}`,
    defaultImport: column.filter.component
  });
  //export function NameFiter(props: FieldProps) {
  source.addFunction({
    isExported: true,
    name: `${column.titleCase}FilterField`,
    parameters: [
      { name: 'props', type: 'FieldProps' }
    ],
    statements: (`
      //props
      const { className, value, change, error = false } = props;
      const attributes = ${JSON.stringify(filter.props)};
      //render
      return (
        <${filter.component} 
          {...attributes}
          name="filter[${column.name}]${column.multiple ? '[]': ''}"
          className={className}
          error={error} 
          defaultValue={value} 
          onUpdate={value => change && change('filter[${column.name}]${column.multiple ? '[]': ''}', value)}
        />
      );
    `)
  });
  //export function NameFilterControl(props: ControlProps) {
  source.addFunction({
    isExported: true,
    name: `${column.titleCase}FilterFieldControl`,
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
        <FieldControl label={_('${column.label}')} error={error} className={className}>
          <${column.titleCase}FilterField
            error={!!error} 
            value={value} 
            change={change}
          />
        </FieldControl>
      );
    `)
  });
};