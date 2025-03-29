import type { FieldProps, ControlProps } from "stackpress/view";
import { useLanguage } from "r22n";
import Control from "frui/element/Control";
import Switch from "frui/field/Switch";

export function ActiveFilter(props: FieldProps) {
  //props
  const { className, value, change, error = false } = props;
  const attributes = {};
  //render
  return (
    <Switch
      {...attributes}
      name="filter[active]"
      className={className}
      error={error}
      defaultValue={value}
      defaultChecked={value}
      onUpdate={(value) => change && change("filter[active]", value)}
    />
  );
}

export function ActiveFilterControl(props: ControlProps) {
  //props
  const { className, value, change, error } = props;
  //hooks
  const { _ } = useLanguage();
  //render
  return (
    <Control label={_("Active")} error={error} className={className}>
      <input type="hidden" name="active" value="false" />
      <ActiveFilter
        className="!border-b2 dark:bg-gray-300 outline-none"
        error={!!error}
        value={value}
        change={change}
      />
    </Control>
  );
}
