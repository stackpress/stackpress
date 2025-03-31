import type { ChangeEvent, MouseEventHandler, SetStateAction } from "react";
import type { SearchParams } from "stackpress/sql";
import type { ServerPageProps, SessionPermission } from "stackpress/view";
import type { AdminConfigProps } from "stackpress/admin/types";
import type { ProfileExtended } from "../../types";
import { useState } from "react";
import { useLanguage } from "r22n";
import { Table, Thead, Trow, Tcol } from "frui/element/Table";
import Alert from "frui/element/Alert";
import Button from "frui/element/Button";
import Input from "frui/field/Input";
import {
  paginate,
  filter,
  order,
  notify,
  flash,
  useServer,
  useStripe,
  Crumbs,
  Pagination,
  LayoutAdmin,
} from "stackpress/view";
import { batchAndSend } from "stackpress/view/import";
import IdListFormat from "../../components/lists/IdListFormat";
import NameListFormat from "../../components/lists/NameListFormat";
import ImageListFormat from "../../components/lists/ImageListFormat";
import TypeListFormat from "../../components/lists/TypeListFormat";
import CreatedListFormat from "../../components/lists/CreatedListFormat";
import UpdatedListFormat from "../../components/lists/UpdatedListFormat";
import { TypeFilterControl } from "../../components/filters/TypeFilter";
import { ActiveFilterControl } from "../../components/filters/ActiveFilter";
import { CreatedSpanControl } from "../../components/spans/CreatedSpan";
import { UpdatedSpanControl } from "../../components/spans/UpdatedSpan";

export function AdminProfileSearchCrumbs() {
  //hooks
  const { _ } = useLanguage();
  //variables
  const crumbs = [
    {
      label: _("Profiles"),
      icon: "user",
    },
  ];
  return <Crumbs crumbs={crumbs} />;
}

export function AdminProfileSearchFilters(props: {
  query: SearchParams;
  close: MouseEventHandler<HTMLElement>;
}) {
  //props
  const { query, close } = props;
  //hooks
  const { _ } = useLanguage();
  return (
    <aside className="theme-bg-bg2 theme-bc-bd1 flex flex-col px-w-100-0 px-h-100-0 border-r">
      <header className="theme-bg-bg3 px-px-10 px-py-14 uppercase">
        <i
          className="fas fa-chevron-right px-mr-10 cursor-pointer"
          onClick={close}
        ></i>
        {_("Filters")}
      </header>
      <form className="flex-grow overflow-auto px-p-10">
        <TypeFilterControl className="px-mb-20" value={query.filter?.type} />

        <ActiveFilterControl
          className="px-mb-20"
          value={query.filter?.active}
        />

        <CreatedSpanControl className="px-mb-20" value={query.span?.created} />

        <UpdatedSpanControl className="px-mb-20" value={query.span?.updated} />

        <Button
          className="theme-bc-primary theme-bg-primary border !px-px-14 !px-py-8"
          type="submit"
        >
          <i className="text-sm fas fa-fw fa-filter"></i>
          {_("Filter")}
        </Button>
      </form>
    </aside>
  );
}

export function AdminProfileSearchForm(props: {
  base: string;
  token: string;
  open: (value: SetStateAction<boolean>) => void;
  can: (...permits: SessionPermission[]) => boolean;
}) {
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
    batchAndSend("import", token, file, notify).then(() => {
      flash("success", "File imported successfully");
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
          <Button
            className="theme-bc-bd2 theme-bg-bg2 border-r border-l-0 border-y !px-px-14 !px-py-8"
            type="submit"
          >
            <i className="text-sm fas fa-fw fa-search"></i>
          </Button>
        </form>
      </div>
      {can({ method: "GET", route: `${base}/profile/export` }) ? (
        <a className="theme-white theme-bg-info px-px-16 px-py-9" href="export">
          <i className="fas fa-download"></i>
        </a>
      ) : null}

      {can({ method: "GET", route: `${base}/profile/import` }) ? (
        <Button warning type="button" className="relative !px-px-16 !px-py-9">
          <i className="cursor-pointer fas fa-upload"></i>
          <input
            className="cursor-pointer opacity-0 absolute px-b-0 px-l-0 px-r-0 px-t-0"
            type="file"
            onChange={upload}
          />
        </Button>
      ) : null}
      {can({ method: "GET", route: `${base}/profile/create` }) ? (
        <a
          className="theme-white theme-bg-success px-px-16 px-py-9"
          href="create"
        >
          <i className="fas fa-plus"></i>
        </a>
      ) : null}
    </div>
  );
}

export function AdminProfileSearchResults(props: {
  base: string;
  query: Partial<SearchParams>;
  results: ProfileExtended[];
  can: (...permits: SessionPermission[]) => boolean;
}) {
  const { can, base, query, results } = props;
  const { sort = {} } = query;
  const { _ } = useLanguage();
  const stripe = useStripe("theme-bg-bg0", "theme-bg-bg1");
  return (
    <Table>
      <Thead noWrap stickyTop className="!theme-bc-bd2 theme-bg-bg2 text-left">
        {_("ID")}
      </Thead>

      <Thead noWrap stickyTop className="!theme-bc-bd2 theme-bg-bg2 text-left">
        {_("Name")}
      </Thead>

      <Thead noWrap stickyTop className="!theme-bc-bd2 theme-bg-bg2 text-left">
        {_("Image")}
      </Thead>

      <Thead noWrap stickyTop className="!theme-bc-bd2 theme-bg-bg2 text-left">
        {_("Type")}
      </Thead>

      <Thead
        noWrap
        stickyTop
        className="theme-info theme-bg-bg2 !theme-bc-bd2 text-right"
      >
        <span className="cursor-pointer" onClick={() => order("sort[created]")}>
          {_("Created")}
        </span>
        {!sort.created ? <i className="px-ml-2 text-xs fas fa-sort"></i> : null}
        {sort.created === "asc" ? (
          <i className="px-ml-2 text-xs fas fa-sort-up"></i>
        ) : null}
        {sort.created === "desc" ? (
          <i className="px-ml-2 text-xs fas fa-sort-down"></i>
        ) : null}
      </Thead>

      <Thead
        noWrap
        stickyTop
        className="theme-info theme-bg-bg2 !theme-bc-bd2 text-right"
      >
        <span className="cursor-pointer" onClick={() => order("sort[updated]")}>
          {_("Updated")}
        </span>
        {!sort.updated ? <i className="px-ml-2 text-xs fas fa-sort"></i> : null}
        {sort.updated === "asc" ? (
          <i className="px-ml-2 text-xs fas fa-sort-up"></i>
        ) : null}
        {sort.updated === "desc" ? (
          <i className="px-ml-2 text-xs fas fa-sort-down"></i>
        ) : null}
      </Thead>

      <Thead stickyTop stickyRight className="!theme-bc-bd2 theme-bg-bg2" />
      {results.map((row, index) => (
        <Trow key={index}>
          <Tcol noWrap className={`!theme-bc-bd2 text-left ${stripe(index)}`}>
            <IdListFormat value={row.id} />
          </Tcol>

          <Tcol noWrap className={`!theme-bc-bd2 text-left ${stripe(index)}`}>
            <NameListFormat value={row.name} />
          </Tcol>

          <Tcol noWrap className={`!theme-bc-bd2 text-left ${stripe(index)}`}>
            {row.image ? <ImageListFormat value={row.image} /> : ""}
          </Tcol>

          <Tcol noWrap className={`!theme-bc-bd2text-left ${stripe(index)}`}>
            <span
              className="cursor-pointer theme-info"
              onClick={() => filter("type", row.type)}
            >
              <TypeListFormat value={row.type} />
            </span>
          </Tcol>

          <Tcol noWrap className={`!theme-bc-bd2 text-right ${stripe(index)}`}>
            <CreatedListFormat value={row.created} />
          </Tcol>

          <Tcol noWrap className={`!theme-bc-bd2 text-right ${stripe(index)}`}>
            <UpdatedListFormat value={row.updated} />
          </Tcol>

          <Tcol
            stickyRight
            className={`!theme-bc-bd2 text-center ${stripe(index)}`}
          >
            {can({
              method: "GET",
              route: `${base}/profile/detail/${row.id}`,
            }) ? (
              <a className="theme-bg-info px-p-2" href={`detail/${row.id}`}>
                <i className="fas fa-fw fa-caret-right"></i>
              </a>
            ) : null}
          </Tcol>
        </Trow>
      ))}
    </Table>
  );
}

export function AdminProfileSearchBody() {
  //props
  const { config, session, request, response } = useServer<
    AdminConfigProps,
    Partial<SearchParams>,
    ProfileExtended[]
  >();
  const base = config.path("admin.base", "/admin");
  const can = session.can.bind(session);
  const query = request.data();
  const skip = query.skip || 0;
  const take = query.take || 50;
  const results = response.results as ProfileExtended[];
  const total = response.total || 0;
  //hooks
  const { _ } = useLanguage();
  const [opened, open] = useState(false);
  //handlers
  const page = (skip: number) => paginate("skip", skip);
  //render
  return (
    <main className="flex flex-col px-h-100-0 theme-bg-bg0 relative">
      <div className="px-px-10 px-py-14 theme-bg-bg2">
        <AdminProfileSearchCrumbs />
      </div>
      <div
        className={`absolute px-t-0 px-b-0 px-w-360 px-z-10 duration-200 ${opened ? "px-r-0" : "px-r--360"}`}
      >
        <AdminProfileSearchFilters query={query} close={() => open(false)} />
      </div>
      <div className="px-p-10">
        <AdminProfileSearchForm
          base={base}
          token={session.data.token}
          open={open}
          can={can}
        />
      </div>
      {!!results?.length && (
        <h1 className="px-px-10 px-mb-10">
          {_(
            "Showing %s - %s of %s",
            (skip + 1).toString(),
            (skip + results.length).toString(),
            total.toString(),
          )}
        </h1>
      )}
      <div className="flex-grow px-w-100-0 relative bottom-0 overflow-auto">
        {!results?.length ? (
          <Alert info>
            <i className="fas fa-fw fa-info-circle px-mr-5"></i>
            {_("No results found.")}
          </Alert>
        ) : (
          <AdminProfileSearchResults
            base={base}
            can={can}
            query={query}
            results={results}
          />
        )}
      </div>
      <Pagination total={total} take={take} skip={skip} paginate={page} />
    </main>
  );
}

export function AdminProfileSearchHead(
  props: ServerPageProps<AdminConfigProps>,
) {
  const { data, styles = [] } = props;
  const { favicon = "/favicon.ico" } = data?.brand || {};
  const { _ } = useLanguage();
  const mimetype = favicon.endsWith(".png")
    ? "image/png"
    : favicon.endsWith(".svg")
      ? "image/svg+xml"
      : "image/x-icon";
  return (
    <>
      <title>{_("Search Profiles")}</title>
      {favicon && <link rel="icon" type={mimetype} href={favicon} />}
      <link rel="stylesheet" type="text/css" href="/styles/global.css" />
      {styles.map((href, index) => (
        <link key={index} rel="stylesheet" type="text/css" href={href} />
      ))}
    </>
  );
}

export function AdminProfileSearchPage(
  props: ServerPageProps<AdminConfigProps>,
) {
  return (
    <LayoutAdmin {...props}>
      <AdminProfileSearchBody />
    </LayoutAdmin>
  );
}

export const Head = AdminProfileSearchHead;
export default AdminProfileSearchPage;
