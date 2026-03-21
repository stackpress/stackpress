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

export default function generate(directory: Directory, model: Model) {
  const ids = model.store.ids.toArray().map(column => column.name);

  //------------------------------------------------------------------//
  // Profile/admin/views/remove.tsx

  const filepath = model.name.toPathName('%s/admin/views/remove.tsx');
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

  //------------------------------------------------------------------//
  // Import Stackpress

  //import type { ServerPageProps } from 'stackpress/view/client';
  source.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: 'stackpress/view/client',
    namedImports: [ 'ServerPageProps' ]
  });
  //import type { AdminConfigProps } from 'stackpress/admin/types';
  source.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: 'stackpress/admin/types',
    namedImports: [ 'AdminConfigProps' ]
  });
  //import type { StoreSearchQuery } from 'stackpress/sql/types';
  source.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: 'stackpress/sql/types',
    namedImports: [ 'StoreSearchQuery' ]
  });
  //import { useServer, LayoutAdmin } from 'stackpress/view/client';
  source.addImportDeclaration({
    moduleSpecifier: 'stackpress/view/client',
    namedImports: [ 'useServer', 'LayoutAdmin' ]
  });

  //------------------------------------------------------------------//
  // Import Client

  //import type { ProfileExtended } from '../../types.js';
  source.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: '../../types.js',
    namedImports: [ model.name.toTypeName('%sExtended') ]
  });

  //------------------------------------------------------------------//
  // Exports
  
  //export function AdminProfileRemoveCrumbs() {}
  source.addFunction({
    isExported: true,
    name: model.name.toComponentName('%sAdminRemoveCrumbs'),
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
    statements: renderCode(TEMPLATE.REMOVE_CRUMBS_BODY, {
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
      }
    })
  });
  //export function AdminProfileRemoveForm() {}
  source.addFunction({
    isExported: true,
    name: model.name.toComponentName('%sAdminRemoveForm'),
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
    statements: renderCode(TEMPLATE.REMOVE_FORM_BODY, { 
      label: render(model, "${results?.%s || ''}"),
      href: renderCode('`${base}/<%model%>/detail/<%ids%>`', { 
        model: model.name.toURLPath(),
        ids: ids.map(name => `\${results.${name}}`).join('/')
      })
    })
  });
  //export function AdminProfileRemoveBody() {}
  source.addFunction({
    isExported: true,
    name: model.name.toComponentName('%sAdminRemoveBody'),
    statements: renderCode(TEMPLATE.REMOVE_BODY, {
      type: model.name.toTypeName('%sExtended'),
      crumbs: model.name.toComponentName('%sAdminRemoveCrumbs'),
      form: model.name.toComponentName('%sAdminRemoveForm')
    })
  });
  //export function AdminProfileRemoveHead() {}
  source.addFunction({
    isExported: true,
    name: model.name.toComponentName('%sAdminRemoveHead'),
    parameters: [{ 
      name: 'props', 
      type: 'ServerPageProps<AdminConfigProps>'
    }],
    statements: renderCode(TEMPLATE.REMOVE_HEAD, { 
      name: model.name.singular 
    })
  });
  //export function AdminProfileRemovePage() {}
  source.addFunction({
    isExported: true,
    name: model.name.toComponentName('%sAdminRemovePage'),
    parameters: [{ 
      name: 'props', 
      type: 'ServerPageProps<AdminConfigProps>'
    }],
    statements: renderCode(TEMPLATE.REMOVE_PAGE, { 
      component: model.name.toComponentName('%sAdminRemoveBody') 
    })
  });
  //export const Head = AdminProfileRemoveHead;
  source.addVariableStatement({
    isExported: true,
    declarationKind: VariableDeclarationKind.Const,
    declarations: [{
      name: 'Head',
      initializer: model.name.toComponentName('%sAdminRemoveHead')
    }]
  });
  //export default AdminProfileRemovePage;
  source.addStatements(
    `export default ${model.name.toComponentName('%sAdminRemovePage')};`
  );
};

export const TEMPLATE = {

REMOVE_CRUMBS_BODY:
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
    <Bread.Crumb icon="trash">
      {_('Remove')}
    </Bread.Crumb>
  </Bread>
);`,

REMOVE_FORM_BODY:
`//props
const { base, can, results } = props;
//hooks
const { _ } = useLanguage();
//render
return (
  <div>
    <div className="message">
      <i className="icon fas fa-fw fa-info-circle"></i>
      <strong>
        {_(
          'Are you sure you want to remove %s forever?', 
          \`<%label%>\`
        )}
      </strong> 
      <br />
      <em>{_('(Thats a real long time)')}</em>
    </div>
    <div className="actions">
      {can({ method: 'GET', route: <%href%> }) && (
        <a className="action cancel" href={<%href%>}>
          <i className="icon fas fa-fw fa-arrow-left"></i>
          <span>{_('Nevermind.')}</span>
        </a>
      )}
      <a className="action remove" href="?confirmed=true">
        <i className="icon fas fa-fw fa-trash"></i>
        <span>{_('Confirmed')}</span>
      </a>
    </div>
  </div>
);`,

REMOVE_BODY:
`//props
const { 
  config, 
  session,
  response 
} = useServer<AdminConfigProps, Partial<StoreSearchQuery>, <%type%>>();
//hooks
const { _ } = useLanguage();
//variables
const can = session.can.bind(session);
const base = config.path('admin.base', '/admin');
const results = response.results as <%type%>;
if (response.code !== 200 && response.code !== 404) {
  console.error(response.toStatusResponse());
}
//render
return (
  <main className="admin-page admin-confirm-page">
    <div className="admin-crumbs">
      <<%crumbs%> base={base} can={can} results={results} />
    </div>
    {response.code === 200 ? (
      <div className="admin-confirm">
        <<%form%> base={base} can={can} results={results} />
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

REMOVE_HEAD:
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
    <title>{_('Remove <%name%>')}</title>
    {favicon && <link rel="icon" type={mimetype} href={favicon} />}
    <link rel="stylesheet" type="text/css" href="/styles/global.css" />
    {styles.map((href, index) => (
      <link key={index} rel="stylesheet" type="text/css" href={href} />
    ))}
  </>
);`,

REMOVE_PAGE:
`return (
  <LayoutAdmin {...props}>
    <<%component%> />
  </LayoutAdmin>
);`

};