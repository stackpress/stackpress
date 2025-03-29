import type { FieldProps, ControlProps } from "stackpress/view";
import { useLanguage } from "r22n";
import Control from "frui/element/Control";
import Input from "frui/field/Input";

export function CityField(props: FieldProps) {
  //props
  const { className, value, change, error = false } = props;
  const attributes = { type: "text" };
  //render
  return (
    <Input
      {...attributes}
      name="city"
      className={className}
      error={error}
      defaultValue={value}
      onUpdate={(value) => change && change("city", value)}
    />
  );
}

export function CityFieldControl(props: ControlProps) {
  //props
  const { className, value, change, error } = props;
  //hooks
  const { _ } = useLanguage();
  //render
  return (
    <Control label={`${_("City")}*`} error={error} className={className}>
      <CityField
        className="!border-b2 dark:bg-gray-300 outline-none"
        error={!!error}
        value={value}
        change={change}
      />
    </Control>
  );
}
