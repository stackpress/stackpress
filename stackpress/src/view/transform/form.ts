//modules
import type { Directory } from 'ts-morph';
import { VariableDeclarationKind } from 'ts-morph';
//stackpress
import Exception from '../../Exception.js';
//stackpress/schema
import type Schema from '../../schema/Schema.js';
import type Fieldset from '../../schema/Fieldset.js';
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
      //get the form field attribute
      const attribute = column.component.formField;
      //skip if no form field 
      if (!attribute?.component.defined) continue;
      //this is the component definition token...
      const component = attribute.component.definition!;
      //if form field component is Relation
      component.name === 'Relation'
        //generate relation field
        ? generateRelation(directory, model, column)
        //if component is a fieldset
        : component.name === 'Fieldset'
        //generate fieldset field
        ? generateFieldset(directory, model, column)
        //if component is boolean
        : ['Checkbox', 'Switch'].includes(component.name)
        //generate boolean field
        ? generateBoolean(directory, model, column)
        //generate normal field
        : generateField(directory, model, column);
    }
  }
  //for each fieldset
  for (const fieldset of schema.fieldsets.values()) {
    //and for each column
    for (const column of fieldset.columns.values()) {
      //get the form field attribute
      const attribute = column.component.formField;
      //skip if no form field 
      if (!attribute?.component.defined) continue;
      //this is the component definition token...
      const component = attribute.component.definition!;
      //if form field component is a fieldset
      component.name === 'Fieldset'
        //generate fieldset field
        ? generateFieldset(directory, fieldset, column)
        //if component is boolean
        : [ 'Checkbox', 'Switch' ].includes(component.name)
        //generate boolean field
        ? generateBoolean(directory, fieldset, column)
        //generate normal field
        : generateField(directory, fieldset, column);
    }
  }
};

export function generateRelation(
  directory: Directory, 
  model: Model,
  column: Column
) {
  //get the form field attribute
  const attribute = column.component.formField;
  //skip if no form field 
  if (!attribute?.component.defined) return;
  //this is the component props from the pre-defined 
  // definitions and the value set in the attribute.
  const props = attribute.component.props;
  if (typeof props.id !== 'string' || !props.id
    || typeof props.search !== 'string' || !props.search
    || typeof props.template !== 'string' || !props.template
  ) {
    throw Exception.for(
      '@field.relation in %s -> %s missing id, search or template prop',
      model.name.toString(),
      column.name.toString()
    );
  }
  
  //get the path where this should be saved
  const filepath = renderCode('<%fieldset%>/components/form/<%component%>.tsx', {
    fieldset: model.name.toPathName(),
    component: column.name.toComponentName('%sFormField')
  });
  //load Profile/components/form/NameFormField.tsx if it exists, if not create it
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
  //import SuggestInput from 'frui/form/SuggestInput';
  source.addImportDeclaration({
    moduleSpecifier: 'frui/form/SuggestInput',
    defaultImport: 'SuggestInput'
  });
  //export function NameFormField(props: FieldProps) {
  source.addFunction({
    isExported: true,
    name: column.name.toComponentName('%sFormField'),
    parameters: [
      { name: 'props', type: 'FieldProps' }
    ],
    statements: renderCode(TEMPLATE.RELATION_FIELD, {
      column: column.name.toURLPath(),
      multiple: column.type.multiple ? '[]': '',
      url: String(props.search || ''),
      template: String(props.template || ''),
      id: props.id
    })
  });
  //export function NameFieldControl(props: ControlProps) {
  source.addFunction({
    isExported: true,
    name: column.name.toComponentName('%sFormFieldControl'),
    parameters: [
      { name: 'props', type: 'ControlProps' }
    ],
    statements: renderCode(TEMPLATE.RELATION_CONTROL, {
      label: column.name.label,
      required: column.type.required && !column.type.multiple
        ? ` + '*'`
        : '',
      component: column.name.toComponentName('%sFormField')
    })
  });
};

export function generateFieldset(
  directory: Directory, 
  fieldset: Fieldset,
  column: Column
) {
  //get the form field attribute
  const attribute = column.component.formField;
  //skip if no form field 
  if (!attribute?.component.defined) return;
  //this is the component props from the pre-defined 
  // definitions and the value set in the attribute.
  const props = attribute.component.props;
  
  //get the path where this should be saved
  const filepath = renderCode('<%fieldset%>/components/form/<%component%>.tsx', {
    fieldset: fieldset.name.toPathName(),
    component: column.name.toComponentName('%sFormField')
  });
  //load Profile/components/form/NameFormField.tsx if it exists, if not create it
  const source = loadProjectFile(directory, filepath);
  
  //import type { ReactNode, CSSProperties } from 'react';
  source.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: 'react',
    namedImports: [ 'ReactNode', 'CSSProperties' ]
  });
  //import type { FieldsProps, FieldsetProps } from 'frui/form/Fieldset';
  source.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: 'frui/form/Fieldset',
    namedImports: [ 'FieldsProps', 'FieldsetProps' ]
  });
  //import type { AddressInput } from '../../../Address/types.js';
  source.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: fieldset.name.toPathName('../../../%s/types.js'),
    namedImports: [ column.name.toTypeName('%sInput') ]
  });
  //import { useLanguage } from 'r22n';
  source.addImportDeclaration({
    moduleSpecifier: 'r22n',
    namedImports: [ 'useLanguage' ]
  });
  //import make from 'frui/form/Fieldset';
  source.addImportDeclaration({
    moduleSpecifier: 'frui/form/Fieldset',
    defaultImport: 'make'
  });
  //import LabelFieldControl from '../../../Address/components/form/LabelField.js';
  for (const column of fieldset.component.formFields.values()) {
    //get the form field attribute
    const attribute = column.component.formField;
    //skip if no form field 
    if (!attribute?.component.defined) return;
    //this is the component definition token...
    const component = attribute.component.definition!;
    if (component.name === 'Fieldset') {
      //import { ActiveFieldsetControl } from '../../components/form/ActiveField.js';
      source.addImportDeclaration({
        moduleSpecifier: renderCode(TEMPLATE.RELATIVE_FORM_FIELD_PATH, {
          fieldset: fieldset.name.toPathName(),
          component: column.name.toComponentName('%sFormField')
        }),
        namedImports: [ column.name.toComponentName('%sFormFieldsetControl') ]
      });
      continue;
    }
  }

  //export type AddressConfig = { ... };
  source.addTypeAlias({
    isExported: true,
    name: column.name.toTypeName('%sConfig'),
    type: renderCode(TEMPLATE.FIELDSET_TYPE_CONFIG, { 
      type: column.name.toTypeName('%sInput')
    })
  });
  //export type AddressFieldsetProps = FieldsetProps<AddressInput>
  source.addTypeAlias({
    isExported: true,
    name: column.name.toTypeName('%sFormFieldsetProps'),
    type: renderCode(TEMPLATE.FIELDSET_TYPE_PROPS, { 
      type: column.name.toTypeName('%sInput') 
    })
  });
  //export type AddressControlProps = { ... };
  source.addTypeAlias({
    isExported: true,
    name: `${column.name.titleCase}ControlProps`,
    type: renderCode(TEMPLATE.FIELDSET_TYPE_CONTROL_PROPS, { 
      type: column.name.toTypeName('%sInput')
    })
  });
  //export function useAddressFormFieldset(config: AddressConfig) {}
  source.addFunction({
    isExported: true,
    name: column.name.toComponentName('use%sFormFieldset'),
    parameters: [
      { name: 'config', type: column.name.toTypeName('%sConfig') }
    ],
    statements: TEMPLATE.FIELDSET_HOOK
  });
  //export function AddressFields(props: FieldsProps<AddressInput>) {}
  source.addFunction({
    isExported: true,
    name: `${column.name.titleCase}FormFields`,
    parameters: [
      { name: 'props', type: `FieldsProps<${column.name.titleCase}Input>` }
    ],
    statements: renderCode(TEMPLATE.FIELDSET_FIELDS, {
      hook: column.name.toComponentName('use%sFormFieldset'),
      singular: fieldset.name.singular,
      fields: fieldset.component.formFields.toArray().map(
        column => column.component.formField?.name === 'Fieldset' 
          ? renderCode(TEMPLATE.FIELDSET_FIELDS_FIELDSET_CONTROL, {
            component: column.name.toComponentName('%sFormFieldsetControl'),
            column: column.name.toURLPath()
          })
          : column.component.formField
          ? renderCode(TEMPLATE.FIELDSET_FIELDS_FIELD_CONTROL, {
            component: column.name.toComponentName('%sFormFieldsetControl'),
            column: column.name.toURLPath()
          })
          : ''
      ).filter(Boolean).join('\n')
    })
  });
  //const Fieldset = make<AddressInput>(AddressFields);
  source.addVariableStatement({
    declarationKind: VariableDeclarationKind.Const,
    declarations: [{
      name: 'Fieldset',
      initializer: renderCode(TEMPLATE.FIELDSET_MAKE, { 
        type: column.name.toTypeName('%sInput'),
        component: column.name.toComponentName('%sFormFields')
      })
    }]
  });
  //export function AddressFormFieldset(props: AddressFieldsetProps) {}
  source.addFunction({
    isExported: true,
    name: column.name.toComponentName('%sFormFieldset'),
    parameters: [
      { 
        name: 'props', 
        type: column.name.toTypeName('%sFormFieldsetProps') 
      }
    ],
    statements: renderCode(TEMPLATE.FIELDSET_FIELD, {
      required: column.type.required ? 'true' : 'false',
      singular: fieldset.name.singular,
      limit: column.type.multiple ? '0' : '1',
      defaults: JSON.stringify(
        fieldset.value.staticDefaults
          .map(column => column.value.default)
          .toObject()
      ),
      value: column.type.multiple 
        ? 'props.value || []'
        : column.type.required
        ? 'props.value || [ defaults ]'
        : 'props.value || []',
      props: JSON.stringify(props)
    })
  });
  //export function AddressFormFieldsetControl(props: ControlProps) {
  source.addFunction({
    isExported: true,
    name: `${column.name.titleCase}FormFieldsetControl`,
    parameters: [
      { 
        name: 'props', 
        type: column.name.toTypeName('%sControlProps') 
      }
    ],
    statements: renderCode(TEMPLATE.FIELDSET_CONTROL, {
      label: column.name.label,
      required: column.type.required && !column.type.multiple
        ? ` + '*'`
        : '',
      component: column.name.toComponentName('%sFormFieldset'),
    })
  });
};

export function generateBoolean(
  directory: Directory, 
  fieldset: Fieldset,
  column: Column
) {
  //get the form field attribute
  const attribute = column.component.formField;
  //skip if no form field 
  if (!attribute?.component.defined) return;
  //this is the component definition token...
  const component = attribute.component.definition!;
  //this is the component props from the pre-defined 
  // definitions and the value set in the attribute.
  const props = attribute.component.props;

  //get the path where this should be saved
  const filepath = renderCode('<%fieldset%>/components/form/<%component%>.tsx', {
    fieldset: fieldset.name.toPathName(),
    component: column.name.toComponentName('%sFormField')
  });
  //load Profile/components/form/NameFormField.tsx if it exists, if not create it
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
  //import Text from 'frui/field/Text';
  source.addImportDeclaration({
    //component token will have import
    //info. just use that as is...
    moduleSpecifier: component.import.from,
    defaultImport: component.import.default ? component.name : undefined,
    namedImports: !component.import.default ? [ component.name ] : []
  });
  //export function NameFormField(props: FieldProps) {
  source.addFunction({
    isExported: true,
    name: column.name.toComponentName('%sFormField'),
    parameters: [
      { name: 'props', type: 'FieldProps' }
    ],
    statements: renderCode(TEMPLATE.BOOLEAN_FIELD, {
      column: column.name.toURLPath(),
      multiple: column.type.multiple ? '[]': '',
      props: JSON.stringify(props),
      component: component.name
    })
  });
  //export function NameFormFieldControl(props: ControlProps) {
  source.addFunction({
    isExported: true,
    name: `${column.name.titleCase}FormFieldControl`,
    parameters: [
      { name: 'props', type: 'ControlProps' }
    ],
    statements: renderCode(TEMPLATE.BOOLEAN_CONTROL, {
      column: column.name.toURLPath(),
      multiple: column.type.multiple ? '[]': '',
      default: column.value.default && !column.value.generator 
        ? '=' + JSON.stringify(column.value.default) 
        : '',
      label: column.name.label,
      required: column.type.required && !column.type.multiple
        ? ` + '*'`
        : '',
      component: column.name.toComponentName('%sFormField')
    })
  });
};

export function generateField(
  directory: Directory, 
  fieldset: Fieldset,
  column: Column
) {
  //get the form field attribute
  const attribute = column.component.formField;
  //skip if no form field 
  if (!attribute?.component.defined) return;
  //this is the component definition token...
  const component = attribute.component.definition!;
  //this is the component props from the pre-defined 
  // definitions and the value set in the attribute.
  const props = attribute.component.props;
  
  //get the path where this should be saved
  const filepath = renderCode('<%fieldset%>/components/form/<%component%>.tsx', {
    fieldset: fieldset.name.toPathName(),
    component: column.name.toComponentName('%sFormField')
  });
  //load Profile/components/form/NameFormField.tsx if it exists, if not create it
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
  //import Text from 'frui/field/Text';
  source.addImportDeclaration({
    //component token will have import
    //info. just use that as is...
    moduleSpecifier: component.import.from,
    defaultImport: component.import.default ? component.name : undefined,
    namedImports: !component.import.default ? [ component.name ] : []
  });
  //export function NameFormField(props: FieldProps) {
  source.addFunction({
    isExported: true,
    name: column.name.toComponentName('%sFormField'),
    parameters: [
      { name: 'props', type: 'FieldProps' }
    ],
    statements: renderCode(TEMPLATE.FIELD_FIELD, {
      column: column.name.toURLPath(),
      multiple: column.type.multiple ? '[]': '',
      default: column.value.default && !column.value.generator 
        ? '=' + JSON.stringify(column.value.default) 
        : '',
      props: JSON.stringify(props),
      component: component.name
    })
  });
  //export function NameFormFieldControl(props: ControlProps) {
  source.addFunction({
    isExported: true,
    name: `${column.name.titleCase}FormFieldControl`,
    parameters: [
      { name: 'props', type: 'ControlProps' }
    ],
    statements: renderCode(TEMPLATE.FIELD_CONTROL, {
      label: column.name.label,
      required: column.type.required && !column.type.multiple
        ? ` + '*'`
        : '',
      component: column.name.toComponentName('%sFormField')
    })
  });
};

export const TEMPLATE = {

RELATIVE_FORM_FIELD_PATH:
'../../../<%fieldset%>/components/form/<%component%>.tsx',

RELATION_FIELD:
`//props
const { 
  className, 
  name = '<%column%><%multiple%>', 
  value, 
  change, 
  error = false 
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
const { className, name, value, change, error } = props;
//hooks
const { _ } = useLanguage();
//determine label
const label = _('<%label%>')<%required%>;
//renderCode
return (
  <FieldControl label={label} error={error} className={className}>
    <<%component%>
      error={!!error} 
      name={name}
      value={value} 
      change={change}
    />
  </FieldControl>
);`,

//export type AddressConfig = { ... };
FIELDSET_TYPE_CONFIG:
`{
  type?: string,
  values?: (<%type%>|undefined)[],
  index: number,
  set: (values: (<%type%>|undefined)[]) => void
}`,

//export type AddressFieldsetProps = FieldsetProps<AddressInput>
FIELDSET_TYPE_PROPS:
'FieldsetProps<<%type%>> & { errors?: Record<string, any>[] }',

//export type AddressControlProps = { ... };
FIELDSET_TYPE_CONTROL_PROPS:
`{
  label?: string,
  error?: string,
  value?: <%type%>|<%type%>[],
  errors?: Record<string, any>|Record<string, any>[],
  style?: CSSProperties,
  className?: string
}`,

FIELDSET_HOOK:
`//props
const { values, index, set } = config;
//handlers
const handlers = {
  update: (value: string) => {
    const newValues = [ ...(values || []) ]
    newValues[index] = value;
    set(newValues);
  },
  remove: () => {
    const newValues = [ ...(values || []) ];
    newValues[index] = undefined;
    set(newValues);
  }
};
return { handlers };`,

FIELDSET_FIELDS:
`const { name, config, values, index, set, limit } = props;
const { _ } = useLanguage();
const { errors = [] } = config;
//handlers
const { handlers } = <%hook%>({ values, index, set });
//variables
const prefix = !limit && name 
  ? \`\${name}[\${index}]\` 
  : limit && name 
  ? \`\${name}\` 
  : undefined;
const value = values ? values[index]: undefined;
const error = errors[index] || {};
const classNames = [
  errors[index] && 'field-fieldset-error',
  !limit && 'field-fieldset-multiple',
  (limit || !config.required) && 'field-fieldset-optional'
].filter(Boolean).join(' ');
return (
  <div className={\`field-fieldset \${classNames}\`}>
    {!limit ? (
      <header>
        <h6>
          {_('<%singular%> %s', index + 1)}
        </h6>
        <a onClick={handlers.remove}>
          &times;
        </a>
      </header>
    ) : !config.required ? (
      <header>
        <a onClick={handlers.remove}>
          &times;
        </a>
      </header>
    ) : null}
    <main>
      <%fields%>
    </main>
  </div>
);`,

FIELDSET_FIELDS_FIELDSET_CONTROL:
`<<%component%>
  className="field-fieldset-control"
  name={prefix ? \`\${prefix}[<%column%>]\` : undefined}
  errors={error['<%column%>']}
  value={value['<%column%>']} 
/>`,

FIELDSET_FIELDS_FIELD_CONTROL:
`<<%component%>
  className="field-fieldset-control"
  name={prefix ? \`\${prefix}[<%column%>]\` : undefined}
  error={error['<%column%>']}
  value={value['<%column%>']} 
/>`,

FIELDSET_MAKE:
`make<<%type%>>(<%component%>)`,

FIELDSET_FIELD:
`//config gets passed straight to the fields
const config = { 
  required: '<%required%>',
  errors: props.errors || [] 
};
const add = 'Add <%singular%>';
const limit = <%limit%>; 
const defaults = <%defaults%>;
const value = <%value%>;
const attributes = Object.assign({}, props, <%props%>);
//renderCode
return (
  <Fieldset 
    {...attributes} 
    add={add}
    limit={limit} 
    config={config} 
    defaultValue={value}
    emptyValue={defaults} 
  />
);`,

FIELDSET_CONTROL:
`//hooks
const { _ } = useLanguage();
//props
let { 
  label = _('<%label%>')<%required%>,
  error = _('Invalid <%label%>'),
  className, 
  name, 
  value, 
  errors = [],
  ...attributes
} = props;
//format value
value = Array.isArray(value)
  ? value
  : value && typeof value === 'object'
  ? [ value ]
  : undefined;
//format errors
errors = Array.isArray(errors)
  ? errors
  : errors && typeof errors === 'object'
  ? [ errors ]
  : [];
//determine classnames
const classNames = ['frui-control'];
if (className) {
  classNames.push(className);
}
//renderCode
return (
  <div className={classNames.join(' ')} {...attributes}>
    {!!label && (
      <label className="frui-control-label">{label}</label>
    )}
    <div className="frui-control-field">
      <<%component%> 
        error={errors.length > 0} 
        errors={errors} 
        name={name} 
        value={value} 
      />
    </div>
    {errors.length > 0 && (
      <div className="frui-control-error">{error || ''}</div>
    )}
  </div>
);`,

BOOLEAN_FIELD:
`//props
const { 
  className, 
  name = '<%column%><%multiple%>', 
  value, 
  change, 
  error = false 
} = props;
const attributes = <%props%>;
//renderCode
return (
  <<%component%> 
    {...attributes}
    name={name}
    className={className}
    error={error} 
    defaultValue="1"
    defaultChecked={!!value}
    onUpdate={value => change && change('<%column%><%multiple%>', value)}
  />
);`,

BOOLEAN_CONTROL:
`//props
const { 
  className, 
  name = '<%column%><%multiple%>', 
  value<%default%>, 
  change, 
  error 
} = props;
//hooks
const { _ } = useLanguage();
//determine label
const label = _('<%label%>')<%required%>;
//renderCode
return (
  <FieldControl label={label} error={error} className={className}>
    <input type="hidden" name={name} value="0" />
    <<%component%>
      error={!!error} 
      name={name}
      value={value} 
      change={change}
    />
  </FieldControl>
);`,

FIELD_FIELD:
`//props
const { 
  className, 
  name = '<%column%><%multiple%>', 
  value<%default%>, 
  change, 
  error = false 
} = props;
const attributes = <%props%>;
//renderCode
return (
  <<%component%> 
    {...attributes}
    name={name}
    className={className}
    error={error} 
    defaultValue={value} 
    onUpdate={value => change && change('<%column%><%multiple%>', value)}
  />
);`,

FIELD_CONTROL:
`//props
const { className, name, value, change, error } = props;
//hooks
const { _ } = useLanguage();
//determine label
const label = _('<%label%>')<%required%>;
//renderCode
return (
  <FieldControl label={label} error={error} className={className}>
    <<%component%>
      error={typeof error === 'string'} 
      name={name}
      value={value} 
      change={change}
    />
  </FieldControl>
);`

};