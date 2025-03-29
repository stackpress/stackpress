import type { FieldProps, ControlProps } from "stackpress/view";
import { useLanguage } from "r22n";
import Control from "frui/element/Control";
import Datetime from "frui/field/Datetime";

export function UpdatedSpan(props: FieldProps) {

        //props
        const { className, value, change, error = false } = props;
        const attributes = {};
        //render
        return (
          <>
            <Datetime 
              {...attributes}
              name="span[updated][0]}"
              className={className}
              error={error} 
              defaultValue={value[0]} 
              onUpdate={value => change && change('span[updated][0]', value)}
            />
            <br />
            <Datetime 
              {...attributes}
              name="span[updated][1]}"
              className={className}
              error={error} 
              defaultValue={value[1]} 
              onUpdate={value => change && change('span[updated][1]', value)}
            />
          </>
        );
      
}

export function UpdatedSpanControl(props: ControlProps) {

        //props
        const { className, value, change, error } = props;
        //hooks
        const { _ } = useLanguage();
        //render
        return (
          <Control label={_('Updated')} error={error} className={className}>
            <UpdatedSpan
              className="!border-b2 dark:bg-gray-300 outline-none"
              error={!!error} 
              value={value} 
              change={change}
            />
          </Control>
        );
      
}
