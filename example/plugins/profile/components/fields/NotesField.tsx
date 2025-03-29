import type { FieldProps, ControlProps } from "stackpress/view";
import { useLanguage } from "r22n";
import Control from "frui/element/Control";
import Textarea from "frui/field/Textarea";

export function NotesField(props: FieldProps) {
  //props
  const { className, value, change, error = false } = props;
  const attributes = {};
  //render
  return (
    <Textarea
      {...attributes}
      name="notes"
      className={className}
      error={error}
      defaultValue={value}
      onUpdate={(value) => change && change("notes", value)}
    />
  );
}

export function NotesFieldControl(props: ControlProps) {
  //props
  const { className, value, change, error } = props;
  //hooks
  const { _ } = useLanguage();
  //render
  return (
    <Control label={_("Notes")} error={error} className={className}>
      <NotesField
        className="!border-b2 dark:bg-gray-300 outline-none"
        error={!!error}
        value={value}
        change={change}
      />
    </Control>
  );
}
