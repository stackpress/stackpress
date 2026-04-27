//modules
import type { Directory } from 'ts-morph';
import { VariableDeclarationKind } from 'ts-morph';
//stackpress-schema
import type Model from 'stackpress-schema/Model';
import { 
  loadProjectFile, 
  renderCode 
} from 'stackpress-schema/transform/helpers';
//stackpress-admin
import { render } from '../helpers.js';
import generateCreate from './detail/create.js';
import generateSearch from './detail/search.js';

export default function generate(directory: Directory, model: Model) {
  const ids = model.store.ids.toArray().map(column => column.name);

  const relations = model.columns.filter(
    column => Boolean(column.type.model && column.store.foreignRelationship)
  ).map(column => column.store.foreignRelationship!).toArray();
  const related = model.columns.filter(
    column => Boolean(
      column.type.model 
        && column.store.localRelationship
        && column.store.localRelationship.foreign.type === 2
    )
  ).map(column => column.store.localRelationship!).toArray();

  //------------------------------------------------------------------//
  // Profile/admin/views/Auth/create.tsx
  // Profile/admin/views/Auth/search.tsx

  for (const relationship of related) {
    generateCreate(directory, model, relationship);
    generateSearch(directory, model, relationship);
  }

  //------------------------------------------------------------------//
  // Profile/admin/views/detail.tsx

  const filepath = model.name.toPathName('%s/admin/views/detail.tsx');
  //load Profile/admin/views/detail.tsx if it exists, if not create it
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
  //import Table from 'frui/Table';
  source.addImportDeclaration({
    moduleSpecifier: 'frui/Table',
    defaultImport: 'Table'
  });

  //------------------------------------------------------------------//
  // Import Stackpress

  //import type { SessionPermission } from 'stackpress-session/types';
  source.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: 'stackpress-session/types',
    namedImports: [ 'SessionPermission' ]
  });
  //import type { 
  //  AdminConfigProps, 
  //  AdminPageProps, 
  //  SearchQuery 
  //} from 'stackpress-admin/client/types';
  source.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: 'stackpress-admin/client/types',
    namedImports: [ 
      'AdminConfigProps', 
      'AdminPageProps',
      'SearchQuery'
    ]
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

  //import type { ProfileExtended } from '../../types.js';
  source.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: '../../types.js',
    namedImports: [ model.name.toTypeName('%sExtended') ]
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

  //------------------------------------------------------------------//
  // Exports

  //export type AdminProfileDetailCrumbsProps = {};
  source.addTypeAlias({
    isExported: true,
    name: model.name.toComponentName('%sAdminDetailCrumbsProps'),
    type: renderCode(`{ 
      base: string, 
      results: <%type%>, 
      can: (...permits: SessionPermission[]) => boolean 
    }`, { 
      type: model.name.toTypeName('%sExtended')
    })
  });
  //export type AdminProfileDetailActionsProps = {};
  source.addTypeAlias({
    isExported: true,
    name: model.name.toComponentName('%sAdminDetailActionsProps'),
    type: renderCode(`{
      base: string,
      results: <%type%>,
      can: (...permits: SessionPermission[]) => boolean,
    }`, { 
      type: model.name.toTypeName('%sExtended') 
    }) 
  });
  //export type AdminProfileDetailTabsProps = {};
  source.addTypeAlias({
    isExported: true,
    name: model.name.toComponentName('%sAdminDetailTabsProps'),
    type: renderCode(`{
      base: string,
      results: <%type%>,
      can: (...permits: SessionPermission[]) => boolean,
    }`, { 
      type: model.name.toTypeName('%sExtended') 
    }) 
  });
  //export type AdminProfileDetailResultsProps = {};
  source.addTypeAlias({
    isExported: true,
    name: model.name.toComponentName('%sAdminDetailResultsProps'),
    type: renderCode(`{ 
      base: string, 
      results: <%type%>, 
      can: (...permits: SessionPermission[]) => boolean 
    }`, { 
      type: model.name.toTypeName('%sExtended') 
    })
  });
  //export type AdminProfileDetailHeadProps = AdminPageProps;
  source.addTypeAlias({
    isExported: true,
    name: model.name.toComponentName('%sAdminDetailHeadProps'),
    type: 'AdminPageProps'
  });
  //export type AdminProfileDetailPageProps = AdminPageProps;
  source.addTypeAlias({
    isExported: true,
    name: model.name.toComponentName('%sAdminDetailPageProps'),
    type: 'AdminPageProps'
  });

  //export function AdminProfileDetailCrumbs() {}
  source.addFunction({
    isExported: true,
    name: model.name.toComponentName('%sAdminDetailCrumbs'),
    parameters: [{ 
      name: 'props', 
      type: model.name.toComponentName('%sAdminDetailCrumbsProps')
    }],
    statements: renderCode(TEMPLATE.DETAIL_CRUMBS_BODY, {
      search: {
        label: model.name.plural || model.name.titleCase,
        icon: model.name.icon,
        href: renderCode('`${base}/<%model%>/search`', { 
          model: model.name.toURLPath()
        })
      },
      detail: {
        label: render(model, "${results?.%s || _('Detail')}")
      }
    })
  });
  //export function AdminProfileDetailActions() {}
  source.addFunction({
    isExported: true,
    name: model.name.toComponentName('%sAdminDetailActions'),
    parameters: [{ 
      name: 'props', 
      type: model.name.toComponentName('%sAdminDetailActionsProps')
    }],
    statements: renderCode(TEMPLATE.DETAIL_ACTIONS_BODY, {
      active: model.store.active ? model.store.active.name.toString() : null,
      copy: renderCode('`${base}/<%model%>/create/<%ids%>`', {
        model: model.name.toURLPath(),
        ids: ids.map(name => `\${results.${name}}`).join('/')
      }),
      update: renderCode('`${base}/<%model%>/update/<%ids%>`', { 
        model: model.name.toURLPath(),
        ids: ids.map(name => `\${results.${name}}`).join('/')
      }),
      remove: renderCode('`${base}/<%model%>/remove/<%ids%>`', { 
        model: model.name.toURLPath(),
        ids: ids.map(name => `\${results.${name}}`).join('/')
      }),
      restore: renderCode('`${base}/<%model%>/restore/<%ids%>`', { 
        model: model.name.toURLPath(),
        ids: ids.map(name => `\${results.${name}}`).join('/')
      })
    })
  });
  //export function AdminProfileDetailTabs() {}
  source.addFunction({
    isExported: true,
    name: model.name.toComponentName('%sAdminDetailTabs'),
    parameters: related.length > 0 ?[{ 
      name: 'props', 
      type: model.name.toComponentName('%sAdminDetailTabsProps')
    }] : [],
    statements: renderCode(TEMPLATE.DETAIL_TABS, {
      //where this model is 1, get the many relations...
      //NOTE: in related, the local model is the foreign 
      // model, and the foreign model is this model
      related: related.map(related => ({
        label: related.foreign.column.attributes.value<string>('label')
          || related.local.model.name.plural 
          || related.local.model.name.singular
          || related.local.model.name.titleCase,
        link: renderCode('`${base}/<%model%>/detail/<%ids%>/<%relation%>/search`', { 
          model: model.name.toURLPath(),
          ids: ids.map(name => `\${results.${name}}`).join('/'),
          relation: related.foreign.column.name.toURLPath()
        })
      }))
    })
  });
  //export function AdminProfileDetailResults() {}
  source.addFunction({
    isExported: true,
    name: model.name.toComponentName('%sAdminDetailResults'),
    parameters: [{ 
      name: 'props', 
      type: model.name.toComponentName('%sAdminDetailResultsProps')
    }],
    statements: renderCode(TEMPLATE.DETAIL_RESULTS_BODY, {
      rows: model.component.viewFormats.toArray().map(
        (column, index) => renderCode(TEMPLATE.DETAIL_RESULTS_ROW, {
          index,
          label: column.name.label,
          value: !column.type.nullable
            ? renderCode(TEMPLATE.DETAIL_RESULTS_VALUE_REQUIRED, { 
              component: column.name.toComponentName('%sViewFormat'),
              name: column.name.toString(),
              link: (() => {
                const relation = relations.find(
                  relation => relation.local.key.name.toString() === column.name.toString()
                );
                if (relation) {
                  const fieldset = relation.foreign.model.name.dashCase;
                  const name = column.name.toString();
                  return renderCode(
                    '`${base}/<%fieldset%>/detail/${results.<%name%>}`', 
                    { fieldset, name }
                  );
                }
                return null;
              })()
            })
            : renderCode(TEMPLATE.DETAIL_RESULTS_VALUE_OPTIONAL, {
              component: column.name.toComponentName('%sViewFormat'),
              name: column.name.toString(),
              link: (() => {
                const relation = relations.find(
                  relation => relation.local.key.name.toString() === column.name.toString()
                );
                if (relation) {
                  const fieldset = relation.foreign.model.name.dashCase;
                  const name = column.name.toString();
                  return renderCode(
                    '`${base}/<%fieldset%>/detail/${results.<%name%>}`', 
                    { fieldset, name }
                  );
                }
                return null;
              })()
            })
        })).join('\n')
    })
  });
  //export function AdminProfileDetailBody() {}
  source.addFunction({
    isExported: true,
    name: model.name.toComponentName('%sAdminDetailBody'),
    statements: renderCode(TEMPLATE.DETAIL_BODY, {
      related: related.length > 0,
      type: model.name.toTypeName('%sExtended'),
      crumbs: model.name.toComponentName('%sAdminDetailCrumbs'),
      tabs: model.name.toComponentName('%sAdminDetailTabs'),
      actions: model.name.toComponentName('%sAdminDetailActions'),
      results: model.name.toComponentName('%sAdminDetailResults')
    })
  });
  //export function AdminProfileDetailHead() {}
  source.addFunction({
    isExported: true,
    name: model.name.toComponentName('%sAdminDetailHead'),
    parameters: [{ 
      name: 'props', 
      type: model.name.toComponentName('%sAdminDetailHeadProps')
    }],
    statements: renderCode(TEMPLATE.DETAIL_HEAD, { 
      name: model.name.singular 
    })
  });
  //export function AdminProfileDetailPage() {}
  source.addFunction({
    isExported: true,
    name: model.name.toComponentName('%sAdminDetailPage'),
    parameters: [{ 
      name: 'props', 
      type: model.name.toComponentName('%sAdminDetailPageProps')
    }],
    statements: renderCode(TEMPLATE.DETAIL_PAGE, { 
      component: model.name.toComponentName('%sAdminDetailBody')
    })
  });
  //export const Head = AdminProfileDetailHead;
  source.addVariableStatement({
    isExported: true,
    declarationKind: VariableDeclarationKind.Const,
    declarations: [{
      name: 'Head',
      initializer: `${model.name.toComponentName('%sAdminDetailHead')}`
    }]
  });
  //export default AdminProfileDetailPage;
  source.addStatements(
    `export default ${model.name.toComponentName('%sAdminDetailPage')};`
  );
};

//------------------------------------------------------------------//
// Templates

export const TEMPLATE = {

DETAIL_CRUMBS_BODY:
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
    <Bread.Crumb>
      {_(\`<%detail.label%>\`)}
    </Bread.Crumb>
  </Bread>
);`,

DETAIL_ACTIONS_BODY:
`//props
const { base, results, can } = props;
//hooks
const { _ } = useLanguage();
//variables
const routes = {
  copy: {
    method: 'GET',
    route: <%copy%>
  },
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
//render
return (
  <div className="actions">
    {can(routes.copy) && (
      <a className="action copy" href={routes.copy.route}>
        <i className="icon fas fa-copy"></i>
        {_('Copy')}
      </a>
    )}
    {can(routes.update) && (
      <a className="action update" href={routes.update.route}>
        <i className="icon fas fa-edit"></i>
        {_('Update')}
      </a>
    )}
    <%#?:active%>
      {results.<%active%> && can(routes.remove) && (
        <a className="action remove" href={routes.remove.route}>
          <i className="icon fas fa-trash"></i>
          {_('Remove')}
        </a>
      )}
      {!results.<%active%> && can(routes.restore) && (
        <a className="action restore" href={routes.restore.route}>
          <i className="icon fas fa-check-circle"></i>
          {_('Restore')}
        </a>
      )}
    <%|%>
      {can(routes.remove) && (
        <a className="action remove" href={routes.remove.route}>
          <i className="icon fas fa-trash"></i>
          {_('Remove')}
        </a>
      )}
    <%/?:active%>
  </div>
);`,

DETAIL_TABS:
`<%#?:related.length%>
  //props
  const { base, results, can } = props;
<%/?:related.length%>
//hooks
const { _ } = useLanguage();
//render
return (
  <div className="admin-tabs">
    <span>{_('Info')}</span>
    <%#@:related%>
      {can({ method: 'GET', route: <%link%> }) && (
        <a href={<%link%>}>{_('<%label%>')}</a>
      )}
    <%/@:related%>
  </div>
);`,

DETAIL_RESULTS_VALUE_REQUIRED:
`<%#?:link%>
  {can({ method: 'GET', route: <%link%> }) ? (
    <a className="theme-info" href={<%link%>}>
      <<%component%> data={results} value={results.<%name%>} />
    </a>
  ) : (
    <span>
      <<%component%> data={results} value={results.<%name%>} />
    </span>
  )}
<%|%>
  <<%component%> data={results} value={results.<%name%>} />
<%/?:link%>`,

DETAIL_RESULTS_VALUE_OPTIONAL:
`<%#?:link%>
  {can({ method: 'GET', route: <%link%> }) ? (
    <a className="theme-info" href={<%link%>}>
      {results.<%name%> ? (<<%component%> data={results} value={results.<%name%>} />) : ''}
    </a>
  ) : (
   <span>
     {results.<%name%> ? (<<%component%> data={results} value={results.<%name%>} />) : ''}
   </span>
  )}
<%|%>
  {results.<%name%> ? (<<%component%> data={results} value={results.<%name%>} />) : ''}
<%/?:link%>`,

DETAIL_RESULTS_ROW:
`<Table.Row index={<%index%>}>
  <Table.Col noWrap addClassName="results-label">
    {_('<%label%>')}
  </Table.Col>
  <Table.Col noWrap addClassName="results-value">
    <%value%>
  </Table.Col>
</Table.Row>`,

DETAIL_RESULTS_BODY:
`//props
const { base, can, results } = props;
//hooks
const { _ } = useLanguage();
//render
return (
  <Table
    className="w-full"
    column={[ 'admin-table-even', 'admin-table-odd' ]}
    head="admin-table-head"
  >
    <%rows%>
  </Table>
);`,

DETAIL_BODY:
`//hooks
const { _ } = useLanguage();
const { 
  config, 
  session, 
  response 
} = useServer<AdminConfigProps, SearchQuery, <%type%>>();
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
      <<%crumbs%> base={base} can={can} results={results} />
    </div>
    {response.code === 200 ? (
      <>
        <%#?:related%>
          <<%tabs%> 
            can={can} 
            base={base} 
            results={results} 
          />
        <%|%>
          <<%tabs%> />
        <%/?:related%>
        <div className="admin-tab-body">
          <div className="admin-actions">
            <<%actions%>
              can={can} 
              base={base} 
              results={results} 
            />
          </div>
          <div className="admin-results">
            <<%results%> base={base} can={can} results={results} />
          </div>
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
    <title>{_('<%name%> Detail')}</title>
    {favicon && <link rel="icon" type={mimetype} href={favicon} />}
    <link rel="stylesheet" type="text/css" href="/styles/global.css" />
    {styles.map((href, index) => (
      <link key={index} rel="stylesheet" type="text/css" href={href} />
    ))}
  </>
);`,

DETAIL_PAGE:
`//render
return (
  <LayoutAdmin {...props}>
    <<%component%> />
  </LayoutAdmin>
);`

};