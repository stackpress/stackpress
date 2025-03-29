import type { FieldProps, ControlProps } from "stackpress/view";
import { useLanguage } from "r22n";
import Control from "frui/element/Control";
import Input from "frui/field/Input";

export function ImageField(props: FieldProps) {

        //props
        const { className, value, change, error = false } = props;
        const attributes = {"type":"url"};
        //render
        return (
          <Input 
            {...attributes}
            name="image"
            className={className}
            error={error} 
            defaultValue={value} 
            
            onUpdate={value => change && change('image', value)}
          />
        );
      
}

export function ImageFieldControl(props: ControlProps) {

        //props
        const { className, value, change, error } = props;
        //hooks
        const { _ } = useLanguage();
        //render
        return (
          <Control label={_('Image')} error={error} className={className}>
            
            <ImageField
              className="!border-b2 dark:bg-gray-300 outline-none"
              error={!!error} 
              value={value} 
              change={change}
            />
          </Control>
        );
      
}
