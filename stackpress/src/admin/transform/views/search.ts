//modules
import type { Directory } from 'ts-morph';
import { VariableDeclarationKind } from 'ts-morph';
//schema
import type Registry from '../../../schema/Registry.js';
import type Model from '../../../schema/spec/Model.js';

export default function searchView(directory: Directory, _registry: Registry, model: Model) {
  const file = `${model.name}/admin/views/search.tsx`;
  const source = directory.createSourceFile(file, '', { overwrite: true });
  const ids = model.ids.map(column => column.name);
  const path = ids.map(name => `\${row.${name}}`).join('/');
  //import 'frui/frui.css';
  //import 'stackpress/fouc.css';

  //import type { ChangeEvent, MouseEventHandler, SetStateAction } from 'react';
  source.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: 'react',
    namedImports: [ 'ChangeEvent', 'MouseEventHandler', 'SetStateAction' ]
  });
  //import type { SearchParams } from 'stackpress/sql';
  source.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: 'stackpress/sql',
    namedImports: [ 'SearchParams' ]
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
  //import type { ProfileExtended } from '../../types.js';
  source.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: '../../types.js',
    namedImports: [ `${model.title}Extended` ]
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
  //import { Table, Thead, Trow, Tcol } from 'frui/element/Table';
  source.addImportDeclaration({
    moduleSpecifier: 'frui/element/Table',
    namedImports: [ 'Table', 'Thead', 'Trow', 'Tcol' ]
  });
  //import Alert from 'frui/element/Alert';
  source.addImportDeclaration({
    moduleSpecifier: 'frui/element/Alert',
    defaultImport: 'Alert'
  });
  //import Button from 'frui/form/Button';
  source.addImportDeclaration({
    moduleSpecifier: 'frui/form/Button',
    defaultImport: 'Button'
  });
  //import Input from 'frui/field/Input';
  source.addImportDeclaration({
    moduleSpecifier: 'frui/field/Input',
    defaultImport: 'Input'
  });
  //import { paginate, filter, order, notify, flash, useServer, useStripe, 
  //Crumbs, Pagination, LayoutAdmin } from 'stackpress/view/client';
  source.addImportDeclaration({
    moduleSpecifier: 'stackpress/view/client',
    namedImports: [
      'paginate',  'filter',    'order',  'notify',     'flash',
      'useServer', 'useStripe', 'Crumbs', 'Pagination', 'LayoutAdmin'
    ]
  });
  //import { batchAndSend } from 'stackpress/view/import';
  source.addImportDeclaration({
    moduleSpecifier: 'stackpress/view/import',
    namedImports: [ 'batchAndSend' ]
  });
  //import CreatedListFormat from '../../components/lists/CreatedListFormat.js';
  model.lists.forEach(column => {
    //skip if no component
    if (typeof column.list.component !== 'string') return;
    source.addImportDeclaration({
      moduleSpecifier: `../../components/lists/${column.title}ListFormat.js`,
      defaultImport: `${column.title}ListFormat`
    });
  });
  //import { ActiveFilterControl } from '../../components/filters/ActiveFilter.js';
  model.filters.forEach(column => {
    //skip if no component
    if (typeof column.filter.component !== 'string') return;
    source.addImportDeclaration({
      moduleSpecifier: `../../components/filters/${column.title}Filter.js`,
      namedImports: [ `${column.title}FilterControl` ]
    });
  });
  //import { ActiveSpanControl } from '../../components/spans/ActiveSpan.js';
  model.spans.forEach(column => {
    //skip if no component
    if (typeof column.span.component !== 'string') return;
    source.addImportDeclaration({
      moduleSpecifier: `../../components/spans/${column.title}Span.js`,
      namedImports: [ `${column.title}SpanControl` ]
    });
  });

  //export function AdminProfileSearchCrumbs() {}
  source.addFunction({
    isExported: true,
    name: `Admin${model.title}SearchCrumbs`,
    statements: (`
      //hooks
      const { _ } = useLanguage();
      //variables
      const crumbs = [{
        label: _('${model.plural}'),
        icon: '${model.icon}'
      }];
      return (<Crumbs crumbs={crumbs} />);
    `)
  });
  //export function AdminProfileSearchFilters() {}
  source.addFunction({
    isExported: true,
    name: `Admin${model.title}SearchFilters`,
    parameters: [{ 
      name: 'props', 
      type: `{ 
        query: SearchParams, 
        close: MouseEventHandler<HTMLElement> 
      }` 
    }],
    statements: (`
      //props
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
            ${Array.from(model.columns.values()).map(column => {
              if (column.filter.component) {
                return (`
                  <${column.title}FilterControl 
                    className="control"
                    value={query.filter?.${column.name}} 
                  />
                `);
              } else if (column.span.component) {
                return (`
                  <${column.title}SpanControl 
                    className="control"
                    value={query.span?.${column.name}} 
                  />
                `);
              }
              return '';
            }).join('\n')}
            <Button className="submit" type="submit">
              <i className="icon fas fa-fw fa-filter"></i>
              {_('Filter')}
            </Button>
          </form>
        </aside>
      ); 
    `)
  });
  //export function AdminProfileSearchForm() {}
  source.addFunction({
    isExported: true,
    name: `Admin${model.title}SearchForm`,
    parameters: [{ 
      name: 'props', 
      type: (`{ 
        base: string,
        token: string, 
        open: (value: SetStateAction<boolean>) => void,
        can: (...permits: SessionPermission[]) => boolean
      }`) 
    }],
    statements: (`
      const { base, token, open, can } = props;
      const upload = (e: ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        //get the input
        const input = e.currentTarget;
        //get the first file
        const file = input.files?.[0];
        //skip if we can't find the file
        if (!file) return;
        //proceed to send
        batchAndSend('import', token, file, notify).then(() => {
          flash('success', 'File imported successfully');
          window.location.reload();
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
            ${model.searchables.length > 0 ? (`
              <form>
                <Input className="input" />
                <Button className="submit" type="submit">
                  <i className="icon fas fa-fw fa-search"></i>
                </Button>
              </form>
            `): ''}
          </div>
          {can({ method: 'GET', route: \`\${base}/${model.dash}/export\` }) ?(
            <Button info className="action" href="export">
              <i className="fas fa-download"></i>
            </Button>
          ): null}
          {can({ method: 'GET', route: \`\${base}/${model.dash}/import\` }) ?(
            <Button warning type="button" className="action import">
              <i className="cursor-pointer fas fa-upload"></i>
              <input className="input" type="file" onChange={upload} />
            </Button>
          ): null}
          {can({ method: 'GET', route: \`\${base}/${model.dash}/create\` }) ? (
            <Button success className="action" href="create">
              <i className="fas fa-plus"></i>
            </Button>
          ): null}
        </div>
      );  
    `)
  });
  //export function AdminProfileSearchResults() {}
  source.addFunction({
    isExported: true,
    name: `Admin${model.title}SearchResults`,
    parameters: [{ 
      name: 'props', 
      type: (`{ 
        base: string,
        query: Partial<SearchParams>, 
        results: ProfileExtended[], 
        can: (...permits: SessionPermission[]) => boolean 
      }`) 
    }],
    statements: (`
      const { can, base, query, results } = props;
      const { sort = {} } = query;
      const { _ } = useLanguage();
      const stripe = useStripe('results-row-1', 'results-row-2');
      return (
        <Table>
          ${model.lists.filter(
            column => column.list.method !== 'hide'
          ).map(column => column.sortable ? (`
            <Thead noWrap stickyTop className="results-label sortable">
              <span onClick={() => order('sort[${column.name}]')}>
                {_('${column.label}')}
              </span>
              {!sort.${column.name} ? (
                <i className="icon fas fa-sort"></i>
              ) : null}
              {sort.${column.name} === 'asc' ? (
                <i className="icon fas fa-sort-up"></i>
              ) : null}
              {sort.${column.name} === 'desc' ? (
                <i className="icon fas fa-sort-down"></i>
              ) : null}
            </Thead>
          `): (`
            <Thead noWrap stickyTop className="results-label">
              {_('${column.label}')}
            </Thead>
          `)).join('\n')}
          <Thead stickyTop stickyRight className="results-label" />
          {results.map((row, index) => (
            <Trow key={index}>
              ${model.lists.filter(
                column => column.list.method !== 'hide'
              ).map(column => {
                const value = column.required && column.list.method === 'none'
                  ? `{row.${column.name}.toString()}`
                  : column.required && column.list.method !== 'none'
                  ? `<${column.title}ListFormat data={row} value={row.${column.name}} />`
                  : !column.required && column.list.method === 'none'
                  ? `{row.${column.name} ? row.${column.name}.toString() : ''}`
                  //!column.required && column.list.method !== 'none'
                  : `{row.${column.name} ? (<${column.title}ListFormat data={row} value={row.${column.name}} />) : ''}`;
                const align = column.sortable ? 'right' : 'left';
                return column.filter.method !== 'none' ? (`
                  <Tcol noWrap className={\`results-value ${align} filterable \${stripe(index)}\`}>
                    <span onClick={() => filter('filter[${column.name}]', row.${column.name})}>
                      ${value}
                    </span>
                  </Tcol>
                `) : (`
                  <Tcol noWrap className={\`results-value ${align} \${stripe(index)}\`}>
                    ${value}
                  </Tcol>
                `);
              }).join('\n')}
              <Tcol stickyRight className={\`results-value center \${stripe(index)}\`}>
                {can({ method: 'GET', route: \`\${base}/${model.dash}/detail/${path}\`}) ? (
                  <Button info className="detail" href={\`detail/\${row.id}\`}>
                    <i className="fas fa-fw fa-caret-right"></i>
                  </Button>
                ) : null}
              </Tcol>
            </Trow>
          ))}
        </Table>
      ); 
    `)
  });
  //export function AdminProfileSearchBody() {}
  source.addFunction({
    isExported: true,
    name: `Admin${model.title}SearchBody`,
    statements: (`
      //props
      const { config, session, request, response } = useServer<${[
        'AdminConfigProps', 
        'Partial<SearchParams>', 
        `${model.title}Extended[]`
      ].join(', ')}>();
      const base = config.path('admin.base', '/admin');
      const can = session.can.bind(session);
      const query = request.data();
      const skip = query.skip || 0;
      const take = query.take || 50;
      const results = response.results as ${model.title}Extended[];
      const total = response.total || 0;
      //hooks
      const { _ } = useLanguage();
      const [ opened, open ] = useState(false);
      //handlers
      const page = (skip: number) => paginate('skip', skip);
      //render
      return (
        <main className="admin-page admin-search-page">
          <div className="admin-crumbs">
            <Admin${model.title}SearchCrumbs />
          </div>
          <div className={\`admin-filters \${opened? 'open': '' }\`}>
            <Admin${model.title}SearchFilters query={query} close={() => open(false)} />
          </div>
          <div className="admin-search-form">
            <Admin${model.title}SearchForm 
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
              <Alert info>
                <i className="no-results-icon fas fa-fw fa-info-circle"></i>
                {_('No results found.')}
              </Alert>
            ): (
              <Admin${model.title}SearchResults 
                base={base}
                can={can} 
                query={query} 
                results={results} 
              />
            )}
          </div>
          <Pagination 
            total={total} 
            take={take} 
            skip={skip} 
            paginate={page} 
          />
        </main>
      );
    `)
  });
  //export function AdminProfileSearchHead() {}
  source.addFunction({
    isExported: true,
    name: `Admin${model.title}SearchHead`,
    parameters: [{ 
      name: 'props', 
      type: 'ServerPageProps<AdminConfigProps>'
    }],
    statements: (`
      const { data, styles = [] } = props;
      const { favicon = '/favicon.ico' } = data?.brand || {};
      const { _ } = useLanguage();
      const mimetype = favicon.endsWith('.png')
        ? 'image/png'
        : favicon.endsWith('.svg')
        ? 'image/svg+xml'
        : 'image/x-icon';
      return (
        <>
          <title>{_('Search ${model.plural}')}</title>
          {favicon && <link rel="icon" type={mimetype} href={favicon} />}
          <link rel="stylesheet" type="text/css" href="/styles/global.css" />
          {styles.map((href, index) => (
            <link key={index} rel="stylesheet" type="text/css" href={href} />
          ))}
        </>
      );
    `)
  });
  //export function AdminProfileSearchPage() {}
  source.addFunction({
    isExported: true,
    name: `Admin${model.title}SearchPage`,
    parameters: [{ 
      name: 'props', 
      type: 'ServerPageProps<AdminConfigProps>'
    }],
    statements: (`
      return (
        <LayoutAdmin {...props}>
          <Admin${model.title}SearchBody />
        </LayoutAdmin>
      );
    `)
  });
  //export const Head = AdminProfileSearchHead;
  source.addVariableStatement({
    isExported: true,
    declarationKind: VariableDeclarationKind.Const,
    declarations: [{
      name: 'Head',
      initializer: `Admin${model.title}SearchHead`
    }]
  });
  //export default AdminProfileSearchPage;
  source.addStatements(`export default Admin${model.title}SearchPage;`);
}