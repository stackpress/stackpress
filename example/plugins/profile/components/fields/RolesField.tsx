import type { FieldProps, ControlProps } from "stackpress/view";
import { useLanguage } from "r22n";
import Control from "frui/element/Control";
import Textlist from "frui/field/Textlist";

export function RolesField(props: FieldProps) {
  //props
  const { className, value, change, error = false } = props;
  const attributes = {"add":"Add Role"};
  //render
  return (
    <Textlist 
      {...attributes}
      className={className}
      error={error} 
      defaultValue={value} 
      onUpdate={value => change('roles', value)}
    />
  );
}

export function RolesControl(props: ControlProps) {
  //props
  const { className, value, change, error } = props;
  //hooks
  const { _ } = useLanguage();
  //render
  return (
    <Control label={_('Roles')} error={error} className={className}>
      <RolesField
        className="!border-b2 dark:bg-gray-300 outline-none"
        error={!!error} 
        value={value} 
        change={change}
      />
    </Control>
  );  
}
