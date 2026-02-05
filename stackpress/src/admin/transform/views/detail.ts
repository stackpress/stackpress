//modules
import type { Directory } from 'ts-morph';
import { VariableDeclarationKind } from 'ts-morph';
//stackpress
import { renderCode } from '../../../helpers.js';
//stacpress/schema
import type Model from '../../../schema/model/Model.js';
//stackpress/admin
import { render } from '../helpers.js';

export default function detailView(directory: Directory, model: Model) {
  const file = model.name.toPathName('%s/admin/views/detail.tsx');
  const source = directory.createSourceFile(file, '', { overwrite: true });
  const ids = model.store.ids.toArray().map(column => column.name);
  const path = ids.map(name => `\${results.${name}}`).join('/');
  const link = (
    action: string,
    extras = ''
  ) => `\`\${base}/${model.name.dashCase}/${action}/${path}${extras}\``;
  
  //import 'frui/frui.css';
  //import 'stackpress/fouc.css';

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
  //import type { SearchParams } from 'stackpress/sql';
  source.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: 'stackpress/sql',
    namedImports: [ 'SearchParams' ]
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
  //import { Table, Trow, Tcol } from 'frui/element/Table';
  source.addImportDeclaration({
    moduleSpecifier: 'frui/element/Table',
    namedImports: [ 'Table', 'Trow', 'Tcol' ]
  });
  //import Bread from 'frui/Bread';
  source.addImportDeclaration({
    moduleSpecifier: 'frui/Bread',
    defaultImport: 'Bread'
  });
  //import { useServer, useStripe, LayoutAdmin } from 'stackpress/view/client';
  source.addImportDeclaration({
    moduleSpecifier: 'stackpress/view/client',
    namedImports: [ 'useServer', 'useStripe', 'LayoutAdmin' ]
  });
  //import CreatedViewFormat from '../../components/views/CreatedViewFormat.js';
  model.component.viewFormats.toArray().forEach(column => {
    //skip if no component
    if (!column.component.viewFormat) return;
    source.addImportDeclaration({
      moduleSpecifier: column.name.toPathName(
        '../../components/views/%sViewFormat.js'
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
        label: model.name.plural,
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
const { base, results } = props;
//hooks
const { _ } = useLanguage();
return (
  <Bread crumb={({ active }) => active ? 'font-bold' : 'font-normal'}>
    <Bread.Slicer value="›" />
    <Bread.Crumb icon="<%search.icon%>" className="admin-crumb" href="../search">
      {_('<%search.label%>')}
    </Bread.Crumb>
    <Bread.Crumb>
      {_('<%detail.label%>')}
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
`{results.<%name%>} ? (<<%component%> data={results} value={results.<%name%>} />) : ''}`,

DETAIL_RESULTS_ROW:
`<Trow>
  <Tcol noWrap addClassName="results-label">
    {_('<%label%>')}
  </Tcol>
  <Tcol noWrap addClassName="results-value">
    <%value%>
  </Tcol>
</Trow>`,

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
`const { config, session, response } = useServer<AdminConfigProps, Partial<SearchParams>, <%type%>}>();
const can = session.can.bind(session);
const base = config.path('admin.base', '/admin');
const results = response.results as <%type%>;
//render
return (
  <main className="admin-detail-page admin-page">
    <div className="admin-crumbs">
      <<%crumbs%> base={base} results={results} />
    </div>
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