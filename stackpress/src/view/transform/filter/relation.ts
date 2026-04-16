//modules
import type { Directory } from 'ts-morph';
//stackpress
import Exception from '../../../Exception.js';
//stackpress/schema
import type Column from '../../../schema/Column.js';
import type Model from '../../../schema/Model.js';
import { 
  loadProjectFile, 
  renderCode 
} from '../../../schema/transform/helpers.js';

export default function generate(
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
  
  //------------------------------------------------------------------//
  // Profile/components/filter/NameFilterField.tsx

  //get the path where this should be saved
  const filepath = renderCode('<%model%>/components/filter/<%component%>.tsx', {
    model: model.name.toPathName(),
    component: column.name.toComponentName('%sFilterField')
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
  //import Select from 'frui/form/Select';
  source.addImportDeclaration({
    moduleSpecifier: 'frui/form/Select',
    defaultImport: 'Select'
  });
  //import FieldControl from 'frui/form/FieldControl';
  source.addImportDeclaration({
    moduleSpecifier: 'frui/form/FieldControl',
    defaultImport: 'FieldControl'
  });
  //import mustache from 'mustache';
  source.addImportDeclaration({
    moduleSpecifier: 'mustache',
    defaultImport: 'mustache'
  });

  //------------------------------------------------------------------//
  // Import Stackpress

  //import type { FieldProps, ControlProps } from 'stackpress/view/client';
  source.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: 'stackpress/view/client',
    namedImports: [ 'FieldProps', 'ControlProps' ]
  });

  //------------------------------------------------------------------//
  // Import Client
  //------------------------------------------------------------------//
  // Exports

  //export type NameFilterFieldProps = FieldProps;
  source.addTypeAlias({
    isExported: true,
    name: column.name.toComponentName('%sFilterFieldProps'),
    type: 'FieldProps'
  });

  //export type NameFilterFieldControlProps = ControlProps;
  source.addTypeAlias({
    isExported: true,
    name: column.name.toComponentName('%sFilterFieldControlProps'),
    type: 'ControlProps'
  });
  
  //export function NameFilterField(props: FieldProps) {
  source.addFunction({
    isExported: true,
    name: column.name.toComponentName('%sFilterField'),
    parameters: [{ 
      name: 'props', 
      type: column.name.toComponentName('%sFilterFieldProps') 
    }],
    statements: renderCode(TEMPLATE.FIELD, {
      url: String(props.search || ''),
      template: props.template,
      id: props.id,
      column: column.name.toString(),
      multiple: column.type.multiple ? '[]': ''
    })
  });
  //export function NameFilterFieldControl(props: ControlProps) {
  source.addFunction({
    isExported: true,
    name: column.name.toComponentName('%sFilterFieldControl'),
    parameters: [{ 
      name: 'props', 
      type: column.name.toComponentName('%sFilterFieldControlProps') 
    }],
    statements: renderCode(TEMPLATE.CONTROL, {
      label: column.name.label,
      hidden: isBoolComponent 
        ? renderCode(TEMPLATE.BOOLEAN_HIDDEN_FIELD, {
          column: column.name.toString(),
          multiple: column.type.multiple ? '[]': ''
        }) 
        : '',
      component: column.name.toComponentName('%sFilterField'),
    })
  });
};

//------------------------------------------------------------------//
// Templates

export const TEMPLATE = {

FIELD:
`//props
const { 
  name = 'eq[<%column%>]<%multiple%>',
  value,  
  error = false,
  onUpdate,
  className
} = props;
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
            label: mustache.render('<%template%>', row),
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

BOOLEAN_HIDDEN_FIELD:
'<input type="hidden" name="eq[<%column%>]<%multiple%>" value="0" />'

};