import type { MouseEventHandler } from "react";
import { useState } from 'react';
import { useLanguage } from "r22n";
import { Table, Thead, Trow, Tcol } from "frui/element/Table";
import Alert from "frui/element/Alert";
import Button from "frui/element/Button";
import Input from "frui/field/Input";
import type { 
  PageHeadProps, 
  PageBodyProps, 
  AdminDataProps 
} from "stackpress/view";
import { 
  //helpers
  paginate, 
  filter,
  order, 
  //hooks
  useStripe,
  //components 
  Crumbs, 
  Pagination, 
  LayoutPanel 
} from "stackpress/view";
import { ProfileExtended } from "../types";
import { SearchParams } from "stackpress/sql";

import CreatedFormat from "../components/lists/CreatedFormat";
import ImageFormat from "../components/lists/ImageFormat";
import UpdatedFormat from "../components/lists/UpdatedFormat";

export function SearchCrumbs() {
  //hooks
  const { _ } = useLanguage();
  //variables
  const crumbs = [
    {
      label: _('Profiles'),
      icon: 'user'
    }
  ];
  return (<Crumbs crumbs={crumbs} />);
}

export function SearchFilters(props: { close: MouseEventHandler<HTMLElement> }) {
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
}

export function SearchResults(props: {
  query: Partial<SearchParams>,
  results: ProfileExtended[]
}) {
  const { query, results } = props;
  const { sort = {} } = query;
  const { _ } = useLanguage();
  const stripe = useStripe('theme-bg-bg0', 'theme-bg-bg1');
  return (
    <Table>
      <Thead noWrap stickyTop className="theme-bc-bd2 theme-bg-bg2 text-left px-p-8">
        {_('ID')}
      </Thead>
      <Thead noWrap stickyTop className="theme-bc-bd2 theme-bg-bg2 text-left px-p-8">
        {_('Name')}
      </Thead>
      <Thead noWrap stickyTop className="theme-bc-bd2 theme-bg-bg2 text-left px-p-8">
        {_('Image')}
      </Thead>
      <Thead noWrap stickyTop className="theme-bc-bd2 theme-bg-bg2 text-left px-p-8">
        {_('Type')}
      </Thead>
      <Thead noWrap stickyTop className="theme-bc-bd2 theme-bg-bg2 text-right theme-info px-p-8">
        <span
          className="cursor-pointer"
          onClick={() => order('created')}
        >
          {_('Created')}
        </span>
        {!sort.created ? (
          <i className="px-ml-2 text-xs fas fa-sort"></i>
        ) : null}
        {sort.created === 'asc' ? (
          <i className="px-ml-2 text-xs fas fa-sort-up"></i>
        ) : null}
        {sort.created === 'desc' ? (
          <i className="px-ml-2 text-xs fas fa-sort-down"></i>
        ) : null}
      </Thead>
      <Thead noWrap stickyTop className="theme-bc-bd2 theme-bg-bg2 text-right theme-info px-p-8">
        <span
          className="cursor-pointer"
          onClick={() => order('updated')}
        >
          {_('Updated')}
        </span>
        {!sort.updated ? (
          <i className="px-ml-2 text-xs fas fa-sort"></i>
        ) : null}
        {sort.updated === 'asc' ? (
          <i className="px-ml-2 text-xs fas fa-sort-up"></i>
        ) : null}
        {sort.updated === 'desc' ? (
          <i className="px-ml-2 text-xs fas fa-sort-down"></i>
        ) : null}
      </Thead>
      {results.map((row, index) => (
        <Trow key={index}>
          <Tcol noWrap className={`theme-bc-bd2 text-left px-p-5 ${stripe(index)}`}>
            {row.id}
          </Tcol>
          <Tcol noWrap className={`theme-bc-bd2 text-left px-p-5 ${stripe(index)}`}>
            {row.name}
          </Tcol>
          <Tcol noWrap className={`theme-bc-bd2 text-left px-p-5 ${stripe(index)}`}>
            {row.image && (<ImageFormat value={row.image} />)}
          </Tcol>
          <Tcol noWrap className={`theme-bc-bd2 text-left px-p-5 ${stripe(index)}`}>
            <span
              className="cursor-pointer text-t-info"
              onClick={() => filter('type', row.type)}
            >
              {row.type}
            </span>
          </Tcol>
          <Tcol noWrap className={`theme-bc-bd2 text-right px-p-5 ${stripe(index)}`}>
            <CreatedFormat value={row.created.toISOString()} />
          </Tcol>
          <Tcol noWrap className={`theme-bc-bd2 text-right px-p-5 ${stripe(index)}`}>
            <UpdatedFormat value={row.created.toISOString()} />
          </Tcol>
        </Trow>
      ))}
    </Table>
  ); 
}

export function SearchBody(props: PageBodyProps<
  AdminDataProps, 
  Partial<SearchParams>, 
  ProfileExtended[]
>) {
  const {
    //data,
    session,
    request,
    response
  } = props;
  const can = (permit: string) => {
    return session.permits.includes(permit);
  };
  const { _ } = useLanguage();
  const query = request.data;
  const { skip = 0, take = 0 } = query;
  const { results = [], total = 0 } = response;
  const [ opened, open ] = useState(false);
  const page = (skip: number) => paginate('skip', skip);
  //render
  return (
    <main className="flex flex-col h-full bg-b0 relative">
      <div className="px-p-6 theme-bg-bg2 w-full">
        <SearchCrumbs />
      </div>
      <div className={`absolute top-0 bottom-0 w-64 z-40 duration-200 ${opened? 'right-0': '-right-64' }`}>
        <SearchFilters close={() => open(false)} />
      </div>
      <div className="flex items-center p-3 w-full">
        <Button 
          className="border border-b2 bg-b2 px-4 py-2" 
          type="button" 
          onClick={() => open((opened: boolean) => !opened)}
        >
          <i className="text-sm fas fa-fw fa-filter"></i>
        </Button>
        <div className="flex-grow">
          <form className="flex items-center">
            <Input className="theme-bc-bd2" />
            <Button className="theme-bc-bd2 theme-bg-bg2 border-r border-l-0 border-y px-4 py-2" type="submit">
              <i className="text-sm fas fa-fw fa-search"></i>
            </Button>
          </form>
        </div>
        {can('profile-create') && (
          <a href="create">
            <Button success>
              <i className="fas fa-plus"></i>
            </Button>
          </a>
        )}
      </div>
      <div className="flex-grow px-3 w-full relative bottom-0 overflow-auto">
        {!!results?.length && (
          <h1 className="mb-3">{_(
            'Showing %s - %s of %s',
            (skip + 1).toString(),
            (skip + results.length).toString(),
            total.toString()
          )}</h1>
        )}
        {!results?.length ? (
          <Alert info>
            <i className="fas fa-fw fa-info-circle mr-2"></i>
            {_('No results found.')}
          </Alert>
        ): (
          <SearchResults query={query} results={results} />
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
}

export default function AdminProfileSearchPage(props: PageBodyProps<
  AdminDataProps, 
  Partial<SearchParams>, 
  ProfileExtended[]
>) {
  return (
    <LayoutPanel>
      <SearchBody {...props} />
    </LayoutPanel>
  );
}

export function Head(props: PageHeadProps<
  AdminDataProps, 
  Partial<SearchParams>, 
  ProfileExtended
>) {
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
}
