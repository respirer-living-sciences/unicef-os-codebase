import { Alert, AlertTitle, Box, Typography } from "@mui/material";
import React, { useEffect, useState, useMemo } from "react";
import SortableTable from "remote/SortableTableComponent";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import { useTheme } from "@mui/material/styles";
const drawerWidth = 260;

export default function Devices(props) {
  const themeMode = props.themeMode || "light";
  const localTheme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: themeMode,
          primary: {
            main: "#03C9D7",
          },
        },
        typography: {
          allVariants: {
            fontFamily:
              '"Inter", "Open Sans", "Helvetica", "Arial", sans-serif',
          },
        },
      }),
    [themeMode],
  );

  return (
    <ThemeProvider theme={localTheme}>
      <DevicesContent {...props} />
    </ThemeProvider>
  );
}

function DevicesContent(props) {
  const theme = useTheme();
  const username = props.username;

  return (
    <>
      <div>
        <Box sx={{ ml: { sm: `${drawerWidth}px` }, mt: "70px" }}>
          {/* <h1>Devices</h1> */}

          {/* Fetching imei device data Error */}
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            {props.geoJsonDataFetchStatus.error && (
              <Alert variant="outlined" severity="error">
                <AlertTitle>
                  <Typography variant="subtitle1">
                    Error occured while fetching Monitors Data.{" "}
                    <strong>{props.geoJsonDataFetchStatus.errorMsg}</strong>
                  </Typography>
                </AlertTitle>
              </Alert>
            )}
          </Box>

          {!props.geoJsonDataFetchStatus.loading && (
            <SortableTable
              finalMainData={props.finalMainData}
              columns={props.headCells}
              filterProperties={props.filterProperties}
              isExpandable={false}
              isSearchable={true}
              searchPlaceHolder="Search by IMEI, Locality, City or State"
              searchHelperText="To search multiple values, add comma separated string value"
              getIcon={props.getIcon}
              theme={theme}
            />
          )}
          {props.geoJsonDataFetchStatus.loading && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "550px",
              }}
            >
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: "50%",
                  border: "4px solid #e5e7eb",
                  borderTopColor: "#2563eb",
                  animation: "mfe-spin 0.8s linear infinite",
                }}
              />
              <span style={{ marginLeft: 12, color: "#4b5563", fontSize: 16 }}>
                Loading…
              </span>
              <style>{`@keyframes mfe-spin { to { transform: rotate(360deg); } }`}</style>
            </div>
          )}
        </Box>
      </div>
    </>
  );
}
