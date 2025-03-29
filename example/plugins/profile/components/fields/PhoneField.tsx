import type { FieldProps, ControlProps } from "stackpress/view";
import { useLanguage } from "r22n";
import Control from "frui/element/Control";
import Input from "frui/field/Input";

export function PhoneField(props: FieldProps) {
  //props
  const { className, value, change, error = false } = props;
  const attributes = { type: "text" };
  //render
  return (
    <Input
      {...attributes}
      name="phone"
      className={className}
      error={error}
      defaultValue={value}
      onUpdate={(value) => change && change("phone", value)}
    />
  );
}

export function PhoneFieldControl(props: ControlProps) {
  //props
  const { className, value, change, error } = props;
  //hooks
  const { _ } = useLanguage();
  //render
  return (
    <Control
      label={_("Contact Phone Number")}
      error={error}
      className={className}
    >
      <PhoneField
        className="!border-b2 dark:bg-gray-300 outline-none"
        error={!!error}
        value={value}
        change={change}
      />
    </Control>
  );
}
