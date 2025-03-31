import type { NestedObject, ServerPageProps } from "stackpress/view";
import type { AdminConfigProps } from "stackpress/admin/types";
import type { ProfileInput, ProfileExtended } from "../../types";
import { useLanguage } from "r22n";
import { useServer, Crumbs, LayoutAdmin } from "stackpress/view";
import Button from "frui/element/Button";
import { NameFieldControl } from "../../components/fields/NameField";
import { ImageFieldControl } from "../../components/fields/ImageField";
import { TypeFieldControl } from "../../components/fields/TypeField";
import { RolesFieldControl } from "../../components/fields/RolesField";
import { TagsFieldControl } from "../../components/fields/TagsField";
import { ReferencesFieldControl } from "../../components/fields/ReferencesField";

export function AdminProfileUpdateCrumbs(props: {
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
      label: _("Update"),
      icon: "edit",
    },
  ];
  return <Crumbs crumbs={crumbs} />;
}

export function AdminProfileUpdateForm(props: {
  input: Partial<ProfileInput>;
  errors: NestedObject<string | string[]>;
}) {
  const { input, errors } = props;
  const { _ } = useLanguage();
  return (
    <form method="post">
      <NameFieldControl
        className="px-mb-20"
        value={input.name}
        error={errors.name?.toString()}
      />

      <ImageFieldControl
        className="px-mb-20"
        value={input.image}
        error={errors.image?.toString()}
      />

      <TypeFieldControl
        className="px-mb-20"
        value={input.type}
        error={errors.type?.toString()}
      />

      <RolesFieldControl
        className="px-mb-20"
        value={input.roles}
        error={errors.roles?.toString()}
      />

      <TagsFieldControl
        className="px-mb-20"
        value={input.tags}
        error={errors.tags?.toString()}
      />

      <ReferencesFieldControl
        className="px-mb-20"
        value={input.references}
        error={errors.references?.toString()}
      />

      <Button
        className="theme-bc-primary theme-bg-primary border !px-px-14 !px-py-8"
        type="submit"
      >
        <i className="text-sm fas fa-fw fa-save"></i>
        {_("Save")}
      </Button>
    </form>
  );
}

export function AdminProfileUpdateBody() {
  const { config, request, response } = useServer<
    AdminConfigProps,
    Partial<ProfileInput>,
    ProfileExtended
  >();
  const base = config.path("admin.base", "/admin");
  const input = { ...response.results, ...request.data() };
  const errors = response.errors();
  const results = response.results as ProfileExtended;
  //render
  return (
    <main className="flex flex-col px-h-100-0 theme-bg-bg0 relative">
      <div className="px-px-10 px-py-14 theme-bg-bg2">
        <AdminProfileUpdateCrumbs base={base} results={results} />
      </div>
      <div className="px-p-10">
        <AdminProfileUpdateForm errors={errors} input={input} />
      </div>
    </main>
  );
}

export function AdminProfileUpdateHead(
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
      <title>{_("Update Profile")}</title>
      {favicon && <link rel="icon" type={mimetype} href={favicon} />}
      <link rel="stylesheet" type="text/css" href="/styles/global.css" />
      {styles.map((href, index) => (
        <link key={index} rel="stylesheet" type="text/css" href={href} />
      ))}
    </>
  );
}

export function AdminProfileUpdatePage(
  props: ServerPageProps<AdminConfigProps>,
) {
  return (
    <LayoutAdmin {...props}>
      <AdminProfileUpdateBody />
    </LayoutAdmin>
  );
}

export const Head = AdminProfileUpdateHead;
export default AdminProfileUpdatePage;
