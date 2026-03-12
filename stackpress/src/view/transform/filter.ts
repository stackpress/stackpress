//modules
import type { Directory } from 'ts-morph';
//stackpress
import Exception from '../../Exception.js';
//stackpress/schema
import type Schema from '../../schema/Schema.js';
import type Column from '../../schema/Column.js';
import type Model from '../../schema/Model.js';
import { 
  loadProjectFile, 
  renderCode 
} from '../../schema/transform/helpers.js';

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
  if (typeof props.id !== 'string' || !props.id
    || typeof props.search !== 'string' || !props.search
    || typeof props.template !== 'string' || !props.template
  ) {
    throw Exception.for(
      '@filter.relation in %s missing id, search or template prop',
      model.name.toString()
    );
  }

  //boolean component?
  const isBoolComponent = [ 'Checkbox', 'Switch' ].indexOf(component.name) !== -1;
  
  //get the path where this should be saved
  const filepath = renderCode('<%model%>/components/filter/<%component%>.tsx', {
    model: model.name.toPathName(),
    component: column.name.toComponentName('%sFilterField')
  });
  //load Profile/components/filter/NameFilterField.tsx if it exists, if not create it
  const source = loadProjectFile(directory, filepath);

  //import type { FieldProps, ControlProps } from 'stackpress/view/client';
  source.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: 'stackpress/view/client',
    namedImports: [ 'FieldProps', 'ControlProps' ]
  });
  //import { useState } from 'react';
  source.addImportDeclaration({
    moduleSpecifier: 'react',
    namedImports: [ 'useState' ]
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
      id: props.id,
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
  const filepath = renderCode('<%model%>/components/filter/<%component%>.tsx', {
    model: model.name.toPathName(),
    component: column.name.toComponentName('%sFilterField')
  });
  //load Profile/components/filter/NameFilterField.tsx if it exists, if not create it
  const source = loadProjectFile(directory, filepath);

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
  const filepath = renderCode('<%model%>/components/filter/<%component%>.tsx', {
    model: model.name.toPathName(),
    component: column.name.toComponentName('%sFilterField')
  });
  //load Profile/components/filter/NameFilterField.tsx if it exists, if not create it
  const source = loadProjectFile(directory, filepath);

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

RELATION_FIELD:
`//props
const { 
  name = 'filter[<%column%>]<%multiple%>',
  value,  
  error = false,
  onUpdate,
  className
} = props;
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
      ).then(response => response.json());
      const options = response.results.map(
        (row: Record<string, unknown>) => ({
          label: mustache.render('<%template%>', row),
          value: row.<%id%>
        })
      );
      updateOptions(options);
    }}
    onUpdate={value => onUpdate && onUpdate(name, value)}
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
const { name, value, onUpdate, error, className } = props;
//hooks
const { _ } = useLanguage();
//render
return (
  <FieldControl label={_('<%label%>')} error={error} className={className}>
    <%hidden%>
    <<%component%>
      error={!!error} 
      name={name}
      value={value} 
      onUpdate={onUpdate}
    />
  </FieldControl>
);`,

RELATION_BOOLEAN_HIDDEN_FIELD:
'<input type="hidden" name="filter[<%column%>]<%multiple%>" value="0" />',

BOOLEAN_FIELD:
`//props
const { className, value, onUpdate, error = false } = props;
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
    onUpdate={value => onUpdate && onUpdate('filter[<%column%>]<%multiple%>', value)}
  />
);`,

BOOLEAN_CONTROL:
`//props
const { className, value, onUpdate, error } = props;
//hooks
const { _ } = useLanguage();
//render
return (
  <FieldControl label={_('<%label%>')} error={error} className={className}>
    <input type="hidden" name="filter[<%column%>]<%multiple%>" value="0" />
    <<%component%>
      error={!!error} 
      value={value} 
      onUpdate={onUpdate}
    />
  </FieldControl>
);`,

FIELD_FIELD:
`//props
const { className, value, onUpdate, error = false } = props;
const attributes = <%props%>;
//render
return (
  <<%component%> 
    {...attributes}
    name="filter[<%column%>]<%multiple%>"
    className={className}
    error={error} 
    defaultValue={value} 
    onUpdate={value => onUpdate && onUpdate('filter[<%column%>]<%multiple%>', value)}
  />
);`,

FIELD_CONTROL:
`//props
const { className, value, onUpdate, error } = props;
//hooks
const { _ } = useLanguage();
//render
return (
  <FieldControl label={_('<%label%>')} error={error} className={className}>
    <<%component%>
      error={!!error} 
      value={value} 
      onUpdate={onUpdate}
    />
  </FieldControl>
);`

};