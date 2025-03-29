import Email from "frui/format/Email";

export default function EmailFormat(props: { value: string }) {
  //props
  const { value } = props;
  const attributes = {};
  //render
  return <Email {...attributes} value={value} />;
}
