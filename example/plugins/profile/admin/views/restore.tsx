import type {
  PageHeadProps,
  PageBodyProps,
  AdminDataProps,
} from "stackpress/view";
import type { SearchParams } from "stackpress/sql";
import type { AddressExtended } from "../../types";
import { useLanguage } from "r22n";
import { Crumbs, LayoutAdmin } from "stackpress/view";

export function AdminAddressRestoreCrumbs(props: {
  root: string;
  results: AddressExtended;
}) {
  const { root, results } = props;
  //hooks
  const { _ } = useLanguage();
  //variables
  const crumbs = [
    {
      label: <span className="theme-info">{_("Addresses")}</span>,
      icon: "map-marker",
      href: `${root}/address/search`,
    },
    {
      label: <span className="theme-info">{`${results?.label || ""}`}</span>,
      icon: "map-marker",
      href: `${root}/address/detail/${results.id}`,
    },
    {
      label: _("Restore"),
      icon: "check-circle",
    },
  ];
  return <Crumbs crumbs={crumbs} />;
}

export function AdminAddressRestoreForm(props: {
  root: string;
  results: AddressExtended;
}) {
  const { root, results } = props;
  const { _ } = useLanguage();
  return (
    <div>
      <div className="theme-bg-bg1 px-fs-16 px-p-20">
        <i className="px-mr-5 inline-block fas fa-fw fa-info-circle"></i>
        <strong className="font-semibold">
          {_("Are you sure you want to restore %s?", `${results?.label || ""}`)}
        </strong>
      </div>
      <div className="px-mt-20">
        <a
          className="theme-bg-muted px-px-14 px-py-10 inline-block rounded"
          href={`${root}/address/detail/${results.id}`}
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

export function AdminAddressRestoreBody(
  props: PageBodyProps<AdminDataProps, Partial<SearchParams>, AddressExtended>,
) {
  const { data, response } = props;
  const { root = "/admin" } = data.admin || {};
  const results = response.results as AddressExtended;
  //render
  return (
    <main className="flex flex-col px-h-100-0 theme-bg-bg0 relative">
      <div className="px-px-10 px-py-14 theme-bg-bg2">
        <AdminAddressRestoreCrumbs root={root} results={results} />
      </div>
      <div className="px-p-10">
        <AdminAddressRestoreForm root={root} results={results} />
      </div>
    </main>
  );
}

export function AdminAddressRestoreHead(
  props: PageHeadProps<AdminDataProps, Partial<SearchParams>, AddressExtended>,
) {
  const { data, styles = [] } = props;
  const { _ } = useLanguage();
  return (
    <>
      <title>{_("Restore Address")}</title>
      {data.icon && <link rel="icon" type="image/svg+xml" href={data.icon} />}
      <link rel="stylesheet" type="text/css" href="/styles/global.css" />
      {styles.map((href, index) => (
        <link key={index} rel="stylesheet" type="text/css" href={href} />
      ))}
    </>
  );
}

export function AdminAddressRestorePage(
  props: PageBodyProps<AdminDataProps, Partial<SearchParams>, AddressExtended>,
) {
  const { data, session, request } = props;
  const theme = request.session.theme as string | undefined;
  const {
    root = "/admin",
    name = "Admin",
    logo = "/images/logo-square.png",
    menu = [],
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
      <AdminAddressRestoreBody {...props} />
    </LayoutAdmin>
  );
}

export const Head = AdminAddressRestoreHead;
export default AdminAddressRestorePage;
