//modules
import type { Directory } from 'ts-morph';
import { VariableDeclarationKind } from 'ts-morph';
//stackpress/schema
import type Model from '../../../schema/Model.js';
import { 
  loadProjectFile, 
  renderCode 
} from '../../../schema/transform/helpers.js';

export default function createView(directory: Directory, model: Model) {
  const filepath = model.name.toPathName('%s/admin/views/create.tsx');
  //load Profile/admin/views/create.tsx if it exists, if not create it
  const source = loadProjectFile(directory, filepath);

  //import type { NestedObject, ServerPageProps } from 'stackpress/view/client';
  source.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: 'stackpress/view/client',
    namedImports: [ 'NestedObject', 'ServerPageProps' ]
  });
  //import type { AdminConfigProps } from 'stackpress/admin/types';
  source.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: 'stackpress/admin/types',
    namedImports: [ 'AdminConfigProps' ]
  });
  //import type { ProfileInput, Profile } from '../../types.js';
  source.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: '../../types.js',
    namedImports: [ 
      model.name.toTypeName('%sInput'), 
      model.name.toTypeName()
    ]
  });
  //import { useLanguage } from 'r22n';
  source.addImportDeclaration({
    moduleSpecifier: 'r22n',
    namedImports: [ 'useLanguage' ]
  });
  //import Button from 'frui/Button';
  source.addImportDeclaration({
    moduleSpecifier: 'frui/Button',
    defaultImport: 'Button'
  });
  //import Bread from 'frui/Bread';
  source.addImportDeclaration({
    moduleSpecifier: 'frui/Bread',
    defaultImport: 'Bread'
  });
  //import { useServer, LayoutAdmin } from 'stackpress/view/client';
  source.addImportDeclaration({
    moduleSpecifier: 'stackpress/view/client',
    namedImports: [ 'useServer', 'LayoutAdmin' ]
  });
  //import { ActiveFieldControl } from '../../components/form/ActiveField.js';
  model.component.formFields.forEach(column => {
    const field = column.component.formField!;
    const component = field.component.definition!;
    //import { ActiveFieldsetControl } from '../../components/form/ActiveField.js';
    source.addImportDeclaration({
      moduleSpecifier: column.name.toPathName(
        '../../components/form/%sFormField.js'
      ),
      namedImports: [ 
        component.name === 'Fieldset'
          ? column.name.toComponentName('%sFormFieldsetControl') 
          : column.name.toComponentName('%sFormFieldControl') 
      ]
    });
  });
  
  //export function AdminProfileCreateCrumbs() {}
  source.addFunction({
    isExported: true,
    name: model.name.toComponentName('Admin%sCreateCrumbs'),
    statements: renderCode(TEMPLATE.CREATE_CRUMBS, { 
      search: {
        label: model.name.plural || model.name.titleCase,
        icon: model.name.icon
      }
    })
  });
  //export function AdminProfileCreateForm() {}
  source.addFunction({
    isExported: true,
    name: model.name.toComponentName('Admin%sCreateForm'),
    parameters: [{ 
      name: 'props', 
      type: renderCode(TEMPLATE.CREATE_FORM_PROPS, { 
        type: model.name.toTypeName('%sInput') 
      }) 
    }],
    statements: renderCode(TEMPLATE.CREATE_FORM_BODY,{
      fields: model.component.formFields.toArray().map(column => {
        const attribute = column.component.formField!;
        const component = attribute.component.definition!;
        if (component.name === 'Fieldset') {
          return renderCode(TEMPLATE.CREATE_FORM_FIELDSET, {
            component: column.name.toComponentName('%sFormFieldsetControl'),
            column: column.name.toString()
          });
        }
        return renderCode(TEMPLATE.CREATE_FORM_FIELD, {
          component: column.name.toComponentName('%sFormFieldControl'),
          column: column.name.toString(),
          multiple: column.type.multiple ? '[]' : ''
        });
      }).join('\n')
    })
  });
  //export function AdminProfileCreateBody() {}
  source.addFunction({
    isExported: true,
    name: model.name.toComponentName('Admin%sCreateBody'),
    statements: renderCode(TEMPLATE.CREATE_BODY, {
      input: model.name.toTypeName('%sInput'),
      type: model.name.toTypeName(),
      crumbs: model.name.toComponentName('Admin%sCreateCrumbs'),
      form: model.name.toComponentName('Admin%sCreateForm')
    })
  });
  //export function AdminProfileCreateHead() {}
  source.addFunction({
    isExported: true,
    name: model.name.toComponentName('Admin%sCreateHead'),
    parameters: [{ 
      name: 'props', 
      type: 'ServerPageProps<AdminConfigProps>'
    }],
    statements: renderCode(TEMPLATE.CREATE_HEAD, { 
      name: model.name.singular 
    })
  });
  //export function AdminProfileCreatePage() {}
  source.addFunction({
    isExported: true,
    name: model.name.toComponentName('Admin%sCreatePage'),
    parameters: [{ 
      name: 'props', 
      type: 'ServerPageProps<AdminConfigProps>'
    }],
    statements: renderCode(TEMPLATE.CREATE_PAGE, { 
      component: model.name.toComponentName('Admin%sCreateBody') 
    })
  });
  //export const Head = AdminProfileCreateHead;
  source.addVariableStatement({
    isExported: true,
    declarationKind: VariableDeclarationKind.Const,
    declarations: [{
      name: 'Head',
      initializer: `${model.name.toComponentName('Admin%sCreateHead')}`
    }]
  });
  //export default AdminProfileCreatePage;
  source.addStatements(
    `export default ${model.name.toComponentName('Admin%sCreatePage')};`
  );
};

export const TEMPLATE = {

CREATE_CRUMBS:
`//hooks
const { _ } = useLanguage();
return (
  <Bread crumb={({ active }) => active ? 'font-bold' : 'font-normal'}>
    <Bread.Slicer>
      <i className="icon fas fa-fw fa-chevron-right frui-block frui-tx-md"></i>
    </Bread.Slicer>
    <Bread.Crumb icon="<%search.icon%>" className="admin-crumb" href="search">
      {_('<%search.label%>')}
    </Bread.Crumb>
    <Bread.Crumb icon="plus">
      {_('Create')}
    </Bread.Crumb>
  </Bread>
);`,
  
CREATE_FORM_PROPS:
`{ 
  input: Partial<<%type%>>, 
  errors: NestedObject<string | string[]> 
}`,

CREATE_FORM_BODY:
`const { input, errors } = props;
const { _ } = useLanguage();
return (
  <form method="post">
    <%fields%>
    <Button className="submit" type="submit">
      <i className="icon fas fa-fw fa-save"></i>
      {_('Save')}
    </Button>
  </form>
);`,

CREATE_FORM_FIELDSET:
`<<%component%>
  className="control"
  name="<%column%>"
  value={input['<%column%>']} 
  errors={errors['<%column%>']} 
/>`,

CREATE_FORM_FIELD:
`<<%component%>
  className="control"
  name="<%column%><%multiple%>"
  value={input['<%column%>']} 
  error={errors.<%column%>?.toString()} 
/>`,

CREATE_BODY:
`const { request, response } = useServer<AdminConfigProps, Partial<<%input%>>, <%type%>>();
const input = { ...response.results, ...request.data() };
const errors = response.errors();
//render
return (
  <main className="admin-page admin-form-page">
    <div className="admin-crumbs">
      <<%crumbs%> />
    </div>
    <div className="admin-form">
      <<%form%> errors={errors} input={input} />
    </div>
  </main>
);`,

CREATE_HEAD:
`const { data, styles = [] } = props;
const { favicon = '/favicon.ico' } = data?.brand || {};
const { _ } = useLanguage();
const mimetype = favicon.endsWith('.png')
  ? 'image/png'
  : favicon.endsWith('.svg')
  ? 'image/svg+xml'
  : 'image/x-icon';
return (
  <>
    <title>{_('Create <%name%>')}</title>
    {favicon && <link rel="icon" type={mimetype} href={favicon} />}
    <link rel="stylesheet" type="text/css" href="/styles/global.css" />
    {styles.map((href, index) => (
      <link key={index} rel="stylesheet" type="text/css" href={href} />
    ))}
  </>
);`,

CREATE_PAGE:
`return (
  <LayoutAdmin {...props}>
    <<%component%> />
  </LayoutAdmin>
);`

};
