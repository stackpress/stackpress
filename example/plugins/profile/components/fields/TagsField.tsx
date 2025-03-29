import type { FieldProps, ControlProps } from "stackpress/view";
import { useLanguage } from "r22n";
import Control from "frui/element/Control";
import Taglist from "frui/field/Taglist";

export function TagsField(props: FieldProps) {

        //props
        const { className, value, change, error = false } = props;
        const attributes = {};
        //render
        return (
          <Taglist 
            {...attributes}
            name="tags[]"
            className={className}
            error={error} 
            defaultValue={value} 
            
            onUpdate={value => change && change('tags[]', value)}
          />
        );
      
}

export function TagsFieldControl(props: ControlProps) {

        //props
        const { className, value, change, error } = props;
        //hooks
        const { _ } = useLanguage();
        //render
        return (
          <Control label={_('Tags')} error={error} className={className}>
            
            <TagsField
              className="!border-b2 dark:bg-gray-300 outline-none"
              error={!!error} 
              value={value} 
              change={change}
            />
          </Control>
        );
      
}
