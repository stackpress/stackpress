//modules
import type { Directory } from 'ts-morph';
//stackpress
import { renderCode } from '../../helpers.js';
//stackpress/schema
import type Schema from '../../schema/Schema.js';
import type Column from '../../schema/column/Column.js';
import type Model from '../../schema/model/Model.js';

export default function generate(directory: Directory, schema: Schema) {
  //for each model
  for (const model of schema.models.values()) {
    //and for each column
    for (const column of model.columns.values()) {
      //get the filter field attribute
      const attribute = column.component.filterField;
      //skip if no filter field 
      if (!attribute?.component.defined) continue;
      //this is the component definition token...
      const component = attribute.component.definition!;
      //if filter field component is Relation
      component.name === 'Relation'
        //generate relation filter field
        ? generateRelation(directory, model, column)
        //else if filter field component is Boolean
        : ['Checkbox', 'Switch'].includes(component.name)
        //generate boolean filter field
        ? generateBoolean(directory, model, column)
        //otherwise generate standard field
        : generateField(directory, model, column);
    }
  }
};

export function generateRelation(
  directory: Directory, 
  model: Model,
  column: Column
) {
  //get the filter field attribute
  const attribute = column.component.filterField;
  //skip if no filter field 
  if (!attribute?.component.defined) return;
  //this is the component definition token...
  const component = attribute.component.definition!;
  //this is the component props from the pre-defined 
  // definitions and the value set in the attribute.
  const props = attribute.component.props;
  //get the path where this should be saved
  const path = renderCode(TEMPLATE.FILE_PATH, {
    model: model.name.toPathName(),
    component: column.name.toComponentName('%sFilterField')
  });
  const source = directory.createSourceFile(path, '', { overwrite: true });
  //boolean component?
  const isBoolComponent = [ 'Checkbox', 'Switch' ].indexOf(component.name) !== -1;

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
    //component token will have import
    //info. just use that as is...
    moduleSpecifier: component.import.from,
    defaultImport: component.import.default ? component.name : undefined,
    namedImports: !component.import.default ? [ component.name ] : []
  });
  //export function NameFilterField(props: FieldProps) {
  source.addFunction({
    isExported: true,
    name: column.name.toComponentName('%sFilterField'),
    parameters: [
      { name: 'props', type: 'FieldProps' }
    ],
    statements: renderCode(TEMPLATE.RELATION_FIELD, {
      url: String(props.search || ''),
      template: props.template,
      id: props.id
    })
  });
  //export function NameFilterFieldControl(props: ControlProps) {
  source.addFunction({
    isExported: true,
    name: column.name.toComponentName('%sFilterFieldControl'),
    parameters: [
      { name: 'props', type: 'ControlProps' }
    ],
    statements: renderCode(TEMPLATE.RELATION_CONTROL, {
      label: column.name.label,
      hidden: isBoolComponent 
        ? renderCode(TEMPLATE.RELATION_BOOLEAN_HIDDEN_FIELD, {
          column: column.name.toURLPath(),
          multiple: column.type.multiple ? '[]': ''
        }) 
        : '',
      component: column.name.toComponentName('%sFilterField'),
    })
  });
};

export function generateBoolean(
  directory: Directory, 
  model: Model,
  column: Column
) {
  //get the filter field attribute
  const attribute = column.component.filterField;
  //skip if no filter field 
  if (!attribute?.component.defined) return;
  //this is the component definition token...
  const component = attribute.component.definition!;
  //this is the component props from the pre-defined 
  // definitions and the value set in the attribute.
  const props = attribute.component.props;
  //get the path where this should be saved
  const path = renderCode(TEMPLATE.FILE_PATH, {
    model: model.name.toPathName(),
    component: column.name.toComponentName('%sFilterField')
  });
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
    //component token will have import
    //info. just use that as is...
    moduleSpecifier: component.import.from,
    defaultImport: component.import.default ? component.name : undefined,
    namedImports: !component.import.default ? [ component.name ] : []
  });
  //export function NameFiter(props: FieldProps) {
  source.addFunction({
    isExported: true,
    name: column.name.toComponentName('%sFilterField'),
    parameters: [
      { name: 'props', type: 'FieldProps' }
    ],
    statements: renderCode(TEMPLATE.BOOLEAN_FIELD, {
      props: JSON.stringify(props),
      component: component.name,
      column: column.name.toURLPath(),
      multiple: column.type.multiple ? '[]': ''
    })
  });
  //export function NameFilterFieldControl(props: ControlProps) {
  source.addFunction({
    isExported: true,
    name: column.name.toComponentName('%sFilterFieldControl'),
    parameters: [
      { name: 'props', type: 'ControlProps' }
    ],
    statements: renderCode(TEMPLATE.BOOLEAN_CONTROL, {
      label: column.name.label,
      column: column.name.toURLPath(),
      multiple: column.type.multiple ? '[]': '',
      component: column.name.toComponentName('%sFilterField')
    })
  });
};

export function generateField(
  directory: Directory, 
  model: Model,
  column: Column
) {
  //get the filter field attribute
  const attribute = column.component.filterField;
  //skip if no filter field 
  if (!attribute?.component.defined) return;
  //this is the component definition token...
  const component = attribute.component.definition!;
  //this is the component props from the pre-defined 
  // definitions and the value set in the attribute.
  const props = attribute.component.props;
  //get the path where this should be saved
  const path = renderCode(TEMPLATE.FILE_PATH, {
    model: model.name.toPathName(),
    component: column.name.toComponentName('%sFilterField')
  });
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
    //component token will have import
    //info. just use that as is...
    moduleSpecifier: component.import.from,
    defaultImport: component.import.default ? component.name : undefined,
    namedImports: !component.import.default ? [ component.name ] : []
  });
  //export function NameFiter(props: FieldProps) {
  source.addFunction({
    isExported: true,
    name: column.name.toComponentName('%sFilterField'),
    parameters: [
      { name: 'props', type: 'FieldProps' }
    ],
    statements: renderCode(TEMPLATE.FIELD_FIELD, {
      props: JSON.stringify(props),
      component: component.name,
      column: column.name.toURLPath(),
      multiple: column.type.multiple ? '[]': ''
    })
  });
  //export function NameFilterControl(props: ControlProps) {
  source.addFunction({
    isExported: true,
    name: column.name.toComponentName('%sFilterFieldControl'),
    parameters: [
      { name: 'props', type: 'ControlProps' }
    ],
    statements: renderCode(TEMPLATE.FIELD_CONTROL, {
      label: column.name.label,
      component: column.name.toComponentName('%sFilterField')
    })
  });
};

export const TEMPLATE = {

FILE_PATH: 
'<%model%>/components/filter/<%component%>.tsx',

RELATION_FIELD:
`//props
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
        '<%url%>'.replace('{{query}}', query)
      );
      const json = await response.json();
      const options = json.results.map(row => ({
        label: mustache.render('<%template%>', row),
        value: row.<%id%>
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
);`,

RELATION_CONTROL:
`//props
const { className, value, change, error } = props;
//hooks
const { _ } = useLanguage();
//render
return (
  <FieldControl label={_('<%label%>')} error={error} className={className}>
    <%hidden%>
    <<%component%>
      error={!!error} 
      value={value} 
      change={change}
    />
  </FieldControl>
);`,

RELATION_BOOLEAN_HIDDEN_FIELD:
'<input type="hidden" name="filter[<%column%>]<%multiple%>" value="0" />',

BOOLEAN_FIELD:
`//props
const { className, value, change, error = false } = props;
const attributes = <%props%>;
//render
return (
  <<%component%> 
    {...attributes}
    name="filter[<%column%>]<%multiple%>"
    className={className}
    error={error} 
    defaultValue="1"
    defaultChecked={!!value}
    onUpdate={value => change && change('filter[<%column%>]<%multiple%>', value)}
  />
);`,

BOOLEAN_CONTROL:
`//props
const { className, value, change, error } = props;
//hooks
const { _ } = useLanguage();
//render
return (
  <FieldControl label={_('<%label%>')} error={error} className={className}>
    <input type="hidden" name="filter[<%column%>]<%multiple%>" value="0" />
    <<%component%>
      error={!!error} 
      value={value} 
      change={change}
    />
  </FieldControl>
);`,

FIELD_FIELD:
`//props
const { className, value, change, error = false } = props;
const attributes = <%props%>;
//render
return (
  <<%component%> 
    {...attributes}
    name="filter[<%column%>]<%multiple%>"
    className={className}
    error={error} 
    defaultValue={value} 
    onUpdate={value => change && change('filter[<%column%>]<%multiple%>', value)}
  />
);`,

FIELD_CONTROL:
`//props
const { className, value, change, error } = props;
//hooks
const { _ } = useLanguage();
//render
return (
  <FieldControl label={_('<%label%>')} error={error} className={className}>
    <<%component%>
      error={!!error} 
      value={value} 
      change={change}
    />
  </FieldControl>
);`

};