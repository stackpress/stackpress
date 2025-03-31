import type { ServerPageProps, SessionPermission } from "stackpress/view";
import type { AdminConfigProps } from "stackpress/admin/types";
import type { SearchParams } from "stackpress/sql";
import type { ProfileExtended } from "../../types";
import { useLanguage } from "r22n";
import { Table, Trow, Tcol } from "frui/element/Table";
import { useServer, useStripe, Crumbs, LayoutAdmin } from "stackpress/view";
import NameViewFormat from "../../components/views/NameViewFormat";
import ImageViewFormat from "../../components/views/ImageViewFormat";
import TypeViewFormat from "../../components/views/TypeViewFormat";
import ReferencesViewFormat from "../../components/views/ReferencesViewFormat";
import ActiveViewFormat from "../../components/views/ActiveViewFormat";
import CreatedViewFormat from "../../components/views/CreatedViewFormat";
import UpdatedViewFormat from "../../components/views/UpdatedViewFormat";

export function AdminProfileDetailCrumbs(props: {
  base: string;
  results: ProfileExtended;
}) {
  //props
  const { base, results } = props;
  //hooks
  const { _ } = useLanguage();
  //variables
  const crumbs = [
    {
      label: <span className="theme-info">{_("Profiles")}</span>,
      icon: "user",
      href: `${base}/profile/search`,
    },
    {
      label: `${results?.name || ""}`,
      icon: "user",
    },
  ];
  return <Crumbs crumbs={crumbs} />;
}

export function AdminProfileDetailActions(props: {
  base: string;
  results: ProfileExtended;
  can: (...permits: SessionPermission[]) => boolean;
}) {
  const { base, results, can } = props;
  const { _ } = useLanguage();
  const routes = {
    update: {
      method: "GET",
      route: `${base}/profile/update/${results.id}`,
    },
    remove: {
      method: "GET",
      route: `${base}/profile/remove/${results.id}`,
    },
    restore: {
      method: "GET",
      route: `${base}/profile/restore/${results.id}`,
    },
  };
  return (
    <div className="text-right px-py-10 px-px-20">
      {can(routes.update) && (
        <a
          className="theme-white theme-bg-warning px-fs-12 px-ml-10 px-px-10 px-py-8 inline-block rounded"
          href={routes.update.route}
        >
          <i className="fas fa-edit px-mr-8"></i>
          {_("Update")}
        </a>
      )}
      {results.active && can(routes.remove) && (
        <a
          className="theme-white theme-bg-error px-fs-12 px-ml-10 px-px-10 px-py-8 inline-block rounded"
          href={routes.remove.route}
        >
          <i className="fas fa-trash px-mr-8"></i>
          {_("Remove")}
        </a>
      )}
      {!results.active && can(routes.restore) && (
        <a
          className="theme-white theme-bg-success px-fs-12 px-ml-10 px-px-10 px-py-8 inline-block rounded"
          href={routes.restore.route}
        >
          <i className="fas fa-check-circle px-mr-8"></i>
          {_("Restore")}
        </a>
      )}
    </div>
  );
}

export function AdminProfileDetailResults(props: { results: ProfileExtended }) {
  const { results } = props;
  const { _ } = useLanguage();
  const stripe = useStripe("theme-bg-bg0", "theme-bg-bg1");
  return (
    <Table>
      <Trow>
        <Tcol
          noWrap
          className={`!theme-bc-bd2 px-p-5 font-bold ${stripe(true)}`}
        >
          {_("Id")}
        </Tcol>
        <Tcol noWrap className={`!theme-bc-bd2 px-p-5 ${stripe()}`}>
          {results.id.toString()}
        </Tcol>
      </Trow>
      ,
      <Trow>
        <Tcol
          noWrap
          className={`!theme-bc-bd2 px-p-5 font-bold ${stripe(true)}`}
        >
          {_("Name")}
        </Tcol>
        <Tcol noWrap className={`!theme-bc-bd2 px-p-5 ${stripe()}`}>
          <NameViewFormat value={results.name} />
        </Tcol>
      </Trow>
      ,
      <Trow>
        <Tcol
          noWrap
          className={`!theme-bc-bd2 px-p-5 font-bold ${stripe(true)}`}
        >
          {_("Image")}
        </Tcol>
        <Tcol noWrap className={`!theme-bc-bd2 px-p-5 ${stripe()}`}>
          {results.image ? <ImageViewFormat value={results.image} /> : ""}
        </Tcol>
      </Trow>
      ,
      <Trow>
        <Tcol
          noWrap
          className={`!theme-bc-bd2 px-p-5 font-bold ${stripe(true)}`}
        >
          {_("Type")}
        </Tcol>
        <Tcol noWrap className={`!theme-bc-bd2 px-p-5 ${stripe()}`}>
          <TypeViewFormat value={results.type} />
        </Tcol>
      </Trow>
      ,
      <Trow>
        <Tcol
          noWrap
          className={`!theme-bc-bd2 px-p-5 font-bold ${stripe(true)}`}
        >
          {_("Roles")}
        </Tcol>
        <Tcol noWrap className={`!theme-bc-bd2 px-p-5 ${stripe()}`}>
          {results.roles.toString()}
        </Tcol>
      </Trow>
      ,
      <Trow>
        <Tcol
          noWrap
          className={`!theme-bc-bd2 px-p-5 font-bold ${stripe(true)}`}
        >
          {_("Tags")}
        </Tcol>
        <Tcol noWrap className={`!theme-bc-bd2 px-p-5 ${stripe()}`}>
          {results.tags.toString()}
        </Tcol>
      </Trow>
      ,
      <Trow>
        <Tcol
          noWrap
          className={`!theme-bc-bd2 px-p-5 font-bold ${stripe(true)}`}
        >
          {_("References")}
        </Tcol>
        <Tcol noWrap className={`!theme-bc-bd2 px-p-5 ${stripe()}`}>
          {results.references ? (
            <ReferencesViewFormat value={results.references} />
          ) : (
            ""
          )}
        </Tcol>
      </Trow>
      ,
      <Trow>
        <Tcol
          noWrap
          className={`!theme-bc-bd2 px-p-5 font-bold ${stripe(true)}`}
        >
          {_("Active")}
        </Tcol>
        <Tcol noWrap className={`!theme-bc-bd2 px-p-5 ${stripe()}`}>
          <ActiveViewFormat value={results.active} />
        </Tcol>
      </Trow>
      ,
      <Trow>
        <Tcol
          noWrap
          className={`!theme-bc-bd2 px-p-5 font-bold ${stripe(true)}`}
        >
          {_("Created")}
        </Tcol>
        <Tcol noWrap className={`!theme-bc-bd2 px-p-5 ${stripe()}`}>
          <CreatedViewFormat value={results.created} />
        </Tcol>
      </Trow>
      ,
      <Trow>
        <Tcol
          noWrap
          className={`!theme-bc-bd2 px-p-5 font-bold ${stripe(true)}`}
        >
          {_("Updated")}
        </Tcol>
        <Tcol noWrap className={`!theme-bc-bd2 px-p-5 ${stripe()}`}>
          <UpdatedViewFormat value={results.updated} />
        </Tcol>
      </Trow>
    </Table>
  );
}

export function AdminProfileDetailBody() {
  const { config, session, response } = useServer<
    AdminConfigProps,
    Partial<SearchParams>,
    ProfileExtended
  >();
  const can = session.can.bind(session);
  const base = config.path("admin.base", "/admin");
  const results = response.results as ProfileExtended;
  //render
  return (
    <main className="flex flex-col px-h-100-0 theme-bg-bg0 relative">
      <div className="px-px-10 px-py-14 theme-bg-bg2">
        <AdminProfileDetailCrumbs base={base} results={results} />
      </div>
      <div className="px-w-100-0">
        <AdminProfileDetailActions can={can} base={base} results={results} />
      </div>
      <div className="flex-grow px-w-100-0 overflow-auto">
        <AdminProfileDetailResults results={results} />
      </div>
    </main>
  );
}

export function AdminProfileDetailHead(
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
      <title>{_("Profile Detail")}</title>
      {favicon && <link rel="icon" type={mimetype} href={favicon} />}
      <link rel="stylesheet" type="text/css" href="/styles/global.css" />
      {styles.map((href, index) => (
        <link key={index} rel="stylesheet" type="text/css" href={href} />
      ))}
    </>
  );
}

export function AdminProfileDetailPage(
  props: ServerPageProps<AdminConfigProps>,
) {
  return (
    <LayoutAdmin {...props}>
      <AdminProfileDetailBody />
    </LayoutAdmin>
  );
}

export const Head = AdminProfileDetailHead;
export default AdminProfileDetailPage;
