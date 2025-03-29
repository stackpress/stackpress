import type {
  NestedObject,
  PageHeadProps,
  PageBodyProps,
  AdminDataProps,
} from "stackpress/view";
import type { AddressInput, Address } from "../../types";
import { useLanguage } from "r22n";
import Button from "frui/element/Button";
import { Crumbs, LayoutAdmin } from "stackpress/view";
import { ProfileIdFieldControl } from "../../components/fields/ProfileIdField";
import { LabelFieldControl } from "../../components/fields/LabelField";
import { ContactFieldControl } from "../../components/fields/ContactField";
import { EmailFieldControl } from "../../components/fields/EmailField";
import { PhoneFieldControl } from "../../components/fields/PhoneField";
import { UnitFieldControl } from "../../components/fields/UnitField";
import { BuildingFieldControl } from "../../components/fields/BuildingField";
import { StreetFieldControl } from "../../components/fields/StreetField";
import { NeighborhoodFieldControl } from "../../components/fields/NeighborhoodField";
import { CityFieldControl } from "../../components/fields/CityField";
import { StateFieldControl } from "../../components/fields/StateField";
import { RegionFieldControl } from "../../components/fields/RegionField";
import { CountryFieldControl } from "../../components/fields/CountryField";
import { PostalFieldControl } from "../../components/fields/PostalField";
import { NotesFieldControl } from "../../components/fields/NotesField";

export function AdminAddressCreateCrumbs() {
  //hooks
  const { _ } = useLanguage();
  //variables
  const crumbs = [
    {
      label: <span className="theme-info">{_("Addresses")}</span>,
      icon: "user",
      href: "search",
    },
    {
      label: _("Create"),
      icon: "plus",
    },
  ];
  return <Crumbs crumbs={crumbs} />;
}

export function AdminAddressCreateForm(props: {
  input: Partial<AddressInput>;
  errors: NestedObject<string | string[]>;
}) {
  const { input, errors } = props;
  const { _ } = useLanguage();
  return (
    <form method="post">
      <ProfileIdFieldControl
        className="px-mb-20"
        value={input.profileId}
        error={errors.profileId?.toString()}
      />
      ,
      <LabelFieldControl
        className="px-mb-20"
        value={input.label}
        error={errors.label?.toString()}
      />
      ,
      <ContactFieldControl
        className="px-mb-20"
        value={input.contact}
        error={errors.contact?.toString()}
      />
      ,
      <EmailFieldControl
        className="px-mb-20"
        value={input.email}
        error={errors.email?.toString()}
      />
      ,
      <PhoneFieldControl
        className="px-mb-20"
        value={input.phone}
        error={errors.phone?.toString()}
      />
      ,
      <UnitFieldControl
        className="px-mb-20"
        value={input.unit}
        error={errors.unit?.toString()}
      />
      ,
      <BuildingFieldControl
        className="px-mb-20"
        value={input.building}
        error={errors.building?.toString()}
      />
      ,
      <StreetFieldControl
        className="px-mb-20"
        value={input.street}
        error={errors.street?.toString()}
      />
      ,
      <NeighborhoodFieldControl
        className="px-mb-20"
        value={input.neighborhood}
        error={errors.neighborhood?.toString()}
      />
      ,
      <CityFieldControl
        className="px-mb-20"
        value={input.city}
        error={errors.city?.toString()}
      />
      ,
      <StateFieldControl
        className="px-mb-20"
        value={input.state}
        error={errors.state?.toString()}
      />
      ,
      <RegionFieldControl
        className="px-mb-20"
        value={input.region}
        error={errors.region?.toString()}
      />
      ,
      <CountryFieldControl
        className="px-mb-20"
        value={input.country}
        error={errors.country?.toString()}
      />
      ,
      <PostalFieldControl
        className="px-mb-20"
        value={input.postal}
        error={errors.postal?.toString()}
      />
      ,
      <NotesFieldControl
        className="px-mb-20"
        value={input.notes}
        error={errors.notes?.toString()}
      />
      <Button
        className="theme-bc-bd2 theme-bg-bg2 border !px-px-14 !px-py-8 px-mr-5"
        type="submit"
      >
        <i className="text-sm fas fa-fw fa-save"></i>
        {_("Save")}
      </Button>
    </form>
  );
}

export function AdminAddressCreateBody(
  props: PageBodyProps<AdminDataProps, Partial<AddressInput>, Address>,
) {
  const { request, response } = props;
  const input = response.results || request.data || {};
  const errors = response.errors || {};
  //render
  return (
    <main className="flex flex-col px-h-100-0 theme-bg-bg0 relative">
      <div className="px-px-10 px-py-14 theme-bg-bg2">
        <AdminAddressCreateCrumbs />
      </div>
      <div className="px-p-10">
        <AdminAddressCreateForm errors={errors} input={input} />
      </div>
    </main>
  );
}

export function AdminAddressCreateHead(
  props: PageHeadProps<AdminDataProps, Partial<AddressInput>, Address>,
) {
  const { data, styles = [] } = props;
  const { _ } = useLanguage();
  return (
    <>
      <title>{_("Create Address")}</title>
      {data.icon && <link rel="icon" type="image/svg+xml" href={data.icon} />}
      <link rel="stylesheet" type="text/css" href="/styles/global.css" />
      {styles.map((href, index) => (
        <link key={index} rel="stylesheet" type="text/css" href={href} />
      ))}
    </>
  );
}

export function AdminAddressCreatePage(
  props: PageBodyProps<AdminDataProps, Partial<AddressInput>, Address>,
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
      <AdminAddressCreateBody {...props} />
    </LayoutAdmin>
  );
}

export const Head = AdminAddressCreateHead;
export default AdminAddressCreatePage;
