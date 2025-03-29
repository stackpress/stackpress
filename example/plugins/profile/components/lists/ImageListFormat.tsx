import Image from "frui/format/Image";

export default function ImageFormat(props: { value: string }) {

        //props
        const { value } = props;
        const attributes = {};
        //render
        return (
          <Image {...attributes} value={value} />
        );
      
}
