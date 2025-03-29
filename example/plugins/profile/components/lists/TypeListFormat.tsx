import Text from "frui/format/Text";

export default function TypeFormat(props: { value: string }) {

        //props
        const { value } = props;
        const attributes = {"lower":true};
        //render
        return (
          <Text {...attributes} value={value} />
        );
      
}
