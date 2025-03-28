//modules
import type { Directory } from 'ts-morph';
//schema
import type Model from '../../schema/spec/Model';
import type Registry from '../../schema/Registry';

export default function generate(directory: Directory, registry: Registry) {
  //loop through models
  for (const model of registry.model.values()) {
    generateSearch(directory, registry, model);
    // generateDetail(directory, registry, model);
    // generateRemove(directory, registry, model);
    // generateRestore(directory, registry, model);
    // generateSearch(directory, registry, model);
    // generateUpdate(directory, registry, model);  
  }
  
};

export function generateSearch(
  directory: Directory, 
  _registry: Registry,
  model: Model
) {
  const file = `${model.name}/admin/views/search.tsx`;
  const source = directory.createSourceFile(file, '', { overwrite: true });
  //import type { MouseEventHandler } from 'react';
  source.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: 'react',
    namedImports: [ 'MouseEventHandler' ]
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
  //import type { HeadProps, BodyProps, AdminDataProps } from 'stackpress/view';
  source.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: 'stackpress/view',
    namedImports: [ 'PageHeadProps', 'PageBodyProps', 'AdminDataProps' ]
  });
  //import { useStripe, Crumbs, Pagination, LayoutPanel } from 'stackpress/view';
  source.addImportDeclaration({
    moduleSpecifier: 'stackpress/view',
    namedImports: [ 'useStripe', 'Crumbs', 'Pagination', 'LayoutPanel' ]
  });
  //import type { ProfileInput, ProfileExtended } from '../../types';
  source.addImportDeclaration({
    moduleSpecifier: '../../types',
    namedImports: [ `${model.title}Input`, `${model.title}Extended` ]
  });
  //export function SearchCrumbs() {}
  source.addFunction({
    isExported: true,
    name: 'SearchCrumbs',
    statements: (`
      //hooks
      const { _ } = useLanguage();
      //variables
      const crumbs = [
        {
          label: _('${model.plural}'),
          icon: '${model.icon || ''}'
        }
      ];
      return (<Crumbs crumbs={crumbs} />);
    `)
  });
  //export function SearchFilters(props: { close: MouseEventHandler<HTMLElement> }) {}
  source.addFunction({
    isExported: true,
    name: 'SearchFilters',
    parameters: [{ 
      name: 'props', 
      type: `{ close: MouseEventHandler<HTMLElement> }` 
    }],
    statements: (`
      //props
      const { close } = props;
      //hooks
      const { _ } = useLanguage();
      return (
        <aside className="flex flex-col w-full h-full bg-b2 border-r border-b1">
          <header className="p-2 bg-b3 uppercase">
            <i className="fas fa-chevron-right p-2 mr-2 cursor-pointer" onClick={close}></i>
            {_('Filters')}
          </header>
          <form className="flex-grow overflow-auto">
            <div className="p-2">
              <Button info className="mt-4">
                <i className="fas fa-save mr-2"></i>
                {_('Submit')}
              </Button>
            </div>
          </form>
        </aside>
      );
    `)
  });
  //export function SearchResults(props: SearchResultsProps) {}
  source.addFunction({
    name: 'SearchResults',
    isExported: true,
    parameters: [{ 
      name: 'props', 
      type: `{
        sort: (column: string) => void;
        filter: (name: string, value: any) => void;
        results: {
          filter: Record<string, any>;
          sort: Record<string, string>;
          rows: ${model.title}Extended[] | undefined;
          total: number;
          skip: number;
          take: number;
        };
      }` 
    }],
    statements: (`
      const { sort, filter, results } = props;
      const { _ } = useLanguage();
      const stripe = useStripe('bg-b0', 'bg-b1');
      return (
        <Table>
          ${model.lists.map(column => column.sortable ? (
            `<Thead noWrap stickyTop className="!border-b2 bg-b2 text-right text-t-info p-4">
              <span
                className="cursor-pointer"
                onClick={() => sort('${column.name}')}
              >
                {_('${column.label || column.name}')}
              </span>
              {!results.sort.${column.name} ? (
                <i className="ml-1 text-xs fas fa-sort"></i>
              ) : null}
              {results.sort.${column.name} === 'asc' ? (
                <i className="ml-1 text-xs fas fa-sort-up"></i>
              ) : null}
              {results.sort.${column.name} === 'desc' ? (
                <i className="ml-1 text-xs fas fa-sort-down"></i>
              ) : null}
            </Thead>`
          ): (
            `<Thead noWrap stickyTop className="!border-b2 bg-b2 ${
              column.typemap.type === 'number' 
                || column.typemap.method === 'date' 
                ? 'text-right' 
                : 'text-left'
            } p-4">
              ${column.label || column.name}
            </Thead>`
          )).join('\n')}
          {results.rows?.map((row, index) => (
            <Trow key={index}>
              ${model.lists.map(column => {
                let value = `{row.${column.name}}`;
                if (column.list.component !== false) {
                  value = `{row.${column.name} && (<${column.title}Format value={row.${column.name}} />)}`;
                  if (column.required) {
                    value = `<${column.title}Format value={row.${column.name}} />` 
                  }
                }
                return (`
                  <Tcol noWrap className={\`!theme-bc-bd2 ${
                    column.typemap.type === 'number' 
                      || column.typemap.method === 'date' 
                      || column.sortable
                      ? 'text-right' 
                      : 'text-left'
                  } px-p-5 \${stripe(index)}\`}>
                    ${column.filter.method !== 'none' ? (
                      `<span
                        className="cursor-pointer text-t-info"
                        onClick={() => filter('${column.name}', row.${column.name})}
                      >
                        ${value}
                      </span>`
                    ): value}
                  </Tcol>
                `);
              }).join('\n')}
            </Trow>
          ))}
        </Table>
      );
    `)
  });
  //export function SearchBody() {}
  source.addFunction({
    name: 'SearchBody',
    isExported: true,
    statements: (`
      //hooks
      const { 
        _,
        can,
        handlers,
        loading,  
        results,
        opened
      } = useSearchPage();
      //render
      return (
        <main className="flex flex-col h-full bg-b0 relative">
          <div className="p-3 bg-b2 w-full">
            <SearchCrumbs />
          </div>
          <div className={\`absolute top-0 bottom-0 w-64 z-40 duration-200 \${opened? 'right-0': '-right-64' }\`}>
            <SearchFilters close={() => handlers.open(false)} />
          </div>
          <div className="flex items-center p-3 w-full">
            ${model.filters.length > 0 
              ? `<Button 
                  className="border border-b2 bg-b2 px-4 py-2" 
                  type="button" 
                  onClick={() => handlers.open((opened: boolean) => !opened)}
                >
                  <i className="text-sm fas fa-fw fa-filter"></i>
                </Button>`
              : ''
            }
            <div className="flex-grow">
              ${model.searchables.length > 0 
                ? `<form className="flex items-center">
                    <Input className="theme-bc-bd2" />
                    <Button className="theme-bc-bd2 theme-bg-bg2 border-r border-l-0 border-y px-4 py-2" type="submit">
                      <i className="text-sm fas fa-fw fa-search"></i>
                    </Button>
                  </form>`
                : ''
              }
            </div>
            {can('${model.dash}-create') && (
              <a href="create">
                <Button success>
                  ${model.searchables.length > 0  
                    ? `<i className="fas fa-plus"></i>`
                    : `<i className="fas fa-plus mr-2"></i>
                      {_('Create ${model.singular}')}`
                  }
                </Button>
              </a>
            )}
          </div>
          <div className="flex-grow px-3 w-full relative bottom-0 overflow-auto">
            {!!results.rows?.length && (
              <h1 className="mb-3">{_(
                'Showing %s - %s of %s',
                (results.skip + 1).toString(),
                (results.skip + results.rows.length).toString(),
                results.total.toString()
              )}</h1>
            )}
            {loading ? (
              <Alert info className="flex align-middle">
                <Loader show={true} />
                {_('Loading...')}
              </Alert>
            ): !results.rows?.length ? (
              <Alert info>
                <i className="fas fa-fw fa-info-circle mr-2"></i>
                {_('No results found.')}
              </Alert>
            ): (
              <SearchResults 
                results={results} 
                filter={handlers.filter} 
                sort={handlers.sort} 
              />
            )}
          </div>
          <Pagination 
            total={results.total} 
            take={results.take} 
            skip={results.skip} 
            paginate={handlers.skip} 
          />
        </main>
    );`)
  });
  //export default function AdminProfileSearchPage(props: BodyProps<AdminDataProps, Partial<ProfileInput>, ProfileExtended>) {}
  source.addFunction({
    isDefaultExport: true,
    name: 'AdminProfileSearchPage',
    parameters: [{ 
      name: 'props', 
      type: [
        'BodyProps<AdminDataProps', 
        `Partial<${model.title}Input>`, 
        `${model.title}Extended>`
      ].join(', ')
    }],
    statements: (`
      return (
        <LayoutPanel head={SearchHead} permit={['${model.dash}-search']}>
          <SearchBody />
        </LayoutPanel>
      );
    `)
  });
  //export function Head(props: HeadProps<AdminDataProps, Partial<ProfileInput>, ProfileExtended>) {}
  source.addFunction({
    isDefaultExport: true,
    name: 'Head',
    parameters: [{ 
      name: 'props', 
      type: [
        'HeadProps<AdminDataProps', 
        `Partial<${model.title}Input>`, 
        `${model.title}Extended>`
      ].join(', ')
    }],
    statements: (`
      const { data, styles = [] } = props;
      const { _ } = useLanguage();
      return (
        <>
          <title>{_('Search Profiles')}</title>
          {data.icon && <link rel="icon" type="image/svg+xml" href={data.icon} />}
          <link rel="stylesheet" type="text/css" href="/styles/global.css" />
          {styles.map((href, index) => (
            <link key={index} rel="stylesheet" type="text/css" href={href} />
          ))}
        </>
      );
    `)
  });
}