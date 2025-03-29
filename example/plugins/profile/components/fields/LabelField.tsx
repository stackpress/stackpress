import type { FieldProps, ControlProps } from "stackpress/view";
import { useLanguage } from "r22n";
import Control from "frui/element/Control";
import Input from "frui/field/Input";

export function LabelField(props: FieldProps) {
  //props
  const { className, value, change, error = false } = props;
  const attributes = { type: "text" };
  //render
  return (
    <Input
      {...attributes}
      name="label"
      className={className}
      error={error}
      defaultValue={value}
      onUpdate={(value) => change && change("label", value)}
    />
  );
}

export function LabelFieldControl(props: ControlProps) {
  //props
  const { className, value, change, error } = props;
  //hooks
  const { _ } = useLanguage();
  //render
  return (
    <Control label={`${_("Name")}*`} error={error} className={className}>
      <LabelField
        className="!border-b2 dark:bg-gray-300 outline-none"
        error={!!error}
        value={value}
        change={change}
      />
    </Control>
  );
}
