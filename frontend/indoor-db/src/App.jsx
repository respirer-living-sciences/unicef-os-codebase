import React from "react";
import ReactDOM from "react-dom/client";
import HomeApp from "./HomeApp";
import { StoreProvider } from "store/store";

import "./index.css";

const App = () => (
  <div className="container">
    <HomeApp />
  </div>
);

const root = ReactDOM.createRoot(document.getElementById("app"));
root.render(
  <StoreProvider>
    <App />
  </StoreProvider>
);
