import React from "react";
import ReactDOM from "react-dom/client";
import Login from "./Login";

import "./index.css";

function App() {
  return <Login />;
}

const root = ReactDOM.createRoot(document.getElementById("app"));
root.render(<App />);
