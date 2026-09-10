import React, { useMemo } from "react";
import ReactDOM from "react-dom/client";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { getTheme } from "./utils/theme";
import { useStore } from "./store/store";
import "./index.css";
import MaveDatahub from "./MaveDatahub";

function ThemedApp() {
  const themeMode = useStore((state) => state.themeMode);
  const theme = useMemo(() => getTheme(themeMode), [themeMode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <MaveDatahub />
    </ThemeProvider>
  );
}

const root = ReactDOM.createRoot(document.getElementById("app"));
root.render(<ThemedApp />);
