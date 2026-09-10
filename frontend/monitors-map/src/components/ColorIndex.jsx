import * as React from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Typography } from "@mui/material";

const ColorsItem = styled(Paper)(({ theme }) => ({
  // backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  // ...theme.typography.subtitle1,
  padding: theme.spacing(1),
  paddingTop: theme.spacing(0),
  textAlign: "center",
  // color: theme.palette.text.secondary,
  height: 24,
}));

const lightTheme = createTheme({ palette: { text: "white", mode: "light" } });
const darkTheme = createTheme({ palette: { mode: "dark" } });

const safetyIndicators = [
  {
    label: "Good",
    color: "#1EC82F",
    width: 1.4,
  },
  {
    label: "Satisfactory",
    color: "#1BF030",
    width: 1.9,
  },
  {
    label: "Moderate",
    color: "#F3DC0C",
    width: 1.9,
  },
  {
    label: "Poor",
    color: "#FFA621",
    width: 1.4,
  },
  {
    label: "Very Poor",
    color: "#FF0F0F",
    width: 1.9,
  },
  {
    label: "Severe",
    color: "#BA0909",
    width: 1.4,
  },
];

const safetyRanges = [
  {
    "pm2.5cnc": "0-30",
    pm10cnc: "0-50",
    width: 1.4,
  },
  {
    "pm2.5cnc": "31-60",
    pm10cnc: "51-100",
    width: 1.9,
  },
  {
    "pm2.5cnc": "61-90",
    pm10cnc: "101-250",
    width: 1.9,
  },
  {
    "pm2.5cnc": "91-120",
    pm10cnc: "251-350",
    width: 1.4,
  },
  {
    "pm2.5cnc": "121-250",
    pm10cnc: "351-430",
    width: 1.9,
  },
  {
    "pm2.5cnc": "251+",
    pm10cnc: "430+",
    width: 1.4,
  },
];

const drawerWidth = 260;

export default function ColorIndex(props) {
  const param = props.param;
  return (
    <ThemeProvider theme={lightTheme}>
      <Box
        sx={{
          ml: { sm: `${drawerWidth}px` },
          mt: 5,
          width: "70%",
          bottom: "45px",
          right: "5%",
          position: "absolute",
        }}
      >
        <Box sx={{ display: "flex" }}>
          <Box
            className="param-name"
            sx={{
              zIndex: "2",
              backgroundColor: "#fff",
              width: "130px",
              height: "48px",
              textAlign: "center",
              paddingTop: "10px",
              boxShadow:
                "0px 2px 1px -1px rgb(0 0 0 / 20%), 0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 1px 3px 0px rgb(0 0 0 / 12%)",
            }}
          >
            <Typography
              variant="h6"
              sx={{ color: "#03C9D7", letterSpacing: "1px" }}
            >
              <b>{param}</b>
            </Typography>
            {/* <Typography
              variant="caption"
              sx={{ marginBottom: "10px", color: "rgb(228, 228, 228)" }}
            >
              param Selected
            </Typography> */}
          </Box>

          <Grid container direction="column">
            <Grid container spacing={0}>
              {safetyIndicators.map((item) => {
                return (
                  <Grid item xs={item.width}>
                    <ColorsItem
                      elevation={1}
                      square
                      sx={{
                        backgroundColor: item.color,
                        color: lightTheme.palette.text,
                      }}
                    >
                      <b>{item.label}</b>
                    </ColorsItem>
                  </Grid>
                );
              })}
            </Grid>
            <Grid container spacing={0}>
              {safetyRanges.map((item) => {
                return (
                  <Grid item xs={item.width}>
                    <ColorsItem
                      elevation={1}
                      square
                      sx={{
                        backgroundColor: "rgb(228, 228, 228)",
                      }}
                    >
                      {/* {param === "pm10cnc" ? item.pm10Range : item.pm25Range} */}
                      {item[param]}
                    </ColorsItem>
                  </Grid>
                );
              })}
            </Grid>
          </Grid>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
