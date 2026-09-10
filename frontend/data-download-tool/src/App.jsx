import React from "react";
import ReactDOM from "react-dom/client";
import DownloadTool from "./DownloadTool";
import "./index.css";

const App = () => <DownloadTool />;

const root = ReactDOM.createRoot(document.getElementById("app"));
root.render(<App />);
