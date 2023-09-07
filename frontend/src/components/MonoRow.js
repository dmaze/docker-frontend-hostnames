import TitleRow from "./TitleRow";

const MonoRow = ({ title, children }) => (
  <TitleRow title={title} classes="font-mono border">
    {children}
  </TitleRow>
);

export default MonoRow;
