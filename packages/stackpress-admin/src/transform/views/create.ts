//modules
import type { Directory } from 'ts-morph';
import { VariableDeclarationKind } from 'ts-morph';
//stackpress-schema
import type Model from 'stackpress-schema/Model';
import { 
  loadProjectFile, 
  renderCode 
} from 'stackpress-schema/transform/helpers';

export default function createView(directory: Directory, model: Model) {
  //------------------------------------------------------------------//
  // Profile/admin/views/create.tsx

  const filepath = model.name.toPathName('%s/admin/views/create.tsx');
  //load file if it exists, if not create it
  const source = loadProjectFile(directory, filepath);

  //------------------------------------------------------------------//
  // Import Modules

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

  //------------------------------------------------------------------//
  // Import Stackpress

  //import type { SessionPermission } from 'stackpress-session/types';
  source.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: 'stackpress-session/types',
    namedImports: [ 'SessionPermission' ]
  });
  //import type { NestedObject } from 'stackpress-view/client/types';
  source.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: 'stackpress-view/client/types',
    namedImports: [ 'NestedObject' ]
  });
  //import type { 
  //  AdminConfigProps, 
  //  AdminPageProps 
  //} from 'stackpress-admin/client/types';
  source.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: 'stackpress-admin/client/types',
    namedImports: [ 'AdminConfigProps', 'AdminPageProps' ]
  });
  //import { useServer } from 'stackpress-view/client';
  source.addImportDeclaration({
    moduleSpecifier: 'stackpress-view/client',
    namedImports: [ 'useServer' ]
  });
  //import { LayoutAdmin } from 'stackpress-admin/client';
  source.addImportDeclaration({
    moduleSpecifier: 'stackpress-admin/client',
    namedImports: [ 'LayoutAdmin' ]
  });

  //------------------------------------------------------------------//
  // Import Client

  //import type { ProfileInput, Profile } from '../../types.js';
  source.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: '../../types.js',
    namedImports: [ 
      model.name.toTypeName('%sInput'), 
      model.name.toTypeName()
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

  //export type ProfileAdminCreateCrumbsProps = {};
  source.addTypeAlias({
    isExported: true,
    name: model.name.toComponentName('%sAdminCreateCrumbsProps'),
    type: `{ 
      base: string, 
      can: (...permits: SessionPermission[]) => boolean 
    }`
  });
  //export type ProfileAdminCreateFormProps = {};
  source.addTypeAlias({
    isExported: true,
    name: model.name.toComponentName('%sAdminCreateFormProps'),
    type: renderCode(`{ 
      input: Partial<<%type%>>, 
      errors: NestedObject<string | string[]> 
    }`, { 
      type: model.name.toTypeName('%sInput') 
    }) 
  });
  //export type ProfileAdminCreateHeadProps = AdminPageProps
  source.addTypeAlias({
    isExported: true,
    name: model.name.toComponentName('%sAdminCreateHeadProps'),
    type: 'AdminPageProps'
  });
  //export type ProfileAdminCreatePageProps = AdminPageProps
  source.addTypeAlias({
    isExported: true,
    name: model.name.toTypeName('%sAdminCreatePageProps'),
    type: 'AdminPageProps'
  });
  
  //export function ProfileAdminCreateCrumbs() {}
  source.addFunction({
    isExported: true,
    name: model.name.toComponentName('%sAdminCreateCrumbs'),
    parameters: [{ 
      name: 'props', 
      type: model.name.toComponentName('%sAdminCreateCrumbsProps')
    }],
    statements: renderCode(TEMPLATE.CREATE_CRUMBS, { 
      search: {
        label: model.name.plural || model.name.titleCase,
        icon: model.name.icon,
        href: renderCode('`${base}/<%model%>/search`', { 
          model: model.name.toURLPath()
        })
      }
    })
  });
  //export function ProfileAdminCreateForm() {}
  source.addFunction({
    isExported: true,
    name: model.name.toComponentName('%sAdminCreateForm'),
    parameters: [{ 
      name: 'props', 
      type: model.name.toComponentName('%sAdminCreateFormProps')
    }],
    statements: renderCode(TEMPLATE.CREATE_FORM_BODY,{
      fields: model.component.formFields.toArray().map(column => {
        const attribute = column.component.formField!;
        const component = attribute.component.definition!;
        if (component.name === 'Fieldset') {
          return renderCode(TEMPLATE.CREATE_FORM_FIELDSET, {
            required: !column.type.nullable,
            component: column.name.toComponentName('%sFormFieldsetControl'),
            column: column.name.toString()
          });
        }
        return renderCode(TEMPLATE.CREATE_FORM_FIELD, {
          required: !column.type.nullable,
          component: column.name.toComponentName('%sFormFieldControl'),
          column: column.name.toString(),
          multiple: column.type.multiple ? '[]' : ''
        });
      }).join('\n')
    })
  });
  //export function ProfileAdminCreateBody() {}
  source.addFunction({
    isExported: true,
    name: model.name.toComponentName('%sAdminCreateBody'),
    statements: renderCode(TEMPLATE.CREATE_BODY, {
      type: model.name.toTypeName(),
      input: model.name.toTypeName('%sInput'),
      crumbs: model.name.toComponentName('%sAdminCreateCrumbs'),
      form: model.name.toComponentName('%sAdminCreateForm')
    })
  });
  //export function ProfileAdminCreateHead() {}
  source.addFunction({
    isExported: true,
    name: model.name.toComponentName('%sAdminCreateHead'),
    parameters: [{ 
      name: 'props', 
      type: model.name.toComponentName('%sAdminCreateHeadProps')
    }],
    statements: renderCode(TEMPLATE.CREATE_HEAD, { 
      name: model.name.singular 
    })
  });
  //export function ProfileAdminCreatePage() {}
  source.addFunction({
    isExported: true,
    name: model.name.toComponentName('%sAdminCreatePage'),
    parameters: [{ 
      name: 'props', 
      type: model.name.toComponentName('%sAdminCreatePageProps')
    }],
    statements: renderCode(TEMPLATE.CREATE_PAGE, { 
      component: model.name.toComponentName('%sAdminCreateBody') 
    })
  });
  //export const Head = ProfileAdminCreateHead;
  source.addVariableStatement({
    isExported: true,
    declarationKind: VariableDeclarationKind.Const,
    declarations: [{
      name: 'Head',
      initializer: `${model.name.toComponentName('%sAdminCreateHead')}`
    }]
  });
  //export default ProfileAdminCreatePage;
  source.addStatements(
    `export default ${model.name.toComponentName('%sAdminCreatePage')};`
  );
};

//------------------------------------------------------------------//
// Templates

export const TEMPLATE = {

CREATE_CRUMBS:
`//props
const { base, can } = props;
//hooks
const { _ } = useLanguage();
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
    <Bread.Crumb icon="plus">
      {_('Create')}
    </Bread.Crumb>
  </Bread>
);`,

CREATE_FORM_BODY:
`const { input, errors } = props;
const { _ } = useLanguage();
const { config } = useServer();
const tokenKey = config.path('csrf.name', 'csrf');
const token = config.path('csrf.token', '');
return (
  <form method="post">
    <input type="hidden" name={tokenKey} value={token} />
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
  value={input.<%column%>} 
  errors={errors.<%column%> as Record<string, any>}
  <%#?:required%>required<%/?:required%>
/>`,

CREATE_FORM_FIELD:
`<<%component%>
  className="control"
  name="<%column%><%multiple%>"
  value={input.<%column%>} 
  error={errors.<%column%>?.toString()} 
  <%#?:required%>required<%/?:required%>
/>`,

CREATE_BODY:
`//hooks
const { 
  config, 
  session, 
  request, 
  response 
} = useServer<AdminConfigProps, Partial<<%input%>>, <%type%>>();
//variables
const base = config.path('admin.base', '/admin');
const can = session.can.bind(session);
const input = { ...response.results, ...request.data() };
const errors = response.errors();
//render
return (
  <main className="admin-page admin-form-page">
    <div className="admin-crumbs">
      <<%crumbs%> base={base} can={can} />
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
