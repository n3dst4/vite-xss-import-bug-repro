import { useCallback, useState } from "react";
import "./App.css";
import xss, { FilterXSS } from "xss";

const dirty =
  "foo bar <section class='corge'>baz</section> qux <img src='whatever' />";

function App() {
  const [text, setText] = useState(dirty);

  // reset the tool
  const handleReset = useCallback(() => {
    setText(dirty);
  }, []);

  // cleant the text using a
  const handleCleanStandardDefaultImport = useCallback(async () => {
    const cleaned = xss(dirty);
    setText(cleaned);
  }, []);

  const handleCleanStandardNamedImport = useCallback(async () => {
    const xss = new FilterXSS({});
    const cleaned = xss.process(dirty);
    setText(cleaned);
  }, []);

  const handleCleanDynamicDefaultImport = useCallback(async () => {
    const xss = (await import("xss")).default;
    const cleaned = xss(dirty);
    setText(cleaned);
  }, []);

  const handleCleanDynamicNamedImport = useCallback(async () => {
    const { FilterXSS } = await import("xss");
    const xss = new FilterXSS({});
    const cleaned = xss.process(dirty);
    setText(cleaned);
  }, []);

  return (
    <>
      <p>
        Below is some text that we want to clean. There are four buttons below.
      </p>
      <p>Standard default import, aka `import x from y;`</p>
      <p>
        Standard named import, aka `import {"{"}x{"}"} from y;`
      </p>
      <p>Dynamic default import, aka `await import(x).default;` </p>
      <p>Dynamic named import, aka `await import(x).y;` </p>
      <p>
        <b>All of these methods work in Vite 5.0. </b>
      </p>
      <p>
        <b>
          All of these methods work in Vite 5.1 when building statically (vite
          build)
        </b>
      </p>
      <p>
        <b>
          But in Vite 5.1.x, in dev mode (vite dev), the final one (dynamic
          named import) does not work. The named import is undefined.
        </b>
      </p>
      <pre style={{ border: "1px solid currentColor", padding: "2em" }}>
        {text}
      </pre>
      <div>
        <button onClick={handleReset}>Reset</button>
        <button onClick={handleCleanStandardDefaultImport}>
          Clean (standard default import)
        </button>
        <button onClick={handleCleanStandardNamedImport}>
          Clean (standard named import)
        </button>
        <button onClick={handleCleanDynamicDefaultImport}>
          Clean (dynamic default import)
        </button>
        <button onClick={handleCleanDynamicNamedImport}>
          Clean (dynamic named import)
        </button>
      </div>
    </>
  );
}

export default App;
