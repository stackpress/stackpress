import type { FieldProps, ControlProps } from "stackpress/view";
import { useLanguage } from "r22n";
import Control from "frui/element/Control";
import Country from "frui/field/Country";

export function CountryField(props: FieldProps) {
  //props
  const { className, value, change, error = false } = props;
  const attributes = {};
  //render
  return (
    <Country
      {...attributes}
      name="country"
      className={className}
      error={error}
      defaultValue={value}
      onUpdate={(value) => change && change("country", value)}
    />
  );
}

export function CountryFieldControl(props: ControlProps) {
  //props
  const { className, value, change, error } = props;
  //hooks
  const { _ } = useLanguage();
  //render
  return (
    <Control label={`${_("Country")}*`} error={error} className={className}>
      <CountryField
        className="!border-b2 dark:bg-gray-300 outline-none"
        error={!!error}
        value={value}
        change={change}
      />
    </Control>
  );
}
