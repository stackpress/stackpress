import Yesno from "frui/format/Yesno";

export default function ActiveFormat(props: { value: string }) {
  //props
  const { value } = props;
  const attributes = {"yes":"Yes","no":"No"};
  //render
  return (
    <Yesno {...attributes} value={value} />
  );
}
