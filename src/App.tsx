import { useCallback, useState } from "react";
import "./App.css";
// import xss from "xss";

const dirty = "<script>alert('xss')</script>";

const createXss = async () => {
  const {
    FilterXSS,
    whiteList: defaultXssWhitelist,
    escapeAttrValue,
  } = await import("xss");

  // build a custom shitelist for xss that adds "style" to the allowed attributes
  // for everything
  const newWhitelist = Object.fromEntries(
    Object.entries(defaultXssWhitelist).map(([tag, attrList = []]) => [
      tag,
      [...attrList, "style"],
    ])
  );

  // copilot said this but it does not work
  // newWhitelist["*"] = ["style"];

  // custom xss to allow style attributes and allow images with src attributes.
  // Yes, it's not ideal XSS, but then again this is a collaborative, trusted
  // environment.
  const xss = new FilterXSS({
    whiteList: newWhitelist,
    onTagAttr: function (tag, name, value) {
      if (tag === "img" && name === "src") {
        // escape its value using built-in escapeAttrValue function
        return name + '="' + escapeAttrValue(value) + '"';
      }
    },
  });
  return xss;
};

function App() {
  const [text, setText] = useState(dirty);

  // const handleClean = useCallback(() => {
  //   const cleaned = xss(dirty);
  //   setText(cleaned);
  // }, []);

  const handleReset = useCallback(() => {
    setText(dirty);
  }, []);

  const handleClean2 = useCallback(async () => {
    const xss = await createXss();
    const cleaned = xss.process(dirty);
    setText(cleaned);
  }, []);

  return (
    <>
      <h1>Text</h1>
      <pre>{text}</pre>
      <div>
        <button onClick={handleReset}>Reset</button>
        {/* <button onClick={handleClean}>Clean</button> */}
        <button onClick={handleClean2}>Clean (dynamic import)</button>
      </div>
    </>
  );
}

export default App;
