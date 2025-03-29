import Overflow from "frui/format/Overflow";

export default function IdFormat(props: { value: string }) {

        //props
        const { value } = props;
        const attributes = {"length":10,"hellip":true};
        //render
        return (
          <Overflow {...attributes} value={value} />
        );
      
}
