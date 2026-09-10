import React, { useContext, useEffect, useMemo, useState } from "react";
import "./index.css";
import { saveAs } from "file-saver";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { useTheme, createTheme, ThemeProvider } from "@mui/material/styles";

import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import IconButton from "@mui/material/IconButton";
import Collapse from "@mui/material/Collapse";
import CloseIcon from "@mui/icons-material/Close";
import Divider from "@mui/material/Divider";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import MonitorOutlinedIcon from "@mui/icons-material/MonitorOutlined";
import TimelineOutlinedIcon from "@mui/icons-material/TimelineOutlined";
import EventOutlinedIcon from "@mui/icons-material/EventOutlined";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import ParkOutlinedIcon from "@mui/icons-material/ParkOutlined";

import Autocomplete from "@mui/material/Autocomplete";
import { styled } from "@mui/material/styles";
import {
  Alert,
  AlertTitle,
  ButtonGroup,
  Card,
  FormControl,
  InputLabel,
  MenuItem,
  Popover,
  Select,
  Tooltip,
} from "@mui/material";

import LoadingButton from "@mui/lab/LoadingButton";
import CustomDurationPopOver from "remote/CustomDurationPopOver";
import AlertSuccessTemp from "remote/AlertSuccessTemp";
import InfoIcon from "@mui/icons-material/Info";
import DownloadProgress from "./DownloadProgress";

const drawerWidth = 260;

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      Respirer Living Sciences {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
  "& .MuiToggleButtonGroup-grouped": {
    // margin: theme.spacing(0.5),
    borderRadius: "10px",
    color: "black",
    // border: 0,
    "&.Mui-selected": {
      transition: "0.3s",
      backgroundColor: theme.palette.mode === "dark" ? "#36878dff" : "#03C9D7",
      fontWeight: "bold",
      color: "white",
      "&:hover": {
        backgroundColor: theme.palette.mode === "dark" ? "#36878dff" : "#03C9D7",
      },
    },
    "&:hover": {
      backgroundColor: theme.palette.mode === "dark" ? "#6b6868ff" : "#c7bebeff",
      transition: "0.3s",
    },
  },
}));

export default function Download(props) {
  const themeMode = props.themeMode || "light";
  const localTheme = useMemo(() => createTheme({ palette: { mode: themeMode } }), [themeMode]);

  return (
    <ThemeProvider theme={localTheme}>
      <DownloadContent {...props} />
    </ThemeProvider>
  );
}

function DownloadContent(props) {
  const { deviceData, downloadProgress } = props;
  const theme = useTheme();

  const today = new Date();
  let sevenDaysAgo = today;
  let thirtyDaysAgo = today;
  const day = ("0" + today.getUTCDate()).slice(-2);
  const month = ("0" + (today.getUTCMonth() + 1)).slice(-2); // getUTCMonth() returns month from 0 to 11
  const year = today.getUTCFullYear();
  const fullDate = `${year}-${month}-${day}`;

  const [durationButton, setDurationButton] = useState("Today");
  const [monitorValue, setMonitorValue] = useState([]);
  const [average, setAverage] = useState("");
  const [timeStep, setTimeStep] = useState("hh");
  const [parameter, setParameter] = useState([]);

  const [durationStartDate, setDurationStartDate] = useState(fullDate);
  const [durationEndDate, setDurationEndDate] = useState(fullDate);

  const [params, setParams] = useState("pm2.5cnc");
  const [validationErrorOpen, setValidationErrorOpen] = useState(false);
  const [imeis, setimeis] = useState();
  const [customDurationButtonPopover, setCustomDurationButtonPopover] =
    useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  // const [allTimeStampsChecked, setAllTimeStampsChecked] = useState(false);
  const [gaps, setGaps] = useState(0);
  const [maxDate, setMaxDate] = useState(182);

  useEffect(() => {
    setValidationErrorOpen(props.downloadStatus.error);
  }, [props.downloadStatus.error]);

  // reset duration on time step change
  useEffect(() => {
    setDurationButton("Today");
    setDurationStartDate(fullDate);
    setDurationEndDate(fullDate);
  }, [timeStep]);

  const handleAverageCriteria = (e) => {
    const targetValue = e.target.value;
    setAverage(targetValue);
  };

  const handleTimeStep = (e) => {
    const targetValue = e.target.value;
    setTimeStep(targetValue);
    if (targetValue === "mm") setMaxDate(0);
    else if (targetValue === "hh") setMaxDate(29);
    else if (targetValue === "dd") setMaxDate(182);
  };

  const handleDurationButton = (event, newButtonValue) => {
    if (newButtonValue === "Today") {
      setDurationStartDate(fullDate);
      setDurationEndDate(fullDate);
      setDurationButton(newButtonValue);
    } else if (newButtonValue === "7 days") {
      sevenDaysAgo.setDate(today.getDate() - 6);
      const day = ("0" + sevenDaysAgo.getUTCDate()).slice(-2);
      const month = ("0" + (sevenDaysAgo.getUTCMonth() + 1)).slice(-2); // getUTCMonth() returns month from 0 to 11
      const year = sevenDaysAgo.getUTCFullYear();
      const sevenDaysAgoFullDate = `${year}-${month}-${day}`;
      setDurationStartDate(sevenDaysAgoFullDate);
      setDurationEndDate(fullDate);
      setDurationButton(newButtonValue);
    } else if (newButtonValue === "30 days") {
      thirtyDaysAgo.setDate(today.getDate() - 29);
      const day = ("0" + thirtyDaysAgo.getUTCDate()).slice(-2);
      const month = ("0" + (thirtyDaysAgo.getUTCMonth() + 1)).slice(-2); // getUTCMonth() returns month from 0 to 11
      const year = thirtyDaysAgo.getUTCFullYear();
      const thirtyDaysAgoFullDate = `${year}-${month}-${day}`;
      setDurationStartDate(thirtyDaysAgoFullDate);
      setDurationEndDate(fullDate);
      setDurationButton(newButtonValue);
    } else if (newButtonValue === "Custom") {
      setDurationButton(newButtonValue);
    }
  };

  const handleDurationPopOverClose = () => {
    setCustomDurationButtonPopover(false);
  };

  const handleDurationPopOverOpen = (event) => {
    if (event.target.value === "Custom") {
      // Custom logic to handle popover open for the "Custom" option
      setCustomDurationButtonPopover(true);
      setAnchorEl(event.currentTarget);
    }
  };

  const handleDurationPopOverCancel = () => {
    setCustomDurationButtonPopover(false);
    setDurationButton("");
    setDurationStartDate("");
    setDurationEndDate("");
  };

  const handleCustomDuration = (customStart, customEnd) => {
    setDurationStartDate(customStart);
    setDurationEndDate(customEnd);
  };

  const handleClickAllMonitors = () => {
    const allImeisList = deviceData.map((item) => {
      return item.imei;
    });
    const allImeisString = allImeisList.join();
    setimeis(allImeisString);
    setMonitorValue(deviceData);
  };

  const handleSelectMonitor = (event, newMonitor) => {
    setMonitorValue([...newMonitor]);

    let imeisString = "";
    for (let i = 0; i < newMonitor.length; i++) {
      if (i === 0) {
        imeisString += `${newMonitor[i].imei}`;
      } else {
        imeisString += `,${newMonitor[i].imei}`;
      }
    }
    setimeis(imeisString);
  };

  const handleParametersButton = (event, newParameters) => {
    setParameter([...newParameters]);
    if (newParameters.length === 0) {
      setParams(parameter[0]);
    } else {
      let paramsString = "";
      for (let i = 0; i < newParameters.length; i++) {
        if (i === 0) {
          paramsString += `${newParameters[i].metric}`;
        } else {
          paramsString += `,${newParameters[i].metric}`;
        }
      }
      setParams(paramsString);
    }
  };

  const selectTimeStepCriteria = (
    <FormControl size="small" fullWidth>
      <InputLabel id="demo-simple-select-label">Time Step</InputLabel>
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={timeStep}
        label="duration"
        onChange={handleTimeStep}
      >
        <MenuItem value={"hh"}>Hours</MenuItem>
        <MenuItem value={"mm"}>Minutes</MenuItem>
        <MenuItem value={"dd"}>Days</MenuItem>
      </Select>
    </FormControl>
  );

  const selectAveragingCriteria = (
    <FormControl size="small" fullWidth>
      <TextField
        size="small"
        id="time-step"
        variant="outlined"
        value={average}
        onChange={handleAverageCriteria}
        type="number"
        label="Averaging Criteria"
        InputProps={{
          inputProps: { min: 1, max: 100 },
        }}
      />
    </FormControl>
  );

  useEffect(() => {
    props.onUrlDataChange({
      imeis,
      params,
      durationStartDate,
      durationEndDate,
      timeStep,
      average,
      gaps,
    });
  }, [
    imeis,
    params,
    durationStartDate,
    durationEndDate,
    timeStep,
    average,
    gaps,
  ]);

  return (
    <>
      <Box
        className="download-container"
        sx={{
          ml: { sm: `${drawerWidth}px` },
          mt: 7,
          mb: 3,
          px: { xs: 2, md: 5 },
          display: "flex",
          flexDirection: "column",
          gap: 3,
        }}
      >
        <CssBaseline />
        {props.fetchDeviceDataStatus.error && (
          <Alert variant="outlined" severity="error" align="center" sx={{ m: 2 }}>
            <AlertTitle>Error Occurred while fetching monitors data!</AlertTitle>
            <strong>{props.fetchDeviceDataStatus.errorMsg}</strong>
          </Alert>
        )}

        {/* Top Header Card */}
        <Card
          sx={{
            padding: "24px 32px",
            boxShadow: theme.palette.mode === "dark" ? "none" : "0px 4px 20px rgba(0, 0, 0, 0.05)",
            borderRadius: "16px",
            display: "flex",
            alignItems: "center",
            background: theme.palette.mode === "dark" ? "linear-gradient(to right, #1E293B, #16243A)" : "linear-gradient(to right, #ffffff, #f0fdfd)",
            border: theme.palette.mode === "dark" ? "1px solid #334155" : "1px solid #e0f2f1",
          }}
        >
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: "50%",
              backgroundColor: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.05)" : "#f8f9fc",
              border: theme.palette.mode === "dark" ? "1px solid rgba(255, 255, 255, 0.1)" : "1px solid #e0e0e0",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              mr: 3,
            }}
          >
            <DescriptionOutlinedIcon sx={{ color: theme.palette.mode === "dark" ? "#60a5fa" : "#1976d2" }} />
          </Box>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h5" sx={{ fontWeight: 700, color: theme.palette.mode === "dark" ? "#F1F5F9" : "#2c3e50" }}>
              Download Data
            </Typography>
            <Typography variant="body2" sx={{ color: theme.palette.mode === "dark" ? "#94A3B8" : "#7f8c8d" }}>
              Export air quality data tailored to your needs.
            </Typography>
          </Box>
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              backgroundColor: "#80deea",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              opacity: 0.8,
            }}
          >
            <CloudDownloadIcon sx={{ color: "#ffffff", fontSize: 40 }} />
          </Box>
        </Card>

        {/* Main Content Card */}
        <Card
          sx={{
            padding: { xs: "20px", md: "40px" },
            boxShadow: theme.palette.mode === "dark" ? "0px 8px 30px rgba(0, 0, 0, 0.3)" : "0px 8px 30px rgba(0, 0, 0, 0.04)",
            borderRadius: "20px",
            border: theme.palette.mode === "dark" ? "1px solid rgba(255, 255, 255, 0.1)" : "1px solid rgba(0, 0, 0, 0.03)",
          }}
        >
          {/********* ROW 1: Monitors & Averaging *********/}
          <Grid container spacing={6}>
            <Grid item xs={12} md={6} sx={{ pr: { md: 6 }, borderRight: { md: "1px solid rgba(0, 0, 0, 0.08)" }, mb: { xs: 4, md: 0 } }}>
              <Box sx={{ display: "flex", alignItems: "flex-start", mb: 2 }}>
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    backgroundColor: theme.palette.mode === "dark" ? "rgba(0, 172, 193, 0.15)" : "#e0f7fa",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    mr: 2,
                  }}
                >
                  <MonitorOutlinedIcon sx={{ color: "#00acc1", fontSize: 18 }} />
                </Box>
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                    1. Select Monitors
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#7f8c8d" }}>
                    Choose the monitors you want to include.
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ position: "relative", mt: 1 }}>
                <Button
                  disabled={props.fetchDeviceDataStatus.loading}
                  variant="text"
                  onClick={handleClickAllMonitors}
                  sx={{ position: "absolute", top: "-36px", right: 0, fontSize: "12px", fontWeight: "bold", color: "#00acc1" }}
                >
                  ALL
                </Button>
                <Autocomplete
                  fullWidth
                  size="small"
                  value={monitorValue}
                  onChange={handleSelectMonitor}
                  multiple
                  id="tags-standard"
                  options={deviceData}
                  getOptionLabel={(option) =>
                    option.locality
                      ? `${option.locality} (${option.imei})`
                      : `(${option.imei})`
                  }
                  defaultValue={[deviceData[13]]}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      label="Monitors"
                      placeholder="select more monitors"
                    />
                  )}
                />
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box sx={{ display: "flex", alignItems: "flex-start", mb: 2 }}>
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    backgroundColor: theme.palette.mode === "dark" ? "rgba(0, 172, 193, 0.15)" : "#e0f7fa",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    mr: 2,
                  }}
                >
                  <TimelineOutlinedIcon sx={{ color: "#00acc1", fontSize: 18 }} />
                </Box>
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                    2. Select Averaging Criteria
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#7f8c8d" }}>
                    Choose how you want the data to be averaged.
                  </Typography>
                </Box>
              </Box>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  {selectAveragingCriteria}
                </Grid>
                <Grid item xs={12} sm={6}>
                  {selectTimeStepCriteria}
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Divider sx={{ my: { xs: 4, md: 5 }, borderColor: "rgba(0, 0, 0, 0.08)" }} />

          {/********* ROW 2: Duration & Info Box *********/}
          <Grid container spacing={6}>
            <Grid item xs={12} md={8}>
              <Box sx={{ display: "flex", alignItems: "flex-start", mb: 2 }}>
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    backgroundColor: theme.palette.mode === "dark" ? "rgba(0, 172, 193, 0.15)" : "#e0f7fa",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    mr: 2,
                  }}
                >
                  <EventOutlinedIcon sx={{ color: "#00acc1", fontSize: 18 }} />
                </Box>
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                    3. {props.downloadToolOptions.select1.selectionTitle || "Duration"}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#7f8c8d" }}>
                    Select the duration for which you want to download data.
                  </Typography>
                </Box>
              </Box>

              <StyledToggleButtonGroup
                color="primary"
                value={durationButton}
                exclusive
                onChange={handleDurationButton}
                fullWidth
                size="medium"
                sx={{ mt: 1 }}
              >
                {props.downloadToolOptions.select1.options.map((option) => (
                  <ToggleButton
                    key={option}
                    value={option}
                    onClick={handleDurationPopOverOpen}
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      py: 1,
                      textTransform: "uppercase",
                      border: theme.palette.mode === "dark" ? "1px solid rgba(0, 0, 0, 0.08)" : "1px solid rgba(0, 0, 0, 0.08)"
                    }}
                  >
                    <EventOutlinedIcon sx={{ color: theme.palette.mode === "dark" ? "#eafcfeff" : "#121212ff", mb: 0.5, fontSize: 18 }} />
                    <Typography variant="subtitle1" sx={{ color: theme.palette.mode === "dark" ? "#e4f1f2ff" : "#1a1a1aff", textTransform: "capitalize", fontWeight: 500 }}>
                      {option === "Custom" &&
                        durationButton === "Custom" &&
                        durationStartDate &&
                        durationEndDate
                        ? `${durationStartDate} - ${durationEndDate}`
                        : option}
                    </Typography>
                  </ToggleButton>
                ))}
              </StyledToggleButtonGroup>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box
                sx={{
                  backgroundColor: theme.palette.mode === "dark" ? "rgba(25, 118, 210, 0.08)" : "#f4f6f8",
                  borderRadius: "12px",
                  p: 3,
                  height: "100%",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <ErrorOutlineIcon sx={{ color: theme.palette.mode === "dark" ? "#60a5fa" : "#1976d2", fontSize: 18, mr: 1 }} />
                  <Typography variant="subtitle2" sx={{ color: theme.palette.mode === "dark" ? "#60a5fa" : "#1976d2", fontWeight: 700 }}>
                    About Duration
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ color: theme.palette.mode === "dark" ? "#94A3B8" : "#546e7a", ml: 3 }}>
                  Select a predefined range or custom date range to fetch the data you need.
                </Typography>
              </Box>
            </Grid>
          </Grid>

          <Divider sx={{ my: { xs: 4, md: 5 }, borderColor: "rgba(0, 0, 0, 0.08)" }} />

          {/********* ROW 3: Parameters & Info Box *********/}
          <Grid container spacing={6}>
            <Grid item xs={12} md={8}>
              <Box sx={{ display: "flex", alignItems: "flex-start", mb: 2 }}>
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    backgroundColor: theme.palette.mode === "dark" ? "rgba(0, 172, 193, 0.15)" : "#e0f7fa",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    mr: 2,
                  }}
                >
                  <FilterAltOutlinedIcon sx={{ color: "#00acc1", fontSize: 18 }} />
                </Box>
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                    4. Select Parameters
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#7f8c8d" }}>
                    Choose the parameters / pollutants to include in your download.
                  </Typography>
                </Box>
              </Box>
              <Autocomplete
                size="small"
                fullWidth
                value={parameter}
                onChange={handleParametersButton}
                multiple
                id="tags-standard2"
                options={props.dropDownParamsList}
                getOptionLabel={(option) => option.label}
                sx={{ mt: 1 }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="outlined"
                    label="Pollutants"
                    placeholder="select Pollutants"
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Box
                sx={{
                  backgroundColor: theme.palette.mode === "dark" ? "rgba(76, 175, 80, 0.08)" : "#f1f8e9",
                  borderRadius: "12px",
                  p: 3,
                  height: "100%",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <FilterAltOutlinedIcon sx={{ color: theme.palette.mode === "dark" ? "#4ade80" : "#4caf50", fontSize: 18, mr: 1 }} />
                  <Typography variant="subtitle2" sx={{ color: theme.palette.mode === "dark" ? "#4ade80" : "#388e3c", fontWeight: 700 }}>
                    Multiple pollutants selection
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ color: theme.palette.mode === "dark" ? "#94A3B8" : "#558b2f", ml: 3 }}>
                  You can select multiple pollutants based on your requirements.
                </Typography>
              </Box>
            </Grid>
          </Grid>

          <Divider sx={{ mt: { xs: 4, md: 5 }, mb: 4, borderColor: "rgba(0, 0, 0, 0.08)" }} />

          {/********* SUBMIT BUTTON *********/}
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <Collapse in={validationErrorOpen} sx={{ width: "100%", maxWidth: "600px" }}>
              {props.downloadStatus.error && (
                <Alert
                  action={
                    <IconButton
                      aria-label="close"
                      color="inherit"
                      size="small"
                      onClick={() => {
                        setValidationErrorOpen(false);
                      }}
                    >
                      <CloseIcon fontSize="inherit" />
                    </IconButton>
                  }
                  variant="outlined"
                  severity="error"
                  sx={{ mb: 3 }}
                >
                  <strong>
                    Please select a value from all options before submitting.
                  </strong>
                </Alert>
              )}
            </Collapse>

            <LoadingButton
              sx={{
                mt: 1,
                mb: 2,
                color: "white",
                backgroundColor: "#03C9D7",
                borderRadius: "8px",
                padding: "12px 64px",
                fontSize: "16px",
                fontWeight: 600,
                boxShadow: "0 4px 14px rgba(3, 201, 215, 0.4)",
                "&:hover": {
                  backgroundColor: "#02b4c1",
                  boxShadow: "0 6px 20px rgba(3, 201, 215, 0.6)",
                }
              }}
              onClick={props.onSubmitDownload}
              variant="contained"
              startIcon={<CloudDownloadIcon />}
              loadingPosition="start"
              loading={props.downloadStatus.loading}
            >
              <span>
                {props.downloadStatus.loading
                  ? "Preparing your file..."
                  : "DOWNLOAD DATA"}
              </span>
            </LoadingButton>
          </Box>
        </Card>

        <Popover
          open={customDurationButtonPopover}
          onClose={handleDurationPopOverClose}
          anchorReference="anchorPosition"
          anchorPosition={{ top: 247, left: 1100 }}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
        >
          <CustomDurationPopOver
            executeCustomDuration={handleCustomDuration}
            customStart={durationStartDate}
            customEnd={durationEndDate}
          />
          <Box>
            <ButtonGroup fullWidth>
              <Button
                onClick={handleDurationPopOverCancel}
                size="large"
                variant="outlined"
                color="error"
                fullWidth
              >
                Cancel
              </Button>
              <Button
                onClick={handleDurationPopOverClose}
                size="large"
                variant="outlined"
                color="success"
                fullWidth
              >
                Go
              </Button>
            </ButtonGroup>
          </Box>
        </Popover>

        {/* Download success message */}
        {!props.downloadStatus.error && props.downloadStatus.loading && (
          <AlertSuccessTemp
            successMsg="Your download is being prepared. For larger datasets, this process can take a few minutes—please don’t close this window."
            open={props.downloadStatus.loading}
            bottom="-28%"
            widthPerc="40%"
            left={{ xs: "8%", sm: "28%" }}
            duration={10000}
          />
        )}
      </Box>

      <Copyright sx={{ mt: 8, mb: 4 }} />
    </>
  );
}
