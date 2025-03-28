import Yesno from "frui/format/Yesno";

export default function ActiveFormat(props: { value: boolean }) {
  //props
  const { value } = props;
  const attributes = {"yes":"Yes","no":"No"};
  //render
  return (
    <Yesno {...attributes} value={value} />
  );
}
