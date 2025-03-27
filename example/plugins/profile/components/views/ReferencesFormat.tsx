import Metadata from "frui/format/Metadata";

export default function ReferencesFormat(props: { value: Record<string, string|number> }) {
  //props
  const { value } = props;
  const attributes = {};
  //render
  return (
    <Metadata {...attributes} value={value} />
  );
}
