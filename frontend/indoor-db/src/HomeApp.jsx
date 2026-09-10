import React from "react";
import "./index.css";
import CardsCarousel from "remote/CardsCarousel";
import CardMUI from "remote/CardMUI";
import DurationSelector from "remote/DurationSelector";
import ApexLineChart from "remote/ApexLineChart";
import OutlineTable from "./OutlineTable";
import Map from "map/Map";
import sampleData from "./sample_data";
import sampleDataTwo from "./sample_data_two";
import { useEffect } from "react";
import { useState } from "react";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  TextField,
  Alert,
  AlertTitle,
  Card,
  TableHead,
  TableSortLabel,
} from "@mui/material";
import loadingImage from "./images/Eclipse-1s-270px.svg";
import moment from "moment";
// import { useServiceContext } from "shell/TitleService";
import { useStore } from "store/store";
// import { usePa_2paParse } from "react-papaparse";
import { createTheme, ThemeProvider } from "@mui/material/styles";
const csv = require("csvtojson");

//convert csv to json with CSVTOJSON npm library,
//show a card for each of the devices with the respective pollutant and data,

//try to implement lazy loading for remote components!

const drawerWidth = 260;

let csvURL;
let csvURLGraph;
let csvString;

let username;
let finalPm25XYData;
let finalPm10XYData;
let finalAmbTempXYData;
let finalHumidityXYData;
let finalco2concXYData;
let finaltvocconcXYData;
let finalWindSpeedXYData;

let mainData;
let finalMainData;
let CardsSlider;
let tableBody;
let tableHead;
// let finalSortedData;
let color = "black";

const theme = createTheme({
  typography: {
    allVariants: {
      fontFamily: "Open Sans",
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

const headCells = [
  { id: "imei", label: "IMEI", minWidth: 120 },
  {
    id: "locality",
    label: "Locality",
    minWidth: 100,
    align: "right",
  },
  {
    id: "pm25",
    label: "PM2.5",
    minWidth: 100,
    align: "right",
  },
  {
    id: "pm10",
    label: "PM10",
    minWidth: 100,
    align: "right",
  },
  {
    id: "co2conc",
    label: "co2conc",
    minWidth: 100,
    align: "right",
  },
  {
    id: "ambTemp",
    label: "Ambient Temp",
    minWidth: 100,
    align: "right",
  },
  {
    id: "tvocconc",
    label: "tvocconc",
    minWidth: 100,
    align: "right",
  },
  {
    id: "air-velocity",
    label: "Air Velocity",
    minWidth: 100,
    align: "right",
  },
  {
    id: "humidity",
    label: "Humidity",
    minWidth: 100,
    align: "right",
  },
  {
    id: "last_updated",
    label: "last updated",
    minWidth: 120,
    align: "right",
  },
];

export default function HomeApp(props) {
  const { changeActiveApp, env_apikey, env_username } = useStore();

  const api_key = localStorage.getItem("api_key") || env_apikey;

  // This 2 lines of code are from redux store.
  useEffect(() => {
    changeActiveApp("Home");
  }, []);

  props.username ? (username = props.username) : (username = env_username);

  const imeiURL = `https://api.yourdomain.com/adp/v4/check_user_imei/user/${username}`;

  //logic for duration selector
  const [duration, setDuration] = useState("today");
  const [buttonPopup, setButtonPopup] = useState(false);
  const [loading, setLoading] = useState(true);
  const [graphLoading, setGraphLoading] = useState(false);
  const [finalCustomGo, setFinalCustomGo] = useState();
  const [fetchIMEIDataHasError, setFetchIMEIDataHasError] = useState(false);
  const [fetchCSVDataHasError, setFetchCSVDataHasError] = useState(false);
  const [fetchErrorStatus, setFetchErrorStatus] = useState();
  const [selectedIMEI, setSelectedIMEI] = useState("");
  const [selectedLocality, setSelectedLocality] = useState("");
  // const [order, setOrder] = useState();
  // const [orderBy, setOrderBy] = useState();
  const [finalCustomStartDate, setFinalCustomStartDate] = useState();
  const [finalCustomEndDate, setFinalCustomEndDate] = useState();

  const executeHandleChange = (newDuration) => {
    setDuration(newDuration);
  };

  const handleCustomDuration = (customStart, customEnd, customGoButton) => {
    setFinalCustomStartDate(customStart);
    setFinalCustomEndDate(customEnd);
    setFinalCustomGo(customGoButton);
  };

  useEffect(() => {
    setGraphLoading(true);

    const getDurationParams = () => {
      let today = new Date();
      let graphStartDate;
      let graphEndDate;
      let graphSevenDaysAgo = today;
      let graphThirtyDaysAgo = today;

      const day = ("0" + today.getUTCDate()).slice(-2);
      const month = ("0" + (today.getUTCMonth() + 1)).slice(-2); // getUTCMonth() returns month from 0 to 11
      const year = today.getUTCFullYear();
      const fullDate = `${year}-${month}-${day}`;

      if (duration === null) {
        setDuration("custom");
      }
      if (duration == "today") {
        //assigning value to params
        graphEndDate = fullDate;
        graphStartDate = fullDate;
      } else if (duration == "7days") {
        graphSevenDaysAgo.setDate(today.getDate() - 6);
        today = new Date();
        const day = ("0" + graphSevenDaysAgo.getUTCDate()).slice(-2);
        const month = ("0" + (graphSevenDaysAgo.getUTCMonth() + 1)).slice(-2); // getUTCMonth() returns month from 0 to 11
        const year = graphSevenDaysAgo.getUTCFullYear();
        const sevenDaysAgoFullDate = `${year}-${month}-${day}`;
        //assigning value to params
        graphEndDate = fullDate;
        graphStartDate = sevenDaysAgoFullDate;
      } else if (duration == "30days") {
        graphThirtyDaysAgo = today;
        graphThirtyDaysAgo.setDate(today.getDate() - 29);
        today = new Date();
        const day = ("0" + graphThirtyDaysAgo.getUTCDate()).slice(-2);
        const month = ("0" + (graphThirtyDaysAgo.getUTCMonth() + 1)).slice(-2); // getUTCMonth() returns month from 0 to 11
        const year = graphThirtyDaysAgo.getUTCFullYear();
        const thirtyDaysAgoFullDate = `${year}-${month}-${day}`;

        //assigning value to params
        graphEndDate = fullDate;
        graphStartDate = thirtyDaysAgoFullDate;
      } else if (duration == "custom") {
        graphEndDate = finalCustomEndDate;
        graphStartDate = finalCustomStartDate;
        today = new Date();
      }
      return {
        graphStartDate,
        graphEndDate,
        graphSevenDaysAgo,
        graphThirtyDaysAgo,
      };
    };

    async function fetchGraphCSVData(graphStartDate, graphEndDate) {
      csvURLGraph = `https://api.yourdomain.com/adp/v4/getDeviceDataParam/imei/${selectedIMEI}/params/pm2.5cnc,pm10cnc,co2conc,ambTemp,humidity,tvocconc,windspeed,lat,lon/startdate/${graphStartDate}T00:00/enddate/${graphEndDate}T23:59/ts/hh/avg/1/api/ambient_aq`;

      const res = await fetch(csvURLGraph, {
        method: "get",
        headers: {
          "content-type": "text/csv;charset=UTF-8",
        },
      });
      if (!res.ok) {
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
    }

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

    async function plotPm25XYData(JsonData) {
      const pm25dataArrayofObj = JsonData.map((n) => {
        const dateStr = n["dt_time"];
        const date = new Date(dateStr);

        // const options = { month: "short", day: "numeric", year: "2-digit" };
        const options = {
          month: "short",
          day: "2-digit",
          year: "2-digit",
          hour: "numeric",
          hour12: true,
        };
        const formattedDate = date.toLocaleDateString("en-US", options);
        var properties = {
          x: formattedDate,
          y: parseFloat(n["pm2"]["5cnc"]).toFixed(2),
        };
        return properties;
      });
      return pm25dataArrayofObj;
    }

    async function plotPm10XYData(JsonData) {
      const pm10dataArrayofObj = JsonData.map((n) => {
        const dateStr = n["dt_time"];
        const date = new Date(dateStr);

        const options = {
          month: "short",
          day: "2-digit",
          year: "2-digit",
          hour: "numeric",
          hour12: true,
        };
        const formattedDate = date.toLocaleDateString("en-US", options);
        var properties = {
          x: formattedDate,
          y: parseFloat(n["pm10cnc"]).toFixed(2),
        };
        return properties;
      });
      return pm10dataArrayofObj;
    }

    async function plotAmbTempXYData(JsonData) {
      const tempDataArrayofObj = JsonData.map((n) => {
        const dateStr = n["dt_time"];
        const date = new Date(dateStr);

        const options = {
          month: "short",
          day: "2-digit",
          year: "2-digit",
          hour: "numeric",
          hour12: true,
        };
        const formattedDate = date.toLocaleDateString("en-US", options);
        var properties = {
          x: formattedDate,
          y: parseFloat(n["ambTemp"]).toFixed(2),
        };
        return properties;
      });
      return tempDataArrayofObj;
    }

    async function plotco2concXYData(JsonData) {
      const co2concDataArrayofObj = JsonData.map((n) => {
        const dateStr = n["dt_time"];
        const date = new Date(dateStr);

        const options = {
          month: "short",
          day: "2-digit",
          year: "2-digit",
          hour: "numeric",
          hour12: true,
        };
        const formattedDate = date.toLocaleDateString("en-US", options);
        var properties = {
          x: formattedDate,
          y: parseFloat(n["co2conc"]).toFixed(2),
        };
        return properties;
      });
      return co2concDataArrayofObj;
    }

    async function plottvocconcXYData(JsonData) {
      const tvocconcDataArrayofObj = JsonData.map((n) => {
        const dateStr = n["dt_time"];
        const date = new Date(dateStr);

        const options = {
          month: "short",
          day: "2-digit",
          year: "2-digit",
          hour: "numeric",
          hour12: true,
        };
        const formattedDate = date.toLocaleDateString("en-US", options);
        var properties = {
          x: formattedDate,
          y: parseFloat(n["tvocconc"]).toFixed(2),
        };
        return properties;
      });
      return tvocconcDataArrayofObj;
    }

    async function plotWindSpeedXYData(JsonData) {
      const windSpeedDataArrayofObj = JsonData.map((n) => {
        const dateStr = n["dt_time"];
        const date = new Date(dateStr);

        const options = {
          month: "short",
          day: "2-digit",
          year: "2-digit",
          hour: "numeric",
          hour12: true,
        };
        const formattedDate = date.toLocaleDateString("en-US", options);
        var properties = {
          x: formattedDate,
          y: parseFloat(n["tvocconc"]).toFixed(2),
        };
        return properties;
      });
      return windSpeedDataArrayofObj;
    }

    async function plotHumidityXYData(JsonData) {
      const humidityDataArrayofObj = JsonData.map((n) => {
        const dateStr = n["dt_time"];
        const date = new Date(dateStr);

        const options = {
          month: "short",
          day: "2-digit",
          year: "2-digit",
          hour: "numeric",
          hour12: true,
        };
        const formattedDate = date.toLocaleDateString("en-US", options);
        var properties = {
          x: formattedDate,
          y: parseFloat(n["humidity"]).toFixed(2),
        };
        return properties;
      });
      return humidityDataArrayofObj;
    }

    async function executeAsyncFunctions() {
      const {
        graphStartDate,
        graphEndDate,
        graphSevenDaysAgo,
        graphThirtyDaysAgo,
      } = getDurationParams();
      const response = await fetchGraphCSVData(graphStartDate, graphEndDate);
      const JsonData = await getProcessedData(response);
      finalPm25XYData = await plotPm25XYData(JsonData);
      finalPm10XYData = await plotPm10XYData(JsonData);
      finalAmbTempXYData = await plotAmbTempXYData(JsonData);
      finalco2concXYData = await plotco2concXYData(JsonData);
      finaltvocconcXYData = await plottvocconcXYData(JsonData);
      finalWindSpeedXYData = await plotWindSpeedXYData(JsonData);
      finalHumidityXYData = await plotHumidityXYData(JsonData);
      setGraphLoading(false);
    }

    executeAsyncFunctions();
  }, [duration, selectedIMEI]);

  const handlePlotGraph = (event, imei, locality) => {
    setTimeout(() => {
      window.scrollTo({
        top: 2500,
        behavior: "smooth",
      });
    }, 500);
    setSelectedIMEI(imei);
    setSelectedLocality(locality);
  };

  // fetch data for the OultineTable.
  useEffect(() => {
    if (duration === null) {
      setDuration("custom");
    }

    //Code for when custom duration is selected
    const getDurationForTable = () => {
      let tableToday = new Date();
      let tableSevenDaysAgo = tableToday;
      let tableThirtyDaysAgo = tableToday;

      let day = ("0" + tableToday.getUTCDate()).slice(-2);
      let month = ("0" + (tableToday.getUTCMonth() + 1)).slice(-2); // getUTCMonth() returns month from 0 to 11
      let year = tableToday.getUTCFullYear();
      let fullDate = `${year}-${month}-${day}`;

      let startDate;
      let endDate;
      let hoursOrDays;
      let hoursDaysValue;
      let endTime;
      let startTime;

      if (duration == "today") {
        //assigning value to params
        endDate = fullDate;
        startDate = fullDate;
        hoursOrDays = "hh";
        hoursDaysValue = "24";
        startTime = "T00:00";
        endTime = "T23:59";
      } else if (duration == "7days") {
        tableSevenDaysAgo.setDate(tableToday.getDate() - 6);
        tableToday = new Date();
        day = ("0" + tableSevenDaysAgo.getUTCDate()).slice(-2);
        month = ("0" + (tableSevenDaysAgo.getUTCMonth() + 1)).slice(-2); // getUTCMonth() returns month from 0 to 11
        year = tableSevenDaysAgo.getUTCFullYear();
        const sevenDaysAgoFullDate = `${year}-${month}-${day}`;
        //assigning value to params
        endDate = fullDate;
        startDate = sevenDaysAgoFullDate;
        hoursOrDays = "dd";
        hoursDaysValue = "7";
        startTime = "T15:00";
        endTime = "T15:00";
      } else if (duration == "30days") {
        tableThirtyDaysAgo.setDate(tableToday.getDate() - 29);
        tableToday = new Date();
        day = ("0" + tableThirtyDaysAgo.getUTCDate()).slice(-2);
        month = ("0" + (tableThirtyDaysAgo.getUTCMonth() + 1)).slice(-2); // getUTCMonth() returns month from 0 to 11
        year = tableThirtyDaysAgo.getUTCFullYear();
        const tableThirtyDaysAgoFullDate = `${year}-${month}-${day}`;

        //assigning value to params
        endDate = fullDate;
        startDate = tableThirtyDaysAgoFullDate;
        hoursOrDays = "dd";
        hoursDaysValue = "30";
        startTime = "T15:00";
        endTime = "T15:00";
      } else if (duration == "custom") {
        endDate = finalCustomEndDate;
        startDate = finalCustomStartDate;
        hoursOrDays = "dd";

        //Calculating the difference / duration of custom selected dates
        let endDateMoment = moment(endDate);
        let startDateMoment = moment(startDate);
        let dayDiff = endDateMoment.diff(startDateMoment, "day");

        hoursDaysValue = dayDiff + 1;
        startTime = "T15:00";
        endTime = "T15:00";
      }

      return {
        startDate,
        endDate,
        startTime,
        endTime,
        hoursOrDays,
        hoursDaysValue,
      };
    };

    async function fetchIMEIData() {
      try {
        const res = await fetch(imeiURL);
        if (!res.ok) {
          setFetchIMEIDataHasError(true);
          setFetchErrorStatus(res.status + " " + res.statusText + "!");
        }
        // let imeiListArray = [];
        return new Promise((resolve, reject) => {
          res.json().then((res) => {
            let imeiListObject = res.imei_details.map((elem) => {
              let d = elem["values"][0].last_updated;
              let date = new Date(+d);
              let last_updated = date.toDateString();
              let newImeiObject = {
                imei: elem["imei"],
                state: elem["values"][0].state,
                city: elem["values"][0].city,
                locality: elem["values"][0].locality,
                last_updated: last_updated,
              };
              return newImeiObject;
            });

            if (imeiListObject.length != 0) {
              resolve(imeiListObject);
            } else {
              reject("error occured while fetching IMEI list");
            }
          });
        });
      } catch (err) {
        setFetchIMEIDataHasError(true);
      }
    }

    async function fetchCSVData(
      imeisString,
      startDate,
      endDate,
      startTime,
      endTime,
      hoursOrDays,
      hoursDaysValue,
    ) {
      //new url

      csvURL = `https://api.yourdomain.com/adp/v4/getDeviceDataParam/imei/${device_imei}}/params/pm2.5cnc,pm10cnc,co2conc,ambTemp,humidity,tvocconc,windspeed,lat,lon/startdate/${startDate}${startTime}/enddate/${endDate}${endTime}/ts/${hoursOrDays}/avg/${hoursDaysValue}/api/ambient_aq`;

      const res = await fetch(csvURL, {
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
    }

    function getProcessedData(imeiList, csvString) {
      // convert the csvstring to jsonObj
      return new Promise((resolve, reject) => {
        csv()
          .fromString(csvString)
          .then((deviceData) => {
            mainData = imeiList;

            for (let i = 0; i < mainData.length; i++) {
              let imeiDevice = mainData[i].imei;

              let foundDeviceData = deviceData.find(function (e) {
                if (e["deviceid"] === imeiDevice) {
                  return true;
                }
              });
              if (foundDeviceData) {
                //make the new array of objects
                // pm25
                if (
                  foundDeviceData["pm2"]["5cnc"] === "" ||
                  foundDeviceData["pm2"]["5cnc"] === null
                ) {
                  mainData[i].pm25 = null;
                } else {
                  mainData[i].pm25 = foundDeviceData["pm2"]["5cnc"];
                }
                // pm10
                if (
                  foundDeviceData["pm10cnc"] === "" ||
                  foundDeviceData["pm10cnc"] === null
                ) {
                  mainData[i].pm10 = null;
                } else {
                  mainData[i].pm10 = foundDeviceData["pm10cnc"];
                }
                // co2conc
                if (
                  foundDeviceData["co2conc"] === "" ||
                  foundDeviceData["co2conc"] === null
                ) {
                  mainData[i].co2conc = null;
                } else {
                  mainData[i].co2conc = foundDeviceData["co2conc"];
                }
                // ambTemp
                if (
                  foundDeviceData["ambTemp"] === "" ||
                  foundDeviceData["ambTemp"] === null
                ) {
                  mainData[i].ambTemp = null;
                } else {
                  mainData[i].ambTemp = foundDeviceData["ambTemp"];
                }
                if (
                  foundDeviceData["tvocconc"] === "" ||
                  foundDeviceData["tvocconc"] === null
                ) {
                  mainData[i].tvocconc = null;
                } else {
                  mainData[i].tvocconc = foundDeviceData["tvocconc"];
                }
                if (
                  foundDeviceData["windspeed"] === "" ||
                  foundDeviceData["windspeed"] === null
                ) {
                  mainData[i].windspeed = null;
                } else {
                  mainData[i].windspeed = foundDeviceData["windspeed"];
                }
                if (
                  foundDeviceData["humidity"] === "" ||
                  foundDeviceData["humidity"] === null
                ) {
                  mainData[i].humidity = null;
                } else {
                  mainData[i].humidity = foundDeviceData["humidity"];
                }
                if (
                  foundDeviceData["lat"] === "" ||
                  foundDeviceData["lat"] === null
                ) {
                  mainData[i].lat = null;
                } else {
                  mainData[i].lat = foundDeviceData["lat"];
                }
                if (
                  foundDeviceData["lon"] === "" ||
                  foundDeviceData["lon"] === null
                ) {
                  mainData[i].lon = null;
                } else {
                  mainData[i].lon = foundDeviceData["lon"];
                }
              } else {
                //assign null
                mainData[i].pm25 = null;
                mainData[i].pm10 = null;
                mainData[i].ambTemp = null;
                mainData[i].co2conc = null;
                mainData[i].humidity = null;
                mainData[i].tvocconc = null;
                mainData[i].lat = null;
                mainData[i].lon = null;
              }
            }
          })
          .then(() => {
            resolve(mainData);
          });
      });
    }

    async function callAsyncFunctions() {
      setLoading(true);
      const res = await fetchIMEIData();
      const allIMEIs = res.map((item) => {
        return item.imei;
      });

      setSelectedIMEI(allIMEIs[0]);
      let imeisString = "";
      for (let i = 0; i < allIMEIs.length; i++) {
        if (i === 0) {
          imeisString += `${allIMEIs[i]}`;
        } else {
          imeisString += `,${allIMEIs[i]}`;
        }
      }
      // setimeis(imeisString);

      const {
        startDate,
        endDate,
        startTime,
        endTime,
        hoursOrDays,
        hoursDaysValue,
      } = getDurationForTable();

      const csvDataRes = await fetchCSVData(
        imeisString,
        startDate,
        endDate,
        startTime,
        endTime,
        hoursOrDays,
        hoursDaysValue,
      );

      if (csvDataRes.message) {
        setFetchCSVDataHasError(true);
        setFetchErrorStatus("message:IMEI does not belong to you");
      }
      finalMainData = await getProcessedData(res, csvDataRes);
      setLoading(false);
    }
    callAsyncFunctions();
  }, [duration, finalCustomGo]);
  return (
    <ThemeProvider theme={theme}>
      <div>
        {/* ml: { sm: `${drawerWidth}px` }, */}
        <Box sx={{ mt: "20px" }}>
          <DurationSelector
            executeSelectorHandleChange={executeHandleChange}
            executeFinalCustomDuration={handleCustomDuration}
            buttonPopupValue={buttonPopup}
          />
          {/* Fetching imei device data Error */}
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            {(fetchIMEIDataHasError || fetchCSVDataHasError) && (
              <Alert variant="outlined" severity="error">
                <AlertTitle>
                  <strong>Error occured while fetching Monitors Data.</strong>
                  {fetchErrorStatus}
                </AlertTitle>
                {/* <strong>{imeiFetchErrorStatus}</strong> */}
              </Alert>
            )}
          </Box>

          {/* This Grid contains all the child item Grids with different cards */}
          <Grid container rowSpacing={3} columnSpacing={3}>
            <Grid item xs={12} lg={6}>
              <Card
                sx={{
                  maxHeight: 570,
                  // maxWidth: 600,
                  ml: "20px",
                  mr: { sm: "20px", lg: "0" },
                  borderRadius: 2,
                  boxShadow: "1px 1px 4px 1px rgb(175 175 175 / 90%)",
                  // borderRadius: "10px 0 0 10px",
                }}
              >
                <Map
                  username="ambient_aq"
                  api_key="ambient_aq"
                  reused={false}
                  width="100%"
                  height="77vh"
                  timeButton={duration}
                  finalCustomEndDate={finalCustomEndDate}
                  finalCustomStartDate={finalCustomStartDate}
                  finalCustomGo={finalCustomGo}
                />
              </Card>
            </Grid>

            {selectedIMEI != "" &&
              !graphLoading &&
              finalPm25XYData.length != 0 && (
                <Grid item xs={12} lg={6} sx={{ float: "left" }}>
                  <Box sx={{ mr: "20px", ml: { xs: "20px", lg: 0 } }}>
                    <ApexLineChart
                      maxHeight="570px"
                      dataName1="PM2.5"
                      data1={finalPm25XYData}
                      dataName2="PM10"
                      data2={finalPm10XYData}
                      dataName3="Humidity"
                      data3={finalHumidityXYData}
                      dataName4="Amb Temp"
                      data4={finalAmbTempXYData}
                      dataName5="CO2 conc"
                      data5={finalco2concXYData}
                      dataName6="TVOC"
                      data6={finaltvocconcXYData}
                      dataName7="Air Velocity"
                      data7={finalWindSpeedXYData}
                      headerTitle={
                        selectedLocality
                          ? `${selectedLocality} ` + `(${selectedIMEI})`
                          : `${selectedIMEI}`
                      }
                      tickAmount={3}
                      legendDisclaimer="Please select/unselect an air quality parameter from above."
                    />
                  </Box>
                </Grid>
              )}

            {!loading && !fetchIMEIDataHasError && !fetchCSVDataHasError && (
              <Grid item xs={12}>
                <OutlineTable
                  headCells={headCells}
                  finalMainData={finalMainData}
                  callHandlePlotGraph={handlePlotGraph}
                />
              </Grid>
            )}

            {selectedIMEI != "" &&
              !graphLoading &&
              finalPm25XYData.length != 0 && (
                <Grid item xs={12}>
                  <Box sx={{ m: "0 20px" }}>
                    <ApexLineChart
                      dataName1="PM2.5"
                      data1={finalPm25XYData}
                      dataName2="PM10"
                      data2={finalPm10XYData}
                      dataName3="Humidity"
                      data3={finalHumidityXYData}
                      dataName4="Amb Temp"
                      data4={finalAmbTempXYData}
                      dataName5="CO2 conc"
                      data5={finalco2concXYData}
                      dataName6="TVOC"
                      data6={finaltvocconcXYData}
                      dataName7="Air Velocity"
                      data7={finalWindSpeedXYData}
                      headerTitle={
                        selectedLocality
                          ? `${selectedLocality} ` + `(${selectedIMEI})`
                          : `${selectedIMEI}`
                      }
                      tickAmount={10}
                    />
                  </Box>
                </Grid>
              )}

            {selectedIMEI != "" && graphLoading && (
              <Grid item xs={12} lg={6}>
                <Skeleton variant="rounded" width={670} height={523} />
              </Grid>
            )}
          </Grid>

          {loading && !fetchIMEIDataHasError && !fetchCSVDataHasError && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <br></br>
              <img src={loadingImage}></img>
            </div>
          )}

          <Box
            className="alert"
            sx={{ display: "flex", justifyContent: "center", mb: 2 }}
          >
            {selectedIMEI != "" &&
              !graphLoading &&
              finalPm25XYData.length === 0 && (
                <Alert variant="outlined" severity="error">
                  <AlertTitle>
                    <strong>
                      No Data Available for the parameters or Device selected!
                      Try changing your selection to plot the graph.
                    </strong>
                    {fetchErrorStatus}
                  </AlertTitle>
                  {/* <strong>{imeiFetchErrorStatus}</strong> */}
                </Alert>
              )}
          </Box>

          {selectedIMEI != "" && graphLoading && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "550px",
              }}
            >
              <br></br>
              <img src={loadingImage}></img>
            </div>
          )}
        </Box>
      </div>
    </ThemeProvider>
  );
}
