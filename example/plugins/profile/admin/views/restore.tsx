import type { ServerPageProps } from "stackpress/view";
import type { AdminConfigProps } from "stackpress/admin/types";
import type { SearchParams } from "stackpress/sql";
import type { ProfileExtended } from "../../types";
import { useLanguage } from "r22n";
import { useServer, Crumbs, LayoutAdmin } from "stackpress/view";

export function AdminProfileRestoreCrumbs(props: {
  base: string;
  results: ProfileExtended;
}) {
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
      label: <span className="theme-info">{`${results?.name || ""}`}</span>,
      icon: "user",
      href: `${base}/profile/detail/${results.id}`,
    },
    {
      label: _("Restore"),
      icon: "check-circle",
    },
  ];
  return <Crumbs crumbs={crumbs} />;
}

export function AdminProfileRestoreForm(props: {
  base: string;
  results: ProfileExtended;
}) {
  const { base, results } = props;
  const { _ } = useLanguage();
  return (
    <div>
      <div className="theme-bg-bg1 px-fs-16 px-p-20">
        <i className="px-mr-5 inline-block fas fa-fw fa-info-circle"></i>
        <strong className="font-semibold">
          {_("Are you sure you want to restore %s?", `${results?.name || ""}`)}
        </strong>
      </div>
      <div className="px-mt-20">
        <a
          className="theme-bg-muted px-px-14 px-py-10 inline-block rounded"
          href={`${base}/profile/detail/${results.id}`}
        >
          <i className="px-mr-5 inline-block fas fa-fw fa-arrow-left"></i>
          <span>Nevermind.</span>
        </a>
        <a
          className="theme-bg-success px-px-14 px-py-10 px-ml-10 inline-block rounded"
          href="?confirmed=true"
        >
          <i className="px-mr-5 inline-block fas fa-fw fa-check-circle"></i>
          <span>{_("Confirmed")}</span>
        </a>
      </div>
    </div>
  );
}

export function AdminProfileRestoreBody() {
  const { config, response } = useServer<
    AdminConfigProps,
    Partial<SearchParams>,
    ProfileExtended
  >();
  const base = config.path("admin.base", "/admin");
  const results = response.results as ProfileExtended;
  //render
  return (
    <main className="flex flex-col px-h-100-0 theme-bg-bg0 relative">
      <div className="px-px-10 px-py-14 theme-bg-bg2">
        <AdminProfileRestoreCrumbs base={base} results={results} />
      </div>
      <div className="px-p-10">
        <AdminProfileRestoreForm base={base} results={results} />
      </div>
    </main>
  );
}

export function AdminProfileRestoreHead(
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
      <title>{_("Restore Profile")}</title>
      {favicon && <link rel="icon" type={mimetype} href={favicon} />}
      <link rel="stylesheet" type="text/css" href="/styles/global.css" />
      {styles.map((href, index) => (
        <link key={index} rel="stylesheet" type="text/css" href={href} />
      ))}
    </>
  );
}

export function AdminProfileRestorePage(
  props: ServerPageProps<AdminConfigProps>,
) {
  return (
    <LayoutAdmin {...props}>
      <AdminProfileRestoreBody />
    </LayoutAdmin>
  );
}

export const Head = AdminProfileRestoreHead;
export default AdminProfileRestorePage;
