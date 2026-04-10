//modules
import type { Directory } from 'ts-morph';
import { VariableDeclarationKind } from 'ts-morph';
//stackpress/schema
import type Model from '../../../schema/Model.js';
import { 
  loadProjectFile, 
  renderCode 
} from '../../../schema/transform/helpers.js';

export default function searchView(directory: Directory, model: Model) {
  const ids = model.store.ids.toArray().map(column => column.name);
  const filterable = Boolean(model.component.listFormats.find(
    column => column.store.filterable
  ));
  const sortable = Boolean(model.component.listFormats.find(
    column => column.store.sortable
  ));

  //------------------------------------------------------------------//
  // Profile/admin/views/search.tsx

  const filepath = model.name.toPathName('%s/admin/views/search.tsx');
  //load file if it exists, if not create it
  const source = loadProjectFile(directory, filepath);

  //------------------------------------------------------------------//
  // Import Modules

  //import type { ChangeEvent, MouseEventHandler, SetStateAction } from 'react';
  source.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: 'react',
    namedImports: [ 'ChangeEvent', 'MouseEventHandler', 'SetStateAction' ]
  });
  //import { useState } from 'react';
  source.addImportDeclaration({
    moduleSpecifier: 'react',
    namedImports: [ 'useState' ]
  });
  //import { useLanguage } from 'r22n';
  source.addImportDeclaration({
    moduleSpecifier: 'r22n',
    namedImports: [ 'useLanguage' ]
  });
  //import Alert from 'frui/Alert';
  source.addImportDeclaration({
    moduleSpecifier: 'frui/Alert',
    defaultImport: 'Alert'
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
  //import Input from 'frui/form/Input';
  if (model.store.searchables.size > 0) {
    source.addImportDeclaration({
      moduleSpecifier: 'frui/form/Input',
      defaultImport: 'Input'
    });
  }
  //import Pager from 'frui/Pager';
  source.addImportDeclaration({
    moduleSpecifier: 'frui/Pager',
    defaultImport: 'Pager'
  });
  //import Table from 'frui/Table';
  source.addImportDeclaration({
    moduleSpecifier: 'frui/Table',
    defaultImport: 'Table'
  });
  //import { notify, flash } from 'frui/Notifier';
  source.addImportDeclaration({
    moduleSpecifier: 'frui/Notifier',
    namedImports: [ 'notify', 'flash' ]
  });

  //------------------------------------------------------------------//
  // Import Stackpress

  //import type { StoreSearchQuery } from 'stackpress/sql/types';
  source.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: 'stackpress/sql/types',
    namedImports: [ 'StoreSearchQuery' ]
  });
  //import type { ServerPageProps, SessionPermission } from 'stackpress/view/client';
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
  //import { paginate, filter, order, useServer, 
  // LayoutAdmin } from 'stackpress/view/client';
  source.addImportDeclaration({
    moduleSpecifier: 'stackpress/view/client',
    namedImports: [
      //import filter if there are any filterables
      ...filterable ? [ 'filter' ]: [],
      //import order if there are any sortables
      ...sortable ? [ 'order' ]: [],
      'paginate',
      'useServer',
      'LayoutAdmin'
    ]
  });
  //import { batchAndSend } from 'stackpress/view/import';
  source.addImportDeclaration({
    moduleSpecifier: 'stackpress/view/import',
    namedImports: [ 'batchAndSend' ]
  });

  //------------------------------------------------------------------//
  // Import Client

  //import type { ProfileExtended } from '../../types.js';
  source.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: '../../types.js',
    namedImports: [ model.name.toTypeName('%sExtended') ]
  });
  //import CreatedListFormat from '../../components/list/CreatedListFormat.js';
  model.component.listFormats.toArray().forEach(column => {
    source.addImportDeclaration({
      moduleSpecifier: column.name.toPathName(
        '../../components/list/%sListFormat.js'
      ),
      defaultImport: column.name.toComponentName('%sListFormat')
    });
  });
  //import { ActiveFilterControl } from '../../components/filter/ActiveFilterField.js';
  model.component.filterFields.toArray().forEach(column => {
    source.addImportDeclaration({
      moduleSpecifier: column.name.toPathName(
        '../../components/filter/%sFilterField.js'
      ),
      namedImports: [ column.name.toComponentName('%sFilterFieldControl') ]
    });
  });
  //import { ActiveSpanControl } from '../../components/span/ActiveSpanField.js';
  model.component.spanFields.toArray().forEach(column => {
    source.addImportDeclaration({
      moduleSpecifier: column.name.toPathName(
        '../../components/span/%sSpanField.js'
      ),
      namedImports: [ column.name.toComponentName('%sSpanFieldControl') ]
    });
  });

  //------------------------------------------------------------------//
  // Exports

  //export type AdminProfileSearchFiltersProps = {};
  source.addTypeAlias({
    isExported: true,
    name: model.name.toTypeName('%sAdminSearchFiltersProps'),
    type: `{ 
      query: StoreSearchQuery, 
      close: MouseEventHandler<HTMLElement> 
    }` 
  });
  //export type AdminProfileSearchFormProps = {};
  source.addTypeAlias({
    isExported: true,
    name: model.name.toTypeName('%sAdminSearchFormProps'),
    type: `{ 
      base: string,
      token: string, 
      open: (value: SetStateAction<boolean>) => void,
      can: (...permits: SessionPermission[]) => boolean
    }`
  });
  //export type AdminProfileSearchResultsProps = {};
  source.addTypeAlias({
    isExported: true,
    name: model.name.toTypeName('%sAdminSearchResultsProps'),
    type: `{ 
      base: string,
      query: Partial<StoreSearchQuery>, 
      results: ${model.name.toTypeName('%sExtended')}[], 
      can: (...permits: SessionPermission[]) => boolean 
    }`
  });
  //export type AdminProfileSearchHeadProps = ServerPageProps<AdminConfigProps>;
  source.addTypeAlias({
    isExported: true,
    name: model.name.toTypeName('%sAdminSearchHeadProps'),
    type: 'ServerPageProps<AdminConfigProps>'
  });
  //export type AdminProfileSearchPageProps = ServerPageProps<AdminConfigProps>;
  source.addTypeAlias({
    isExported: true,
    name: model.name.toTypeName('%sAdminSearchPageProps'),
    type: 'ServerPageProps<AdminConfigProps>'
  });

  //export function AdminProfileSearchCrumbs() {}
  source.addFunction({
    isExported: true,
    name: model.name.toComponentName('%sAdminSearchCrumbs'),
    statements: renderCode(TEMPLATE.SEARCH_CRUMBS, {
      search: {
        label: model.name.plural || model.name.titleCase,
        icon: model.name.icon
      }
    })
  });
  //export function AdminProfileSearchFilters() {}
  source.addFunction({
    isExported: true,
    name: model.name.toComponentName('%sAdminSearchFilters'),
    parameters: [{ 
      name: 'props', 
      type: model.name.toTypeName('%sAdminSearchFiltersProps')
    }],
    statements: renderCode(TEMPLATE.SEARCH_FILTERS_BODY, {
      fields: Array.from(model.columns.values()).map(column => {
        if (column.component.filterField?.component) {
          return renderCode(TEMPLATE.SEARCH_FILTERS_FIELD, {
            component: column.name.toComponentName('%sFilterFieldControl'),
            column: column.name.toString()
          });
        } else if (column.component.spanField?.component) {
          return renderCode(TEMPLATE.SEARCH_FILTERS_FIELD, {
            component: column.name.toComponentName('%sSpanFieldControl'),
            column: column.name.toString()
          });
        }
        return '';
      }).join('\n')
    })
  });
  //export function AdminProfileSearchForm() {}
  source.addFunction({
    isExported: true,
    name: model.name.toComponentName('%sAdminSearchForm'),
    parameters: [{ 
      name: 'props', 
      type: model.name.toTypeName('%sAdminSearchFormProps')
    }],
    statements: renderCode(TEMPLATE.SEARCH_FORM_BODY, {
      searchable: model.store.searchables.size > 0,
      export: model.name.toURLPath("`${base}/%s/export`"),
      import: model.name.toURLPath("`${base}/%s/import`"),
      create: model.name.toURLPath("`${base}/%s/create`")
    })
  });
  //export function AdminProfileSearchResults() {}
  source.addFunction({
    isExported: true,
    name: model.name.toComponentName('%sAdminSearchResults'),
    parameters: [{ 
      name: 'props', 
      type: model.name.toTypeName('%sAdminSearchResultsProps')
    }],
    statements: renderCode(TEMPLATE.SEARCH_RESULTS_BODY, {
      sortable,
      headers: (
        model.component.listFormats
      ).toArray().map(column => renderCode(
        column.store.sortable 
          ? TEMPLATE.SEARCH_RESULTS_TABLE_HEAD_SORTABLE
          : TEMPLATE.SEARCH_RESULTS_TABLE_HEAD, 
        {
          label: column.name.label,
          column: column.name.toString()
        }
      )).join('\n'),
      columns: (
        model.component.listFormats
      ).toArray().map(column => renderCode(
        column.store.filterable 
          ? TEMPLATE.SEARCH_RESULTS_COLUMN_FILTERABLE
          : TEMPLATE.SEARCH_RESULTS_COLUMN, 
        {
          align: column.store.sortable ? 'right' : 'left',
          column: column.name.toString(),
          required: column.type.required,
          component: column.name.toComponentName('%sListFormat')
        }
      )).join('\n'),
      model: model.name.toURLPath(),
      path: ids.map(name => `\${row.${name}}`).join('/')
    })
  });
  //export function AdminProfileSearchBody() {}
  source.addFunction({
    isExported: true,
    name: model.name.toComponentName('%sAdminSearchBody'),
    statements: renderCode(TEMPLATE.SEARCH_BODY, {
      type: model.name.toTypeName('%sExtended[]'),
      crumbs: model.name.toComponentName('%sAdminSearchCrumbs'),
      filters: model.name.toComponentName('%sAdminSearchFilters'),
      form: model.name.toComponentName('%sAdminSearchForm'),
      results: model.name.toComponentName('%sAdminSearchResults')
    })
  });
  //export function AdminProfileSearchHead() {}
  source.addFunction({
    isExported: true,
    name: model.name.toComponentName('%sAdminSearchHead'),
    parameters: [{ 
      name: 'props', 
      type: model.name.toTypeName('%sAdminSearchHeadProps')
    }],
    statements: renderCode(TEMPLATE.SEARCH_HEAD, { 
      label: model.name.plural 
    })
  });
  //export function AdminProfileSearchPage() {}
  source.addFunction({
    isExported: true,
    name: model.name.toComponentName('%sAdminSearchPage'),
    parameters: [{ 
      name: 'props', 
      type: model.name.toTypeName('%sAdminSearchPageProps')
    }],
    statements: renderCode(TEMPLATE.SEARCH_PAGE, { 
      component: model.name.toComponentName('%sAdminSearchBody') 
    })
  });
  //export const Head = AdminProfileSearchHead;
  source.addVariableStatement({
    isExported: true,
    declarationKind: VariableDeclarationKind.Const,
    declarations: [{
      name: 'Head',
      initializer: model.name.toComponentName('%sAdminSearchHead')
    }]
  });
  //export default AdminProfileSearchPage;
  source.addStatements(
    `export default ${model.name.toComponentName('%sAdminSearchPage')};`
  );
};

//------------------------------------------------------------------//
// Templates

export const TEMPLATE = {

SEARCH_CRUMBS:
`//hooks
const { _ } = useLanguage();
return (
  <Bread crumb={({ active }) => active ? 'font-bold' : 'font-normal'}>
    <Bread.Slicer>
      <i className="icon fas fa-fw fa-chevron-right frui-block frui-tx-md"></i>
    </Bread.Slicer>
    <Bread.Crumb icon="<%search.icon%>">
      {_('<%search.label%>')}
    </Bread.Crumb>
  </Bread>
);`,

SEARCH_FILTERS_FIELD:
`<<%component%> 
  className="control"
  value={query.filter?.<%column%>} 
/>`,

SEARCH_FILTERS_BODY:
`//props
const { query, close } = props;
//hooks
const { _ } = useLanguage();
return (
  <aside>
    <header>
      <i className="icon fas fa-chevron-right" onClick={close}></i>
      {_('Filters')}
    </header>
    <form>
      <%fields%>
      <Button className="submit" type="submit">
        <i className="icon fas fa-fw fa-filter"></i>
        {_('Filter')}
      </Button>
    </form>
  </aside>
);`,

SEARCH_FORM_BODY:
`const { base, token, open, can } = props;
const upload = (e: ChangeEvent<HTMLInputElement>) => {
  e.preventDefault();
  //get the input
  const input = e.currentTarget;
  //get the first file
  const file = input.files?.[0];
  //skip if we can't find the file
  if (!file) return;
  //proceed to send
  batchAndSend('import?json', token, file, notify).then(success => {
    if (success) {
      flash('success', 'File imported successfully');
      window.location.reload();
    }
  });
  return false;
};

return (
  <div className="search">
    <Button 
      className="filter" 
      type="button" 
      onClick={() => open((opened: boolean) => !opened)}
    >
      <i className="icon fas fa-fw fa-filter"></i>
    </Button>
    <div className="form">
      <%#searchable%>
        <form>
          <Input className="input" name="q" />
          <Button className="submit" type="submit">
            <i className="icon fas fa-fw fa-search"></i>
          </Button>
        </form>
      <%/searchable%>
    </div>
    {can({ method: 'GET', route: <%export%> }) ?(
      <Button info className="action" href="export">
        <i className="fas fa-download"></i>
      </Button>
    ): null}
    {can({ method: 'GET', route: <%import%> }) ?(
      <Button warning type="button" className="action import">
        <i className="cursor-pointer fas fa-upload"></i>
        <input className="input" type="file" onChange={upload} />
      </Button>
    ): null}
    {can({ method: 'GET', route: <%create%> }) ? (
      <Button success className="action" href="create">
        <i className="fas fa-plus"></i>
      </Button>
    ): null}
  </div>
);`,

SEARCH_RESULTS_TABLE_HEAD_SORTABLE:
`<Table.Head noWrap stickyTop addClassName="results-label sortable">
  <span onClick={() => order('sort[<%column%>]')}>
    {_('<%label%>')}
  </span>
  {!sort.<%column%> ? (
    <i className="icon fas fa-sort"></i>
  ) : null}
  {sort.<%column%> === 'asc' ? (
    <i className="icon fas fa-sort-up"></i>
  ) : null}
  {sort.<%column%> === 'desc' ? (
    <i className="icon fas fa-sort-down"></i>
  ) : null}
</Table.Head>`,

SEARCH_RESULTS_TABLE_HEAD:
`<Table.Head noWrap stickyTop addClassName="results-label">
  {_('<%label%>')}
</Table.Head>`,

SEARCH_RESULTS_COLUMN_FILTERABLE:
`<Table.Col noWrap addClassName="results-value <%align%> filterable">
  <span onClick={() => filter('filter[<%column%>]', row.<%column%>)}>
    <%#required%>
      <<%component%> data={row} value={row.<%column%>} />
    <%/required%>
    <%^required%>
      {row.<%column%> ? (<<%component%> data={row} value={row.<%column%>} />) : ''}
    <%/required%>
  </span>
</Table.Col>`,

SEARCH_RESULTS_COLUMN:
`<Table.Col noWrap addClassName="results-value <%align%>">
  <%#required%>
    <<%component%> data={row} value={row.<%column%>} />
  <%/required%>
  <%^required%>
    {row.<%column%> ? (<<%component%> data={row} value={row.<%column%>} />) : ''}
  <%/required%>
</Table.Col>`,

SEARCH_RESULTS_BODY:
`<%#sortable%>
  const { can, base, query, results } = props;
  const { sort = {} } = query;
<%/sortable%>
<%^sortable%>
  const { can, base, results } = props;
<%/sortable%>
const { _ } = useLanguage();
return (
  <Table
    className="w-full"
    column={[ 'admin-table-odd', 'admin-table-even' ]}
    head="admin-table-head"
  >
    <%headers%>
    <%#path%>
      <Table.Head stickyTop stickyRight addClassName="results-label" />
    <%/path%>
    {results.map((row, index) => (
      <Table.Row key={index} index={index}>
        <%columns%>
        <%#path%>
          <Table.Col stickyRight addClassName="results-value center">
            {can({ method: 'GET', route: \`\${base}/<%model%>/detail/<%path%>\`}) ? (
              <Button info className="detail" href={\`detail/<%path%>\`}>
                <i className="fas fa-fw fa-caret-right"></i>
              </Button>
            ) : null}
          </Table.Col>
        <%/path%>
      </Table.Row>
    ))}
  </Table>
);`,

SEARCH_BODY:
`//hooks
const { _ } = useLanguage();
const { 
  config, 
  session, 
  request, 
  response 
} = useServer<AdminConfigProps, Partial<StoreSearchQuery>, <%type%>>();
const [ opened, open ] = useState(false);
//variables
const base = config.path('admin.base', '/admin');
const can = session.can.bind(session);
const query = request.data();
const skip = query.skip || 0;
const take = query.take || 50;
const results = response.results as <%type%>;
const total = response.total || 0;
//handlers
const page = (skip: number) => paginate('skip', skip);
//render
return (
  <main className="admin-page admin-search-page">
    <div className="admin-crumbs">
      <<%crumbs%> />
    </div>
    <div className={\`admin-filters \${opened? 'open': '' }\`}>
      <<%filters%> query={query} close={() => open(false)} />
    </div>
    <div className="admin-search-form">
      <<%form%>
        base={base} 
        token={session.data.token} 
        open={open} 
        can={can} 
      />
    </div>
    {!!results?.length && (
      <h1 className="admin-search-title">{_(
        'Showing %s - %s of %s',
        (skip + 1).toString(),
        (skip + results.length).toString(),
        total.toString()
      )}</h1>
    )}
    <div className="admin-search-results">
      {!results?.length ? (
        <div className="admin-no-results">
          <Alert info>
            <i className="no-results-icon fas fa-fw fa-info-circle"></i>
            {_('No results found.')}
          </Alert>
        </div>
      ): (
        <<%results%>
          base={base}
          can={can} 
          query={query} 
          results={results} 
        />
      )}
    </div>
    {total > take && (
      <div className="admin-pager">
        <Pager 
          className={({ active }) => active 
            ? 'px-w-32 px-h-32 !font-normal' 
            : 'px-w-32 px-h-32 theme-info'
          } 
          total={total} 
          skip={skip} 
          take={take}
          radius={3} 
          prev={<i className="fas fa-fw fa-backward theme-1"></i>}
          next={<i className="fas fa-fw fa-forward theme-1"></i>}
          start={<i className="fas fa-fw fa-backward-fast theme-1"></i>}
          end={<i className="fas fa-fw fa-forward-fast theme-1"></i>}
          onUpdate={page}
        />
      </div>
    )}
  </main>
);`,

SEARCH_HEAD:
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
    <title>{_('Search <%label%>')}</title>
    {favicon && <link rel="icon" type={mimetype} href={favicon} />}
    <link rel="stylesheet" type="text/css" href="/styles/global.css" />
    {styles.map((href, index) => (
      <link key={index} rel="stylesheet" type="text/css" href={href} />
    ))}
  </>
);`,

SEARCH_PAGE:
`return (
  <LayoutAdmin {...props}>
    <<%component%> />
  </LayoutAdmin>
);`

};