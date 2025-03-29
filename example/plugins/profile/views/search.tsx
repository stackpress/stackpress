import 'frui/frui.css';
import 'stackpress/fouc.css';

import type { ChangeEvent, MouseEventHandler, SetStateAction } from 'react';
import type { PageHeadProps, PageBodyProps, AdminDataProps, 
SessionPermission } from 'stackpress/view';
import type { SearchParams } from 'stackpress/sql';
import type { ProfileExtended } from '../types';

import { useState } from 'react';
import { useLanguage } from 'r22n';
import { Table, Thead, Trow, Tcol } from 'frui/element/Table';
import Alert from 'frui/element/Alert';
import Button from 'frui/element/Button';
import Input from 'frui/field/Input';
import { paginate, filter, order, notify, flash, Session, useStripe, 
useLocation, Crumbs, Pagination, LayoutAdmin } from 'stackpress/view';
import { batchAndSend } from 'stackpress/view/import';

import CreatedFormat from '../components/lists/CreatedFormat';
import ImageFormat from '../components/lists/ImageFormat';
import UpdatedFormat from '../components/lists/UpdatedFormat';

export function AdminProfileSearchCrumbs() {
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

export function AdminProfileSearchFilters(props: { 
  close: MouseEventHandler<HTMLElement> 
}) {
  //props
  const { close } = props;
  //hooks
  const { _ } = useLanguage();
  return (
    <aside className="theme-bg-bg2 theme-bc-bd1 flex flex-col px-w-100-0 px-h-100-0 border-r">
      <header className="theme-bg-bg3 px-px-10 px-py-14 uppercase">
        <i className="fas fa-chevron-right px-mr-10 cursor-pointer" onClick={close}></i>
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

export function AdminProfileSearchForm(props: { 
  token: string, 
  open: (value: SetStateAction<boolean>) => void,
  can: (...permits: SessionPermission[]) => boolean,
}) {
  const { token, open, can } = props;
  const url = useLocation();
  const route = url ? `${url.dirname}/create`: '/unauthorized';
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
        <form className="flex items-center">
          <Input className="!theme-bc-bd2" />
          <Button className="theme-bc-bd2 theme-bg-bg2 border-r border-l-0 border-y !px-px-14 !px-py-8" type="submit">
            <i className="text-sm fas fa-fw fa-search"></i>
          </Button>
        </form>
      </div>
      <a className="theme-white theme-bg-info px-px-16 px-py-9" href="export">
        <i className="fas fa-download"></i>
      </a>
      <Button warning type="button" className="relative !px-px-16 !px-py-9">
        <i className="cursor-pointer fas fa-upload"></i>
        <input className="cursor-pointer opacity-0 absolute px-b-0 px-l-0 px-r-0 px-t-0" type="file" onChange={upload} />
      </Button>
      {can({ method: 'ALL', route }) && (
        <a className="theme-white theme-bg-success px-px-16 px-py-9" href="create">
          <i className="fas fa-plus"></i>
        </a>
      )}
    </div>
  ); 
}

export function AdminProfileSearchResults(props: {
  query: Partial<SearchParams>,
  results: ProfileExtended[]
}) {
  const { query, results } = props;
  const { sort = {} } = query;
  const { _ } = useLanguage();
  const stripe = useStripe('theme-bg-bg0', 'theme-bg-bg1');
  return (
    <Table>
      <Thead noWrap stickyTop className="!theme-bc-bd2 theme-bg-bg2 px-p-10 text-left">
        {_('ID')}
      </Thead>
      <Thead noWrap stickyTop className="!theme-bc-bd2 theme-bg-bg2 px-p-10 text-left">
        {_('Name')}
      </Thead>
      <Thead noWrap stickyTop className="!theme-bc-bd2 theme-bg-bg2 px-p-10 text-left">
        {_('Image')}
      </Thead>
      <Thead noWrap stickyTop className="!theme-bc-bd2 theme-bg-bg2 px-p-10 text-left">
        {_('Type')}
      </Thead>
      <Thead noWrap stickyTop className="theme-info theme-bg-bg2 !theme-bc-bd2 px-p-10 text-right">
        <span
          className="cursor-pointer"
          onClick={() => order('sort[created]')}
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
      <Thead noWrap stickyTop className="theme-info theme-bg-bg2 !theme-bc-bd2 px-p-10 text-right">
        <span
          className="cursor-pointer"
          onClick={() => order('sort[updated]')}
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
      <Thead stickyTop stickyRight className="!theme-bc-bd2 theme-bg-bg2 px-p-10" />
      {results.map((row, index) => (
        <Trow key={index}>
          <Tcol noWrap className={`!theme-bc-bd2 px-p-5 text-left ${stripe(index)}`}>
            {row.id}
          </Tcol>
          <Tcol noWrap className={`!theme-bc-bd2 px-p-5 text-left ${stripe(index)}`}>
            {row.name}
          </Tcol>
          <Tcol noWrap className={`!theme-bc-bd2 px-p-5 text-left ${stripe(index)}`}>
            {row.image && (<ImageFormat value={row.image} />)}
          </Tcol>
          <Tcol noWrap className={`!theme-bc-bd2 px-p-5 text-left ${stripe(index)}`}>
            <span
              className="cursor-pointer text-t-info"
              onClick={() => filter('type', row.type)}
            >
              {row.type}
            </span>
          </Tcol>
          <Tcol noWrap className={`!theme-bc-bd2 px-p-5 text-right ${stripe(index)}`}>
            <CreatedFormat value={row.created.toString()} />
          </Tcol>
          <Tcol noWrap className={`!theme-bc-bd2 px-p-5 text-right ${stripe(index)}`}>
            <UpdatedFormat value={row.updated.toString()} />
          </Tcol>
          <Tcol stickyRight className={`!theme-bc-bd2 px-py-5 text-center ${stripe(index)}`}>
            <a 
              className="theme-bg-info px-p-2" 
              href={`detail/${row.id}`}
            >
              <i className="fas fa-fw fa-caret-right"></i>
            </a>
          </Tcol>
        </Trow>
      ))}
    </Table>
  ); 
}

export function AdminProfileSearchBody(props: PageBodyProps<
  AdminDataProps, 
  Partial<SearchParams>, 
  ProfileExtended[]
>) {
  //props
  const { session, request, response } = props;
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
        <AdminProfileSearchCrumbs />
      </div>
      <div className={`absolute px-t-0 px-b-0 px-w-220 px-z-10 duration-200 ${opened? 'px-r-0': 'px-r--220' }`}>
        <AdminProfileSearchFilters close={() => open(false)} />
      </div>
      <div className="px-p-10">
        <AdminProfileSearchForm token={session.token} open={open} can={can} />
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
          <AdminProfileSearchResults query={query} results={results} />
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

export function AdminProfileSearchHead(props: PageHeadProps<
  AdminDataProps, 
  Partial<SearchParams>, 
  ProfileExtended[]
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

export function AdminProfileSearchPage(props: PageBodyProps<
  AdminDataProps, 
  Partial<SearchParams>, 
  ProfileExtended[]
>) {
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
      <AdminProfileSearchBody {...props} />
    </LayoutAdmin>
  );
}

export const Head = AdminProfileSearchHead;
export default AdminProfileSearchPage;
