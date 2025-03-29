//modules
import type { Directory } from 'ts-morph';
import { VariableDeclarationKind } from 'ts-morph';
//schema
import type Registry from '../../../schema/Registry';
import type Model from '../../../schema/spec/Model';

export default function searchPage(directory: Directory, _registry: Registry, model: Model) {
  const file = `${model.name}/admin/views/search.tsx`;
  const source = directory.createSourceFile(file, '', { overwrite: true });
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
  //import type { PageHeadProps, PageBodyProps, AdminDataProps, 
  //SessionPermission } from 'stackpress/view';
  source.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: 'stackpress/view',
    namedImports: [
      'PageHeadProps',
      'PageBodyProps',
      'AdminDataProps',
      'SessionPermission'
    ]
  });
  //import type { ProfileExtended } from '../../types';
  source.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: '../../types',
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
  //import Button from 'frui/element/Button';
  source.addImportDeclaration({
    moduleSpecifier: 'frui/element/Button',
    defaultImport: 'Button'
  });
  //import Input from 'frui/field/Input';
  source.addImportDeclaration({
    moduleSpecifier: 'frui/field/Input',
    defaultImport: 'Input'
  });
  //import { paginate, filter, order, notify, flash, Session, useStripe,
  //Crumbs, Pagination, LayoutAdmin } from 'stackpress/view';
  source.addImportDeclaration({
    moduleSpecifier: 'stackpress/view',
    namedImports: [
      'paginate',
      'filter',
      'order',
      'notify',
      'flash',
      'Session',
      'useStripe',
      'Crumbs',
      'Pagination',
      'LayoutAdmin'
    ]
  });
  //import { batchAndSend } from 'stackpress/view/import';
  source.addImportDeclaration({
    moduleSpecifier: 'stackpress/view/import',
    namedImports: [ 'batchAndSend' ]
  });
  //import CreatedListFormat from '../../components/lists/CreatedListFormat';
  model.lists.forEach(column => {
    //skip if no component
    if (typeof column.list.component !== 'string') return;
    source.addImportDeclaration({
      moduleSpecifier: `../../components/lists/${column.title}ListFormat`,
      defaultImport: `${column.title}ListFormat`
    });
  });
  //import { ActiveFilterControl } from '../../components/filters/ActiveFilter';
  model.filters.forEach(column => {
    //skip if no component
    if (typeof column.filter.component !== 'string') return;
    source.addImportDeclaration({
      moduleSpecifier: `../../components/filters/${column.title}Filter`,
      namedImports: [ `${column.title}FilterControl` ]
    });
  });
  //import { ActiveSpanControl } from '../../components/spans/ActiveSpan';
  model.spans.forEach(column => {
    //skip if no component
    if (typeof column.span.component !== 'string') return;
    source.addImportDeclaration({
      moduleSpecifier: `../../components/spans/${column.title}Span`,
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
        <aside className="theme-bg-bg2 theme-bc-bd1 flex flex-col px-w-100-0 px-h-100-0 border-r">
          <header className="theme-bg-bg3 px-px-10 px-py-14 uppercase">
            <i className="fas fa-chevron-right px-mr-10 cursor-pointer" onClick={close}></i>
            {_('Filters')}
          </header>
          <form className="flex-grow overflow-auto">
            ${Array.from(model.columns.values()).map(column => {
              if (column.filter.component) {
                return (`
                  <${column.title}FilterControl 
                    className="px-mb-20"
                    value={query.filter?.${column.name}} 
                  />
                `);
              } else if (column.span.component) {
                return (`
                  <${column.title}SpanControl 
                    className="px-mb-20"
                    value={query.span?.${column.name}} 
                  />
                `);
              }
              return '';
            }).join('\n')}
            <Button 
              className="theme-bc-bd2 theme-bg-bg2 border !px-px-14 !px-py-8 px-mr-5" 
              type="submit"
            >
              <i className="text-sm fas fa-fw fa-filter"></i>
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
        root: string,
        token: string, 
        open: (value: SetStateAction<boolean>) => void,
        can: (...permits: SessionPermission[]) => boolean,
      }`) 
    }],
    statements: (`
      const { root, token, open, can } = props;
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
        <div className="flex items-center">
          <Button 
            className="border theme-bc-bd2 theme-bg-bg2 !px-px-14 !px-py-8" 
            type="button" 
            onClick={() => open((opened: boolean) => !opened)}
          >
            <i className="text-sm fas fa-fw fa-filter"></i>
          </Button>
          <div className="flex-grow">
            ${model.searchables.length > 0 ? (`
              <form className="flex items-center">
                <Input className="!theme-bc-bd2" />
                <Button className="theme-bc-bd2 theme-bg-bg2 border-r border-l-0 border-y !px-px-14 !px-py-8" type="submit">
                  <i className="text-sm fas fa-fw fa-search"></i>
                </Button>
              </form>
            `): ''}
          </div>
          <a className="theme-white theme-bg-info px-px-16 px-py-9" href="export">
            <i className="fas fa-download"></i>
          </a>
          <Button warning type="button" className="relative !px-px-16 !px-py-9">
            <i className="cursor-pointer fas fa-upload"></i>
            <input className="cursor-pointer opacity-0 absolute px-b-0 px-l-0 px-r-0 px-t-0" type="file" onChange={upload} />
          </Button>
          {can({ method: 'ALL', route: \`\${root}/${model.dash}/create\` }) && (
            <a className="theme-white theme-bg-success px-px-16 px-py-9" href="create">
              <i className="fas fa-plus"></i>
            </a>
          )}
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
      type: ('{ query: Partial<SearchParams>, results: ProfileExtended[] }') 
    }],
    statements: (`
      const { query, results } = props;
      const { sort = {} } = query;
      const { _ } = useLanguage();
      const stripe = useStripe('theme-bg-bg0', 'theme-bg-bg1');
      return (
        <Table>
          ${model.lists.filter(
            column => column.list.method !== 'hide'
          ).map(column => column.sortable ? (`
            <Thead noWrap stickyTop className="theme-info theme-bg-bg2 !theme-bc-bd2 px-p-10 text-right">
              <span
                className="cursor-pointer"
                onClick={() => order('sort[${column.name}]')}
              >
                {_('${column.label}')}
              </span>
              {!sort.${column.name} ? (
                <i className="px-ml-2 text-xs fas fa-sort"></i>
              ) : null}
              {sort.${column.name} === 'asc' ? (
                <i className="px-ml-2 text-xs fas fa-sort-up"></i>
              ) : null}
              {sort.${column.name} === 'desc' ? (
                <i className="px-ml-2 text-xs fas fa-sort-down"></i>
              ) : null}
            </Thead>
          `): (`
            <Thead noWrap stickyTop className="!theme-bc-bd2 theme-bg-bg2 px-p-10 text-left">
              {_('${column.label}')}
            </Thead>
          `)).join('\n')}
          <Thead stickyTop stickyRight className="!theme-bc-bd2 theme-bg-bg2 px-p-10" />
          {results.map((row, index) => (
            <Trow key={index}>
              ${model.lists.filter(
                column => column.list.method !== 'hide'
              ).map(column => {
                const value = column.required && column.list.method === 'none'
                  ? `{row.${column.name}.toString()}`
                  : column.required && column.list.method !== 'none'
                  ? `<${column.title}ListFormat value={row.${column.name}} />`
                  : !column.required && column.list.method === 'none'
                  ? `{row.${column.name} ? row.${column.name}.toString() : ''}`
                  //!column.required && column.list.method !== 'none'
                  : `{row.${column.name} ? (<${column.title}ListFormat value={row.${column.name}} />) : ''}`;
                const align = column.sortable ? 'text-right' : 'text-left';
                return column.filter.method !== 'none' ? (`
                  <Tcol noWrap className={\`!theme-bc-bd2 px-p-5 ${align} \${stripe(index)}\`}>
                    <span
                      className="cursor-pointer text-t-info"
                      onClick={() => filter('type', row.${column.name})}
                    >
                      ${value}
                    </span>
                  </Tcol>
                `) : (`
                  <Tcol noWrap className={\`!theme-bc-bd2 px-p-5 ${align} \${stripe(index)}\`}>
                    ${value}
                  </Tcol>
                `);
              })}
              <Tcol stickyRight className={\`!theme-bc-bd2 px-py-5 text-center \${stripe(index)}\`}>
                <a 
                  className="theme-bg-info px-p-2" 
                  href={\`detail/\${row.id}\`}
                >
                  <i className="fas fa-fw fa-caret-right"></i>
                </a>
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
    parameters: [{ 
      name: 'props', 
      type: (`PageBodyProps<AdminDataProps, Partial<SearchParams>, ${model.title}Extended[]>`) 
    }],
    statements: (`
      //props
      const { data, session, request, response } = props;
      const { root = '/admin' } = data.admin || {};
      const me = Session.load(session);
      const can = me.can.bind(me);
      const query = request.data;
      const { skip = 0, take = 0 } = query;
      const { results = [], total = 0 } = response;
      //hooks
      const { _ } = useLanguage();
      const [ opened, open ] = useState(false);
      //handlers
      const page = (skip: number) => paginate('skip', skip);
      //render
      return (
        <main className="flex flex-col px-h-100-0 theme-bg-bg0 relative">
          <div className="px-px-10 px-py-14 theme-bg-bg2">
            <Admin${model.title}SearchCrumbs />
          </div>
          <div className={\`absolute px-t-0 px-b-0 px-w-220 px-z-10 duration-200 \${opened? 'px-r-0': 'px-r--220' }\`}>
            <Admin${model.title}SearchFilters query={query} close={() => open(false)} />
          </div>
          <div className="px-p-10">
            <Admin${model.title}SearchForm root={root} token={session.token} open={open} can={can} />
          </div>
          {!!results?.length && (
            <h1 className="px-px-10 px-mb-10">{_(
              'Showing %s - %s of %s',
              (skip + 1).toString(),
              (skip + results.length).toString(),
              total.toString()
            )}</h1>
          )}
          <div className="flex-grow px-w-100-0 relative bottom-0 overflow-auto">
            {!results?.length ? (
              <Alert info>
                <i className="fas fa-fw fa-info-circle px-mr-5"></i>
                {_('No results found.')}
              </Alert>
            ): (
              <Admin${model.title}SearchResults query={query} results={results} />
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
      type: (`PageHeadProps<AdminDataProps, Partial<SearchParams>, ${model.title}Extended[]>`) 
    }],
    statements: (`
      const { data, styles = [] } = props;
      const { _ } = useLanguage();
      return (
        <>
          <title>{_('Search ${model.plural}')}</title>
          {data.icon && <link rel="icon" type="image/svg+xml" href={data.icon} />}
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
      type: (`PageBodyProps<AdminDataProps, Partial<SearchParams>, ${model.title}Extended[]>`) 
    }],
    statements: (`
      const { data, session, request } = props;
      const theme = request.session.theme as string | undefined;
      const {
        root = '/admin',
        name = 'Admin',
        logo = '/images/logo-square.png',
        menu = []
      } = data.admin;
      const path = request.url.pathname;
      return (
        <LayoutAdmin
          theme={theme} 
          brand={name}
          base={root}
          logo={logo}
          path={path} 
          menu={menu}
          session={session}
        >
          <Admin${model.title}SearchBody {...props} />
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