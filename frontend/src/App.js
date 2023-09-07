import "./App.css";
import { useState } from "react";
import Button from "./components/Button";
import Row from "./components/Row";
import ErrorRow from "./components/ErrorRow";
import MonoRow from "./components/MonoRow";

function App() {
  const [url, setUrl] = useState("<unset>");
  const [text, setText] = useState("<unset>");
  const [error, setError] = useState(null);

  const retrieve = async (url) => {
    setUrl(url);
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`returned HTTP status ${response.status}`);
      }
      const body = await response.json();
      setText(body.hello);
      setError(null);
    } catch (error) {
      setText("<error>");
      setError(error.toString());
    }
  };

  const getBackend = () => retrieve("http://backend:5000/hello");
  const getLocalhost = () => retrieve("http://localhost:8002/hello");
  const getApi = () => retrieve("/api/hello");

  return (
    <div className="md:container p-4">
      <div className="flex flex-col gap-4">
        <MonoRow title="URL">{url}</MonoRow>
        <MonoRow title="Hello">{text}</MonoRow>
        <ErrorRow title="Error" error={error} />
        <Row>
          <Button onClick={getBackend}>GET backend</Button>
          <Button onClick={getLocalhost}>GET localhost</Button>
          <Button onClick={getApi}>GET /api</Button>
        </Row>
      </div>
    </div>
  );
}

export default App;
