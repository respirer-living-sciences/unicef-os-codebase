import React, { useEffect, useRef, useState } from "react";
import "../controller.css";
import Heatmap from "./Heatmap";
import { DailyHeatmap } from "./DailyHeatmap";
import { FaInfoCircle } from "react-icons/fa";
import {
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Autocomplete,
  TextField,
  Alert,
  AlertTitle,
  Popover,
  ButtonGroup,
  Box,
  Skeleton,
} from "@mui/material";
const csv = require("csvtojson");
import moment from "moment";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { styled } from "@mui/material/styles";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import loadingImage from "../images/Eclipse-1s-270px.svg";
// import { useStore } from "store/store";

const drawerWidth = 280;
let csvURL;
let dailyAvgCsvURL;
let csvString;
let JsonData;
let dailyAvgJsonData;
let monitorPoints;
let count = 0;

const theme = createTheme({
  typography: {
    allVariants: {
      fontFamily: "Open Sans, sans-serif",
    },
  },
  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          fontSize: "14px",
          borderRadius: "10px",
          backgroundColor: "#f8f9fc",
          transition: "all 0.25s ease",
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "rgba(0, 0, 0, 0.08)",
            transition: "all 0.25s ease",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "rgba(3, 201, 215, 0.4)",
          },
          "&.Mui-focused": {
            backgroundColor: "#fff",
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "#03C9D7",
              borderWidth: "1.5px",
            },
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          fontSize: "14px",
          color: "#8b95a5",
          fontWeight: 500,
          "&.Mui-focused": {
            color: "#03C9D7",
            fontWeight: 600,
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        icon: {
          color: "#8b95a5",
          transition: "transform 0.2s ease",
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          fontSize: "14px",
          borderRadius: "6px",
          margin: "2px 6px",
          transition: "all 0.15s ease",
          "&:hover": {
            backgroundColor: "rgba(3, 201, 215, 0.08)",
          },
          "&.Mui-selected": {
            backgroundColor: "rgba(3, 201, 215, 0.12)",
            fontWeight: 600,
            "&:hover": {
              backgroundColor: "rgba(3, 201, 215, 0.18)",
            },
          },
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          borderRadius: "12px",
          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.08)",
        },
      },
    },
    MuiAutocomplete: {
      styleOverrides: {
        paper: {
          borderRadius: "12px",
          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.08)",
        },
        option: {
          fontSize: "14px",
          borderRadius: "6px",
          margin: "2px 6px",
          transition: "all 0.15s ease",
          '&[aria-selected="true"]': {
            backgroundColor: "rgba(3, 201, 215, 0.12) !important",
            fontWeight: 600,
          },
          "&:hover": {
            backgroundColor: "rgba(3, 201, 215, 0.08) !important",
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          fontSize: "14px",
          borderRadius: "10px",
          textTransform: "none",
          fontWeight: 600,
          letterSpacing: "0.3px",
          padding: "8px 28px",
          transition: "all 0.25s ease",
          boxShadow: "0 2px 8px rgba(3, 201, 215, 0.25)",
          "&:hover": {
            boxShadow: "0 4px 16px rgba(3, 201, 215, 0.35)",
            transform: "translateY(-1px)",
          },
        },
      },
    },
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
});

export default function ControllerComponent(props) {
  // const { env_apikey, env_username } = useStore();
  let allMetricsString = props.dropDownParamsList
    .map((metricItem) => metricItem.metric)
    .join(",");

  const username = props.username;
  const api_key = localStorage.getItem("api_key");
  const imeiURL = `https://api.yourdomain.com/adp/v4/check_user_imei/user/${username}`;

  const [buttonValue, setButtonValue] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [lastMonthsLastDay, setLastMonthsLastDay] = useState("");
  const [loading, setLoading] = useState(true);
  const [launch, setLaunch] = useState(false);
  const [masterData, setMasterData] = useState([{}]);
  const [hasError, setHasError] = useState(false);
  const [fetchErrorStatus, setFetchErrorStatus] = useState("");
  const [imeiError, setImeiError] = useState(false);
  const [imeiFetchErrorStatus, setImeiFetchErrorStatus] = useState(false);
  const [validationError, setValidationError] = useState(false);
  const [imeiLoading, setImeiLoading] = useState(false);

  const [selectedMetric, _setSelectedMetric] = useState("pm2.5cnc");
  const [renderedMetric, setRenderedMetric] = useState("PM₂.₅");
  const [monitorValue, setMonitorValue] = useState("");
  const [deviceData, setDeviceData] = useState([]); //initial value of deviceData should be empty array as the options data in the selector before it is populated so it should be an array.
  const childRef = useRef(null);

  const [month, setMonth] = useState(moment().format("YYYY-MM"));
  const [microparam, setMicroParam] = useState("µg/m³");

  const handleSelectMaveMonitor = (e, newMaveMonitor) => {
    setMonitorValue(newMaveMonitor.imei);
  };

  const handleSelectedMetric = (value, e) => {
    const metricLabel = props.dropDownParamsList.find(
      (item) => item.metric === value,
    ).label;
    _setSelectedMetric(value);
    setRenderedMetric(metricLabel);
    if (
      value === "pm2.5cnc" ||
      value === "pm10cnc" ||
      value === "so2model" ||
      value === "no2model" ||
      value === "nh3"
    ) {
      setMicroParam("µg/m³");
    } else if (value === "temp") {
      setMicroParam("°C");
    } else if (value === "humidity") {
      setMicroParam("%");
    } else if (value === "comodel") {
      setMicroParam("mg/m³");
    } else if (value === "h2sppb") {
      setMicroParam("ppm");
    } else if (value === "tvocppb") {
      setMicroParam("ppb");
    } else {
      setMicroParam("ppb");
    }
    if (buttonValue) {
      setMasterData(masterData);
      _setSelectedMetric(value);
    }
  };

  const handleSelectMonth = (newMonth) => {
    const finalMonth = newMonth.format("YYYY-MM");
    setMonth(finalMonth);
  };

  // const changeStateinHeatmap = () => {
  //   // childRef.current.childFunction1();
  //   childRef.current.updateCharts();
  // };

  function toggleView(date_time) {
    setSelectedDate(date_time);
    setButtonValue(!buttonValue);
  }

  async function handleSubmit() {
    //setButtonValue(true);
    setButtonValue(false);
    setLaunch(true);
    setHasError(false);

    if (monitorValue === "" || null) {
      setValidationError(true);
      setLoading(false);
    } else {
      setValidationError(false);
      async function fetchCSVData() {
        csvURL = `https://api.yourdomain.com/adp/v4/getDeviceDataParam/imei/${monitorValue}/params/${allMetricsString}/startdate/${month}-01T00:00/enddate/${month}-${lastMonthsLastDay}T23:00/ts/hh/avg/1/api/${api_key}?gaps=1`;

        const res = await fetch(csvURL, {
          method: "get",
          headers: {
            "content-type": "text/csv;charset=UTF-8",
          },
        });
        if (!res.ok) {
          setHasError(true);
          setFetchErrorStatus(res.status + " " + res.statusText + "!");
        }
        return new Promise((resolve, reject) => {
          if (res.status === 200) {
            res.text().then((data) => {
              csvString = data;
              resolve(csvString);
            });
          } else {
            setHasError(true);
            reject("error occured while fetching CSV data");
          }
        });
      }
      async function fetchDailyAvgCSVData() {
        dailyAvgCsvURL = `https://api.yourdomain.com/adp/v4/getDeviceDataParam/imei/${monitorValue}/params/${allMetricsString}/startdate/${month}-01T00:00/enddate/${month}-${lastMonthsLastDay}T23:00/ts/dd/avg/1/api/${api_key}?gaps=1`;

        const dailyAvgRes = await fetch(dailyAvgCsvURL, {
          method: "get",
          headers: {
            "content-type": "text/csv;charset=UTF-8",
          },
        });
        if (!dailyAvgRes.ok) {
          setHasError(true);
          setFetchErrorStatus(
            dailyAvgRes.status + " " + dailyAvgRes.statusText + "!",
          );
        }
        return new Promise((resolve, reject) => {
          if (dailyAvgRes.status === 200) {
            dailyAvgRes.text().then((data) => {
              csvString = data;
              resolve(csvString);
            });
          } else {
            setHasError(true);
            reject("error occured while fetching CSV data");
          }
        });
      }

      function getProcessedData(csvString) {
        // convert the csvstring to jsonObj
        return new Promise((resolve, reject) => {
          csv()
            .fromString(csvString)
            .then((csvDeviceData) => {
              const transformedData = csvDeviceData.map((csvDeviceDataItem) => {
                const { pm2, deviceid, dt_time, ...rest } = csvDeviceDataItem; //exclude pm2 from each item
                return {
                  ...rest,
                  "pm2.5cnc": csvDeviceDataItem.pm2["5cnc"],
                  imei: csvDeviceDataItem["deviceid"],
                  timestamp: csvDeviceDataItem["dt_time"],
                };
              });
              resolve(transformedData);
            })
            .catch((error) => {});
        });
      }

      async function executeAsyncFunctions() {
        setLoading(true);
        const response = await fetchCSVData();
        const dailyAvgResponse = await fetchDailyAvgCSVData();
        dailyAvgJsonData = await getProcessedData(dailyAvgResponse);
        JsonData = await getProcessedData(response);
        setLoading(false);
      }

      executeAsyncFunctions();
    }
  }

  useEffect(() => {
    var temp_date = new Date(month + "-01");

    var d = new Date(temp_date.getFullYear(), temp_date.getMonth() + 1, 0);
    setLastMonthsLastDay(d.getDate());
    // return d.getDate() = 30;
  }, [month]);

  useEffect(() => {
    if (childRef.current?.updateCharts) {
      childRef.current.updateCharts();
    }
  }, [selectedMetric]);

  const selectMaveMonitor = (
    <Autocomplete
      disablePortal
      id="combo-box-demo"
      onChange={handleSelectMaveMonitor}
      options={deviceData}
      getOptionLabel={(option) =>
        option.locality
          ? `${option.locality} (${option.imei})`
          : `(${option.imei})`
      }
      size="small"
      renderInput={(params) => <TextField {...params} label="Mave Monitors" />}
    />
  );

  const selectPollutant = (
    <FormControl size="small" fullWidth>
      <InputLabel id="demo-simple-select-label">Select Pollutant</InputLabel>
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={selectedMetric}
        label="duration"
        onChange={(e) => {
          handleSelectedMetric(e.target.value, e);
          // changeStateinHeatmap();
        }}
      >
        {props.dropDownParamsList
          .filter((item) => item.metric !== "lat" && item.metric !== "lon")
          .map((item) => (
            <MenuItem key={item.metric} value={item.metric}>
              {item.label}
            </MenuItem>
          ))}
      </Select>
    </FormControl>
  );

  const selectMonth = (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <DatePicker
        views={["year", "month"]}
        label="Year and Month"
        // minDate={moment("2012-03-01")}
        // maxDate={moment("2023-06-01")}
        value={month}
        onChange={(newValue) => {
          handleSelectMonth(newValue);
        }}
        renderInput={(params) => (
          <TextField {...params} size="small" helperText={null} />
        )}
      />
    </LocalizationProvider>
  );

  //(new) Fetching Data from the new API
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

    async function getImeiData() {
      // for the list of monitors:
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

    getImeiData();
  }, []);

  //show the new mave user data on the daily and hourly heatmap
  //change code according to the data whenever necessary
  //change city selector to imei selector
  // DONE!
  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ ml: { sm: `${drawerWidth}px` }, mt: "100px" }}>
        <Box>
          <Grid container spacing={3} columns={12}>
            <Grid item xs={12} sm={4}>
              {selectMaveMonitor}
            </Grid>
            <Grid item xs={12} sm={2}>
              {selectPollutant}
            </Grid>
            <Grid item xs={12} sm={2}>
              {selectMonth}
            </Grid>
            <Grid item xs={12} sm={2}>
              <Button
                sx={{
                  // width: "100px",
                  // padding: "13px 21px",
                  color: "white",
                }}
                variant="contained"
                size="small"
                onClick={() => {
                  handleSubmit();
                }}
              >
                Go
              </Button>
            </Grid>
          </Grid>
        </Box>
        {launch && (
          <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
            <FaInfoCircle style={{ marginRight: "8px" }} />
            <i style={{ fontSize: "14px" }}>
              The numbers below indicate the{" "}
              <b>{buttonValue ? "hourly" : "daily"}</b> average of{" "}
              {renderedMetric} values ({microparam}) for the location and date
              selected.
            </i>
          </Box>
        )}
        {hasError && <h4>{fetchErrorStatus}</h4>}
        {!launch && (
          <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
            <FaInfoCircle style={{ marginRight: "8px" }} />
            <h4 style={{ margin: 0 }}>
              Select search parameters and click &quot;Go&quot; to plot the
              calendar heatmap
            </h4>
          </Box>
        )}
        {/* Validation Error */}
        {validationError && (
          <Box
            className="validation-error"
            sx={{ display: "flex", justifyContent: "center", mb: 2 }}
          >
            <Alert variant="outlined" severity="error">
              <AlertTitle>Error!</AlertTitle>
              <strong>Please select an option from all the fields</strong>
            </Alert>
          </Box>
        )}
        {/* IMEI data fetch Error */}
        {imeiError && (
          <Box
            className="imei-error"
            sx={{ display: "flex", justifyContent: "center", mb: 2 }}
          >
            <Alert variant="outlined" severity="error">
              <AlertTitle>Error occured while fetching device IMEI!</AlertTitle>
            </Alert>
          </Box>
        )}
        {launch && loading && (
          <div style={{ marginRight: "4%" }}>
            <div
              style={{
                backgroundColor: "#ffffff",
                borderRadius: "16px",
                boxShadow: "0 8px 30px rgba(0, 0, 0, 0.04)",
                border: "1px solid rgba(0, 0, 0, 0.03)",
                padding: "24px 30px",
                marginTop: "16px",
              }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(7, 1fr)",
                  gap: "14px",
                }}
              >
                {["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat"].map(
                  (day) => (
                    <div
                      key={day}
                      style={{
                        paddingBottom: "8px",
                        borderBottom: "2px solid #f0f2f5",
                        marginBottom: "8px",
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      <Skeleton
                        variant="text"
                        width={40}
                        height={20}
                        animation="wave"
                      />
                    </div>
                  ),
                )}

                {[...Array(30)].map((_, i) => (
                  <Skeleton
                    key={i}
                    variant="rectangular"
                    animation="wave"
                    sx={{
                      borderRadius: "12px",
                      minHeight: "100px",
                      width: "100%",
                      bgcolor: "rgba(229, 231, 235, 0.5)",
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
        {!loading &&
          !hasError &&
          !validationError &&
          (buttonValue ? (
            <Heatmap
              ref={childRef}
              date_time={selectedDate}
              daily_hourly={JsonData}
              selected_metric={selectedMetric}
              renderedMetric={renderedMetric}
            />
          ) : (
            <DailyHeatmap
              dateTileOnClick={toggleView}
              daily_hourly={dailyAvgJsonData}
              selected_metric={selectedMetric}
              finalMaveData={JsonData}
            />
          ))}
        {buttonValue && (
          <Button
            variant="contained"
            onClick={() => {
              setButtonValue(false);
            }}
          >
            Back
          </Button>
        )}
        {/* </Box> */}
      </Box>
    </ThemeProvider>
  );
}
