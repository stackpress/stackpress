import Text from "frui/format/Text";

export default function CountryFormat(props: { value: string }) {
  //props
  const { value } = props;
  const attributes = {};
  //render
  return <Text {...attributes} value={value} />;
}
