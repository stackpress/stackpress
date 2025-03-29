import type {
  PageHeadProps,
  PageBodyProps,
  AdminDataProps,
} from "stackpress/view";
import type { SearchParams } from "stackpress/sql";
import type { AddressExtended } from "../../types";
import { useLanguage } from "r22n";
import { Crumbs, LayoutAdmin } from "stackpress/view";

export function AdminAddressRemoveCrumbs(props: {
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
      label: _("Remove"),
      icon: "trash",
    },
  ];
  return <Crumbs crumbs={crumbs} />;
}

export function AdminAddressRemoveForm(props: {
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
          {_(
            "Are you sure you want to remove %s forever?",
            `${results?.label || ""}`,
          )}
        </strong>
        <br />
        <em className="px-fs-14">{_("(Thats a real long time)")}</em>
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
          className="theme-bg-error px-px-14 px-py-10 px-ml-10 inline-block rounded"
          href="?confirmed=true"
        >
          <i className="px-mr-5 inline-block fas fa-fw fa-trash"></i>
          <span>{_("Confirmed")}</span>
        </a>
      </div>
    </div>
  );
}

export function AdminAddressRemoveBody(
  props: PageBodyProps<AdminDataProps, Partial<SearchParams>, AddressExtended>,
) {
  const { data, response } = props;
  const { root = "/admin" } = data.admin || {};
  const results = response.results as AddressExtended;
  //render
  return (
    <main className="flex flex-col px-h-100-0 theme-bg-bg0 relative">
      <div className="px-px-10 px-py-14 theme-bg-bg2">
        <AdminAddressRemoveCrumbs root={root} results={results} />
      </div>
      <div className="px-p-10">
        <AdminAddressRemoveForm root={root} results={results} />
      </div>
    </main>
  );
}

export function AdminAddressRemoveHead(
  props: PageHeadProps<AdminDataProps, Partial<SearchParams>, AddressExtended>,
) {
  const { data, styles = [] } = props;
  const { _ } = useLanguage();
  return (
    <>
      <title>{_("Remove Address")}</title>
      {data.icon && <link rel="icon" type="image/svg+xml" href={data.icon} />}
      <link rel="stylesheet" type="text/css" href="/styles/global.css" />
      {styles.map((href, index) => (
        <link key={index} rel="stylesheet" type="text/css" href={href} />
      ))}
    </>
  );
}

export function AdminAddressRemovePage(
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
      <AdminAddressRemoveBody {...props} />
    </LayoutAdmin>
  );
}

export const Head = AdminAddressRemoveHead;
export default AdminAddressRemovePage;
