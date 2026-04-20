//modules
import type { Directory } from 'ts-morph';
import { VariableDeclarationKind } from 'ts-morph';
//stackpress-schema
import type Fieldset from 'stackpress-schema/Fieldset';
import type Column from 'stackpress-schema/Column';
import { 
  loadProjectFile, 
  renderCode 
} from 'stackpress-schema/transform/helpers';
//stackpress-view
import Exception from '../../../Exception.js';

export default function generate(
  directory: Directory, 
  fieldset: Fieldset,
  column: Column
) {
  //get the form field attribute
  const attribute = column.component.formField;
  //skip if no form field 
  if (!attribute?.component.defined) return;
  if (!column.type.fieldset) {
    throw Exception.for(
      '@fieldset.field used in %s.%s is not a fieldset type',
      fieldset.name.toString(),
      column.name.toString()
    );
  }
  //extract the fieldset definition from the column type
  const columnFieldset = column.type.fieldset;
  //this is the component props from the pre-defined 
  // definitions and the value set in the attribute.
  const props = attribute.component.props;
  
  //------------------------------------------------------------------//
  // Profile/components/form/NameFormField.tsx
  
  //get the path where this should be saved
  const filepath = renderCode('<%fieldset%>/components/form/<%component%>.tsx', {
    fieldset: fieldset.name.toPathName(),
    component: column.name.toComponentName('%sFormField')
  });
  //load file if it exists, if not create it
  const source = loadProjectFile(directory, filepath);

  //------------------------------------------------------------------//
  // Import Modules
  
  //import type { CSSProperties } from 'react';
  source.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: 'react',
    namedImports: [ 'CSSProperties' ]
  });
  //import type { FieldsProps, FieldsetProps } from 'frui/form/Fieldset';
  source.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: 'frui/form/Fieldset',
    namedImports: [ 'FieldsProps', 'FieldsetProps' ]
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

  //------------------------------------------------------------------//
  // Import Stackpress
  //------------------------------------------------------------------//
  // Import Client

  //import type { AddressInput } from '../../../Address/types.js';
  source.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: columnFieldset.name.toPathName('../../../%s/types.js'),
    namedImports: [ columnFieldset.name.toTypeName('%sInput') ]
  });
  //import LabelFormFieldControl from '../../../Address/components/form/LabelFormField.js';
  for (const field of columnFieldset.component.formFields.values()) {
    source.addImportDeclaration({
      moduleSpecifier: renderCode(
        '../../../<%fieldset%>/components/form/<%component%>.js', 
        {
          fieldset: columnFieldset.name.toPathName(),
          component: field.name.toComponentName('%sFormField')
        }
      ),
      namedImports: [ field.name.toComponentName('%sFormFieldControl') ]
    });
  }

  //------------------------------------------------------------------//
  // Exports

  //export type AddressConfig = { ... };
  source.addTypeAlias({
    isExported: true,
    name: `${column.name.titleCase}Config`,
    type: renderCode(TEMPLATE.TYPE_CONFIG, { 
      type: columnFieldset.name.toTypeName('%sInput')
    })
  });
  //export type AddressFieldsetProps = FieldsetProps<AddressInput>
  source.addTypeAlias({
    isExported: true,
    name: `${column.name.titleCase}FormFieldsetProps`,
    type: renderCode(TEMPLATE.TYPE_FIELDSET_PROPS, { 
      type: columnFieldset.name.toTypeName('%sInput') 
    })
  });
  //export type AddressControlProps = { ... };
  source.addTypeAlias({
    isExported: true,
    name: `${column.name.titleCase}ControlProps`,
    type: renderCode(TEMPLATE.TYPE_CONTROL_PROPS, { 
      type: columnFieldset.name.toTypeName('%sInput')
    })
  });
  //export function useAddressFormFieldset(config: AddressConfig) {}
  source.addFunction({
    isExported: true,
    name: column.name.toComponentName('use%sFormFieldset'),
    parameters: [{ 
      name: 'config', 
      type: `${column.name.titleCase}Config` 
    }],
    statements: renderCode(TEMPLATE.HOOK, {
      type: columnFieldset.name.toTypeName('%sInput')
    })
  });
  //export function AddressFormFields(props: FieldsProps<AddressInput>) {}
  source.addFunction({
    isExported: true,
    name: `${column.name.titleCase}FormFields`,
    parameters: [{ 
      name: 'props', 
      type: columnFieldset.name.toTypeName('FieldsProps<%sInput>') 
    }],
    statements: renderCode(TEMPLATE.FIELDS, {
      hook: column.name.toComponentName('use%sFormFieldset'),
      singular: columnFieldset.name.singular,
      fields: columnFieldset.component.formFields.toArray().map(
        column => column.component.formField?.name === 'Fieldset' 
          ? renderCode(TEMPLATE.FIELDS_CONTROL, {
            component: column.name.toComponentName('%sFormFieldControl'),
            column: column.name.toURLPath()
          })
          : column.component.formField
          ? renderCode(TEMPLATE.FIELDS_FIELD_CONTROL, {
            component: column.name.toComponentName('%sFormFieldControl'),
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
      initializer: renderCode(TEMPLATE.MAKE, { 
        type: columnFieldset.name.toTypeName('%sInput'),
        component: `${column.name.titleCase}FormFields`
      })
    }]
  });
  //export function AddressFormFieldset(props: AddressFieldsetProps) {}
  source.addFunction({
    isExported: true,
    name: column.name.toComponentName('%sFormFieldset'),
    parameters: [{ 
      name: 'props', 
      type: `${column.name.titleCase}FormFieldsetProps` 
    }],
    statements: renderCode(TEMPLATE.FIELD, {
      input: columnFieldset.name.toTypeName('%sInput'),
      required: column.type.required ? 'true' : 'false',
      singular: columnFieldset.name.singular,
      defaults: JSON.stringify(
        columnFieldset.value.staticDefaults
          .map(column => column.value.default)
          .toObject()
      ),
      props: JSON.stringify(props)
    })
  });
  //export function AddressFormFieldsetControl(props: AddressControlProps) {
  source.addFunction({
    isExported: true,
    name: `${column.name.titleCase}FormFieldsetControl`,
    parameters: [{ 
      name: 'props', 
      type: `${column.name.titleCase}ControlProps`
    }],
    statements: renderCode(TEMPLATE.CONTROL, {
      label: column.name.label,
      component: column.name.toComponentName('%sFormFieldset'),
    })
  });
};

//------------------------------------------------------------------//
// Templates

export const TEMPLATE = {

//export type AddressConfig = { ... };
TYPE_CONFIG:
`{
  type?: string,
  values?: (<%type%>|undefined)[],
  index: number,
  set: (values: (<%type%>|undefined)[]) => void
}`,

//export type AddressFieldsetProps = FieldsetProps<AddressInput>
TYPE_FIELDSET_PROPS:
'FieldsetProps<<%type%>> & { errors?: Record<string, any>[] }',

//export type AddressControlProps = { ... };
TYPE_CONTROL_PROPS:
`{
  name?: string,
  label?: string,
  required?: boolean,
  error?: string,
  value?: <%type%>|<%type%>[],
  errors?: Record<string, any>|Record<string, any>[],
  style?: CSSProperties,
  className?: string
}`,

HOOK:
`//props
const { values, index, set } = config;
//handlers
const handlers = {
  update: (value: <%type%>) => {
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

FIELDS:
`const { name, config = {}, values, index, set, limit } = props;
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
  errors[index] && 'form-fieldset-error',
  'form-fieldset-multiple',
  (limit || !config.required) && 'form-fieldset-optional'
].filter(Boolean).join(' ');
return (
  <div className={\`form-fieldset \${classNames}\`}>
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

FIELDS_CONTROL:
`<<%component%>
  className="form-fieldset-control"
  name={prefix ? \`\${prefix}[<%column%>]\` : undefined}
  errors={error['<%column%>']}
  value={value['<%column%>']} 
/>`,

FIELDS_FIELD_CONTROL:
`<<%component%>
  className="form-fieldset-control"
  name={prefix ? \`\${prefix}[<%column%>]\` : undefined}
  error={error.<%column%>}
  value={value?.<%column%>} 
/>`,

MAKE:
`make<<%type%>>(<%component%>)`,

FIELD:
`//config gets passed straight to the fields
const config = { 
  required: '<%required%>',
  errors: props.errors || [] 
};
const add = 'Add <%singular%>'.trim();
const defaults = <%defaults%> as <%input%>;
const value = props.value || [];
const attributes = Object.assign({}, props, <%props%>);
//renderCode
return (
  <Fieldset 
    {...attributes} 
    add={add}
    config={config} 
    defaultValue={value}
    emptyValue={defaults} 
  />
);`,

CONTROL:
`//hooks
const { _ } = useLanguage();
//props
let { 
  label = _('<%label%>'),
  error = _('Invalid <%label%>'),
  className, 
  name, 
  value, 
  errors = [],
  required,
  ...attributes
} = props;
//format label
required && (label += '*');
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
const classNames = [ 
  'frui-control', 
  'fieldset-control', 
  'fieldset-multiple' 
];
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
        errors={errors as Record<string, any>[]} 
        name={name} 
        value={value} 
      />
    </div>
    {errors.length > 0 && (
      <div className="frui-control-error">{error || ''}</div>
    )}
  </div>
);`

};