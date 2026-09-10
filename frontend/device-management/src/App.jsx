import React from "react";
import ReactDOM from "react-dom/client";
import DevicesTable from "./DevicesTable";

import "./index.css";

const App = () => (
  <div className="container">
    <DevicesTable />
  </div>
);
const root = ReactDOM.createRoot(document.getElementById("app"));

root.render(<App />);
