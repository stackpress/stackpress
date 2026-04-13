//modules
import type { Directory } from 'ts-morph';
import { VariableDeclarationKind } from 'ts-morph';
//stackpress/schema
import type Model from '../../../schema/Model.js';
import { 
  loadProjectFile, 
  renderCode 
} from '../../../schema/transform/helpers.js';

export default function updateView(directory: Directory, model: Model) {
  const ids = model.store.ids.toArray().map(column => column.name);

  //------------------------------------------------------------------//
  // Profile/admin/views/update.tsx

  const filepath = model.name.toPathName('%s/admin/views/update.tsx');
  //load file if it exists, if not create it
  const source = loadProjectFile(directory, filepath);

  //------------------------------------------------------------------//
  // Import Modules

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
  //import Button from 'frui/Button';
  source.addImportDeclaration({
    moduleSpecifier: 'frui/Button',
    defaultImport: 'Button'
  });

  //import Handlebars from 'stackpress/view/handlebars';
  source.addImportDeclaration({
    moduleSpecifier: 'stackpress/view/handlebars',
    defaultImport: 'Handlebars'
  });

  //------------------------------------------------------------------//
  // Import Stackpress

  //import type { NestedObject, ServerPageProps, SessionPermission } from 'stackpress/view/client';
  source.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: 'stackpress/view/client',
    namedImports: [ 'NestedObject', 'ServerPageProps', 'SessionPermission' ]
  });
  //import type { AdminConfigProps } from 'stackpress/admin/types';
  source.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: 'stackpress/admin/types',
    namedImports: [ 'AdminConfigProps' ]
  });
  //import { useServer, LayoutAdmin } from 'stackpress/view/client';
  source.addImportDeclaration({
    moduleSpecifier: 'stackpress/view/client',
    namedImports: [ 'useServer', 'LayoutAdmin' ]
  });

  //------------------------------------------------------------------//
  // Import Client

  //import type { ProfileInput, ProfileExtended } from '../../types.js';
  source.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: '../../types.js',
    namedImports: [ 
      model.name.toTypeName('%sInput'), 
      model.name.toTypeName('%sExtended') 
    ]
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

  //------------------------------------------------------------------//
  // Exports

  //export type AdminProfileUpdateCrumbsProps = {};
  source.addTypeAlias({
    isExported: true,
    name: model.name.toTypeName('%sAdminUpdateCrumbsProps'),
    type: renderCode(`{ 
      base: string, 
      results: <%type%>, 
      can: (...permits: SessionPermission[]) => boolean 
    }`, { 
      type: model.name.toTypeName('%sExtended') 
    })
  });
  //export type AdminProfileUpdateFormProps = {};
  source.addTypeAlias({
    isExported: true,
    name: model.name.toTypeName('%sAdminUpdateFormProps'),
    type: renderCode(TEMPLATE.UPDATE_FORM_PROPS, { 
      type: model.name.toTypeName('%sInput') 
    }) 
  });
  //export type AdminProfileUpdateHeadProps = ServerPageProps<AdminConfigProps>;
  source.addTypeAlias({
    isExported: true,
    name: model.name.toTypeName('%sAdminUpdateHeadProps'),
    type: 'ServerPageProps<AdminConfigProps>'
  });
  //export type AdminProfileUpdatePageProps = ServerPageProps<AdminConfigProps>;
  source.addTypeAlias({
    isExported: true,
    name: model.name.toTypeName('%sAdminUpdatePageProps'),
    type: 'ServerPageProps<AdminConfigProps>'
  });

  //export function AdminProfileUpdateCrumbs() {}
  source.addFunction({
    isExported: true,
    name: model.name.toComponentName('%sAdminUpdateCrumbs'),
    parameters: [{ 
      name: 'props', 
      type: model.name.toTypeName('%sAdminUpdateCrumbsProps')
    }],
    statements: renderCode(TEMPLATE.UPDATE_CRUMBS_BODY, {
      search: {
        label: model.name.plural || model.name.titleCase,
        icon: model.name.icon,
        href: renderCode('`${base}/<%model%>/search`', { 
          model: model.name.toURLPath()
        })
      },
      detail: {
        template: JSON.stringify(model.name.display || ''),
        href: renderCode('`${base}/<%model%>/detail/<%ids%>`', { 
          model: model.name.toURLPath(),
          ids: ids.map(name => `\${results.${name}}`).join('/')
        })
      }
    })
  });
  //export function AdminProfileUpdateForm() {}
  source.addFunction({
    isExported: true,
    name: model.name.toComponentName('%sAdminUpdateForm'),
    parameters: [{ 
      name: 'props', 
      type: model.name.toTypeName('%sAdminUpdateFormProps')
    }],
    statements: renderCode(TEMPLATE.UPDATE_FORM_BODY,{
      fields: model.component.formFields.toArray().map(column => {
        const attribute = column.component.formField!;
        const component = attribute.component.definition!;
        if (component.name === 'Fieldset') {
          return renderCode(TEMPLATE.UPDATE_FORM_FIELDSET, {
            required: !column.type.nullable,
            component: column.name.toComponentName('%sFormFieldsetControl'),
            column: column.name.toString()
          });
        }
        return renderCode(TEMPLATE.UPDATE_FORM_FIELD, {
          required: !column.type.nullable,
          component: column.name.toComponentName('%sFormFieldControl'),
          column: column.name.toString(),
          multiple: column.type.multiple ? '[]' : ''
        });
      }).join('\n')
    })
  });
  //export function AdminProfileUpdateBody() {}
  source.addFunction({
    isExported: true,
    name: model.name.toComponentName('%sAdminUpdateBody'),
    statements: renderCode(TEMPLATE.UPDATE_BODY, {
      input: model.name.toTypeName('%sInput'),
      type: model.name.toTypeName('%sExtended'),
      crumbs: model.name.toComponentName('%sAdminUpdateCrumbs'),
      form: model.name.toComponentName('%sAdminUpdateForm')
    })
  });
  //export function AdminProfileUpdateHead() {}
  source.addFunction({
    isExported: true,
    name: model.name.toComponentName('%sAdminUpdateHead'),
    parameters: [{ 
      name: 'props', 
      type: model.name.toTypeName('%sAdminUpdateHeadProps')
    }],
    statements: renderCode(TEMPLATE.UPDATE_HEAD, { 
      name: model.name.singular 
    })
  });
  //export function AdminProfileUpdatePage() {}
  source.addFunction({
    isExported: true,
    name: model.name.toComponentName('%sAdminUpdatePage'),
    parameters: [{ 
      name: 'props', 
      type: model.name.toTypeName('%sAdminUpdatePageProps')
    }],
    statements: renderCode(TEMPLATE.UPDATE_PAGE, { 
      component: model.name.toComponentName('%sAdminUpdateBody') 
    })
  });
  //export const Head = AdminProfileUpdateHead;
  source.addVariableStatement({
    isExported: true,
    declarationKind: VariableDeclarationKind.Const,
    declarations: [{
      name: 'Head',
      initializer: model.name.toComponentName('%sAdminUpdateHead')
    }]
  });
  //export default AdminProfileUpdatePage;
  source.addStatements(
    `export default ${model.name.toComponentName('%sAdminUpdatePage')};`
  );
};

//------------------------------------------------------------------//
// Templates

export const TEMPLATE = {

UPDATE_CRUMBS_BODY:
`//props
const { base, can, results } = props;
//hooks
const { _ } = useLanguage();
//variables
const template = Handlebars.compile(<%detail.template%>);
const label = template(results) || _('Detail');
//render
return (
  <Bread crumb={({ active }) => active ? 'font-bold' : 'font-normal'}>
    <Bread.Slicer>
      <i className="icon fas fa-fw fa-chevron-right frui-block frui-tx-md"></i>
    </Bread.Slicer>
    {can({ method: 'GET', route: <%search.href%> }) && (
      <Bread.Crumb 
        icon="<%search.icon%>" 
        className="admin-crumb" 
        href={<%search.href%>}
      >
        {_('<%search.label%>')}
      </Bread.Crumb>
    )}
    {!!results && can({ method: 'GET', route: <%detail.href%> }) && (
      <Bread.Crumb className="admin-crumb" href={<%detail.href%>}>
        {label}
      </Bread.Crumb>
    )}
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
  value={input.<%column%>} 
  errors={errors.<%column%> as Record<string, any>} 
  <%#required%>required<%/required%>
/>`,

UPDATE_FORM_FIELD:
`<<%component%>
  className="control"
  name="<%column%><%multiple%>"
  value={input.<%column%>} 
  error={errors.<%column%>?.toString()} 
  <%#required%>required<%/required%>
/>`,

UPDATE_BODY:
`//props
const { 
  config, 
  session,
  request, 
  response 
} = useServer<AdminConfigProps, Partial<<%input%>>, <%type%>>();
//hooks
const { _ } = useLanguage();
//variables
const can = session.can.bind(session);
const base = config.path('admin.base', '/admin');
const input = { ...response.results, ...request.data() };
const errors = response.errors();
const results = response.results as <%type%>;
//render
return (
  <main className="admin-page admin-form-page">
    <div className="admin-crumbs">
      <<%crumbs%> base={base} can={can} results={results} />
    </div>
    {response.code === 404 ? (
      <div className="admin-form">
        <div className="flex flex-col frui-fa-center px-h-100-0">
          <h1 className="px-pb-20 px-fs-20 font-bold">
            {_('Not Found')}
          </h1>
          <p>
            {_('Looks like this page does not exist. Please make sure the URL is correct.')}
          </p>
        </div>
      </div>
    ) : (
      <div className="admin-form">
        <<%form%> errors={errors} input={input} />
      </div>
    )}
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