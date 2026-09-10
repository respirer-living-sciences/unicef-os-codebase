import React from "react";
import "./index.css";
// import CardsCarousel from "remote/CardsCarousel";
// import CardMUI from "remote/CardMUI";
import DurationSelector from "remote/DurationSelector";
import DataIntervalSelector from "remote/DataIntervalSelector";
import ApexLineChart from "remote/ApexLineChart";
import AdvancedLineChart from "remote/AdvancedLineChart";
import Map from "map/Map";
// import sampleData from "./sample_data";
// import sampleDataTwo from "./sample_data_two";
import { useEffect } from "react";
import { useState } from "react";
import Box from "@mui/material/Box";
// import Skeleton from "@mui/material/Skeleton";
import {
  Grid,
  Alert,
  AlertTitle,
  Card,
  Typography,
  Skeleton,
} from "@mui/material";
// import loadingImage from "./images/Eclipse-1s-270px.svg";
// import { usePa_2paParse } from "react-papaparse";
import { useTheme } from "@mui/material/styles";
import SortableTable from "remote/SortableTableComponent";
import LoadingSpinner from "remote/LoadingSpinner";
import ValueCardsGrid from "remote/ValueCardsGrid";
import getColorStops from "./getColorStops";
import { GetSafeLimit } from "./getSafeLimit";
import HealthTipsCard from "remote/HealthTips";
import { useCallback } from "react";
import PaginationComponent from "remote/PaginationComponent";
const csv = require("csvtojson");

//convert csv to json with CSVTOJSON npm library,
//show a card for each of the devices with the respective pollutant and data,

//try to implement lazy loading for remote components!

const drawerWidth = 260;

let username;
// let finalSortedData;

const cardSx = (theme) => ({
  borderRadius: 2,
  bgcolor: "background.paper",
  border: `1px solid ${theme.palette.divider}`,
  boxShadow:
    theme.palette.mode === "light"
      ? "1px 1px 4px 1px rgb(175 175 175 / 90%)"
      : "none",
});

function capitalizeString(inputString) {
  if (inputString) {
    return (
      <>
        {inputString.split(/(\d+(?:\.\d+)?)/g).map((part, index) => {
          return !/^\d+(\.\d+)?$/.test(part) ? (
            <span key={index}>{part.toUpperCase()}</span>
          ) : (
            <sub key={index}>{part}</sub>
          );
        })}
      </>
    );
  } else {
    return inputString;
  }
}

export default function HomeApp(props) {
  const theme = useTheme();
  const api_key = localStorage.getItem("api_key");

  const {
    finalChartData,
    finalTableData,
    tableDataFetchStatus,
    outlineChartFetchStatus,
    headCells,
    lastMinuteData,
    setTablePage,
    totalMonitorsLength,
  } = props;

  username = props.username;

  const [interval, setInterval] = useState({ unit: "hh", value: 1 });
  const [buttonPopup, setButtonPopup] = useState(false);
  const [finalCustomGo, setFinalCustomGo] = useState();
  const [selectedImei, setSelectedImei] = useState();
  const [selectedLocality, setSelectedLocality] = useState();
  const [finalCustomStartDate, setFinalCustomStartDate] = useState();
  const [finalCustomEndDate, setFinalCustomEndDate] = useState();
  const [cardsData, setCardsData] = useState([]);
  const [selectedMetricChartData, setSelectedMetricChartData] = useState([]);
  const [yAxisTitle, setYAxisTitle] = useState("");
  const [colorStops, setColorStops] = useState([]);
  const [pollutantLimit, setPollutantLimit] = useState("");
  const [selectedPollutant, setSelectedPollutant] = useState("");
  const [healthTipMetricValue, setHealthTipMetricValue] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState();

  useEffect(() => {
    if (finalTableData) {
      setTotalPages(Math.ceil(totalMonitorsLength / 10));
    }
  }, [finalTableData]);

  const executeHandleChange = (newDuration) => {
    props.onSelectDuration(newDuration);
    // transformCardData();
  };

  const handleIntervalChange = (newInterval) => {
    setInterval(newInterval);
    props.onSelectInterval(newInterval);
  };

  const handleCustomDuration = (customStart, customEnd, customGoButton) => {
    setFinalCustomStartDate(customStart);
    setFinalCustomEndDate(customEnd);
    setFinalCustomGo(customGoButton);
    props.onSubmitCustomDuration(customStart, customEnd, customGoButton);
  };

  useEffect(() => {
    if (!selectedImei) {
      // Only set if we don't already have one
      setSelectedImei(props.selectedImei);
      setSelectedLocality(props.selectedLocality);
    }
  }, [props.selectedImei]);

  const transformCardData = useCallback(() => {
    let dailyAveragesList = [];
    // setCardsData([]);
    if (lastMinuteData) {
      dailyAveragesList = props.userConfigData.priority_metrics
        .filter((item) => lastMinuteData[item.metric] !== undefined)
        .map((item) => ({
          title: lastMinuteData[item.metric],
          text: `${item.label} (${item.unit})`,
          label: item.label,
          bgColor: "#fdb025",
          barHeight: "32%",
        }));

      setCardsData(dailyAveragesList);

      if (dailyAveragesList.length > 0) {
        let foundHealthTipMetric = dailyAveragesList.find(
          (item) => item.label === "PM2.5" || item.label === "PM₂.₅",
        );
        if (foundHealthTipMetric) {
          setHealthTipMetricValue(foundHealthTipMetric.title);
        }
      }
    } else {
      dailyAveragesList = props.userConfigData.priority_metrics.map((item) => ({
        title: "",
        text: `${item.label} (${item.unit})`,
        label: item.label,
        bgColor: "#fdb025",
        barHeight: "32%",
      }));

      setCardsData(dailyAveragesList);
    }
  }, []);

  const handlePlotGraph = (event, imei, locality, item) => {
    setTimeout(() => {
      window.scrollBy({
        top: 700,
        behavior: "smooth",
      });
    }, 500);
    props.onSelectNewImei(imei, locality);
    setSelectedImei(imei);
    setSelectedLocality(locality);
  };

  useEffect(() => {
    transformCardData();
  }, []);

  useEffect(() => {
    if (username === "wbgt") {
      handleSelectGraphicMetric("Wet Bulb Globe Temperature (°C)");
    } else {
      const defaultMetric =
        props.userConfigData.priority_metrics[0].label +
        " (" +
        props.userConfigData.priority_metrics[0].unit +
        ")";

      handleSelectGraphicMetric(
        selectedPollutant ? selectedPollutant : defaultMetric,
      );
    }
  }, [finalChartData]);

  const handleSelectGraphicMetric = (text) => {
    const selectedChart = finalChartData.find(
      (chartItem) => chartItem.name === text,
    );

    if (selectedChart) {
      const dataPoints = selectedChart.data.map((point) => point);
      const pollutantLimit = GetSafeLimit(text);

      // create an array for area chart (for each pollutant safety level is different)
      const pm25Area = dataPoints.map((dataPoint) => {
        return {
          x: dataPoint.x,
          y: pollutantLimit,
        };
      });
      const series = [
        {
          name: selectedChart.name,
          data: dataPoints,
          type: "line",
        },
        {
          name: text + " Area",
          data: pm25Area,
          type: "area",
        },
      ];
      setSelectedPollutant(text);
      const colorStops = getColorStops(series[0].data, text);

      setColorStops(colorStops);
      const safeLimit = GetSafeLimit(text);

      setPollutantLimit(safeLimit);
      setYAxisTitle(String(series[0].name));
      setSelectedMetricChartData(series);
    }
  };

  const onPageChange = (newPage) => {
    setPage(newPage);
    setTablePage(newPage);
    // Fetch new data based on the new page
    // fetchDataForPage(newPage);
  };

  const chartAreaFadeColor =
    theme.palette.mode === "light" ? "#ffffff" : theme.palette.background.paper;

  return (
    <div>
      <Box sx={{ ml: { sm: `${drawerWidth}px` }, mt: "70px" }}>
        <DurationSelector
          executeSelectorHandleChange={executeHandleChange}
          executeFinalCustomDuration={handleCustomDuration}
          buttonPopupValue={buttonPopup}
        />
        {/* Fetching imei device data Error */}
        {tableDataFetchStatus.error && (
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Alert variant="outlined" severity="error">
              <AlertTitle>
                <strong>Error occured while fetching Monitors Data. </strong>
                {tableDataFetchStatus.errorMsg}
              </AlertTitle>
              {/* <strong>{imeiFetchErrorStatus}</strong> */}
            </Alert>
          </Box>
        )}

        <Grid container rowSpacing={3} columnSpacing={3}>
          <Grid item xs={12}>
            <Card sx={{ m: "0 20px 0 20px", ...cardSx(theme) }}>
              <SortableTable
                columns={headCells}
                finalMainData={finalTableData || []}
                getColor={props.getColor}
                onRowClick={handlePlotGraph}
                isExpandable={false}
                tableHeight={440}
                selectedImei={selectedImei}
                isLoading={tableDataFetchStatus.loading}
                totalNumOfMonitors={totalMonitorsLength}
              />
              <PaginationComponent
                page={page}
                totalPages={totalPages}
                onChange={onPageChange}
              />
            </Card>
          </Grid>

          <Grid
            item
            xs={12}
            sx={{
              marginLeft: "20px",
              marginRight: "20px",
            }}
          >
            <ValueCardsGrid
              interval={interval}
              initialSelectedMetric={
                selectedPollutant ||
                props.userConfigData.priority_metrics[0].label +
                  " (" +
                  props.userConfigData.priority_metrics[0].unit +
                  ")"
              }
              dailyAveragesList={cardsData}
              handleSelectGraphicMetric={handleSelectGraphicMetric}
              isLoading={false}
            />
          </Grid>

          <DataIntervalSelector
            executeIntervalHandleChange={handleIntervalChange}
            initialInterval={props.userConfigData?.data_interval}
          />
          <Grid item xs={12}>
            <Box sx={{ m: "0 20px" }}>
              <Card sx={{ p: 2, minHeight: 400, ...cardSx(theme) }}>
                <AdvancedLineChart
                  headerTitle={
                    selectedLocality
                      ? `${selectedLocality} ` + `(${selectedImei})`
                      : `${selectedImei}`
                  }
                  pollutantName={yAxisTitle}
                  noDataText="No data available for the current selection."
                  isLoading={outlineChartFetchStatus.loading}
                  seriesData={selectedMetricChartData}
                  colorStops={colorStops}
                  colorStops2={[
                    {
                      offset: 0,
                      color: "#B8FFC780",
                      opacity: 0.8,
                    },
                    {
                      offset: 10,
                      color: "#B8FFC780",
                      opacity: 0.5,
                    },
                    {
                      offset: 100,
                      color: chartAreaFadeColor,
                      opacity: 0.1,
                    },
                  ]}
                />
              </Card>
            </Box>

            {pollutantLimit != 0 &&
              selectedPollutant != "Temperature (°C)" &&
              selectedPollutant != "Humidity (%)" && (
                <Box
                  className="legend"
                  sx={{
                    display: "flex",
                    gap: 1.5, // 1.5 * 8 = 12px (equivalent to Tailwind's gap-3)
                    alignItems: "center",
                    justifyContent: "flex-end",
                    mt: 3,
                    mr: "50px",
                  }}
                >
                  <Box
                    sx={{
                      width: "64.15px",
                      height: "2px",
                      backgroundColor: "#00D22D",
                    }}
                  />
                  <Typography variant="body1" fontWeight="bold">
                    NAAQS: {pollutantLimit}
                  </Typography>
                </Box>
              )}
          </Grid>
        </Grid>

        {healthTipMetricValue && (
          <Grid
            item
            xs={12}
            sx={{
              marginLeft: "20px",
              marginRight: "20px",
            }}
          >
            <HealthTipsCard
              value={Number(healthTipMetricValue)}
              isLoading={tableDataFetchStatus.loading}
            />
          </Grid>
        )}
      </Box>
    </div>
  );
}
