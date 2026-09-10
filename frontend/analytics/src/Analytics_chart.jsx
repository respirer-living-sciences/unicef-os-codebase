import React, { useEffect, useState } from "react";
import "./index.css";
import Box from "@mui/material/Box";
import {
  Button,
  Grid,
  Alert,
  AlertTitle,
  Popover,
  ButtonGroup,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import CardTiles from "remote/CardTiles";

import ApexLineChart from "remote/ApexLineChart";
import RegressionMixedChart from "./Components/RegressionMixedChart";
import CustomDurationPopOver from "remote/CustomDurationPopOver";
import DurationSelector from "./Components/DurationSelector";
import TimeStepSelector from "./Components/TimeStepSelector";
import AvgCriteriaSelector from "./Components/AvgCriteriaSelector";
import ParameterSelector from "./Components/ParameterSelector";
import MonitorSelector from "./Components/MonitorSelector";
import FetchDeviceDataService from "./Services/fetchDeviceIMEIs";
import getMonitorPoints from "./utils/getMonitorPoints";
import getRegressionMetrics from "./utils/getRegressionMetrics";
import getPlottableData from "./utils/getPlottableData";
import fetchAnalyticsData from "./Services/fetchAnalyticsData";

const drawerWidth = 260;

export default function analytics_chart(props) {
  const username = props.username;
  const dropDownParamsList = props.dropDownParamsList;

  const theme = useTheme();

  const imeiURL = `https://mave.yourdomain.com/check_user_imei/user/${username}`;
  const ncapImeiURL = "https://mave.yourdomain.com/check_user_imei/user/ncap";

  const today = new Date();
  let sevenDaysAgo = today;
  let thirtyDaysAgo = today;
  const day = ("0" + today.getUTCDate()).slice(-2);
  const month = ("0" + (today.getUTCMonth() + 1)).slice(-2); // getUTCMonth() returns month from 0 to 11
  const year = today.getUTCFullYear();
  const fullDate = `${year}-${month}-${day}`;

  const [durationButton, setDurationButton] = useState("");
  const [durationStartDate, setDurationStartDate] = useState(fullDate);
  const [durationEndDate, setDurationEndDate] = useState(fullDate);
  const [average, setAverage] = useState("");
  const [timeStep, setTimeStep] = useState("");
  const [selectedParameter, setSelectedParameter] = useState("pm2.5cnc");
  const [loading, setLoading] = useState(false);
  const [validationError, setValidationError] = useState(false);
  const [launched, setLaunched] = useState(false);
  const [regression, setRegression] = useState(null);
  const [regressionMetricsList, setRegressionMetricsList] = useState([]);
  const [deviceData, setDeviceData] = useState([]);
  const [imeiLoading, setImeiLoading] = useState(false);
  const [imeiError, setImeiError] = useState(false);
  const [imeiFetchErrorStatus, setImeiFetchErrorStatus] = useState(false);
  const [ncapImeilLoading, setNcapImeiLoading] = useState(false);
  const [ncapImeiError, setNcapImeiError] = useState(false);
  const [ncapImeiFetchErrorStatus, setNcapImeiFetchErrorStatus] =
    useState(false);
  const [error, setError] = useState(false);
  const [maveMonitorValue, setMaveMonitorValue] = useState();
  const [ncapDeviceData, setNcapDeviceData] = useState([]);
  const [ncapMonitorValue, setNcapMonitorValue] = useState();
  const [customDurationButtonPopover, setCustomDurationButtonPopover] =
    useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [seriesArray, setSeriesArray] = useState([]);

  const handleDurationButton = (e) => {
    const targetValue = e.target.value;

    setDurationButton(targetValue);
    if (targetValue === "today") {
      setDurationStartDate(fullDate);
      setDurationEndDate(fullDate);
    } else if (targetValue === "7days") {
      sevenDaysAgo.setDate(today.getDate() - 6);
      const day = ("0" + sevenDaysAgo.getUTCDate()).slice(-2);
      const month = ("0" + (sevenDaysAgo.getUTCMonth() + 1)).slice(-2); // getUTCMonth() returns month from 0 to 11
      const year = sevenDaysAgo.getUTCFullYear();
      const sevenDaysAgoFullDate = `${year}-${month}-${day}`;
      setDurationStartDate(sevenDaysAgoFullDate);
      setDurationEndDate(fullDate);
    } else if (targetValue === "30days") {
      thirtyDaysAgo.setDate(today.getDate() - 29);
      const day = ("0" + thirtyDaysAgo.getUTCDate()).slice(-2);
      const month = ("0" + (thirtyDaysAgo.getUTCMonth() + 1)).slice(-2); // getUTCMonth() returns month from 0 to 11
      const year = thirtyDaysAgo.getUTCFullYear();
      const thirtyDaysAgoFullDate = `${year}-${month}-${day}`;
      setDurationStartDate(thirtyDaysAgoFullDate);
      setDurationEndDate(fullDate);
    }
  };

  const handleDurationButtonClick = (e) => {
    setAnchorEl(e.currentTarget);
  };

  const handleAverageCriteria = (e) => {
    const targetValue = e.target.value;
    setAverage(targetValue);
  };

  const handleTimeStep = (e) => {
    setTimeStep(e.target.value);
  };

  const handleParameter = (e) => {
    setSelectedParameter(e.target.value);
  };

  const handleSelectMaveMonitor = (e, newMaveMonitor) => {
    setMaveMonitorValue(newMaveMonitor.imei);
  };

  const handleSelectNcapMonitor = (e, newNcapMonitor) => {
    setNcapMonitorValue(newNcapMonitor.imei);
  };

  const handleDurationPopOverClose = () => {
    setCustomDurationButtonPopover(false);
  };

  const handleDurationPopOverOpen = () => {
    setCustomDurationButtonPopover(true);
  };

  const handleDurationPopOverCancel = () => {
    setDurationButton("");
    setDurationStartDate("");
    setDurationEndDate("");
  };

  const handleCustomDuration = (customStart, customEnd) => {
    setDurationStartDate(customStart);
    setDurationEndDate(customEnd);
  };

  const loadingMetrics = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  // Fetch IMEI data from server and make a list of imeis with their locality
  useEffect(() => {
    async function getMaveImeis() {
      const devicesGroupName = "Mave Devices";
      const { res, imeiError, imeiLoading, imeiFetchErrorStatus } =
        await FetchDeviceDataService(imeiURL, devicesGroupName);
      setImeiError(imeiError);
      setImeiLoading(imeiLoading);
      setImeiFetchErrorStatus(imeiFetchErrorStatus);
      const monitorPoints = getMonitorPoints(res);
      setDeviceData(monitorPoints);
    }

    getMaveImeis();
  }, []);

  useEffect(() => {
    async function getNcapImeis() {
      const devicesGroupName = "NCAP Devices";
      const { res, imeiError, imeiLoading, imeiFetchErrorStatus } =
        await FetchDeviceDataService(ncapImeiURL, devicesGroupName);
      setNcapImeiError(imeiError);
      setNcapImeiLoading(imeiLoading);
      setNcapImeiFetchErrorStatus(imeiFetchErrorStatus);
      const ncapMonitorPoints = getMonitorPoints(res);
      setNcapDeviceData(ncapMonitorPoints);
    }
    getNcapImeis();
  }, []);

  // Plot Points
  const handlePlotPoints = () => {
    setError(false);
    setValidationError(false);
    setLoading(true);

    // form validation
    if (
      durationButton === ("" || undefined) ||
      average === ("" || undefined) ||
      timeStep === ("" || undefined) ||
      maveMonitorValue === ("" || undefined) ||
      ncapMonitorValue === ("" || undefined)
    ) {
      setValidationError(true);
      setLoading(false);
    } else {
      setValidationError(false);
      async function executeAnalyticsAsyncFunctions() {
        // fetch analytics data

        const { res, error, loading, fetchErrorStatus } =
          await fetchAnalyticsData(
            maveMonitorValue,
            ncapMonitorValue,
            durationStartDate,
            durationEndDate,
            timeStep,
            average,
            selectedParameter,
          );
        const regressionResponseData = res;
        setError(error);
        setLoading(loading);

        const maveDeviceData = regressionResponseData.device_data;
        // refactor device data to get plottable XY data
        const maveDeviceXYData = getPlottableData(
          maveDeviceData,
          selectedParameter,
        );

        const refDeviceData = regressionResponseData.ref_data;
        // refactor device data to get plottable XY data
        const refDeviceXYData = getPlottableData(
          refDeviceData,
          selectedParameter,
        );

        const currentRegression = regressionResponseData.regression;

        setRegression(currentRegression);
        setRegressionMetricsList(getRegressionMetrics(currentRegression));

        const paramLabel = selectedParameter === "pm2.5cnc" ? "PM₂.₅" : "PM₁₀";
        setSeriesArray([
          { data: maveDeviceXYData, name: `MAVE ${paramLabel}` },
          { data: refDeviceXYData, name: `Ref ${paramLabel}` },
        ]);

        setLoading(false);
        setLaunched(true);
      }
      executeAnalyticsAsyncFunctions();
    }
  };

  return (
    <>
      <Box sx={{ ml: { sm: `${drawerWidth}px` }, mt: "100px", mb: "50px" }}>
        <Box
          className="params-selector"
          sx={{ ml: { xs: "5%", sm: "2%" }, mr: { xs: "10%", sm: "4%" } }}
        >
          {/* Replaced the space consuming buttons with these select Grids*/}
          <Grid container spacing={3} columns={12}>
            <Grid item xs={12} sm={4} lg={1.5}>
              <DurationSelector
                durationButton={durationButton}
                handleDurationButton={handleDurationButton}
                handleDurationPopOverOpen={handleDurationPopOverOpen}
                durationStartDate={durationStartDate}
                durationEndDate={durationEndDate}
              />
            </Grid>
            <Grid item xs={12} sm={4} lg={1.5}>
              <AvgCriteriaSelector
                handleAverageCriteria={handleAverageCriteria}
                average={average}
              />
            </Grid>
            <Grid item xs={12} sm={4} lg={1.5}>
              <TimeStepSelector
                handleTimeStep={handleTimeStep}
                timeStep={timeStep}
              />
            </Grid>
            <Grid item xs={12} sm={4} lg={1.5}>
              <ParameterSelector
                handleParameter={handleParameter}
                parameter={selectedParameter}
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={3}>
              {
                <MonitorSelector
                  handleSelector={handleSelectMaveMonitor}
                  data={deviceData}
                  label="Mave Monitors"
                />
              }
            </Grid>
            <Grid item xs={12} sm={6} lg={3}>
              {
                <MonitorSelector
                  handleSelector={handleSelectNcapMonitor}
                  data={ncapDeviceData}
                  label="Reference Monitors"
                />
              }
            </Grid>
          </Grid>
          <Button
            onClick={handlePlotPoints}
            color="primary"
            variant="contained"
            sx={{ mt: 2, mb: 1, color: "white" }}
          >
            Plot Points
          </Button>
        </Box>

        {/* Validation Error */}
        <Box
          className="validation-error"
          sx={{ display: "flex", justifyContent: "center", mb: 1 }}
        >
          {validationError && (
            <Alert variant="outlined" severity="error">
              <AlertTitle>Error!</AlertTitle>
              <strong>Please select an option from all the fields</strong>
            </Alert>
          )}
        </Box>

        {/* Fetching Regression Analysis data Error */}
        <Box
          className="Regression-error"
          sx={{ display: "flex", justifyContent: "center", mb: 1 }}
        >
          {error && (
            <Alert variant="outlined" severity="error">
              <AlertTitle>Error Occured while fetching data!</AlertTitle>
              {/* <strong>{fetchErrorStatus}</strong> */}
            </Alert>
          )}
        </Box>

        {/* Fetching imei device data Error */}
        <Box
          className="Regression-error"
          sx={{ display: "flex", justifyContent: "center", mb: 1 }}
        >
          {imeiError && (
            <Alert variant="outlined" severity="error">
              <AlertTitle>
                <strong>Error Occured while fetching monitors data!</strong>
              </AlertTitle>
              {/* <strong>{imeiFetchErrorStatus}</strong> */}
            </Alert>
          )}
        </Box>

        {/* Regression Tiles */}
        <Box
          className="regression-tiles"
          sx={{ ml: { xs: "5%", sm: "2%" }, mr: { xs: "2%" }, mb: 1 }}
        >
          {!loading && !validationError && !error && launched && (
            <Grid container spacing={1} columns={9}>
              {regressionMetricsList.map((item) => {
                return (
                  <Grid
                    key={item.regressionMetric}
                    item
                    xs={4.5}
                    sm={3}
                    md={1.8}
                    lg={1}
                  >
                    <CardTiles
                      tileHeading={item.regressionMetric}
                      value={parseFloat(item.value).toFixed(3)}
                    />
                  </Grid>
                );
              })}
            </Grid>
          )}
        </Box>

        {!loading && !validationError && !error && launched && (
          <Box sx={{ ml: { xs: "5%", sm: "2%" }, mr: { xs: "2%" }, mt: 2 }}>
            <Grid container spacing={3} alignItems="stretch">
              <Grid
                item
                xs={12}
                md={7}
                sx={{ display: "flex", flexDirection: "column" }}
              >
                <Box
                  sx={{
                    height: "100%",
                    "& .mui-card-linechart, & .MuiCard-root": {
                      height: "100%",
                    },
                  }}
                >
                  <ApexLineChart
                    yaxisTitle={
                      selectedParameter === "pm2.5cnc" ? "PM₂.₅" : "PM₁₀"
                    }
                    tickAmount={3}
                    series={seriesArray}
                    headerTitle="Regression Analytics Chart"
                  />
                </Box>
              </Grid>
              <Grid
                item
                xs={12}
                md={5}
                sx={{ display: "flex", flexDirection: "column" }}
              >
                {!loading &&
                  !validationError &&
                  !error &&
                  launched &&
                  regression?.X_test && (
                    <RegressionMixedChart
                      regression={regression}
                      selectedParameter={selectedParameter}
                    />
                  )}
              </Grid>
            </Grid>
          </Box>
        )}

        {/* !validationError && !error && launched && */}
        {loading && (
          <Box sx={{ ml: { xs: "5%", sm: "2%" }, mr: { xs: "2%" }, mb: 2 }}>
            <Grid container spacing={1} columns={9} mb={3}>
              {loadingMetrics.map((item) => {
                return (
                  <Grid item key={item} xs={4.5} sm={3} md={1.8} lg={1}>
                    <Skeleton variant="rectangular" height={100} />
                  </Grid>
                );
              })}
            </Grid>
          </Box>
        )}
        {loading && (
          <Box sx={{ ml: { xs: "5%", sm: "2%" }, mr: { xs: "2%" }, mb: 2 }}>
            <Stack direction="row" spacing={2}>
              <Skeleton variant="rounded" width={1000} height={400} />
              <Skeleton variant="rounded" width={400} height={300} />
            </Stack>
          </Box>
        )}
      </Box>
      {/* Duration Selector PopOver */}
      <Popover
        open={customDurationButtonPopover}
        anchorEl={anchorEl}
        onClose={handleDurationPopOverClose}
        // anchorReference="anchorPosition"
        // anchorPosition={{ top: 147, left: 1100 }}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        {/* Content goes here */}
        {/* <CustomDurationPopOver executeCustomDuration={handleCustomDuration} /> */}
        <CustomDurationPopOver executeCustomDuration={handleCustomDuration} />
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-around",
          }}
        >
          <ButtonGroup fullWidth>
            <Button
              onClick={handleDurationPopOverCancel}
              size="large"
              variant="outlined"
              color="error"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDurationPopOverClose}
              size="large"
              variant="outlined"
              color="success"
            >
              Go
            </Button>
          </ButtonGroup>
        </Box>
      </Popover>
    </>
  );
}

// const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
//   "& .MuiToggleButtonGroup-grouped": {
//     // margin: theme.spacing(0.5),
//     borderRadius: "10px",
//     color: "black",
//     // border: 0,
//     "&.Mui-selected": {
//       transition: "0.3s",
//       backgroundColor: "#03C9D7",
//       fontWeight: "bold",
//       color: "white",
//       "&:hover": {
//         backgroundColor: "#03C9D7",
//       },
//     },
//     "&:hover": {
//       backgroundColor: "#dadada",
//       transition: "0.3s",
//     },
//   },
// }));
