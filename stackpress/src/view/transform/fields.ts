//modules
import type { Directory } from 'ts-morph';
import { VariableDeclarationKind } from 'ts-morph';
//registry
import type Registry from '../../schema/Registry';
import type Fieldset from '../../schema/spec/Fieldset';
import type Column from '../../schema/spec/Column';
import type Model from '../../schema/spec/Model';

export default function generate(directory: Directory, registry: Registry) {
  //for each model
  for (const model of registry.model.values()) {
    //generate all column fields
    model.columns.forEach(
      column => column.field.method === 'relation' 
        ? generateRelation(directory, model, column)
        : column.field.method === 'fieldset' 
        ? generateFieldset(directory, model, column)
        : column.field.component 
          && [ 'Checkbox', 'Switch' ].indexOf(column.field.component) !== -1
        ? generateBoolean(directory, model, column)
        : generateField(directory, model, column)
    );
  }
  //for each fieldset
  for (const fieldset of registry.fieldset.values()) {
    //generate all column fields
    fieldset.columns.forEach(
      column => column.field.method === 'fieldset' 
        ? generateFieldset(directory, fieldset, column)
        : column.field.component 
          && [ 'Checkbox', 'Switch' ].indexOf(column.field.component) !== -1
        ? generateBoolean(directory, fieldset, column)
        : generateField(directory, fieldset, column)
    );
  }
}

export function generateRelation(
  directory: Directory, 
  model: Model,
  column: Column
) {
  //skip if no format component
  if (typeof column.field.component !== 'string') return;
  //get the path where this should be saved
  const path = `${model.name}/components/fields/${column.title}Field.tsx`;
  const source = directory.createSourceFile(path, '', { overwrite: true });

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
  //import { useLanguage } from 'r22n';
  source.addImportDeclaration({
    moduleSpecifier: 'r22n',
    namedImports: [ 'useLanguage' ]
  });
  //import Control from 'frui/form/Control';
  source.addImportDeclaration({
    moduleSpecifier: 'frui/form/Control',
    defaultImport: 'Control'
  });
  //import Text from 'frui/field/Text';
  source.addImportDeclaration({
    moduleSpecifier: `frui/field/${column.field.component}`,
    defaultImport: column.field.component
  });
  //export function NameField(props: FieldProps) {
  source.addFunction({
    isExported: true,
    name: `${column.title}Field`,
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
      //render
      return (
        <${column.field.component} 
          name={name}
          className={className}
          error={error} 
          defaultValue={value} 
          searchable={true}
          onQuery={async (query, update) => {
            const response = await fetch(\`${
              (column.field.attributes.search as string)?.includes('?')
                ? column.field.attributes.search + '&q=${query}'
                : column.field.attributes.search + '?q=${query}'
            }\`);
            const json = await response.json();
            const options = json.results.map(row => ({
              label: mustache.render('${column.field.attributes.template}', row),
              value: row.${column.field.attributes.id}
            }));
            update(options);
          }}
        />
      );
    `)
  });
  //export function NameFieldControl(props: ControlProps) {
  source.addFunction({
    isExported: true,
    name: `${column.title}FieldControl`,
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
        <Control label={label} error={error} className={className}>
          <${column.title}Field
            error={!!error} 
            name={name}
            value={value} 
            change={change}
          />
        </Control>
      );
    `)
  });
}

export function generateFieldset(
  directory: Directory, 
  model: Fieldset,
  column: Column
) {
  //skip if no format component
  if (!column.fieldset) return;
  //get the path where this should be saved
  const path = `${model.name}/components/fields/${column.title}Field.tsx`;
  const source = directory.createSourceFile(path, '', { overwrite: true });
  const fieldset = column.fieldset;

  //import type { FieldsProps, FieldsetProps } from 'frui/element/Fieldset';
  source.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: 'frui/element/Fieldset',
    namedImports: [ 'FieldsProps', 'FieldsetProps' ]
  });
  //import type { ControlProps } from 'stackpress/view/client';
  source.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: 'stackpress/view/client',
    namedImports: [ 'ControlProps' ]
  });
  //import type { AddressInput } from '../../../Address/types';
  source.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: `../../../${fieldset.name}/types`,
    namedImports: [ `${column.title}Input` ]
  });
  //import { useLanguage } from 'r22n';
  source.addImportDeclaration({
    moduleSpecifier: 'r22n',
    namedImports: [ 'useLanguage' ]
  });
  //import Control from 'frui/form/Control';
  source.addImportDeclaration({
    moduleSpecifier: 'frui/form/Control',
    defaultImport: 'Control'
  });
  //import make from 'frui/form/Fieldset';
  source.addImportDeclaration({
    moduleSpecifier: 'frui/form/Fieldset',
    defaultImport: 'make'
  });
  //import LabelFieldControl from '../../../Address/components/fields/LabelField';
  fieldset.fields.forEach(column => {
    //skip if no component
    if (typeof column.field.component !== 'string') return;
    if (column.field.method === 'fieldset') {
      //import { ActiveFieldsetControl } from '../../components/fields/ActiveField';
      source.addImportDeclaration({
        moduleSpecifier: `../../../${fieldset.name}/components/fields/${column.title}Field`,
        namedImports: [ `${column.title}FieldsetControl` ]
      });
      return;
    }
    source.addImportDeclaration({
      moduleSpecifier: `../../../${fieldset.name}/components/fields/${column.title}Field`,
      namedImports: [ `${column.title}FieldControl` ]
    });
  });

  //export type AddressConfig = {};
  source.addTypeAlias({
    isExported: true,
    name: `${column.title}Config`,
    type: `{
      type?: string,
      values?: (${column.title}Input|undefined)[],
      index: number,
      set: (values: (${column.title}Input|undefined)[]) => void
    }`
  });
  //export type AddressFieldsetProps = FieldsetProps<AddressInput>
  source.addTypeAlias({
    isExported: true,
    name: `${column.title}FieldsetProps`,
    type: `FieldsetProps<${column.title}Input>`
  });
  //export function useAddressFieldset(config: AddressConfig) {}
  source.addFunction({
    isExported: true,
    name: `use${column.title}Fieldset`,
    parameters: [
      { name: 'config', type: `${column.title}Config` }
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
    name: `${column.title}Fields`,
    parameters: [
      { name: 'props', type: `FieldsProps<${column.title}Input>` }
    ],
    statements: (`
      const { 
        name,
        config,
        values, 
        index, 
        error,
        set,
        limit
      } = props;
      const { _ } = useLanguage();
      //handlers
      const { handlers } = use${column.title}Fieldset({ values, index, set });
      //variables
      const prefix = !limit && name 
        ? \`\${name}[\${index}]\` 
        : limit && name 
        ? \`\${name}\` 
        : undefined;
      const value = values ? values[index]: undefined;
      const border = error ? 'theme-bc-error' : 'theme-bc-bd2';
      return (
        <div className={\`\${border} border relative px-my-10\`}>
          {!limit ? (
            <header className="theme-bg-bg1 flex items-center px-p-10">
              <h6 className="flex-grow">
                {_('${fieldset.singular} %s', index + 1)}
              </h6>
              <a 
                onClick={handlers.remove}
                className="theme-error px-fs-20 cursor-pointer"
              >
                &times;
              </a>
            </header>
          ) : !config.required ? (
            <header className="absolute px-r-10 px-t-5">
              <a 
                onClick={handlers.remove}
                className="theme-error px-fs-20 cursor-pointer"
              >
                &times;
              </a>
            </header>
          ) : null}
          <main className="px-p-10">
            ${fieldset.fields.map(column => {
              return column.field.method === 'fieldset' 
                ? (`
                  <${column.title}FieldsetControl
                    className="px-py-10"
                    name={prefix ? \`\${prefix}[${column.name}]\` : undefined}
                    value={value.${column.name}} 
                  />  
                `)
                : column.field.component 
                ? (`
                  <${column.title}FieldControl
                    className="px-py-10"
                    name={prefix ? \`\${prefix}[${column.name}]\` : undefined}
                    value={value.${column.name}} 
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
      initializer: `make<${column.title}Input>(${column.title}Fields)`,
    }]
  });
  //export function AddressFieldset(props: AddressFieldsetProps) {}
  source.addFunction({
    isExported: true,
    name: `${column.title}Fieldset`,
    parameters: [
      { name: 'props', type: `${column.title}FieldsetProps` }
    ],
    statements: (`
      //config gets passed straight to the fields
      const config = { required: ${column.required ? 'true' : 'false'} };
      const add = 'Add ${fieldset.singular}';
      const limit = ${column.multiple ? '0' : '1'}; 
      const defaults = ${JSON.stringify(fieldset.defaults)};
      const value = ${column.multiple 
        ? 'props.value || []'
        : column.required
        ? 'props.value || [defaults]'
        : 'props.value || []'
      }
      //render
      return (
        <Fieldset 
          {...props} 
          add={add}
          limit={limit} 
          config={config} 
          value={value}
          emptyValue={defaults} 
        />
      );
    `)
  });
  //export function AddressFieldsetControl(props: ControlProps) {
  source.addFunction({
    isExported: true,
    name: `${column.title}FieldsetControl`,
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
        <Control label={label} error={error} className={className}>
          <${column.title}Fieldset error={!!error} name={name} value={value} />
        </Control>
      );
    `)
  });
}

export function generateBoolean(
  directory: Directory, 
  fieldset: Fieldset,
  column: Column
) {
  //skip if no format component
  if (typeof column.field.component !== 'string') return;
  //get the path where this should be saved
  const path = `${fieldset.name}/components/fields/${column.title}Field.tsx`;
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
  //import Control from 'frui/form/Control';
  source.addImportDeclaration({
    moduleSpecifier: 'frui/form/Control',
    defaultImport: 'Control'
  });
  //import Text from 'frui/field/Text';
  source.addImportDeclaration({
    moduleSpecifier: `frui/field/${column.field.component}`,
    defaultImport: column.field.component
  });
  //export function NameField(props: FieldProps) {
  source.addFunction({
    isExported: true,
    name: `${column.title}Field`,
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
      const attributes = ${JSON.stringify(column.field.attributes)};
      //render
      return (
        <${column.field.component} 
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
    name: `${column.title}FieldControl`,
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
        <Control label={label} error={error} className={className}>
          <input type="hidden" name="${column.name}" value="0" />
          <${column.title}Field
            error={!!error} 
            name={name}
            value={value} 
            change={change}
          />
        </Control>
      );
    `)
  });
}

export function generateField(
  directory: Directory, 
  fieldset: Fieldset,
  column: Column
) {
  //skip if no format component
  if (typeof column.field.component !== 'string') return;
  //get the path where this should be saved
  const path = `${fieldset.name}/components/fields/${column.title}Field.tsx`;
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
  //import Control from 'frui/form/Control';
  source.addImportDeclaration({
    moduleSpecifier: 'frui/form/Control',
    defaultImport: 'Control'
  });
  //import Text from 'frui/field/Text';
  source.addImportDeclaration({
    moduleSpecifier: `frui/field/${column.field.component}`,
    defaultImport: column.field.component
  });
  //export function NameField(props: FieldProps) {
  source.addFunction({
    isExported: true,
    name: `${column.title}Field`,
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
      const attributes = ${JSON.stringify(column.field.attributes)};
      //render
      return (
        <${column.field.component} 
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
  //export function NameFieldControl(props: ControlProps) {
  source.addFunction({
    isExported: true,
    name: `${column.title}FieldControl`,
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
        <Control label={label} error={error} className={className}>
          <${column.title}Field
            error={!!error} 
            name={name}
            value={value} 
            change={change}
          />
        </Control>
      );
    `)
  });
}