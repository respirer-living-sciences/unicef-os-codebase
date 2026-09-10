import React from "react";
import ReactDOM from "react-dom/client";
import Display from "./Display";

import "./index.css";

const App = () => (
  <div>
    <Display />
  </div>
);

const root = ReactDOM.createRoot(document.getElementById("app"));
root.render(<App />);
