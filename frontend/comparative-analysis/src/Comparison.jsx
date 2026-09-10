import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import {
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  TextField,
  Alert,
  AlertTitle,
  Popover,
  ButtonGroup,
  Typography,
  Divider,
  ToggleButtonGroup,
  ToggleButton,
  Skeleton,
} from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import { styled } from "@mui/material/styles";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import CustomDurationPopOver from "remote/CustomDurationPopOver";
import IconButton from "@mui/material/IconButton";
import ApexLineChart from "remote/ApexLineChart";
const csv = require("csvtojson");
import "./compare.css";
import getApexPlottableData from "./utils/getApexPlottableData";

const drawerWidth = 260;
let monitorPoints;
let csvURLDevice1;
let csvURLDevice2;
let csvURLDevice3;
let csvURLDevice4;
let csvString;
const theme = createTheme({
  typography: {
    fontFamily: "Open Sans, sans-serif",
    fontSize: 14,
  },
  palette: {
    primary: {
      main: "#03C9D7",
      light: "#757ce8",
    },
    secondary: {
      main: "#f44336",
    },
  },
  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: "10px",
          backgroundColor: "#f8f9fc",
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#03C9D7",
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#03C9D7",
            borderWidth: "2px",
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: "8px",
          fontSize: "14px",
          "&:hover": {
            boxShadow: "0px 4px 12px rgba(3, 201, 215, 0.4)",
          },
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          borderRadius: "12px",
          boxShadow: "0px 4px 20px rgba(0,0,0,0.05)",
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          fontSize: "14px",
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          fontSize: "14px",
        },
      },
    },
  },
});

export default function Comparison(props) {
  let allMetricsString = props.dropDownParamsList
    .map((metricItem) => metricItem.metric)
    .join(",");
  const today = new Date();
  let sevenDaysAgo = today;
  let thirtyDaysAgo = today;
  const day = ("0" + today.getUTCDate()).slice(-2);
  const month = ("0" + (today.getUTCMonth() + 1)).slice(-2); // getUTCMonth() returns month from 0 to 11
  const year = today.getUTCFullYear();
  const fullDate = `${year}-${month}-${day}`;

  const username = props.username;
  const api_key = localStorage.getItem("api_key");
  const imeiURL = `https://api.yourdomain.com/adp/v4/check_user_imei/user/${username}`;

  const [durationStartDateMui, setDurationStartDateMui] = useState();
  const [durationEndDateMui, setDurationEndDateMui] = useState();
  const [average, setAverage] = useState("");
  const [timeStep, setTimeStep] = useState("");
  const [pollutant, setPollutant] = useState("pm2.5cnc");
  const [pollutantLabel, setPollutantLabel] = useState("PM₂.₅");
  const [deviceData, setDeviceData] = useState([]);
  // const [sampleDeviceData, setSampleDeviceData] = useState(initialDeviceData);
  // const [loading, setLoading] = useState();
  const [loadingDevice1, setLoadingDevice1] = useState(true);
  const [launched, setLaunched] = useState(false);
  const [loadingDevice2, setLoadingDevice2] = useState(true);
  const [launchedDevice2, setLaunchedDevice2] = useState(false);
  1;
  const [loadingDevice3, setLoadingDevice3] = useState(true);
  const [launchedDevice3, setLaunchedDevice3] = useState(false);
  const [loadingDevice4, setLoadingDevice4] = useState(true);
  const [launchedDevice4, setLaunchedDevice4] = useState(false);
  const [validationError, setValidationError] = useState(true);
  const [imeiLoading, setImeiLoading] = useState(false);
  const [imeiError, setImeiError] = useState(false);
  const [imeiFetchErrorStatus, setImeiFetchErrorStatus] = useState(false);
  const [customDurationButtonPopover, setCustomDurationButtonPopover] =
    useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [customDurationStartDate, setCustomDurationStartDate] = useState(null);
  const [customDurationEndDate, setCustomDurationEndDate] = useState(null);
  const [finalXYDataState, setfinalXYDataState] = useState([]);
  const [device2XYDataState, setDevice2XYDataState] = useState([]);
  const [device3XYDataState, setDevice3XYDataState] = useState([]);
  const [device4XYDataState, setDevice4XYDataState] = useState([]);
  const [fetchCSVDataHasError, setFetchCSVDataHasError] = useState(false);
  const [fetchErrorStatus, setFetchErrorStatus] = useState();
  const [fetchIMEIDataHasError, setFetchIMEIDataHasError] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(false);
  // const [customDurationEndDate, setCustomDurationEndDate] = useState(null);
  // const [customDurationEndDate, setCustomDurationEndDate] = useState(null);
  const [viewType, setViewType] = useState(null);
  const [sameMonitor, setSameMonitor] = useState();
  const [sameMonitorLocation, setSameMonitorLocation] = useState();
  const [durationButton, setDurationButton] = useState();
  const [anchorElMuiDuration, setAnchorElMuiDuration] = useState(null);

  const [deviceOptionList, setDeviceOptionList] = useState([
    {
      duration: "",
      monitor: "",
      durationStartDate: "",
      durationEndDate: "",
    },
  ]);

  const handleDurationButton = (e, index) => {
    const targetValue = e.target.value;
    setDurationButton(targetValue);

    const list = [...deviceOptionList];
    if (viewType === "sameMonitor") {
      if (targetValue === "today") {
        // setDurationStartDate(fullDate);
        // setDurationEndDate(fullDate);
        list[index]["durationStartDate"] = fullDate;
        list[index]["durationEndDate"] = fullDate;
        setDeviceOptionList(list);
      } else if (targetValue === "7days") {
        sevenDaysAgo.setDate(today.getDate() - 6);
        const day = ("0" + sevenDaysAgo.getUTCDate()).slice(-2);
        const month = ("0" + (sevenDaysAgo.getUTCMonth() + 1)).slice(-2); // getUTCMonth() returns month from 0 to 11
        const year = sevenDaysAgo.getUTCFullYear();
        const sevenDaysAgoFullDate = `${year}-${month}-${day}`;
        // setDurationStartDate(sevenDaysAgoFullDate);
        // setDurationEndDate(fullDate);
        list[index]["durationStartDate"] = sevenDaysAgoFullDate;
        list[index]["durationEndDate"] = fullDate;
        setDeviceOptionList(list);
      } else if (targetValue === "30days") {
        thirtyDaysAgo.setDate(today.getDate() - 29);
        const day = ("0" + thirtyDaysAgo.getUTCDate()).slice(-2);
        const month = ("0" + (thirtyDaysAgo.getUTCMonth() + 1)).slice(-2); // getUTCMonth() returns month from 0 to 11
        const year = thirtyDaysAgo.getUTCFullYear();
        const thirtyDaysAgoFullDate = `${year}-${month}-${day}`;
        // setDurationStartDate(thirtyDaysAgoFullDate);
        // setDurationEndDate(fullDate);
        list[index]["durationStartDate"] = thirtyDaysAgoFullDate;
        list[index]["durationEndDate"] = fullDate;
        setDeviceOptionList(list);
      } else if (targetValue === "custom") {
        const currentTarget = e.currentTarget;
        setAnchorEl(currentTarget);
        handleDurationPopOverOpen();
        setCurrentIndex(index);
      }
    } else {
      if (targetValue === "today") {
        list.map((item) => {
          item.durationStartDate = fullDate;
          item.durationEndDate = fullDate;
        });
        setDurationStartDateMui(fullDate);
        setDurationEndDateMui(fullDate);
        setDeviceOptionList(list);
      } else if (targetValue === "7days") {
        sevenDaysAgo.setDate(today.getDate() - 6);
        const day = ("0" + sevenDaysAgo.getUTCDate()).slice(-2);
        const month = ("0" + (sevenDaysAgo.getUTCMonth() + 1)).slice(-2); // getUTCMonth() returns month from 0 to 11
        const year = sevenDaysAgo.getUTCFullYear();
        const sevenDaysAgoFullDate = `${year}-${month}-${day}`;

        list.map((item) => {
          item.durationStartDate = sevenDaysAgoFullDate;
          item.durationEndDate = fullDate;
        });
        setDurationStartDateMui(sevenDaysAgoFullDate);
        setDurationEndDateMui(fullDate);
        setDeviceOptionList(list);
      } else if (targetValue === "30days") {
        thirtyDaysAgo.setDate(today.getDate() - 29);
        const day = ("0" + thirtyDaysAgo.getUTCDate()).slice(-2);
        const month = ("0" + (thirtyDaysAgo.getUTCMonth() + 1)).slice(-2); // getUTCMonth() returns month from 0 to 11
        const year = thirtyDaysAgo.getUTCFullYear();
        const thirtyDaysAgoFullDate = `${year}-${month}-${day}`;

        list.map((item) => {
          item.durationStartDate = thirtyDaysAgoFullDate;
          item.durationEndDate = fullDate;
        });
        setDurationStartDateMui(thirtyDaysAgoFullDate);
        setDurationEndDateMui(fullDate);

        setDeviceOptionList(list);
      } else if (targetValue === "custom") {
        const currentTarget = e.currentTarget;
        setAnchorEl(currentTarget);
        handleDurationPopOverOpen();
        setCurrentIndex(index);
      }
    }
  };

  const handleDurationButtonClick = (e) => {
    setAnchorElMuiDuration(e.currentTarget);
  };

  const handleAverageCriteria = (e) => {
    const targetValue = e.target.value;
    setAverage(targetValue);
  };

  const handleTimeStep = (e) => {
    const targetValue = e.target.value;
    setTimeStep(targetValue);
  };

  const handleMonitorAdd = () => {
    if (viewType === "sameMonitor") {
      setDeviceOptionList([
        ...deviceOptionList,
        { duration: "", monitor: sameMonitor },
      ]);
    }

    if (viewType === "differentMonitor") {
      if (durationStartDateMui && durationEndDateMui) {
        setDeviceOptionList([
          ...deviceOptionList,
          {
            duration: "",
            monitor: "",
            durationStartDate: durationStartDateMui,
            durationEndDate: durationEndDateMui,
          },
        ]);
      } else {
        setDeviceOptionList([
          ...deviceOptionList,
          { duration: "", monitor: "" },
        ]);
      }
    }
  };

  const handleMonitorRemove = (index) => {
    const list = [...deviceOptionList];
    const removed = list.splice(index, 1);
    setDeviceOptionList(list);
  };

  const handleSelectMaveMonitor = (e, newMaveMonitor) => {
    const monitorImei = newMaveMonitor.imei;
    const location = newMaveMonitor.locality;
    setSameMonitor(monitorImei);
    setSameMonitorLocation(location);
    const updatedDeviceList = deviceOptionList.map((deviceItem) => {
      const { ...rest } = deviceItem;
      return {
        ...rest,
        "location-name": newMaveMonitor.locality,
        monitor: newMaveMonitor.imei,
      };
    });
    setDeviceOptionList(updatedDeviceList);
  };

  const handlePollutantChange = (event) => {
    const metric = event.target.value;
    const selectedItem = props.dropDownParamsList.find(
      (item) => item.metric === metric,
    );

    setPollutant(metric);
    setPollutantLabel(selectedItem?.label || metric);
  };

  const handleDurationPopOverClose = () => {
    setCustomDurationButtonPopover(false);
  };

  const handleCustomDuration = (customStart, customEnd) => {
    setCustomDurationStartDate(customStart);
    setCustomDurationEndDate(customEnd);
  };

  const handleDurationPopOverSubmit = () => {
    const list = [...deviceOptionList];
    if (viewType === "sameMonitor") {
      const finalIndex = currentIndex;
      list[finalIndex].durationStartDate = customDurationStartDate;
      list[finalIndex].durationEndDate = customDurationEndDate;
    } else if (viewType === "differentMonitor") {
      list.map((item) => {
        item.durationStartDate = customDurationStartDate;
        item.durationEndDate = customDurationEndDate;
      });
      // This is because I need to set the MUI duration selectors value and change durations accordingly when and if the user adds more monitors for different monitors comparison
      setDurationStartDateMui(customDurationStartDate);
      setDurationEndDateMui(customDurationEndDate);
    }

    setCustomDurationButtonPopover(false);
  };

  const handleDurationPopOverOpen = () => {
    setCustomDurationButtonPopover(true);
  };

  const handleDurationPopOverCancel = () => {
    setCustomDurationButtonPopover(false);
    const list = [...deviceOptionList];
    list[index].durationStartDate = "";
    list[index].durationEndDate = "";
    setCustomDurationButtonPopover(false);
  };

  const handleComparisonType = (event, nextView) => {
    if (nextView !== null) {
      setViewType(nextView);
    }
    setLaunched(false);

    setDurationButton(null);

    setDeviceOptionList([
      {
        duration: "",
        monitor: "",
        durationStartDate: "",
        durationEndDate: "",
      },
      {
        duration: "",
        monitor: "",
        durationStartDate: "",
        durationEndDate: "",
      },
    ]);
  };

  //custom styles for ToggleButton
  const StyledToggleButton = styled(ToggleButton)(({ theme }) => ({
    marginRight: "10px",
    padding: "8px 24px",
    borderRadius: "24px !important",
    border: "1px solid rgba(0,0,0,0.08) !important",
    backgroundColor: "#f8f9fc",
    color: "#555",
    textTransform: "none",
    fontSize: "14px",
    fontWeight: 600,
    transition: "all 0.3s ease",
    boxShadow: "0 2px 4px rgba(0,0,0,0.02)",
    "&.Mui-selected": {
      backgroundColor: "#03C9D7",
      color: "#ffffff",
      boxShadow: "0 4px 12px rgba(3, 201, 215, 0.4)",
      borderColor: "#03C9D7 !important",
      "&:hover": {
        backgroundColor: "#02b4c1",
      },
    },
    "&:hover": {
      backgroundColor: "#edf0f7",
      transform: "translateY(-1px)",
    },
  }));

  const selectDuration = (index) => {
    return (
      <select
        className="comparison-controllers"
        value={deviceOptionList[index].duration}
        label="duration"
        onChange={(e) => {
          handleDurationButton(e, index);
          const targetValue = e.target.value;
          const targetIndex = index;

          const list = [...deviceOptionList];
          list[targetIndex]["duration"] = targetValue;
          if (viewType === "sameMonitor") {
            list[targetIndex]["monitor"] = sameMonitor;
            deviceOptionList.map((item) => {
              item["location-name"] = sameMonitorLocation;
            });
          }
          setDeviceOptionList(list);
        }}
      >
        <option disabled value="">
          Select a duration
        </option>
        <option className="options" value={"today"}>
          Today
        </option>
        <option className="options" value={"7days"}>
          7 Days
        </option>
        <option className="options" value={"30days"}>
          30 Days
        </option>
        <option className="options" value={"custom"}>
          Custom
        </option>
      </select>
    );
  };

  const selectDurationMui = (
    <FormControl size="small" fullWidth>
      <InputLabel id="demo-simple-select-label">Duration</InputLabel>
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={durationButton}
        label="duration"
        onChange={handleDurationButton}
        onClick={handleDurationButtonClick}
      >
        <MenuItem value={"today"}>Today</MenuItem>
        <MenuItem value={"7days"}>7 Days</MenuItem>
        <MenuItem value={"30days"}>30 Days</MenuItem>
        <MenuItem value={"custom"} onClick={handleDurationPopOverOpen}>
          {deviceOptionList[0]["durationStartDate"] &&
          deviceOptionList[0]["durationEndDate"]
            ? `${deviceOptionList[0]["durationStartDate"]} - ${deviceOptionList[0]["durationEndDate"]}`
            : "Custom"}
        </MenuItem>
      </Select>
    </FormControl>
  );

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

  // I have used native html <select> tag instead of MUI because I could not pass event trigger to specifically get the value for a single select option (i,e it used to apply those changes to all options in MUI)
  const selectMaveMonitor = (index) => (
    <select
      className="comparison-controllers locality-selector"
      onChange={(e) => {
        const targetValue = e.target.value;
        // e.target[e.target.selectedIndex].text
        const targetName = e.target[e.target.selectedIndex].text;
        const targetIndex = index;
        const list = [...deviceOptionList];
        list[targetIndex]["monitor"] = targetValue;
        list[targetIndex]["location-name"] = targetName;
        setDeviceOptionList(list);
      }}
      value={deviceOptionList[index].monitor}
    >
      <option disabled value="">
        Select a Device
      </option>
      {deviceData.length > 0 &&
        deviceData.map((device) => {
          return (
            <option value={device.imei}>
              {device.locality} ({device.imei})
            </option>
          );
        })}
    </select>
  );

  const selectPollutant = (
    <FormControl size="small" fullWidth>
      <InputLabel id="demo-simple-select-label">Pollutant</InputLabel>
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={pollutant}
        label="pollutant"
        onChange={handlePollutantChange}
      >
        {props.dropDownParamsList.map((item) => (
          <MenuItem value={item.metric}>{item.label}</MenuItem>
        ))}
      </Select>
    </FormControl>
  );

  const selectMaveMonitorMui = (
    <Autocomplete
      size="small"
      disablePortal
      id="combo-box-demo"
      onChange={handleSelectMaveMonitor}
      options={deviceData}
      getOptionLabel={(option) =>
        option.locality
          ? `${option.locality} (${option.imei})`
          : `(${option.imei})`
      }
      renderInput={(params) => <TextField {...params} label="Mave Monitors" />}
    />
  );

  // Fetch IMEI data from server and make a list of imeis with their locality
  useEffect(() => {
    async function fetchIMEIData() {
      try {
        const res = await fetch(imeiURL);
        if (!res.ok) {
          setImeiLoading(false);
          setImeiError(true);
          setImeiFetchErrorStatus(res.status + " " + res.statusText + "!");
        } else {
          const response = res.json();
          return response;
        }
      } catch (err) {
        setImeiLoading(false);
        setImeiError(true);
        setImeiFetchErrorStatus("error CAUGHT while fetching data");
      }
    }

    async function callAsyncFunctions() {
      const res = await fetchIMEIData();
      monitorPoints = res.imei_details.map((elem) => {
        let imeiDetailsObject = {
          imei: elem.imei,
          locality:
            elem.values[0].locality !== (null || undefined)
              ? elem.values[0].locality
              : elem.values[0].imei,
          city: elem.values[0].city,
        };
        return imeiDetailsObject;
      });

      setDeviceData(monitorPoints);
    }

    callAsyncFunctions();
  }, []);

  const handlePlotComparePoints = () => {
    setTimeout(() => {
      window.scrollTo({
        top: 5500,
        behavior: "smooth",
      });
    }, [500]);
    // setError(false);
    setValidationError(false);
    setLaunched(true);

    // form validation
    if (
      deviceOptionList.some(
        (item) =>
          item.monitor === "" ||
          item.durationStartDate === "" ||
          item.durationEndDate === "",
      ) ||
      timeStep === "" ||
      average === ""
    ) {
      setValidationError(true);
    } else {
      setValidationError(false);
      setLoadingDevice1(true);
      setLoadingDevice2(true);
      setLoadingDevice3(true);
      setLoadingDevice4(true);
      const device1 = deviceOptionList[0].monitor;
      const device1DurationStartDate = deviceOptionList[0].durationStartDate;
      const device1DurationEndDate = deviceOptionList[0].durationEndDate;

      const fetchDataForDevice1 = async () => {
        csvURLDevice1 = `https://api.yourdomain.com/adp/v4/getDeviceDataParam/imei/${device1}/params/${allMetricsString}/startdate/${device1DurationStartDate}T00:00/enddate/${device1DurationEndDate}T23:59/ts/${timeStep}/avg/${average}/api/${api_key}`;
        try {
          const res = await fetch(csvURLDevice1, {
            method: "get",
            headers: {
              "content-type": "text/csv;charset=UTF-8",
            },
          });
          if (!res.ok) {
            setFetchCSVDataHasError(true);
            setFetchErrorStatus(res.status + " " + res.statusText + "!");
          }
          return new Promise((resolve, reject) => {
            if (res.status === 200) {
              res.text().then((data) => {
                csvString = data;
                resolve(csvString);
              });
            } else {
              reject("error occured while fetching CSV data");
            }
          });
        } catch (err) {
          setFetchCSVDataHasError(true);
          setFetchErrorStatus(err + "!");
        }
      };

      function getProcessedData(csvString) {
        // convert the csvstring to jsonObj
        return new Promise((resolve, reject) => {
          csv()
            .fromString(csvString)
            .then((deviceData) => {
              resolve(deviceData);
            });
        });
      }

      async function executeAsyncFunctions() {
        const response = await fetchDataForDevice1();

        const JsonData = await getProcessedData(response);
        const finalXYData = await getApexPlottableData(JsonData, pollutant);
        setfinalXYDataState(finalXYData);

        setLoadingDevice1(false);
      }
      executeAsyncFunctions();

      if (deviceOptionList.length > 1) {
        var device2 = deviceOptionList[1].monitor;
        var device2DurationStartDate = deviceOptionList[1].durationStartDate;
        var device2DurationEndDate = deviceOptionList[1].durationEndDate;

        const fetchDataForDevice2 = async () => {
          csvURLDevice2 = `https://api.yourdomain.com/adp/v4/getDeviceDataParam/imei/${device2}/params/${allMetricsString}/startdate/${device2DurationStartDate}T00:00/enddate/${device2DurationEndDate}T23:59/ts/${timeStep}/avg/${average}/api/${api_key}`;

          const res = await fetch(csvURLDevice2, {
            method: "get",
            headers: {
              "content-type": "text/csv;charset=UTF-8",
            },
          });
          if (!res.ok) {
            setFetchCSVDataHasError(true);
            setFetchErrorStatus(res.status + " " + res.statusText + "!");
          }
          return new Promise((resolve, reject) => {
            if (res.status === 200) {
              res.text().then((data) => {
                csvString = data;
                resolve(csvString);
              });
            } else {
              reject("error occured while fetching CSV data");
            }
          });
        };

        function getProcessedDataForDevice2(csvString) {
          // convert the csvstring to jsonObj
          return new Promise((resolve, reject) => {
            csv()
              .fromString(csvString)
              .then((deviceData) => {
                resolve(deviceData);
              });
          });
        }

        async function device2ExecuteAsyncFunctions() {
          const response2 = await fetchDataForDevice2();
          const device2JsonData = await getProcessedDataForDevice2(response2);
          const device2FinalXYData = await getApexPlottableData(
            device2JsonData,
            pollutant,
          );

          setDevice2XYDataState(device2FinalXYData);

          setLoadingDevice2(false);
        }
        device2ExecuteAsyncFunctions();
      }

      if (deviceOptionList.length > 2) {
        var device3 = deviceOptionList[2].monitor;
        var device3DurationStartDate = deviceOptionList[2].durationStartDate;
        var device3DurationEndDate = deviceOptionList[2].durationEndDate;

        const fetchDataForDevice3 = async () => {
          csvURLDevice3 = `https://api.yourdomain.com/adp/v4/getDeviceDataParam/imei/${device3}/params/${allMetricsString}/startdate/${device3DurationStartDate}T00:00/enddate/${device3DurationEndDate}T23:59/ts/${timeStep}/avg/${average}/api/${api_key}`;

          const res = await fetch(csvURLDevice3, {
            method: "get",
            headers: {
              "content-type": "text/csv;charset=UTF-8",
            },
          });
          if (!res.ok) {
            setFetchCSVDataHasError(true);
            setFetchErrorStatus(res.status + " " + res.statusText + "!");
          }
          return new Promise((resolve, reject) => {
            if (res.status === 200) {
              res.text().then((data) => {
                csvString = data;
                resolve(csvString);
              });
            } else {
              reject("error occured while fetching CSV data");
            }
          });
        };

        function getProcessedDataForDevice3(csvString) {
          // convert the csvstring to jsonObj
          return new Promise((resolve, reject) => {
            csv()
              .fromString(csvString)
              .then((deviceData) => {
                resolve(deviceData);
              });
          });
        }

        async function device3ExecuteAsyncFunctions() {
          const response3 = await fetchDataForDevice3();
          const device3JsonData = await getProcessedDataForDevice3(response3);
          const device3FinalXYData = await getApexPlottableData(
            device3JsonData,
            pollutant,
          );
          setDevice3XYDataState(device3FinalXYData);

          setLoadingDevice3(false);
        }
        device3ExecuteAsyncFunctions();
      }

      if (deviceOptionList.length > 3) {
        var device4 = deviceOptionList[3].monitor;
        var device4DurationStartDate = deviceOptionList[3].durationStartDate;
        var device4DurationEndDate = deviceOptionList[3].durationEndDate;

        const fetchDataForDevice4 = async () => {
          csvURLDevice4 = `https://api.yourdomain.com/adp/v4/getDeviceDataParam/imei/${device4}/params/${allMetricsString}/startdate/${device4DurationStartDate}T00:00/enddate/${device4DurationEndDate}T23:59/ts/${timeStep}/avg/${average}/api/${api_key}`;

          const res = await fetch(csvURLDevice4, {
            method: "get",
            headers: {
              "content-type": "text/csv;charset=UTF-8",
            },
          });
          if (!res.ok) {
            setFetchCSVDataHasError(true);
            setFetchErrorStatus(res.status + " " + res.statusText + "!");
          }
          return new Promise((resolve, reject) => {
            if (res.status === 200) {
              res.text().then((data) => {
                csvString = data;
                resolve(csvString);
              });
            } else {
              reject("error occured while fetching CSV data");
            }
          });
        };

        function getProcessedDataForDevice4(csvString) {
          // convert the csvstring to jsonObj
          return new Promise((resolve, reject) => {
            csv()
              .fromString(csvString)
              .then((deviceData) => {
                resolve(deviceData);
              });
          });
        }

        async function device4ExecuteAsyncFunctions() {
          const response4 = await fetchDataForDevice4();
          const device4JsonData = await getProcessedDataForDevice4(response4);
          const device4FinalXYData = await getApexPlottableData(
            device4JsonData,
            pollutant,
          );
          setDevice4XYDataState(device4FinalXYData);

          setLoadingDevice4(false);
        }
        device4ExecuteAsyncFunctions();
      }
    }
  };

  // useEffect(() => {
  //   handlePlotComparePoints();
  // }, [pollutant]);

  return (
    <div>
      <ThemeProvider theme={theme}>
        <Box sx={{ ml: { sm: `${drawerWidth}px` }, mt: "100px" }}>
          <Box
            className="params-selector"
            sx={{ ml: { xs: "5%", sm: "2%" }, mr: { xs: "10%" } }}
          >
            <Typography variant="h5" sx={{ mb: 1 }}>
              Compare
            </Typography>
            <Typography variant="subtitle2" mb={2}>
              Compare different monitors with each other or compare same monitor
              at different time periods.
            </Typography>

            <ToggleButtonGroup
              exclusive
              value={viewType}
              onChange={handleComparisonType}
            >
              <StyledToggleButton
                sx={{ width: { xs: "170px", md: "220px" } }}
                value="sameMonitor"
              >
                <Typography variant="subtitle2">Same Monitor</Typography>
              </StyledToggleButton>
              <StyledToggleButton
                sx={{ width: { xs: "170px", md: "220px" } }}
                value="differentMonitor"
              >
                <Typography variant="subtitle2">Different Monitors</Typography>
              </StyledToggleButton>
            </ToggleButtonGroup>
            {/* Fetching imei device data Error */}
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              {(imeiError || fetchCSVDataHasError) && (
                <Alert variant="outlined" severity="error">
                  <AlertTitle>{fetchErrorStatus}</AlertTitle>
                  <strong>{imeiFetchErrorStatus}</strong>
                </Alert>
              )}
            </Box>

            {/* Validation Error */}
            <Box
              className="validation-error"
              sx={{ display: "flex", justifyContent: "center", m: 2 }}
            >
              {validationError && launched && (
                <Alert variant="outlined" severity="error">
                  <AlertTitle>Error!</AlertTitle>
                  <strong>
                    Please select an option from all the fields and try again
                  </strong>
                </Alert>
              )}
            </Box>

            {/* Replaced the space consuming buttons with these select Grids
                Render this components for Different monitors selection 
            */}
            {viewType === "differentMonitor" && (
              <Box className="different-monitor-container">
                <Grid
                  container
                  spacing={3}
                  columns={12}
                  mb={3}
                  alignContent="center"
                  alignItems="center"
                >
                  {deviceOptionList.map((singleDevice, index) => {
                    return (
                      <Grid item xs={12} lg={6}>
                        <Box key={index} className="device-select-options">
                          <Divider className="device-divider" sx={{ mb: 2 }} />

                          <Typography
                            sx={{ fontSize: "18px", fontWeight: "bold", mb: 2 }}
                          >
                            Device {index + 1}
                          </Typography>

                          <Grid container>
                            <Grid item xs={7}>
                              {selectMaveMonitor(index)}
                            </Grid>

                            {/* GRID ITEM 2 */}
                            {deviceOptionList.length !== 1 && (
                              <Grid item xs={2}>
                                <IconButton
                                  aria-label="delete"
                                  color="error"
                                  onClick={() => handleMonitorRemove(index)}
                                >
                                  <DeleteOutlinedIcon />
                                </IconButton>
                              </Grid>
                            )}
                          </Grid>

                          {/* Duration Selector PopOver */}
                          <Popover
                            open={customDurationButtonPopover}
                            anchorEl={
                              viewType === "sameMonitor"
                                ? anchorEl
                                : anchorElMuiDuration
                            }
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
                            <CustomDurationPopOver
                              executeCustomDuration={handleCustomDuration}
                            />
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
                                  onClick={() =>
                                    handleDurationPopOverSubmit(index)
                                  }
                                  size="large"
                                  variant="outlined"
                                  color="success"
                                >
                                  Go
                                </Button>
                              </ButtonGroup>
                            </Box>
                          </Popover>
                        </Box>
                      </Grid>
                    );
                  })}
                  {deviceOptionList.length < 4 && (
                    <Grid item xs={2}>
                      <Button
                        variant="outlined"
                        type="button"
                        onClick={() => handleMonitorAdd()}
                        className="add-btn"
                      >
                        Add a Monitor
                      </Button>
                    </Grid>
                  )}
                </Grid>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={3} lg={2}>
                    {selectDurationMui}
                  </Grid>
                  <Grid item xs={12} sm={3} lg={2}>
                    {selectPollutant}
                  </Grid>
                  <Grid item xs={12} sm={4} lg={2}>
                    {selectAveragingCriteria}
                  </Grid>
                  <Grid item xs={12} sm={4} lg={2}>
                    {selectTimeStepCriteria}
                  </Grid>
                </Grid>
              </Box>
            )}

            {/* SAME MONITOR VIEW */}
            {viewType === "sameMonitor" && (
              <Box className="same-monitor-container">
                <Divider className="device-divider" sx={{ mb: 3 }} />
                <Grid container spacing={3} columns={12} mb={5}>
                  <Grid item xs={12} sm={5} lg={4.5}>
                    {selectMaveMonitorMui}
                  </Grid>
                  <Grid item xs={12} sm={3} lg={2.5}>
                    {selectPollutant}
                  </Grid>
                  <Grid item xs={12} sm={2} lg={2.5}>
                    {selectAveragingCriteria}
                  </Grid>
                  <Grid item xs={12} sm={2} lg={2.5}>
                    {selectTimeStepCriteria}
                  </Grid>
                </Grid>

                <Grid
                  container
                  spacing={3}
                  columns={12}
                  mb={3}
                  alignContent="center"
                  alignItems="center"
                >
                  {deviceOptionList.map((singleDevice, index) => {
                    return (
                      <>
                        <Grid item xs={12} sm={5}>
                          <Box key={index} className="duration-select-options">
                            {/* <Divider className="device-divider" sx={{ mb: 2 }} /> */}

                            <Typography
                              sx={{
                                fontSize: "16px",
                                fontWeight: "bold",
                                mb: 2,
                              }}
                            >
                              Time Period {index + 1}
                            </Typography>

                            <Grid container alignItems="center" spacing={2}>
                              <Grid item xs={9}>
                                {selectDuration(index)}
                              </Grid>
                              {deviceOptionList.length !== 1 && (
                                <Grid item xs={3}>
                                  <IconButton
                                    aria-label="delete"
                                    color="error"
                                    onClick={() => handleMonitorRemove(index)}
                                  >
                                    <DeleteOutlinedIcon />
                                  </IconButton>
                                </Grid>
                              )}
                            </Grid>

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
                              <CustomDurationPopOver
                                executeCustomDuration={handleCustomDuration}
                              />
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
                                    onClick={() =>
                                      handleDurationPopOverSubmit(index)
                                    }
                                    size="large"
                                    variant="outlined"
                                    color="success"
                                  >
                                    Go
                                  </Button>
                                </ButtonGroup>
                              </Box>
                            </Popover>
                          </Box>
                        </Grid>
                        {/* <Grid item xs={1}>
                          <hr style={{ borderRight: "3px solid #bbb" }} />
                        </Grid> */}
                        <Divider
                          orientation="vertical"
                          variant="middle"
                          flexItem
                          sx={{ mr: 2 }}
                        />
                      </>
                    );
                  })}
                  {deviceOptionList.length < 4 && (
                    <Grid item xs={2}>
                      <Button
                        variant="outlined"
                        type="button"
                        onClick={() => handleMonitorAdd()}
                        className="add-btn"
                      >
                        Add
                      </Button>
                    </Grid>
                  )}
                </Grid>
              </Box>
            )}

            {viewType && (
              <Button
                onClick={handlePlotComparePoints}
                color="primary"
                variant="contained"
                sx={{ mt: 4, mb: 3, color: "white" }}
              >
                {deviceOptionList.length === 1 ? "Plot Graph" : "Plot Graphs"}
              </Button>
            )}
          </Box>
          {!validationError &&
            viewType === "differentMonitor" &&
            launched &&
            !loadingDevice1 &&
            !loadingDevice2 &&
            finalXYDataState.length === 0 &&
            device2XYDataState.length === 0 &&
            device3XYDataState.length === 0 &&
            device4XYDataState.length === 0 && (
              <Box
                className="validation-error"
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  mb: 2,
                }}
              >
                <Alert variant="outlined" severity="error">
                  <AlertTitle>
                    Data isn't available for the selected Monitors
                  </AlertTitle>
                </Alert>
              </Box>
            )}
          {!validationError &&
            viewType === "differentMonitor" &&
            launched &&
            (loadingDevice1 ||
              (deviceOptionList.length > 1 && loadingDevice2) ||
              (deviceOptionList.length > 2 && loadingDevice3) ||
              (deviceOptionList.length > 3 && loadingDevice4)) && (
              <Box sx={{ margin: 3 }}>
                <Skeleton
                  variant="rectangular"
                  width="100%"
                  height={350}
                  sx={{
                    borderRadius: "12px",
                    bgcolor: "rgba(229, 231, 235, 0.4)",
                  }}
                  animation="wave"
                />
              </Box>
            )}

          {!validationError &&
            viewType === "differentMonitor" &&
            launched &&
            !loadingDevice1 &&
            !loadingDevice2 &&
            (finalXYDataState.length != 0 ||
              device2XYDataState.length != 0 ||
              device3XYDataState.length != 0 ||
              device4XYDataState.length != 0) && (
              <Box sx={{ margin: 3 }}>
                <ApexLineChart
                  series={[
                    {
                      data: finalXYDataState,
                      name:
                        (deviceOptionList[0]["location-name"] ||
                          deviceOptionList[0]["monitor"]) +
                        " " +
                        props.dropDownParamsList.find(
                          (item) => item.metric === pollutant,
                        ).label,
                    },
                    device2XYDataState && {
                      data: device2XYDataState,
                      name:
                        deviceOptionList.length > 1
                          ? (deviceOptionList[1]["location-name"] ||
                              deviceOptionList[1]["monitor"]) +
                            " " +
                            props.dropDownParamsList.find(
                              (item) => item.metric === pollutant,
                            ).label
                          : "",
                    },
                    device3XYDataState && {
                      data: device3XYDataState,
                      name:
                        deviceOptionList.length > 2
                          ? (deviceOptionList[2]["location-name"] ||
                              deviceOptionList[2]["monitor"]) +
                            " " +
                            props.dropDownParamsList.find(
                              (item) => item.metric === pollutant,
                            ).label
                          : "",
                    },
                    device4XYDataState && {
                      data: device4XYDataState,
                      name:
                        deviceOptionList.length > 3
                          ? (deviceOptionList[3]["location-name"] ||
                              deviceOptionList[3]["monitor"]) +
                            " " +
                            props.dropDownParamsList.find(
                              (item) => item.metric === pollutant,
                            ).label
                          : "",
                    },
                  ]}
                  tickAmount={7}
                  legendPosition="top"
                  headerTitle={
                    "from " +
                    " " +
                    deviceOptionList[0]["durationStartDate"] +
                    " to " +
                    deviceOptionList[0]["durationEndDate"]
                  }
                  yaxisTitle={
                    props.dropDownParamsList.find(
                      (item) => item.metric === pollutant,
                    ).label
                  }
                />
              </Box>
            )}
          {!validationError && viewType != "differentMonitor" && (
            <Grid container columns={12} mb={3} gap={2} mx={2}>
              {launched && loadingDevice1 && (
                <Grid item xs={12} lg={deviceOptionList.length === 1 ? 12 : 5}>
                  <Skeleton
                    variant="rectangular"
                    width="100%"
                    height={350}
                    sx={{
                      borderRadius: "12px",
                      bgcolor: "rgba(229, 231, 235, 0.4)",
                    }}
                    animation="wave"
                  />
                </Grid>
              )}
              {launched && !loadingDevice1 && finalXYDataState.length != 0 && (
                <Grid item xs={12} lg={deviceOptionList.length === 1 ? 12 : 5}>
                  <ApexLineChart
                    series={[
                      {
                        data: finalXYDataState,
                        name: "Device 1 " + pollutant,
                      },
                    ]}
                    headerTitle={
                      "from " +
                      " " +
                      deviceOptionList[0]["durationStartDate"] +
                      " to " +
                      deviceOptionList[0]["durationEndDate"]
                    }
                    tickAmount={3}
                    yaxisTitle={pollutantLabel}
                  />
                </Grid>
              )}

              {/* no Data Error */}
              {launched && !loadingDevice1 && finalXYDataState.length === 0 && (
                <Box
                  className="validation-error"
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    mb: 2,
                  }}
                >
                  <Alert variant="outlined" severity="error">
                    <AlertTitle>No Data Available</AlertTitle>
                  </Alert>
                </Box>
              )}

              {deviceOptionList.length > 1 && launched && loadingDevice2 && (
                <Grid item xs={12} lg={5}>
                  <Skeleton
                    variant="rectangular"
                    width="100%"
                    height={350}
                    sx={{
                      borderRadius: "12px",
                      bgcolor: "rgba(229, 231, 235, 0.4)",
                    }}
                    animation="wave"
                  />
                </Grid>
              )}
              {deviceOptionList.length > 1 && launched && !loadingDevice2 && (
                <Grid item xs={12} lg={5}>
                  <ApexLineChart
                    series={[
                      {
                        data: device2XYDataState,
                        name: "Device 2 " + pollutant,
                      },
                    ]}
                    color1="#3DDABB"
                    headerTitle={
                      "from " +
                      " " +
                      deviceOptionList[1]["durationStartDate"] +
                      " to " +
                      deviceOptionList[1]["durationEndDate"]
                    }
                    tickAmount={3}
                    yaxisTitle={pollutantLabel}
                  />
                </Grid>
              )}

              {/* no Data Error */}
              {launched &&
                !loadingDevice1 &&
                device2XYDataState.length === 0 && (
                  <Box
                    className="validation-error"
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      mb: 2,
                    }}
                  >
                    <Alert variant="outlined" severity="error">
                      <AlertTitle>No Data Available</AlertTitle>
                    </Alert>
                  </Box>
                )}

              {deviceOptionList.length > 2 && launched && loadingDevice3 && (
                <Grid item xs={12} lg={deviceOptionList.length === 3 ? 12 : 5}>
                  <Skeleton
                    variant="rectangular"
                    width="100%"
                    height={350}
                    sx={{
                      borderRadius: "12px",
                      bgcolor: "rgba(229, 231, 235, 0.4)",
                    }}
                    animation="wave"
                  />
                </Grid>
              )}
              {deviceOptionList.length > 2 && launched && !loadingDevice3 && (
                <Grid item xs={12} lg={deviceOptionList.length === 3 ? 12 : 5}>
                  <ApexLineChart
                    series={[
                      {
                        data: device3XYDataState,
                        name: "Device 3 " + pollutant,
                      },
                    ]}
                    color1="#3B9CF1"
                    headerTitle={
                      "from " +
                      " " +
                      deviceOptionList[2]["durationStartDate"] +
                      " to " +
                      deviceOptionList[2]["durationEndDate"]
                    }
                    tickAmount={3}
                    yaxisTitle={pollutantLabel}
                  />
                </Grid>
              )}

              {deviceOptionList.length > 3 && launched && loadingDevice4 && (
                <Grid item xs={12} lg={5}>
                  <Skeleton
                    variant="rectangular"
                    width="100%"
                    height={350}
                    sx={{
                      borderRadius: "12px",
                      bgcolor: "rgba(229, 231, 235, 0.4)",
                    }}
                    animation="wave"
                  />
                </Grid>
              )}
              {deviceOptionList.length > 3 && launched && !loadingDevice4 && (
                <Grid item xs={12} lg={5}>
                  <ApexLineChart
                    series={[
                      {
                        data: device4XYDataState,
                        name: "Device 4 " + pollutant,
                      },
                    ]}
                    color1="#B24BF3"
                    headerTitle={
                      "from " +
                      " " +
                      deviceOptionList[3]["durationStartDate"] +
                      " to " +
                      deviceOptionList[3]["durationEndDate"]
                    }
                    tickAmount={3}
                    yaxisTitle={pollutantLabel}
                  />
                </Grid>
              )}
            </Grid>
          )}
        </Box>
      </ThemeProvider>
    </div>
  );
}
