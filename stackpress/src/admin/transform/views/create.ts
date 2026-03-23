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
  //import Tabs from 'frui/Tabs';
  source.addImportDeclaration({
    moduleSpecifier: 'frui/Tabs',
    defaultImport: 'Tabs'
  });

  //------------------------------------------------------------------//
  // Import Stackpress

  //import type { ErrorReport } from 'stackpress/schema/types';
  source.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: 'stackpress/schema/types',
    namedImports: [ 'ErrorReport' ]
  });
  //import type { AdminConfigProps } from 'stackpress/admin/types';
  source.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: 'stackpress/admin/types',
    namedImports: [ 'AdminConfigProps' ]
  });
  //import type { ServerPageProps, SessionPermission } from 'stackpress/view/client';
  source.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: 'stackpress/view/client',
    namedImports: [ 'ServerPageProps', 'SessionPermission' ]
  });
  //import { useServer, LayoutAdmin } from 'stackpress/view/client';
  source.addImportDeclaration({
    moduleSpecifier: 'stackpress/view/client',
    namedImports: [ 'useServer', 'LayoutAdmin' ]
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
  
  //export function ProfileAdminCreateCrumbs() {}
  source.addFunction({
    isExported: true,
    name: model.name.toComponentName('%sAdminCreateCrumbs'),
    parameters: [{ 
      name: 'props', 
      type: `{ 
        base: string, 
        can: (...permits: SessionPermission[]) => boolean 
      }`
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
      type: renderCode(`{ 
        input: Partial<<%type%>>, 
        errors: Record<string, ErrorReport>
      }`, { 
        type: model.name.toTypeName('%sInput') 
      }) 
    }],
    statements: renderCode(TEMPLATE.CREATE_FORM_BODY,{
      fields: model.component.formFields
        .toArray()
        .filter(column => {
          const attribute = column.component.formField!;
          const component = attribute.component.definition!;
          return component.name !== 'Fieldset';
        })
        .map(column => ({
          component: column.name.toComponentName('%sFormFieldControl'),
          column: column.name.toString(),
          multiple: column.type.multiple ? '[]' : ''
        })),
      fieldsets: model.component.formFields
        .toArray()
        .filter(column => {
          const attribute = column.component.formField!;
          const component = attribute.component.definition!;
          return component.name === 'Fieldset';
        })
        .map(column => ({
          value: column.name.toString(),
          label: column.name.label || column.name.titleCase,
          required: column.type.required && !column.type.multiple,
          component: column.name.toComponentName('%sFormFieldsetControl'),
          column: column.name.toString(),
          errorType: column.type.multiple 
           ? 'Record<string, ErrorReport>[]' 
           : 'Record<string, ErrorReport>'
        }))
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
      type: 'ServerPageProps<AdminConfigProps>'
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
      type: 'ServerPageProps<AdminConfigProps>'
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
return (
  <form method="post">
    <Tabs 
      className="admin-form-tabs"
      defaultValue="_info"
      tab={({ active }) => active 
        ? 'admin-form-tab-active' 
        : 'admin-form-tab'
      }
      content={({ active }) => active 
        ? 'admin-form-tab-content' 
        : 'admin-form-tab-content frui-none'
      }
    >
      <Tabs.Head className="flex">
        <Tabs.Label value="_info">{_('Info')}</Tabs.Label>
        <%#fieldsets%>
          <Tabs.Label value="<%value%>">
            {_('<%label%>')<%#required%>+ ' *'<%/required%>}
          </Tabs.Label>
        <%/fieldsets%>
      </Tabs.Head>
      <Tabs.Body>
        <Tabs.Content value="_info">
          <%#fields%>
            <<%component%>
              className="control"
              name="<%column%><%multiple%>"
              value={input['<%column%>']} 
              error={errors.<%column%>?.toString()} 
            />
          <%/fields%>
        </Tabs.Content>
        <%#fieldsets%>
          <Tabs.Content value="<%value%>">
            <<%component%>
              className="control"
              name="<%column%>"
              value={input['<%column%>']} 
              errors={errors['<%column%>'] as <%errorType%>} 
            />
          </Tabs.Content>
        <%/fieldsets%>
      </Tabs.Body>
    </Tabs>
    <Button className="submit" type="submit">
      <i className="icon fas fa-fw fa-save"></i>
      {_('Save')}
    </Button>
  </form>
);`,

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
