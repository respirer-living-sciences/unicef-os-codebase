import React from "react";
import ReactDOM from "react-dom/client";
// import { StoreProvider } from "store/store";
import Map from "./Map";
// import MainMap from "./MainMap";
import "./index.css";
import { Box } from "@mui/material";

const App = () => <Map />;

const root = ReactDOM.createRoot(document.getElementById("app"));
root.render(
  // <StoreProvider>
  <App />
  // </StoreProvider>
);
