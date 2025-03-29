import Metadata from "frui/format/Metadata";

export default function ReferencesFormat(props: {
  value: Record<string, any>;
}) {
  //props
  const { value } = props;
  const attributes = {};
  //render
  return <Metadata {...attributes} value={value} />;
}
