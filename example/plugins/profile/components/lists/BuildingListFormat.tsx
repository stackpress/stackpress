import Text from "frui/format/Text";

export default function BuildingFormat(props: { value: string }) {
  //props
  const { value } = props;
  const attributes = {};
  //render
  return <Text {...attributes} value={value} />;
}
