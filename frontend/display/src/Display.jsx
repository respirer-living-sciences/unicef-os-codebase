import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
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
  Typography,
} from "@mui/material";

import { styled } from "@mui/material/styles";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";

const drawerWidth = 260;

const theme = createTheme({
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

const deviceData = [
  { imei: "123", locality: "asda" },
  { imei: "456", locality: "jkas" },
];

const pollutantsData = [
  { pollutantName: "PM2.5", value: "pm2.5cnc" },
  { pollutantName: "PM10", value: "pm10cnc" },
  { pollutantName: "PM1", value: "pm1cnc" },
  { pollutantName: "Humidity", value: "humidity" },
  { pollutantName: "Temperature", value: "temp" },
];

export default function Display() {
  const [monitorValue, setMonitorValue] = useState([]);
  const [parameter, setParameter] = useState([]);
  const [average, setAverage] = useState("");
  const [timeStep, setTimeStep] = useState("");
  const [locationTitle, setLocationTitle] = useState("");
  const [validationError, setValidationError] = useState(false);

  const handleSelectMonitor = (event, newMonitor) => {
    setMonitorValue([...newMonitor]);
  };

  const handleParametersButton = (event, newParameters) => {
    setParameter([...newParameters]);
  };

  const handleAverageCriteria = (e) => {
    const targetValue = e.target.value;
    setAverage(targetValue);
  };

  const handleTimeStep = (e) => {
    const targetValue = e.target.value;
    setTimeStep(targetValue);
  };

  const handleCreateDisplay = () => {
    setValidationError(false);
    // form validation
    if (
      locationTitle === ("" || undefined) ||
      average === ("" || undefined) ||
      timeStep === ("" || undefined) ||
      monitorValue.length === 0 ||
      parameter.length === 0
    ) {
      setValidationError(true);
    } else {
      setValidationError(false);
      const data = JSON.stringify({
        imei: monitorValue,
        params: parameter,
        avg: average,
        ts: timeStep,
        location_title: locationTitle,
      });
    }
  };

  const handleLocationTitle = (event) => {
    setLocationTitle(event.target.value);
  };

  const selectMaveMonitor = (
    <Autocomplete
      sx={{ mb: 3 }}
      fullWidth
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
          label="Monitors"
          placeholder="select monitors from the list"
        />
      )}
    />
  );

  {
    /* parameter button (pm25cnc, pm10cnc, etc...) */
  }

  const selectPollutant = (
    <Autocomplete
      sx={{ mb: 3 }}
      fullWidth
      value={parameter}
      onChange={handleParametersButton}
      multiple
      id="tags-standard"
      options={pollutantsData}
      getOptionLabel={(option) => option.pollutantName}
      // defaultValue={[pollutantsData[0]]}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Pollutants"
          placeholder="select Pollutants from the list"
        />
      )}
    />
  );

  const selectTimeStepCriteria = (
    <FormControl sx={{ minWidth: 120, mb: 3 }} size="medium" fullWidth>
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
    <FormControl sx={{ minWidth: 120, mb: 3 }} size="medium" fullWidth>
      <TextField
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

  const TypeLocationTitle = (
    <TextField
      sx={{ mb: 3 }}
      id="outlined-name"
      label="Location Title"
      value={locationTitle}
      onChange={handleLocationTitle}
    />
  );

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ ml: { sm: `${drawerWidth}px` }, mt: "100px" }}>
        <Box
          className="params-selector"
          sx={{ ml: { xs: "5%", sm: "2%" }, mr: { xs: "10%" } }}
        >
          <Box>
            Static Display Allows you to create a static display to showcase air
            quality in your building...
          </Box>
          <br></br>
          {/* Replaced the space consuming buttons with these select Grids*/}
          <Grid container spacing={3} columns={12}>
            <Grid item xs={12} sm={6} lg={3}>
              {/* IMEI */}

              {selectMaveMonitor}
            </Grid>
            <Grid item xs={12} sm={6} lg={3}>
              {selectPollutant}
            </Grid>
            <Grid item xs={12} sm={6} lg={3}>
              {selectTimeStepCriteria}
            </Grid>
            <Grid item xs={12} sm={6} lg={3}>
              {selectAveragingCriteria}
            </Grid>
            <Grid item xs={12} sm={6} lg={3}>
              {TypeLocationTitle}
            </Grid>
          </Grid>
          <Button
            onClick={handleCreateDisplay}
            color="primary"
            variant="contained"
            sx={{ mt: 3, mb: 2, color: "white" }}
          >
            Create Display
          </Button>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
