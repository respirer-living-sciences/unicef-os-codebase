import React from "react";
import ReactDOM from "react-dom/client";
import CalendarHeatmap from "./CalendarHeatmap.jsx";
import "./index.css";
// import { StoreProvider } from "store/store";

const App = () => (
  <div>
    <CalendarHeatmap />
  </div>
);
const root = ReactDOM.createRoot(document.getElementById("app"));
root.render(<App />);
