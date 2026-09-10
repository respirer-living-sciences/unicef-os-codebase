import React from "react";
import ReactDOM from "react-dom/client";
import CardMUI from "./CardMUI";
import CardsCarousel from "./CardsCarousel";
import DurationSelector from "./DurationSelector";
import CardTiles from "./CardTiles";
import OutlineSortableTable from "./OutlineSortableTable";
import OutlineTable from "./OutlineTable";

import "./index.css";
import { Box } from "@mui/system";
import { Typography } from "@mui/material";
import LoadingSpinner from "./LoadingSpinner";
import LoadingSpinner2 from "./LoadingSpinner2";
import ValueCardsGrid from "./ValueCardsGrid";

function DummyFun() {}

const App = () => (
  <Box
    sx={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      alignContent: "center",
    }}
  >
    <Typography variant="h4" mb={6}>
      remote UI Components
    </Typography>

    <Typography variant="h6" mb={6}>
      ValueCardsGrid
    </Typography>
    {/* <OutlineTable /> */}
    <ValueCardsGrid
      handleSelectGraphicMetric={DummyFun}
      initialSelectedMetric={"CO (mg/m³)"}
      dailyAveragesList={[
        {
          title: "",
          text: "CO (mg/m³)",
          label: "CO",
          bgColor: "#fdb025",
          barHeight: "32%",
        },
        {
          title: "",
          text: "Noise (db)",
          label: "Noise",
          bgColor: "#fdb025",
          barHeight: "32%",
        },
        {
          title: "0.12",
          text: "PM₂.₅ (µg/m³)",
          label: "PM₂.₅",
          bgColor: "#fdb025",
          barHeight: "32%",
        },
        {
          title: "0.17",
          text: "PM₁₀ (µg/m³)",
          label: "PM₁₀",
          bgColor: "#fdb025",
          barHeight: "32%",
        },
        {
          title: "4.13",
          text: "Temperature (°C)",
          label: "Temperature",
          bgColor: "#fdb025",
          barHeight: "32%",
        },
        {
          title: "73.14",
          text: "Humidity (%)",
          label: "Humidity",
          bgColor: "#fdb025",
          barHeight: "32%",
        },
      ]}
    />

    {/* <ValueCardsGrid /> */}

    <Box sx={{ display: "flex", justifyContent: "center" }}>
      <Typography variant="h6" mb={6}>
        OutlineSortableTable
      </Typography>
      {/* <OutlineTable /> */}
      <OutlineSortableTable />
    </Box>
    <br />
    <br />
    <Typography variant="h6" mb={6}>
      CardMUI
    </Typography>
    <CardMUI
      Key="imei"
      title="Title"
      subHeadingOne="IMEI"
      subHeadingOneValue="imei"
      subHeadingTwo="Last Updated"
      subHeadingTwoValue="last_updated"
      miniCardHeadingOne="PM25"
      miniCardHeadingOneValue="10"
      miniCardHeadingOneValueColor="color"
      miniCardHeadingTwo="TEMP"
      miniCardHeadingTwoValue="40"
      miniCardHeadingThree="AQI"
    />
    <Typography variant="h6" mb={6}>
      DurationSelector
    </Typography>
    <DurationSelector executeFinalCustomDuration={DummyFun} />
    <br />
    <Typography variant="h6" mb={6}>
      CardTiles
    </Typography>
    <CardTiles tileHeading="Title" value="Value" />
    <br />
    <br />
    <LoadingSpinner />
    <LoadingSpinner2 />
  </Box>
);
const root = ReactDOM.createRoot(document.getElementById("app"));
root.render(<App />);
