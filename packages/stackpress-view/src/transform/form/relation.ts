//modules
import type { Directory } from 'ts-morph';
//stackpress-schema
import type Column from 'stackpress-schema/Column';
import type Model from 'stackpress-schema/Model';
import { 
  loadProjectFile, 
  renderCode 
} from 'stackpress-schema/transform/helpers';
//stackpress-view
import Exception from '../../Exception.js';

export default function generate(
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
  
  //------------------------------------------------------------------//
  // Profile/components/form/NameFormField.tsx
  
  //get the path where this should be saved
  const filepath = renderCode('<%fieldset%>/components/form/<%component%>.tsx', {
    fieldset: model.name.toPathName(),
    component: column.name.toComponentName('%sFormField')
  });
  //load file if it exists, if not create it
  const source = loadProjectFile(directory, filepath);

  //------------------------------------------------------------------//
  // Import Modules

  //import type { KeyboardEvent, MouseEvent } from 'react';
  source.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: 'react',
    namedImports: [ 'KeyboardEvent', 'MouseEvent' ]
  });
  //import { useState, useEffect } from 'react';
  source.addImportDeclaration({
    moduleSpecifier: 'react',
    namedImports: [ 'useState', 'useEffect' ]
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
  //import Select from 'frui/form/Select';
  source.addImportDeclaration({
    moduleSpecifier: 'frui/form/Select',
    defaultImport: 'Select'
  });
  //import * as template from '@stackpress/lib/Template';
  source.addImportDeclaration({
    moduleSpecifier: '@stackpress/lib/Template',
    namespaceImport: 'template'
  });
  
  //------------------------------------------------------------------//
  // Import Stackpress

  //import type { FieldProps, ControlProps } from 'stackpress-view/client';
  source.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: 'stackpress-view/client',
    namedImports: [ 'FieldProps', 'ControlProps' ]
  });

  //------------------------------------------------------------------//
  // Import Client
  //------------------------------------------------------------------//
  // Exports

  //export type NameFormFieldProps = FieldProps;
  source.addTypeAlias({
    isExported: true,
    name: column.name.toComponentName('%sFormFieldProps'),
    type: 'FieldProps'
  });

  //export type NameFormFieldControlProps = ControlProps;
  source.addTypeAlias({
    isExported: true,
    name: column.name.toComponentName('%sFormFieldControlProps'),
    type: 'ControlProps'
  });

  //export function NameFormField(props: FieldProps) {
  source.addFunction({
    isExported: true,
    name: column.name.toComponentName('%sFormField'),
    parameters: [{ 
      name: 'props', 
      type: column.name.toComponentName('%sFormFieldProps') 
    }],
    statements: renderCode(TEMPLATE.FIELD, {
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
    parameters: [{ 
      name: 'props', 
      type: column.name.toComponentName('%sFormFieldControlProps') 
    }],
    statements: renderCode(TEMPLATE.CONTROL, {
      label: column.name.label,
      component: column.name.toComponentName('%sFormField')
    })
  });
};

//------------------------------------------------------------------//
// Templates

export const TEMPLATE = {

FIELD:
`//props
const { 
  className, 
  name = '<%column%><%multiple%>', 
  value, 
  onUpdate, 
  error = false 
} = props;
//hooks
const [ 
  options, 
  updateOptions 
] = useState<{ label: string , value: any }[]>([]);
const [ loading, isLoading  ] = useState(false);
//handlers
const handlers = {
  fetch(query = '') {
    if (loading) return;
    isLoading(true);
    fetch('<%url%>'.replace('{{query}}', query))
      .then(response => response.json())
      .then(response => {
        updateOptions(response.results.map(
          (row: Record<string, unknown>) => ({
            label: template.render('<%template%>', row),
            value: row.<%id%>
          })
        ));
        isLoading(false);
      });
  },
  keyDown(e: KeyboardEvent<HTMLInputElement>) {
    //stop propagation of key events to prevent interference with form shortcuts
    e.stopPropagation();
    if (e.key === 'Enter') {
      e.preventDefault();
      setTimeout(() => {
        const input = e.target as HTMLInputElement;
        //check if this was the input being typed in and 
        // if so, fetch options based on the current value
        if (input.tagName === 'INPUT') {
          const query = String(input.value || '').toLowerCase();
          handlers.fetch(query);
        }
      });
      return false;
    }
  },
  mouseClick(e: MouseEvent<HTMLButtonElement>) {
    //stop propagation of mouse events to prevent interference with form shortcuts
    e.preventDefault();
    e.stopPropagation();
    //get the input element and fetch options based on its value
    const input = e.currentTarget.previousElementSibling as HTMLInputElement;
    if (input) {
      const query = String(input.value || '').toLowerCase();
      handlers.fetch(query);
    }
    return false;
  }
};
//effects
useEffect(() => {
  handlers.fetch();
}, []);
//render
return (
  <Select 
    name={name}
    className={className}
    option={({ selected, target }) => selected && target === 'control'
      ? ''
      : 'frui-pt-md frui-pr-lg frui-pb-md frui-pl-lg'
    } 
    error={error} 
    defaultValue={value}
    onUpdate={value => onUpdate && onUpdate('<%column%><%multiple%>', value)}
    append="#dropdown-root"
  >
    <Select.Head className="frui-pt-md frui-pr-md frui-pl-md">
      <div className="frui-flex frui-fa-center frui-form-input">
        <input 
          className="frui-fa-grow"
          type="text" 
          placeholder="Search..."
          onKeyDown={handlers.keyDown}
          style={{ outline: 'none' }}
        />
        <button 
          type="button" 
          className="frui-pt-md frui-pr-md frui-pb-md frui-pl-md" 
          onClick={handlers.mouseClick}
        >
          <i className="fas fa-search"></i>
        </button>
      </div>
    </Select.Head>
    {options.length > 0 ? options.map(option => (
      <Select.Option value={option.value} key={option.value}>
        {option.label}
      </Select.Option>
    )) : (
      <Select.Option className="frui-none" value="">
        No Results Found
      </Select.Option> 
    )}
  </Select>
);`,

CONTROL:
`//props
const { className, name, value, onUpdate, error, required } = props;
//hooks
const { _ } = useLanguage();
//variables
const label = _('<%label%>') + (required ? '*' : '');
//renderCode
return (
  <FieldControl label={label} error={error} className={className}>
    <<%component%>
      error={!!error} 
      name={name}
      value={value} 
      onUpdate={onUpdate}
    />
  </FieldControl>
);`

};