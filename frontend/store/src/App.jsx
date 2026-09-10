import React from "react";
import ReactDOM from "react-dom/client";

import "./index.css";

const App = () => <div className="container">Hello Store</div>;

const root = ReactDOM.createRoot(document.getElementById("app"));
root.render(<App />);
