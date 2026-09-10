import React from "react";
import ReactDOM from "react-dom/client";
import Analytics_chart from "./Analytics_chart";
import "./index.css";

const App = () => (
  <div className="container">
    <Analytics_chart />
  </div>
);
const root = ReactDOM.createRoot(document.getElementById("app"));
root.render(<App />);
