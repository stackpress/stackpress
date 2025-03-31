import type { FieldProps, ControlProps } from "stackpress/view";
import { useLanguage } from "r22n";
import Control from "frui/element/Control";
import Datetime from "frui/field/Datetime";

export function CreatedSpan(props: FieldProps) {
  //props
  const { className, value, change, error = false } = props;
  const attributes = {};
  const values = Array.isArray(value) ? value : [];
  //render
  return (
    <>
      <Datetime
        {...attributes}
        name="span[created][0]}"
        className={className}
        error={error}
        defaultValue={values[0]}
        onUpdate={(value) => change && change("span[created][0]", value)}
      />
      <br />
      <Datetime
        {...attributes}
        name="span[created][1]}"
        className={className}
        error={error}
        defaultValue={values[1]}
        onUpdate={(value) => change && change("span[created][1]", value)}
      />
    </>
  );
}

export function CreatedSpanControl(props: ControlProps) {
  //props
  const { className, value, change, error } = props;
  //hooks
  const { _ } = useLanguage();
  //render
  return (
    <Control label={_("Created")} error={error} className={className}>
      <CreatedSpan
        className="!border-b2 dark:bg-gray-300 outline-none"
        error={!!error}
        value={value}
        change={change}
      />
    </Control>
  );
}
