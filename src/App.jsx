import { useEffect, useState } from "react";
import logo from "./assets/logo.png";
import { evaluateExpression } from "./expression";

const keypad = [
  [
    { label: "7", value: "7" },
    { label: "8", value: "8" },
    { label: "9", value: "9" },
    { label: "\u00f7", value: "/" },
  ],
  [
    { label: "4", value: "4" },
    { label: "5", value: "5" },
    { label: "6", value: "6" },
    { label: "\u00d7", value: "*" },
  ],
  [
    { label: "1", value: "1" },
    { label: "2", value: "2" },
    { label: "3", value: "3" },
    { label: "\u2212", value: "-" },
  ],
  [
    { label: "0", value: "0" },
    { label: ".", value: "." },
    { label: "(", value: "(" },
    { label: ")", value: ")" },
  ],
];

function isAllowedInput(value) {
  return /^[0-9+\-*/(). ]*$/.test(value);
}

function removeLastChunk(value) {
  if (!value) {
    return "";
  }

  return value.replace(/\s*[0-9.()]+\s*$|\s*[+\-*/]\s*$/u, "").trimEnd();
}

function getDisplayClassName(expression) {
  if (expression.length > 20) {
    return "display display-compact";
  }

  if (expression.length > 12) {
    return "display display-balanced";
  }

  return "display";
}

export default function App() {
  const [expression, setExpression] = useState("");
  const [error, setError] = useState("");
  const [history, setHistory] = useState([]);
  const [preview, setPreview] = useState("");

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "Enter") {
        event.preventDefault();
        try {
          const result = evaluateExpression(expression);
          setHistory((current) => [{ expression, result }, ...current].slice(0, 5));
          setExpression(result);
          setError("");
          setPreview("");
        } catch (calculationError) {
          setError(calculationError.message);
        }
        return;
      }

      if (event.key === "Escape") {
        event.preventDefault();
        setExpression("");
        setError("");
        setPreview("");
        return;
      }

      if (event.key === "Backspace" && event.ctrlKey) {
        event.preventDefault();
        setExpression((current) => removeLastChunk(current));
        setError("");
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [expression]);

  useEffect(() => {
    if (!expression.trim()) {
      setPreview("");
      return;
    }

    try {
      setPreview(evaluateExpression(expression));
      setError("");
    } catch (calculationError) {
      setPreview("");
      if (calculationError.message === "Cannot divide by zero") {
        setError(calculationError.message);
        return;
      }

      setError("");
    }
  }, [expression]);

  function appendValue(value) {
    setExpression((current) => current + value);
    setError("");
  }

  function handleInputChange(event) {
    const nextValue = event.target.value;
    if (!isAllowedInput(nextValue)) {
      return;
    }

    setExpression(nextValue);
    setError("");
  }

  function handleCalculate() {
    try {
      const result = evaluateExpression(expression);
      setHistory((current) => [{ expression, result }, ...current].slice(0, 5));
      setExpression(result);
      setError("");
      setPreview("");
    } catch (calculationError) {
      setError(calculationError.message);
    }
  }

  function handleClear() {
    setExpression("");
    setError("");
    setPreview("");
  }

  function handleBackspace() {
    setExpression((current) => current.slice(0, -1));
    setError("");
  }

  function handleDisplayKeyDown(event) {
    if (event.key === "Backspace" && event.ctrlKey) {
      event.preventDefault();
      setExpression((current) => removeLastChunk(current));
      setError("");
    }
  }

  return (
    <main className="app-shell">
      <section className="calculator-card">
        <div className="card-glow" aria-hidden="true" />
        <header className="hero">
          <div className="brand-row">
            <a className="brand-link" href="https://rojaswebs.com" target="_blank" rel="noreferrer">
              <div className="brand-copy">
                <p className="eyebrow">RojasWebs</p>
                <h1>Calc by RojasWebs</h1>
                <p className="hero-copy">
                  Fast, clean calculator for everyday math with keyboard support, live previews,
                  and a layout that works across desktop and mobile.
                </p>
              </div>
              <img className="brand-logo" src={logo} alt="Rojas Webs logo" />
            </a>
          </div>
          <div className="shortcut-row" aria-label="Keyboard shortcuts">
            <button type="button" className="shortcut-chip" onClick={handleCalculate}>
              Enter to solve
            </button>
            <button type="button" className="shortcut-chip" onClick={handleClear}>
              Escape to clear
            </button>
            <button
              type="button"
              className="shortcut-chip"
              onClick={() => {
                setExpression((current) => removeLastChunk(current));
                setError("");
              }}
            >
              Ctrl+Backspace to undo
            </button>
          </div>
        </header>

        <div className="display-panel">
          <div className="display-heading">
            <label className="display-label" htmlFor="expression-input">
              Expression
            </label>
            <div className="display-meta">
              <span>{expression.trim() ? `${expression.length} chars` : "Ready"}</span>
              <span>{preview ? `Preview ${preview}` : "Try 12 / (3 + 1)"}</span>
            </div>
          </div>
          <div className={`display-shell ${error ? "display-shell-error" : ""}`}>
            <input
              id="expression-input"
              className={`${getDisplayClassName(expression)} ${error ? "display-error" : ""}`}
              type="text"
              inputMode="decimal"
              value={expression}
              onChange={handleInputChange}
              onKeyDown={handleDisplayKeyDown}
              placeholder="0"
              autoFocus
            />
            <div className="display-preview" aria-live="polite">
              {preview && !error ? `= ${preview}` : " "}
            </div>
          </div>
          <div className={`status ${error ? "status-error" : ""}`}>
            {error || "Enter an expression or use the keypad."}
          </div>
        </div>

        <div className="workspace">
          <section className="keypad" aria-label="Calculator keypad">
            <div className="keypad-grid">
              {keypad.flat().map((item) => (
                <button
                  key={item.value}
                  type="button"
                  className={`key ${/[+\-*/()]/.test(item.value) ? "key-operator" : "key-number"}`}
                  onClick={() => appendValue(item.value)}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div className="action-row">
              <button type="button" className="key key-clear" onClick={handleClear}>
                Clear
              </button>
              <button type="button" className="key key-secondary" onClick={handleBackspace}>
                Back
              </button>
              <button type="button" className="key key-equals" onClick={handleCalculate}>
                =
              </button>
            </div>
          </section>

          <aside className="history-panel">
            <div className="history-header">
              <h2>Recent</h2>
              <p>Tap a result to bring it back into the display.</p>
            </div>

            <div className="history-list">
              {history.length === 0 ? (
                <p className="history-empty">Results will appear here as you calculate.</p>
              ) : (
                history.map((item, index) => (
                  <button
                    key={`${item.expression}=${item.result}-${index}`}
                    type="button"
                    className="history-item"
                    onClick={() => {
                      setExpression(item.result);
                      setError("");
                    }}
                  >
                    <span>{item.expression}</span>
                    <strong>{item.result}</strong>
                  </button>
                ))
              )}
            </div>
          </aside>
        </div>

        <footer className="site-credit" aria-label="Site credit">
          <a className="credit-brand" href="https://rojaswebs.com" target="_blank" rel="noreferrer">
            <img className="credit-logo" src={logo} alt="Rojas Webs logo" />
            <span className="credit-title credit-link">Created by RojasWebs</span>
          </a>
          <p className="credit-copy">
            A lightweight calculator built for quick problem solving on desktop and phone.
          </p>
        </footer>
      </section>
    </main>
  );
}
