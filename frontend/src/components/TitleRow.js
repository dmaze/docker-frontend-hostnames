import Row from "./Row";

const TitleRow = ({ title, classes, children }) => (
  <Row>
    <div className="flex-none">
      <b>{title}:</b>
    </div>
    <div className={"flex-auto " + classes}>{children}</div>
  </Row>
);
export default TitleRow;
