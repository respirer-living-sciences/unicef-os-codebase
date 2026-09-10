import React from "react";
import ReactDOM from "react-dom/client";
import Comparison from "./Comparison";

const App = () => (
  <div className="container">
    <Comparison />
  </div>
);

const root = ReactDOM.createRoot(document.getElementById("app"));
root.render(<App />);
