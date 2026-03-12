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

export default function detailView(directory: Directory, model: Model) {
  const ids = model.store.ids.toArray().map(column => column.name);
  const path = ids.map(name => `\${results.${name}}`).join('/');
  const link = (
    action: string,
    extras = ''
  ) => `\`\${base}/${model.name.dashCase}/${action}/${path}${extras}\``;

  const filepath = model.name.toPathName('%s/admin/views/detail.tsx');
  //load Profile/admin/views/detail.tsx if it exists, if not create it
  const source = loadProjectFile(directory, filepath);

  //import type { ServerPageProps, AdminConfigProps } from 'stackpress/view/client';
  source.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: 'stackpress/view/client',
    namedImports: [ 'ServerPageProps', 'SessionPermission' ]
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
  //import type { ProfileExtended } from '../../types.js';
  source.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: '../../types.js',
    namedImports: [ model.name.toTypeName('%sExtended') ]
  });
  //import { useLanguage } from 'r22n';
  source.addImportDeclaration({
    moduleSpecifier: 'r22n',
    namedImports: [ 'useLanguage' ]
  });
  //import Table from 'frui/Table';
  source.addImportDeclaration({
    moduleSpecifier: 'frui/Table',
    defaultImport: 'Table'
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
  //import CreatedViewFormat from '../../components/view/CreatedViewFormat.js';
  model.component.viewFormats.toArray().forEach(column => {
    source.addImportDeclaration({
      moduleSpecifier: column.name.toPathName(
        '../../components/view/%sViewFormat.js'
      ),
      defaultImport: column.name.toComponentName('%sViewFormat')
    });
  });

  //export function AdminProfileDetailCrumbs() {}
  source.addFunction({
    isExported: true,
    name: model.name.toComponentName('Admin%sDetailCrumbs'),
    parameters: [{ 
      name: 'props', 
      type: renderCode(TEMPLATE.DETAIL_CRUMBS_PROPS, { 
        type: model.name.toTypeName('%sExtended')
      })
    }],
    statements: renderCode(TEMPLATE.DETAIL_CRUMBS_BODY, {
      search: {
        label: model.name.plural || model.name.titleCase,
        icon: model.name.icon
      },
      detail: {
        label: render(model, "${results?.%s || ''}")
      }
    })
  });
  //export function AdminProfileDetailActions() {}
  source.addFunction({
    isExported: true,
    name: model.name.toComponentName('Admin%sDetailActions'),
    parameters: [{ 
      name: 'props', 
      type: renderCode(TEMPLATE.DETAIL_ACTIONS_PROPS, { 
        type: model.name.toTypeName('%sExtended') 
      }) 
    }],
    statements: renderCode(TEMPLATE.DETAIL_ACTIONS_BODY, {
      update: link('update'),
      remove: link('remove'),
      restore: link('restore')
    })
  });
  //export function AdminProfileDetailResults() {}
  source.addFunction({
    isExported: true,
    name: model.name.toComponentName('Admin%sDetailResults'),
    parameters: [{ 
      name: 'props', 
      type: renderCode(
        `{ results: <%type%> }`, 
        { type: model.name.toTypeName('%sExtended') } 
      )
    }],
    statements: renderCode(TEMPLATE.DETAIL_RESULTS_BODY, {
      rows: model.component.viewFormats.toArray().map(column => {
        return renderCode(TEMPLATE.DETAIL_RESULTS_ROW, {
          label: column.name.label,
          value: column.type.required
            ? renderCode(TEMPLATE.DETAIL_RESULTS_VALUE_REQUIRED, { 
              component: column.name.toComponentName('%sViewFormat'),
              name: column.name.toString()
            })
            : renderCode(TEMPLATE.DETAIL_RESULTS_VALUE_OPTIONAL, {
              component: column.name.toComponentName('%sViewFormat'),
              name: column.name.toString()
            })
        });
      }).join('\n')
    })
  });
  //export function AdminProfileDetailBody() {}
  source.addFunction({
    isExported: true,
    name: model.name.toComponentName('Admin%sDetailBody'),
    statements: renderCode(TEMPLATE.DETAIL_BODY, {
      type: model.name.toTypeName('%sExtended'),
      crumbs: model.name.toComponentName('Admin%sDetailCrumbs'),
      actions: model.name.toComponentName('Admin%sDetailActions'),
      results: model.name.toComponentName('Admin%sDetailResults')
    })
  });
  //export function AdminProfileDetailHead() {}
  source.addFunction({
    isExported: true,
    name: model.name.toComponentName('Admin%sDetailHead'),
    parameters: [{ 
      name: 'props', 
      type: 'ServerPageProps<AdminConfigProps>'
    }],
    statements: renderCode(TEMPLATE.DETAIL_HEAD, { 
      name: model.name.singular 
    })
  });
  //export function AdminProfileDetailPage() {}
  source.addFunction({
    isExported: true,
    name: model.name.toComponentName('Admin%sDetailPage'),
    parameters: [{ 
      name: 'props', 
      type: 'ServerPageProps<AdminConfigProps>'
    }],
    statements: renderCode(TEMPLATE.DETAIL_PAGE, { 
      component: model.name.toComponentName('Admin%sDetailBody')
    })
  });
  //export const Head = AdminProfileDetailHead;
  source.addVariableStatement({
    isExported: true,
    declarationKind: VariableDeclarationKind.Const,
    declarations: [{
      name: 'Head',
      initializer: `${model.name.toComponentName('Admin%sDetailHead')}`
    }]
  });
  //export default AdminProfileDetailPage;
  source.addStatements(
    `export default ${model.name.toComponentName('Admin%sDetailPage')};`
  );
};

export const TEMPLATE = {

DETAIL_CRUMBS_PROPS:
'{ base: string, results: <%type%> }',

DETAIL_CRUMBS_BODY:
`//props
const { results } = props;
//hooks
const { _ } = useLanguage();
return (
  <Bread crumb={({ active }) => active ? 'font-bold' : 'font-normal'}>
    <Bread.Slicer>
      <i className="icon fas fa-fw fa-chevron-right frui-block frui-tx-md"></i>
    </Bread.Slicer>
    <Bread.Crumb icon="<%search.icon%>" className="admin-crumb" href="../search">
      {_('<%search.label%>')}
    </Bread.Crumb>
    <Bread.Crumb>
      {_(\`<%detail.label%>\`)}
    </Bread.Crumb>
  </Bread>
);`,

DETAIL_ACTIONS_PROPS:
`{
  base: string,
  results: <%type%>,
  can: (...permits: SessionPermission[]) => boolean,
}`,

DETAIL_ACTIONS_BODY:
`const { base, results, can } = props;
const { _ } = useLanguage();
const routes = {
  update: { 
    method: 'GET', 
    route: <%update%>
  },
  remove: { 
    method: 'GET', 
    route: <%remove%>
  },
  restore: { 
    method: 'GET', 
    route: <%restore%>
  },
};
return (
  <div className="actions">
    {can(routes.update) && (
      <a className="action update" href={routes.update.route}>
        <i className="icon fas fa-edit"></i>
        {_('Update')}
      </a>
    )}
    {results.active && can(routes.remove) && (
      <a className="action remove" href={routes.remove.route}>
        <i className="icon fas fa-trash"></i>
        {_('Remove')}
      </a>
    )}
    {!results.active && can(routes.restore) && (
      <a className="action restore" href={routes.restore.route}>
        <i className="icon fas fa-check-circle"></i>
        {_('Restore')}
      </a>
    )}
  </div>
);`,

DETAIL_RESULTS_VALUE_REQUIRED:
'<<%component%> data={results} value={results.<%name%>} />',

DETAIL_RESULTS_VALUE_OPTIONAL:
`{results.<%name%> ? (<<%component%> data={results} value={results.<%name%>} />) : ''}`,

DETAIL_RESULTS_ROW:
`<Table.Row>
  <Table.Col noWrap addClassName="results-label">
    {_('<%label%>')}
  </Table.Col>
  <Table.Col noWrap addClassName="results-value">
    <%value%>
  </Table.Col>
</Table.Row>`,

DETAIL_RESULTS_BODY:
`const { results } = props;
const { _ } = useLanguage();
return (
  <Table
    className="w-full"
    column={[ 'theme-bg-2', 'theme-bg-1' ]}
    head="theme-bg-3"
  >
    <%rows%>
  </Table>
);`,

DETAIL_BODY:
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
  <main className="admin-detail-page admin-page">
    <div className="admin-crumbs">
      <<%crumbs%> base={base} results={results} />
    </div>
    {response.code === 200 ? (
      <>
        <div className="admin-actions">
          <<%actions%>
            can={can} 
            base={base} 
            results={results} 
          />
        </div>
        <div className="admin-results">
          <<%results%> results={results} />
        </div>
      </>
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

DETAIL_HEAD:
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
    <title>{_('<%name%> Detail')}</title>
    {favicon && <link rel="icon" type={mimetype} href={favicon} />}
    <link rel="stylesheet" type="text/css" href="/styles/global.css" />
    {styles.map((href, index) => (
      <link key={index} rel="stylesheet" type="text/css" href={href} />
    ))}
  </>
);`,

DETAIL_PAGE:
`return (
  <LayoutAdmin {...props}>
    <<%component%> />
  </LayoutAdmin>
);`

};