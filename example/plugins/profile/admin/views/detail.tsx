import type {
  PageHeadProps,
  PageBodyProps,
  AdminDataProps,
  SessionPermission,
} from "stackpress/view";
import type { SearchParams } from "stackpress/sql";
import type { AddressExtended } from "../../types";
import { useLanguage } from "r22n";
import { Table, Trow, Tcol } from "frui/element/Table";
import { Session, useStripe, Crumbs, LayoutAdmin } from "stackpress/view";
import LabelViewFormat from "../../components/views/LabelViewFormat";
import ContactViewFormat from "../../components/views/ContactViewFormat";
import EmailViewFormat from "../../components/views/EmailViewFormat";
import PhoneViewFormat from "../../components/views/PhoneViewFormat";
import UnitViewFormat from "../../components/views/UnitViewFormat";
import BuildingViewFormat from "../../components/views/BuildingViewFormat";
import StreetViewFormat from "../../components/views/StreetViewFormat";
import NeighborhoodViewFormat from "../../components/views/NeighborhoodViewFormat";
import CityViewFormat from "../../components/views/CityViewFormat";
import StateViewFormat from "../../components/views/StateViewFormat";
import RegionViewFormat from "../../components/views/RegionViewFormat";
import CountryViewFormat from "../../components/views/CountryViewFormat";
import PostalViewFormat from "../../components/views/PostalViewFormat";
import NotesViewFormat from "../../components/views/NotesViewFormat";
import ActiveViewFormat from "../../components/views/ActiveViewFormat";
import CreatedViewFormat from "../../components/views/CreatedViewFormat";
import UpdatedViewFormat from "../../components/views/UpdatedViewFormat";

export function AdminAddressDetailCrumbs(props: {
  root: string;
  results: AddressExtended;
}) {
  //props
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
      label: `${results?.label || ""}`,
      icon: "map-marker",
    },
  ];
  return <Crumbs crumbs={crumbs} />;
}

export function AdminAddressDetailActions(props: {
  root: string;
  results: AddressExtended;
  can: (...permits: SessionPermission[]) => boolean;
}) {
  const { root, results, can } = props;
  const { _ } = useLanguage();
  const routes = {
    update: {
      method: "ALL",
      route: `${root}/address/update/${results.id}`,
    },
    remove: {
      method: "ALL",
      route: `${root}/address/remove/${results.id}`,
    },
    restore: {
      method: "ALL",
      route: `${root}/address/restore/${results.id}`,
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

export function AdminAddressDetailResults(props: { results: AddressExtended }) {
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
          {_("ProfileId")}
        </Tcol>
        <Tcol noWrap className={`!theme-bc-bd2 px-p-5 ${stripe()}`}>
          {results.profileId.toString()}
        </Tcol>
      </Trow>
      ,
      <Trow>
        <Tcol
          noWrap
          className={`!theme-bc-bd2 px-p-5 font-bold ${stripe(true)}`}
        >
          {_("Label")}
        </Tcol>
        <Tcol noWrap className={`!theme-bc-bd2 px-p-5 ${stripe()}`}>
          <LabelViewFormat value={results.label} />
        </Tcol>
      </Trow>
      ,
      <Trow>
        <Tcol
          noWrap
          className={`!theme-bc-bd2 px-p-5 font-bold ${stripe(true)}`}
        >
          {_("Contact")}
        </Tcol>
        <Tcol noWrap className={`!theme-bc-bd2 px-p-5 ${stripe()}`}>
          {results.contact ? <ContactViewFormat value={results.contact} /> : ""}
        </Tcol>
      </Trow>
      ,
      <Trow>
        <Tcol
          noWrap
          className={`!theme-bc-bd2 px-p-5 font-bold ${stripe(true)}`}
        >
          {_("Email")}
        </Tcol>
        <Tcol noWrap className={`!theme-bc-bd2 px-p-5 ${stripe()}`}>
          {results.email ? <EmailViewFormat value={results.email} /> : ""}
        </Tcol>
      </Trow>
      ,
      <Trow>
        <Tcol
          noWrap
          className={`!theme-bc-bd2 px-p-5 font-bold ${stripe(true)}`}
        >
          {_("Phone")}
        </Tcol>
        <Tcol noWrap className={`!theme-bc-bd2 px-p-5 ${stripe()}`}>
          {results.phone ? <PhoneViewFormat value={results.phone} /> : ""}
        </Tcol>
      </Trow>
      ,
      <Trow>
        <Tcol
          noWrap
          className={`!theme-bc-bd2 px-p-5 font-bold ${stripe(true)}`}
        >
          {_("Unit")}
        </Tcol>
        <Tcol noWrap className={`!theme-bc-bd2 px-p-5 ${stripe()}`}>
          {results.unit ? <UnitViewFormat value={results.unit} /> : ""}
        </Tcol>
      </Trow>
      ,
      <Trow>
        <Tcol
          noWrap
          className={`!theme-bc-bd2 px-p-5 font-bold ${stripe(true)}`}
        >
          {_("Building")}
        </Tcol>
        <Tcol noWrap className={`!theme-bc-bd2 px-p-5 ${stripe()}`}>
          {results.building ? (
            <BuildingViewFormat value={results.building} />
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
          {_("Street")}
        </Tcol>
        <Tcol noWrap className={`!theme-bc-bd2 px-p-5 ${stripe()}`}>
          <StreetViewFormat value={results.street} />
        </Tcol>
      </Trow>
      ,
      <Trow>
        <Tcol
          noWrap
          className={`!theme-bc-bd2 px-p-5 font-bold ${stripe(true)}`}
        >
          {_("Neighborhood")}
        </Tcol>
        <Tcol noWrap className={`!theme-bc-bd2 px-p-5 ${stripe()}`}>
          {results.neighborhood ? (
            <NeighborhoodViewFormat value={results.neighborhood} />
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
          {_("City")}
        </Tcol>
        <Tcol noWrap className={`!theme-bc-bd2 px-p-5 ${stripe()}`}>
          <CityViewFormat value={results.city} />
        </Tcol>
      </Trow>
      ,
      <Trow>
        <Tcol
          noWrap
          className={`!theme-bc-bd2 px-p-5 font-bold ${stripe(true)}`}
        >
          {_("State")}
        </Tcol>
        <Tcol noWrap className={`!theme-bc-bd2 px-p-5 ${stripe()}`}>
          {results.state ? <StateViewFormat value={results.state} /> : ""}
        </Tcol>
      </Trow>
      ,
      <Trow>
        <Tcol
          noWrap
          className={`!theme-bc-bd2 px-p-5 font-bold ${stripe(true)}`}
        >
          {_("Region")}
        </Tcol>
        <Tcol noWrap className={`!theme-bc-bd2 px-p-5 ${stripe()}`}>
          {results.region ? <RegionViewFormat value={results.region} /> : ""}
        </Tcol>
      </Trow>
      ,
      <Trow>
        <Tcol
          noWrap
          className={`!theme-bc-bd2 px-p-5 font-bold ${stripe(true)}`}
        >
          {_("Country")}
        </Tcol>
        <Tcol noWrap className={`!theme-bc-bd2 px-p-5 ${stripe()}`}>
          <CountryViewFormat value={results.country} />
        </Tcol>
      </Trow>
      ,
      <Trow>
        <Tcol
          noWrap
          className={`!theme-bc-bd2 px-p-5 font-bold ${stripe(true)}`}
        >
          {_("Postal")}
        </Tcol>
        <Tcol noWrap className={`!theme-bc-bd2 px-p-5 ${stripe()}`}>
          <PostalViewFormat value={results.postal} />
        </Tcol>
      </Trow>
      ,
      <Trow>
        <Tcol
          noWrap
          className={`!theme-bc-bd2 px-p-5 font-bold ${stripe(true)}`}
        >
          {_("Notes")}
        </Tcol>
        <Tcol noWrap className={`!theme-bc-bd2 px-p-5 ${stripe()}`}>
          {results.notes ? <NotesViewFormat value={results.notes} /> : ""}
        </Tcol>
      </Trow>
      ,
      <Trow>
        <Tcol
          noWrap
          className={`!theme-bc-bd2 px-p-5 font-bold ${stripe(true)}`}
        >
          {_("Latitude")}
        </Tcol>
        <Tcol noWrap className={`!theme-bc-bd2 px-p-5 ${stripe()}`}>
          {results.latitude ? results.latitude.toString() : ""}
        </Tcol>
      </Trow>
      ,
      <Trow>
        <Tcol
          noWrap
          className={`!theme-bc-bd2 px-p-5 font-bold ${stripe(true)}`}
        >
          {_("Longitude")}
        </Tcol>
        <Tcol noWrap className={`!theme-bc-bd2 px-p-5 ${stripe()}`}>
          {results.longitude ? results.longitude.toString() : ""}
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

export function AdminAddressDetailBody(
  props: PageBodyProps<AdminDataProps, Partial<SearchParams>, AddressExtended>,
) {
  const { data, session, response } = props;
  const me = Session.load(session);
  const can = me.can.bind(me);
  const { root = "/admin" } = data.admin || {};
  const results = response.results as AddressExtended;
  //render
  return (
    <main className="flex flex-col px-h-100-0 theme-bg-bg0 relative">
      <div className="px-px-10 px-py-14 theme-bg-bg2">
        <AdminAddressDetailCrumbs root={root} results={results} />
      </div>
      <div className="px-w-100-0">
        <AdminAddressDetailActions can={can} root={root} results={results} />
      </div>
      <div className="flex-grow px-w-100-0 overflow-auto">
        <AdminAddressDetailResults results={results} />
      </div>
    </main>
  );
}

export function AdminAddressDetailHead(
  props: PageHeadProps<AdminDataProps, Partial<SearchParams>, AddressExtended>,
) {
  const { data, styles = [] } = props;
  const { _ } = useLanguage();
  return (
    <>
      <title>{_("Address Detail")}</title>
      {data.icon && <link rel="icon" type="image/svg+xml" href={data.icon} />}
      <link rel="stylesheet" type="text/css" href="/styles/global.css" />
      {styles.map((href, index) => (
        <link key={index} rel="stylesheet" type="text/css" href={href} />
      ))}
    </>
  );
}

export function AdminAddressDetailPage(
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
      <AdminAddressDetailBody {...props} />
    </LayoutAdmin>
  );
}

export const Head = AdminAddressDetailHead;
export default AdminAddressDetailPage;
