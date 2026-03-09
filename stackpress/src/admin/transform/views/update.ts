//modules
import type { Directory } from 'ts-morph';
import { VariableDeclarationKind } from 'ts-morph';
//stackpress/schema
import type Model from '../../../schema/Model.js';
import { 
  loadProjectFile, 
  renderCode 
} from '../../../schema/transform/helpers.js';
//stackpress/admin
import { render } from '../helpers.js';

export default function updateView(directory: Directory, model: Model) {
  const ids = model.store.ids.toArray().map(column => column.name);
  const path = ids.map(name => `\${results.${name}}`).join('/');
  const link = (action: string) => `\`\${base}/${model.name.dashCase}/${action}/${path}\``;

  const filepath = model.name.toPathName('%s/admin/views/update.tsx');
  //load Profile/admin/views/update.tsx if it exists, if not create it
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
  //import type { ProfileInput, ProfileExtended } from '../../types.js';
  source.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: '../../types.js',
    namedImports: [ 
      model.name.toTypeName('%sInput'), 
      model.name.toTypeName('%sExtended') 
    ]
  });
  //import { useLanguage } from 'r22n';
  source.addImportDeclaration({
    moduleSpecifier: 'r22n',
    namedImports: [ 'useLanguage' ]
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
  //import Button from 'frui/Button';
  source.addImportDeclaration({
    moduleSpecifier: 'frui/Button',
    defaultImport: 'Button'
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

  //export function AdminProfileUpdateCrumbs() {}
  source.addFunction({
    isExported: true,
    name: model.name.toComponentName('Admin%sUpdateCrumbs'),
    parameters: [{ 
      name: 'props', 
      type: renderCode(TEMPLATE.UPDATE_CRUMBS_PROPS, { 
        type: model.name.toTypeName('%sExtended') 
      })
    }],
    statements: renderCode(TEMPLATE.UPDATE_CRUMBS_BODY, {
      search: {
        label: model.name.plural || model.name.titleCase,
        icon: model.name.icon
      },
      detail: {
        label: render(model, "${results?.%s || ''}"),
        href: link('detail')
      }
    })
  });
  //export function AdminProfileUpdateForm() {}
  source.addFunction({
    isExported: true,
    name: model.name.toComponentName('Admin%sUpdateForm'),
    parameters: [{ 
      name: 'props', 
      type: renderCode(TEMPLATE.UPDATE_FORM_PROPS, { 
        type: model.name.toTypeName('%sInput') 
      }) 
    }],
    statements: renderCode(TEMPLATE.UPDATE_FORM_BODY,{
      fields: model.component.formFields.toArray().map(column => {
        const attribute = column.component.formField!;
        const component = attribute.component.definition!;
        if (component.name === 'Fieldset') {
          return renderCode(TEMPLATE.UPDATE_FORM_FIELDSET, {
            component: column.name.toComponentName('%sFormFieldsetControl'),
            column: column.name.toURLPath()
          });
        }
        return renderCode(TEMPLATE.UPDATE_FORM_FIELD, {
          component: column.name.toComponentName('%sFormFieldControl'),
          column: column.name.toURLPath(),
          multiple: column.type.multiple ? '[]' : ''
        });
      }).join('\n')
    })
  });
  //export function AdminProfileUpdateBody() {}
  source.addFunction({
    isExported: true,
    name: model.name.toComponentName('Admin%sUpdateBody'),
    statements: renderCode(TEMPLATE.UPDATE_BODY, {
      input: model.name.toTypeName('%sInput'),
      type: model.name.toTypeName('%sExtended'),
      crumbs: model.name.toComponentName('Admin%sUpdateCrumbs'),
      form: model.name.toComponentName('Admin%sUpdateForm')
    })
  });
  //export function AdminProfileUpdateHead() {}
  source.addFunction({
    isExported: true,
    name: model.name.toComponentName('Admin%sUpdateHead'),
    parameters: [{ 
      name: 'props', 
      type: 'ServerPageProps<AdminConfigProps>'
    }],
    statements: renderCode(TEMPLATE.UPDATE_HEAD, { 
      name: model.name.singular 
    })
  });
  //export function AdminProfileUpdatePage() {}
  source.addFunction({
    isExported: true,
    name: model.name.toComponentName('Admin%sUpdatePage'),
    parameters: [{ 
      name: 'props', 
      type: 'ServerPageProps<AdminConfigProps>'
    }],
    statements: renderCode(TEMPLATE.UPDATE_PAGE, { 
      component: model.name.toComponentName('Admin%sUpdateBody') 
    })
  });
  //export const Head = AdminProfileUpdateHead;
  source.addVariableStatement({
    isExported: true,
    declarationKind: VariableDeclarationKind.Const,
    declarations: [{
      name: 'Head',
      initializer: model.name.toComponentName('Admin%sUpdateHead')
    }]
  });
  //export default AdminProfileUpdatePage;
  source.addStatements(
    `export default ${model.name.toComponentName('Admin%sUpdatePage')};`
  );
};

export const TEMPLATE = {

UPDATE_CRUMBS_PROPS:
'{ base: string, results: <%type%> }',

UPDATE_CRUMBS_BODY:
`const { base, results } = props;
//hooks
const { _ } = useLanguage();
return (
  <Bread crumb={({ active }) => active ? 'font-bold' : 'font-normal'}>
    <Bread.Slicer value="›" />
    <Bread.Crumb icon="<%search.icon%>" className="admin-crumb" href="../search">
      {_('<%search.label%>')}
    </Bread.Crumb>
    <Bread.Crumb href={<%detail.href%>}>
      {_(\`<%detail.label%>\`)}
    </Bread.Crumb>
    <Bread.Crumb icon="edit">
      {_('Update')}
    </Bread.Crumb>
  </Bread>
);`,

UPDATE_FORM_PROPS:
`{ 
  input: Partial<<%type%>>, 
  errors: NestedObject<string | string[]> 
}`,

UPDATE_FORM_BODY:
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

UPDATE_FORM_FIELDSET:
`<<%component%>
  className="control"
  name="<%column%>"
  value={input['<%column%>']} 
  errors={errors['<%column%>']} 
/>`,

UPDATE_FORM_FIELD:
`<<%component%>
  className="control"
  name="<%column%><%multiple%>"
  value={input['<%column%>']} 
  error={errors.<%column%>?.toString()} 
/>`,

UPDATE_BODY:
`const { config, request, response } = useServer<AdminConfigProps, Partial<<%input%>>, <%type%>>();
const base = config.path('admin.base', '/admin');
const input = { ...response.results, ...request.data() };
const errors = response.errors();
const results = response.results as <%type%>;
//render
return (
  <main className="admin-page admin-form-page">
    <div className="admin-crumbs">
      <<%crumbs%> base={base} results={results} />
    </div>
    <div className="admin-form">
      <<%form%> errors={errors} input={input} />
    </div>
  </main>
);`,

UPDATE_HEAD:
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
    <title>{_('Update <%name%>')}</title>
    {favicon && <link rel="icon" type={mimetype} href={favicon} />}
    <link rel="stylesheet" type="text/css" href="/styles/global.css" />
    {styles.map((href, index) => (
      <link key={index} rel="stylesheet" type="text/css" href={href} />
    ))}
  </>
);`,

UPDATE_PAGE:
`return (
  <LayoutAdmin {...props}>
    <<%component%> />
  </LayoutAdmin>
);`

};