import Phone from "frui/format/Phone";

export default function PhoneFormat(props: { value: string }) {
  //props
  const { value } = props;
  const attributes = {};
  //render
  return <Phone {...attributes} value={value} />;
}
