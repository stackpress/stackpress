import Date from "frui/format/Date";

export default function CreatedFormat(props: { value: string|number|Date }) {

        //props
        const { value } = props;
        const attributes = {};
        //render
        return (
          <Date {...attributes} value={value} />
        );
      
}
