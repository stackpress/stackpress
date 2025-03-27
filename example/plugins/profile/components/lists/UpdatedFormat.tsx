import Date from "frui/format/Date";

export default function UpdatedFormat(props: { value: string }) {
  //props
  const { value } = props;
  const attributes = {};
  //render
  return (
    <Date {...attributes} value={value} />
  );
}
