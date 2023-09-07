import TitleRow from "./TitleRow";

const ErrorRow = ({ title, error }) => {
  const texts = [];
  while (error) {
    texts.push(<div>{error.toString()}</div>);
    error = error.cause;
  }

  if (texts.length == 0) {
    return <></>;
  }

  return (
    <TitleRow title={title} classes="text-red-800">
      {texts}
    </TitleRow>
  );
};

export default ErrorRow;
