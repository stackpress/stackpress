import type { NestedObject, ServerPageProps } from "stackpress/view";
import type { AdminConfigProps } from "stackpress/admin/types";
import type { ProfileInput, Profile } from "../../types";
import { useLanguage } from "r22n";
import Button from "frui/element/Button";
import { useServer, Crumbs, LayoutAdmin } from "stackpress/view";
import { NameFieldControl } from "../../components/fields/NameField";
import { ImageFieldControl } from "../../components/fields/ImageField";
import { TypeFieldControl } from "../../components/fields/TypeField";
import { RolesFieldControl } from "../../components/fields/RolesField";
import { TagsFieldControl } from "../../components/fields/TagsField";
import { ReferencesFieldControl } from "../../components/fields/ReferencesField";

export function AdminProfileCreateCrumbs() {
  //hooks
  const { _ } = useLanguage();
  //variables
  const crumbs = [
    {
      label: <span className="theme-info">{_("Profiles")}</span>,
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

export function AdminProfileCreateForm(props: {
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

export function AdminProfileCreateBody() {
  const { request, response } = useServer<
    AdminConfigProps,
    Partial<ProfileInput>,
    Profile
  >();
  const input = { ...response.results, ...request.data() };
  const errors = response.errors();
  //render
  return (
    <main className="flex flex-col px-h-100-0 theme-bg-bg0 relative">
      <div className="px-px-10 px-py-14 theme-bg-bg2">
        <AdminProfileCreateCrumbs />
      </div>
      <div className="px-p-10">
        <AdminProfileCreateForm errors={errors} input={input} />
      </div>
    </main>
  );
}

export function AdminProfileCreateHead(
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
      <title>{_("Create Profile")}</title>
      {favicon && <link rel="icon" type={mimetype} href={favicon} />}
      <link rel="stylesheet" type="text/css" href="/styles/global.css" />
      {styles.map((href, index) => (
        <link key={index} rel="stylesheet" type="text/css" href={href} />
      ))}
    </>
  );
}

export function AdminProfileCreatePage(
  props: ServerPageProps<AdminConfigProps>,
) {
  return (
    <LayoutAdmin {...props}>
      <AdminProfileCreateBody />
    </LayoutAdmin>
  );
}

export const Head = AdminProfileCreateHead;
export default AdminProfileCreatePage;
