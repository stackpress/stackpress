import type { FieldProps, ControlProps } from "stackpress/view";
import { useLanguage } from "r22n";
import Control from "frui/element/Control";
import Metadata from "frui/field/Metadata";

export function ReferencesField(props: FieldProps) {
  //props
  const { className, value, change, error = false } = props;
  const attributes = { add: "Add Reference" };
  //render
  return (
    <Metadata
      {...attributes}
      name="references"
      className={className}
      error={error}
      defaultValue={value}
      onUpdate={(value) => change && change("references", value)}
    />
  );
}

export function ReferencesFieldControl(props: ControlProps) {
  //props
  const { className, value, change, error } = props;
  //hooks
  const { _ } = useLanguage();
  //render
  return (
    <Control label={_("References")} error={error} className={className}>
      <ReferencesField
        className="!border-b2 dark:bg-gray-300 outline-none"
        error={!!error}
        value={value}
        change={change}
      />
    </Control>
  );
}
