//modules
import type { Directory } from 'ts-morph';
import { VariableDeclarationKind } from 'ts-morph';
//registry
import type Registry from '../../schema/Registry.js';
import type Fieldset from '../../schema/spec/Fieldset.js';
import type Column from '../../schema/spec/Column.js';
import type Model from '../../schema/spec/Model.js';

export default function generate(directory: Directory, registry: Registry) {
  //for each model
  for (const model of registry.model.values()) {
    //generate all column fields
    for (const column of model.columns.values()) {
      const field = column.field;
      if (!field) continue;
      field.component === 'Relation'
        ? generateRelation(directory, model, column)
        : field.component === 'Fieldset'
        ? generateFieldset(directory, model, column)
        : ['Checkbox', 'Switch'].includes(field.component)
        ? generateBoolean(directory, model, column)
        : generateField(directory, model, column);
    }
  }
  //for each fieldset
  for (const fieldset of registry.fieldset.values()) {
    //generate all column fields
    for (const column of fieldset.columns.values()) {
      const field = column.field;
      if (!field) continue;
      field.component === 'Fieldset'
        ? generateFieldset(directory, fieldset, column)
        : [ 'Checkbox', 'Switch' ].includes(field.component)
        ? generateBoolean(directory, fieldset, column)
        : generateField(directory, fieldset, column);
    }
  }
};

export function generateRelation(
  directory: Directory, 
  model: Model,
  column: Column
) {
  const field = column.field;
  //skip if no field component
  if (!field) return;
  //get the path where this should be saved
  const path = `${model.name}/components/form/${column.titleCase}FormField.tsx`;
  const source = directory.createSourceFile(path, '', { overwrite: true });

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
  //export function NameField(props: FieldProps) {
  source.addFunction({
    isExported: true,
    name: `${column.titleCase}Field`,
    parameters: [
      { name: 'props', type: 'FieldProps' }
    ],
    statements: (`
      //props
      const { 
        className, 
        name = '${column.name}${column.multiple ? '[]': ''}', 
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
              '${String(field.props.search || '')}'.replace('{{query}}', query)
            );
            const json = await response.json();
            const options = json.results.map(row => ({
              label: mustache.render('${field.props.template}', row),
              value: row.${field.props.id}
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
  //export function NameFieldControl(props: ControlProps) {
  source.addFunction({
    isExported: true,
    name: `${column.titleCase}FieldControl`,
    parameters: [
      { name: 'props', type: 'ControlProps' }
    ],
    statements: (`
      //props
      const { className, name, value, change, error } = props;
      //hooks
      const { _ } = useLanguage();
      //determine label
      const label = ${column.required && !column.multiple 
        ? `\`\${_('${column.label}')}*\`;` 
        : `_('${column.label}');`
      }
      //render
      return (
        <FieldControl label={label} error={error} className={className}>
          <${column.titleCase}Field
            error={!!error} 
            name={name}
            value={value} 
            change={change}
          />
        </FieldControl>
      );
    `)
  });
};

export function generateFieldset(
  directory: Directory, 
  model: Fieldset,
  column: Column
) {
  //NOTE: column.field is a computed getter, 
  // so dont keep computing it multiple times
  const field = column.field;
  const fieldset = column.fieldset;
  //skip if no field component
  if (!field || !fieldset) return;
  //get the path where this should be saved
  const path = `${model.name}/components/form/${column.titleCase}FormField.tsx`;
  const source = directory.createSourceFile(path, '', { overwrite: true });
  
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
    moduleSpecifier: `../../../${fieldset.name}/types.js`,
    namedImports: [ `${column.titleCase}Input` ]
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
  for (const column of fieldset.fields) {
    //NOTE: column.field is a computed getter, 
    // so dont keep computing it multiple times
    const field = column.field;
    //skip if no field component
    if (!field) continue;
    if (column.field.component === 'Fieldset') {
      //import { ActiveFieldsetControl } from '../../components/form/ActiveField.js';
      source.addImportDeclaration({
        moduleSpecifier: `../../../${fieldset.name}/components/form/${column.titleCase}Field.js`,
        namedImports: [ `${column.titleCase}FieldsetControl` ]
      });
      continue;
    }
    source.addImportDeclaration({
      moduleSpecifier: `../../../${fieldset.name}/components/form/${column.titleCase}Field.js`,
      namedImports: [ `${column.titleCase}FieldControl` ]
    });
  }

  //export type AddressConfig = {};
  source.addTypeAlias({
    isExported: true,
    name: `${column.titleCase}Config`,
    type: `{
      type?: string,
      values?: (${column.titleCase}Input|undefined)[],
      index: number,
      set: (values: (${column.titleCase}Input|undefined)[]) => void
    }`
  });
  //export type AddressFieldsetProps = FieldsetProps<AddressInput>
  source.addTypeAlias({
    isExported: true,
    name: `${column.titleCase}FieldsetProps`,
    type: `FieldsetProps<${column.titleCase}Input> & { errors?: Record<string, any>[] }`
  });
  //export type AddressControlProps = {};
  source.addTypeAlias({
    isExported: true,
    name: `${column.titleCase}ControlProps`,
    type: `{
      label?: string,
      error?: string,
      value?: ${column.titleCase}Input|${column.titleCase}Input[],
      errors?: Record<string, any>|Record<string, any>[],
      style?: CSSProperties,
      className?: string
    }`
  });
  //export function useAddressFieldset(config: AddressConfig) {}
  source.addFunction({
    isExported: true,
    name: `use${column.titleCase}Fieldset`,
    parameters: [
      { name: 'config', type: `${column.titleCase}Config` }
    ],
    statements: (`
      //props
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
      return { handlers };  
    `)
  });
  //export function AddressFields(props: FieldsProps<AddressInput>) {}
  source.addFunction({
    isExported: true,
    name: `${column.titleCase}Fields`,
    parameters: [
      { name: 'props', type: `FieldsProps<${column.titleCase}Input>` }
    ],
    statements: (`
      const { 
        name,
        config,
        values, 
        index,
        set,
        limit
      } = props;
      const { _ } = useLanguage();
      const { errors = [] } = config;
      //handlers
      const { handlers } = use${column.titleCase}Fieldset({ values, index, set });
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
                {_('${fieldset.singular} %s', index + 1)}
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
            ${fieldset.fields.map(column => {
              return column.field?.component === 'Fieldset' 
                ? (`
                  <${column.titleCase}FieldsetControl
                    className="field-fieldset-control"
                    name={prefix ? \`\${prefix}[${column.name}]\` : undefined}
                    errors={error['${column.name}']}
                    value={value['${column.name}']} 
                  />  
                `)
                : column.field
                ? (`
                  <${column.titleCase}FieldControl
                    className="field-fieldset-control"
                    name={prefix ? \`\${prefix}[${column.name}]\` : undefined}
                    error={error['${column.name}']}
                    value={value['${column.name}']} 
                  />  
                `)
                : false
            }).filter(Boolean).join('\n')}
          </main>
        </div>
      );
    `)
  });
  //const Fieldset = make<AddressInput>(AddressFields);
  source.addVariableStatement({
    declarationKind: VariableDeclarationKind.Const,
    declarations: [{
      name: 'Fieldset',
      initializer: `make<${column.titleCase}Input>(${column.titleCase}Fields)`,
    }]
  });
  //export function AddressFieldset(props: AddressFieldsetProps) {}
  source.addFunction({
    isExported: true,
    name: `${column.titleCase}Fieldset`,
    parameters: [
      { name: 'props', type: `${column.titleCase}FieldsetProps` }
    ],
    statements: (`
      //config gets passed straight to the fields
      const config = { 
        required: ${column.required ? 'true' : 'false'},
        errors: props.errors || [] 
      };
      const add = 'Add ${fieldset.singular}';
      const limit = ${column.multiple ? '0' : '1'}; 
      const defaults = ${JSON.stringify(fieldset.defaults)};
      const value = ${column.multiple 
        ? 'props.value || []'
        : column.required
        ? 'props.value || [ defaults ]'
        : 'props.value || []'
      }
      //render
      return (
        <Fieldset 
          {...props} 
          add={add}
          limit={limit} 
          config={config} 
          defaultValue={value}
          emptyValue={defaults} 
        />
      );
    `)
  });
  //export function AddressFieldsetControl(props: ControlProps) {
  source.addFunction({
    isExported: true,
    name: `${column.titleCase}FieldsetControl`,
    parameters: [
      { name: 'props', type: `${column.titleCase}ControlProps` }
    ],
    statements: (`
      //hooks
      const { _ } = useLanguage();
      //props
      let { 
        label = ${column.required && !column.multiple 
          ? `\`\${_('${column.label}')}*\`` 
          : `_('${column.label}')`
        },
        error = 'Invalid ${column.label}',
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
      //render
      return (
        <div className={classNames.join(' ')} {...attributes}>
          {!!label && (
            <label className="frui-control-label">{label}</label>
          )}
          <div className="frui-control-field">
            <${column.titleCase}Fieldset 
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
      );
    `)
  });
};

export function generateBoolean(
  directory: Directory, 
  fieldset: Fieldset,
  column: Column
) {
  //NOTE: column.field is a computed getter, 
  // so dont keep computing it multiple times
  const field = column.field;
  //skip if no field component
  if (!field) return;
  //get the path where this should be saved
  const path = `${fieldset.name}/components/form/${column.titleCase}FormField.tsx`;
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
  //import Text from 'frui/field/Text';
  source.addImportDeclaration({
    moduleSpecifier: field.import.from,
    defaultImport: field.import.default 
      ? field.component 
      : undefined,
    namedImports: !field.import.default 
      ? [ field.component ] 
      : undefined
  });
  //export function NameField(props: FieldProps) {
  source.addFunction({
    isExported: true,
    name: `${column.titleCase}Field`,
    parameters: [
      { name: 'props', type: 'FieldProps' }
    ],
    statements: (`
      //props
      const { 
        className, 
        name = '${column.name}${column.multiple ? '[]': ''}', 
        value, 
        change, 
        error = false 
      } = props;
      const attributes = ${JSON.stringify(field.props)};
      //render
      return (
        <${field.component} 
          {...attributes}
          name={name}
          className={className}
          error={error} 
          defaultValue="1"
          defaultChecked={!!value}
          onUpdate={value => change && change('${column.name}${column.multiple ? '[]': ''}', value)}
        />
      );
    `)
  });
  //export function NameFieldControl(props: ControlProps) {
  source.addFunction({
    isExported: true,
    name: `${column.titleCase}FieldControl`,
    parameters: [
      { name: 'props', type: 'ControlProps' }
    ],
    statements: (`
      //props
      const { 
        className, 
        name = '${column.name}${column.multiple ? '[]': ''}', 
        value${column.default ? ' = ' + JSON.stringify(column.default) : ''}, 
        change, 
        error 
      } = props;
      //hooks
      const { _ } = useLanguage();
      //determine label
      const label = ${column.required && !column.multiple 
        ? `\`\${_('${column.label}')}*\`;` 
        : `_('${column.label}');`
      }
      //render
      return (
        <FieldControl label={label} error={error} className={className}>
          <input type="hidden" name="${column.name}" value="0" />
          <${column.titleCase}Field
            error={!!error} 
            name={name}
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
  fieldset: Fieldset,
  column: Column
) {
  //NOTE: column.field is a computed getter, 
  // so dont keep computing it multiple times
  const field = column.field;
  //skip if no field component
  if (!field) return;
  //get the path where this should be saved
  const path = `${fieldset.name}/components/form/${column.titleCase}FormField.tsx`;
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
  //import Text from 'frui/field/Text';
  source.addImportDeclaration({
    moduleSpecifier: field.import.from,
    defaultImport: field.import.default 
      ? field.component 
      : undefined,
    namedImports: !field.import.default 
      ? [ field.component ] 
      : undefined
  });
  //export function NameFormField(props: FieldProps) {
  source.addFunction({
    isExported: true,
    name: `${column.titleCase}FormField`,
    parameters: [
      { name: 'props', type: 'FieldProps' }
    ],
    statements: (`
      //props
      const { 
        className, 
        name = '${column.name}${column.multiple ? '[]': ''}', 
        value${column.default ? ' = ' + JSON.stringify(column.default) : ''}, 
        change, 
        error = false 
      } = props;
      const attributes = ${JSON.stringify(field.props)};
      //render
      return (
        <${field.component} 
          {...attributes}
          name={name}
          className={className}
          error={error} 
          defaultValue={value} 
          onUpdate={value => change && change('${column.name}${column.multiple ? '[]': ''}', value)}
        />
      );
    `)
  });
  //export function NameFormFieldControl(props: ControlProps) {
  source.addFunction({
    isExported: true,
    name: `${column.titleCase}FormFieldControl`,
    parameters: [
      { name: 'props', type: 'ControlProps' }
    ],
    statements: (`
      //props
      const { className, name, value, change, error } = props;
      //hooks
      const { _ } = useLanguage();
      //determine label
      const label = ${column.required && !column.multiple 
        ? `\`\${_('${column.label}')}*\`;` 
        : `_('${column.label}');`
      }
      //render
      return (
        <FieldControl label={label} error={error} className={className}>
          <${column.titleCase}FormField
            error={typeof error === 'string'} 
            name={name}
            value={value} 
            change={change}
          />
        </FieldControl>
      );
    `)
  });
};