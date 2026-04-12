//modules
import type { Directory } from 'ts-morph';
import { VariableDeclarationKind } from 'ts-morph';
//stackpress/schema
import type Model from '../../../../schema/Model.js';
import { 
  loadProjectFile, 
  renderCode 
} from '../../../../schema/transform/helpers.js';
//stackpress/admin
import type { Relationship } from '../../types.js';
import { render } from '../../helpers.js';

export default function generate(
  directory: Directory, 
  model: Model, 
  relationship: Relationship
) {
  const ids = model.store.ids.toArray().map(column => column.name);
  //NOTE: in related, the local model is the foreign 
  // model, and the foreign model is this model
  const foreignModel = relationship.local.model as Model;
  //relation used for filepaths and function names
  const relatedColumn = relationship.foreign.column;

  //------------------------------------------------------------------//
  // Profile/admin/views/Auth/create.tsx

  const filepath = renderCode(
    '<%model%>/admin/views/<%relation%>/create.tsx', 
    {
      model: model.name.toPathName(),
      relation: relationship.foreign.column.name.toString()
    }
  );
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

  //------------------------------------------------------------------//
  // Import Stackpress

  //import type { NestedObject, ServerPageProps, SessionPermission } from 'stackpress/view/client';
  source.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: 'stackpress/view/client',
    namedImports: [ 
      'NestedObject', 
      'ServerPageProps',
      'SessionPermission'
    ]
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
  
  //import type { Profile, ProfileExtended } from '../../../types.js';
  source.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: '../../../types.js',
    namedImports: [
      model.name.toTypeName(),
      model.name.toTypeName('%sExtended')
    ]
  });
  //import type { AuthInput } from '../../../../Auth/types.js';
  source.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: foreignModel.name.toPathName('../../../../%s/types.js'),
    namedImports: [ 
      foreignModel.name.toTypeName('%sInput') 
    ]
  });
  //import { ActiveFormFieldControl } from '../../../../Auth/components/form/ActiveFormField.js';
  foreignModel.component.formFields.forEach(column => {
    //skip profileId
    if (relationship.local.key.name.toString() === column.name.toString()) {
      return;
    }
    const field = column.component.formField!;
    const component = field.component.definition!;
    //import { ActiveFormFieldsetControl } from '../../../../Auth/components/form/ActiveFormField.js';
    source.addImportDeclaration({
      moduleSpecifier: renderCode('../../../../<%model%>/components/form/<%column%>FormField.js', {
        model: foreignModel.name.toPathName(),
        column: column.name.toPathName()
      }),
      namedImports: [ 
        component.name === 'Fieldset'
          ? column.name.toComponentName('%sFormFieldsetControl') 
          : column.name.toComponentName('%sFormFieldControl') 
      ]
    });
  });

  //------------------------------------------------------------------//
  // Exports

  //export function AdminProfileAuthCreateCrumbs() {}
  source.addFunction({
    isExported: true,
    name: renderCode('<%model%>Admin<%relation%>CreateCrumbs', {
      model: model.name.toComponentName(),
      relation: relatedColumn.name.toComponentName()
    }),
    parameters: [{ 
      name: 'props', 
      type: renderCode(`{ 
        base: string, 
        results: <%type%>, 
        can: (...permits: SessionPermission[]) => boolean 
      }`, { 
        type: model.name.toTypeName('%sExtended')
      })
    }],
    statements: renderCode(TEMPLATE.CREATE_CRUMBS_BODY, {
      search: {
        label: model.name.plural || model.name.titleCase,
        icon: model.name.icon,
        href: renderCode('`${base}/<%model%>/search`', {
          model: model.name.toURLPath()
        })
      },
      detail: {
        label: render(model, "${results?.%s || ''}"),
        href: renderCode('`${base}/<%model%>/detail/<%ids%>`', {
          model: model.name.toURLPath(),
          ids: ids.map(name => `\${results.${name}}`).join('/')
        })
      },
      relation: {
        label: relatedColumn.attributes.value<string>('label') 
          || foreignModel.name.plural 
          || foreignModel.name.titleCase,
        icon: foreignModel.name.icon,
        href: renderCode('`${base}/<%model%>/detail/<%ids%>/<%relation%>/search`', {
          model: model.name.toURLPath(),
          ids: ids.map(name => `\${results.${name}}`).join('/'),
          relation: relatedColumn.name.toURLPath()
        })
      }
    })
  });
  //export function ProfileAdminAuthCreateForm() {}
  source.addFunction({
    isExported: true,
    name: renderCode('<%model%>Admin<%relation%>CreateForm', {
      model: model.name.toComponentName(),
      relation: relatedColumn.name.toComponentName()
    }),
    parameters: [{ 
      name: 'props', 
      type: renderCode(TEMPLATE.CREATE_FORM_PROPS, { 
        type: foreignModel.name.toTypeName('%sInput') 
      }) 
    }],
    statements: renderCode(TEMPLATE.CREATE_FORM_BODY,{
      fields: foreignModel.component.formFields
        .toArray()
        .filter(column => relationship.local.key.name.toString() !== column.name.toString())
        .map(column => {
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
  //export function AdminProfileAuthCreateBody() {}
  source.addFunction({
    isExported: true,
    name: renderCode('<%model%>Admin<%relation%>CreateBody', {
      model: model.name.toComponentName(),
      relation: relatedColumn.name.toComponentName()
    }),
    statements: renderCode(TEMPLATE.CREATE_BODY, {
      input: foreignModel.name.toTypeName('%sInput'),
      type: model.name.toTypeName(),
      crumbs: renderCode('<%model%>Admin<%relation%>CreateCrumbs', {
        model: model.name.toComponentName(),
        relation: relatedColumn.name.toComponentName(),
      }),
      form: renderCode('<%model%>Admin<%relation%>CreateForm', {
        model: model.name.toComponentName(),
        relation: relatedColumn.name.toComponentName(),
      })
    })
  });
  //export function AdminProfileAuthCreateHead() {}
  source.addFunction({
    isExported: true,
    name: renderCode('<%model%>Admin<%relation%>CreateHead', {
      model: model.name.toComponentName(),
      relation: relatedColumn.name.toComponentName()
    }),
    parameters: [{ 
      name: 'props', 
      type: 'ServerPageProps<AdminConfigProps>'
    }],
    statements: renderCode(TEMPLATE.CREATE_HEAD, { 
      name: model.name.singular,
      relation: relatedColumn.attributes.value<string>('label') 
        || foreignModel.name.plural 
        || foreignModel.name.titleCase
    })
  });
  //export function AdminProfileAuthCreatePage() {}
  source.addFunction({
    isExported: true,
    name: renderCode('<%model%>Admin<%relation%>CreatePage', {
      model: model.name.toComponentName(),
      relation: relatedColumn.name.toComponentName()
    }),
    parameters: [{ 
      name: 'props', 
      type: 'ServerPageProps<AdminConfigProps>'
    }],
    statements: renderCode(TEMPLATE.CREATE_PAGE, { 
      component: renderCode('<%model%>Admin<%relation%>CreateBody', {
        model: model.name.toComponentName(),
        relation: relatedColumn.name.toComponentName(),
      })
    })
  });
  //export const Head = AdminProfileAuthCreateHead;
  source.addVariableStatement({
    isExported: true,
    declarationKind: VariableDeclarationKind.Const,
    declarations: [{
      name: 'Head',
      initializer: renderCode('<%model%>Admin<%relation%>CreateHead', {
        model: model.name.toComponentName(),
        relation: relatedColumn.name.toComponentName()
      })
    }]
  });
  //export default AdminProfileAuthCreatePage;
  source.addStatements(
    `export default ${renderCode('<%model%>Admin<%relation%>CreatePage', {
      model: model.name.toComponentName(),
      relation: relatedColumn.name.toComponentName()
    })};`
  );
};

//------------------------------------------------------------------//
// Templates

export const TEMPLATE = {

CREATE_CRUMBS_BODY:
`//props
const { base, can, results } = props;
//hooks
const { _ } = useLanguage();
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
        {_(\`<%detail.label%>\`)}
      </Bread.Crumb>
    )}
    {!!results && can({ method: 'GET', route: <%relation.href%> }) && (
      <Bread.Crumb 
        icon="<%relation.icon%>" 
        className="admin-crumb" 
        href={<%relation.href%>}
      >
        {_('<%relation.label%>')}
      </Bread.Crumb>
    )}
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
`//hooks
const { _ } = useLanguage();
const { 
  config, 
  session,
  request, 
  response 
} = useServer<
  AdminConfigProps, 
  Partial<<%input%>>, 
  <%type%>
>();
//variables
const can = session.can.bind(session);
const base = config.path('admin.base', '/admin');
const input = { ...request.data() };
const errors = response.errors();
const results = response.results!;
//render
return (
  <main className="admin-detail-page admin-form-page admin-page">
    <div className="admin-crumbs">
      <<%crumbs%> base={base} can={can} results={results} />
    </div>
    {response.code === 200 ? (
      <div className="admin-form">
        <<%form%> errors={errors} input={input} />
      </div>
    ) : response.code === 404 ? (
      <div className="flex-grow">
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
      <div className="flex-grow">
        <div className="flex flex-col frui-fa-center px-h-100-0">
          <h1 className="px-pb-20 px-fs-20 font-bold">
            {_('Unknown Error')}
          </h1>
          <p>
            {_('Sorry, something went wrong. Ask an admin to help, then try again later.')}
          </p>
        </div>
      </div>
    )}
  </main>
);`,

CREATE_HEAD:
`//props
const { data, styles = [] } = props;
//hooks
const { _ } = useLanguage();
//variables
const { favicon = '/favicon.ico' } = data?.brand || {};
const mimetype = favicon.endsWith('.png')
  ? 'image/png'
  : favicon.endsWith('.svg')
  ? 'image/svg+xml'
  : 'image/x-icon';
//render
return (
  <>
    <title>{_('<%name%> - Create <%relation%>')}</title>
    {favicon && <link rel="icon" type={mimetype} href={favicon} />}
    <link rel="stylesheet" type="text/css" href="/styles/global.css" />
    {styles.map((href, index) => (
      <link key={index} rel="stylesheet" type="text/css" href={href} />
    ))}
  </>
);`,

CREATE_PAGE:
`//render
return (
  <LayoutAdmin {...props}>
    <<%component%> />
  </LayoutAdmin>
);`

};