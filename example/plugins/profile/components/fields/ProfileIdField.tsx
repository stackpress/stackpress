import type { FieldProps, ControlProps } from "stackpress/view";
import { useLanguage } from "r22n";
import Control from "frui/element/Control";
import Select from "frui/field/Select";

export function ProfileIdField(props: FieldProps) {
  //props
  const { className, value, change, error = false } = props;
  const attributes = {
    searchable: true,
    href: "/admin/profile/search",
    key: "profile",
    foreign: "id",
    template: "{{name}}",
  };
  //render
  return (
    <Select
      {...attributes}
      name="profileId"
      className={className}
      error={error}
      defaultValue={value}
      onUpdate={(value) => change && change("profileId", value)}
    />
  );
}

export function ProfileIdFieldControl(props: ControlProps) {
  //props
  const { className, value, change, error } = props;
  //hooks
  const { _ } = useLanguage();
  //render
  return (
    <Control label={`${_("Profile")}*`} error={error} className={className}>
      <ProfileIdField
        className="!border-b2 dark:bg-gray-300 outline-none"
        error={!!error}
        value={value}
        change={change}
      />
    </Control>
  );
}
