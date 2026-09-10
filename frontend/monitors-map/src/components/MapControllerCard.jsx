import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  FormGroup,
  FormControlLabel,
  Switch,
  Grow,
  Fab,
  Popover,
  ButtonGroup,
  CardHeader,
} from "@mui/material";
import { Box } from "@mui/system";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import ScreenshotMonitorIcon from "@mui/icons-material/ScreenshotMonitor";
import { useEffect } from "react";
import moment from "moment";
import { Link } from "react-router-dom";
// import MapSnapshot from "./MapSnapshot";
import html2canvas from "html2canvas";

import CustomDurationPopOver from "remote/CustomDurationPopOver";
import DialogScreenshot from "./DialogScreenshot";
import Tooltip from "@mui/material/Tooltip";
import InfoIcon from "@mui/icons-material/Info";
import IconButton from "@mui/material/IconButton";

export default function MapControllerCard(props) {
  const username = props.username;
  const mapRef = props.mapRef;

  let mapToday = new Date();
  let mapSevenDaysAgo = mapToday;
  let mapThirtyDaysAgo = mapToday;
  const day = ("0" + mapToday.getUTCDate()).slice(-2);
  const month = ("0" + (mapToday.getUTCMonth() + 1)).slice(-2); // getUTCMonth() returns month from 0 to 11
  const year = mapToday.getUTCFullYear();
  const fullDate = `${year}-${month}-${day}`;

  const [avgTime, setAvgTime] = useState("hh");
  const [pollutant, setPollutant] = useState("pm2.5cnc");
  const [timeButton, setTimeButton] = useState("24hrs");
  const [clusterChecked, setClusterChecked] = useState(true);
  const [split, setSplit] = useState("1");
  const [go, setGo] = useState("1");

  const [durationButtonPopOver, setDurationButtonPopOver] = useState(null);
  const [durationStartDate, setDurationStartDate] = useState(fullDate);
  const [durationEndDate, setDurationEndDate] = useState(fullDate);

  const [anchorEl, setAnchorEl] = useState(null);
  const [mapStartTime, setMapStartTime] = useState("T00:00");
  const [mapEndTime, setMapEndTime] = useState("T23:59");
  const [hoursOrDays, setHoursOrDays] = useState("hh");
  const [hoursDaysValue, setHoursDaysValue] = useState("24");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [mapScreenshot, setMapScreenshot] = useState("");
  const [maxDate, setMaxDate] = useState(6);

  useEffect(() => {
    props.executeGetURLDataInParent(
      avgTime,
      pollutant,
      timeButton,
      split,
      durationStartDate,
      durationEndDate,
      mapStartTime,
      mapEndTime,
      hoursOrDays,
      hoursDaysValue,
      clusterChecked,
    );
  }, [go, avgTime, split, timeButton, pollutant, clusterChecked]);

  const handleAvgTimeChange = (event) => {
    setAvgTime(event.target.value);
    if (event.target.value === "mm") setMaxDate(0);
    else if (event.target.value === "hh") setMaxDate(29);
    else if (event.target.value === "dd") setMaxDate(182);
  };
  const handlePollutantChange = (event) => {
    setPollutant(event.target.value);
  };

  const handleTimeButtonChange = (event, newTime) => {
    if (newTime === null) {
      setTimeButton("");
      setHoursOrDays("dd");
      setHoursDaysValue("1");
    }
    if (newTime === "24hrs") {
      setDurationStartDate(fullDate);
      setDurationEndDate(fullDate);
      setTimeButton(newTime);
      setHoursOrDays("hh");
      setHoursDaysValue("24");
      setMapStartTime("T00:00");
      setMapEndTime("T23:59");
    } else if (newTime === "7days") {
      mapSevenDaysAgo.setDate(mapToday.getDate() - 6);
      const day = ("0" + mapSevenDaysAgo.getUTCDate()).slice(-2);
      const month = ("0" + (mapSevenDaysAgo.getUTCMonth() + 1)).slice(-2); // getUTCMonth() returns month from 0 to 11
      const year = mapSevenDaysAgo.getUTCFullYear();
      const sevenDaysAgoFullDate = `${year}-${month}-${day}`;
      setDurationStartDate(sevenDaysAgoFullDate);
      setDurationEndDate(fullDate);
      setTimeButton(newTime);
      setHoursOrDays("dd");
      setHoursDaysValue("7");
      setMapStartTime("T15:00");
      setMapEndTime("T15:00");
      mapToday = new Date();
    } else if (newTime === "30days") {
      mapThirtyDaysAgo.setDate(mapToday.getDate() - 29);
      const day = ("0" + mapThirtyDaysAgo.getUTCDate()).slice(-2);
      const month = ("0" + (mapThirtyDaysAgo.getUTCMonth() + 1)).slice(-2); // getUTCMonth() returns month from 0 to 11
      const year = mapThirtyDaysAgo.getUTCFullYear();
      const thirtyDaysAgoFullDate = `${year}-${month}-${day}`;
      setDurationStartDate(thirtyDaysAgoFullDate);
      setDurationEndDate(fullDate);
      setTimeButton(newTime);
      setHoursOrDays("dd");
      setHoursDaysValue("30");
      setMapStartTime("T15:00");
      setMapEndTime("T15:00");
      mapToday = new Date();
    }
  };

  const handleSplitChange = (event) => {
    setSplit(event.target.value);
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSwitchChange = (event) => {
    clusterChecked ? setClusterChecked(false) : setClusterChecked(true);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  // Duration Popover handle functions

  const handleDurationPopOverOpen = () => {
    setDurationButtonPopOver(true);
  };

  const handleDurationPopOverClose = () => {
    setDurationButtonPopOver(false);
  };

  const handleDurationPopOverGo = () => {
    go ? setGo(false) : setGo(true);
    setTimeButton("");
    setDurationButtonPopOver(false);
  };

  const handleCustomDuration = (customStart, customEnd) => {
    setDurationStartDate(customStart);
    setDurationEndDate(customEnd);
    if (customEnd != null) {
      let endDateMoment = moment(customEnd);
      let startDateMoment = moment(customStart);
      let dayDiff = endDateMoment.diff(startDateMoment, "day");
      setHoursOrDays("dd");
      setHoursDaysValue(dayDiff + 1);
      setMapStartTime("T15:00");
      setMapEndTime("T15:00");
    }
  };

  // const handleGetSnapshot = () => {

  // };

  const handleSnapshotDialog = () => {
    const map = mapRef.current?.getMap();
    if (!map) return;

    const canvas = map.getCanvas();
    html2canvas(canvas).then((screenshot) => {
      const screenshotURL = screenshot.toDataURL();
      setMapScreenshot(screenshotURL);
      setDialogOpen(true);
    });
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  //split select menu props
  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };

  const selectAvgTime = (
    <FormControl sx={{ minWidth: 110 }} size="small">
      <InputLabel id="demo-simple-select-label">Average Time</InputLabel>
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={avgTime}
        label="avgTime"
        onChange={handleAvgTimeChange}
      >
        <MenuItem value={"mm"}>Minute</MenuItem>
        <MenuItem value={"hh"}>Hour</MenuItem>
        <MenuItem value={"dd"}>Day</MenuItem>
      </Select>
    </FormControl>
  );

  const selectPollutant = (
    <FormControl sx={{ minWidth: 110 }} size="small">
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

  const clusterSwitch = (
    <FormGroup sx={{ marginRight: "10px" }}>
      <FormControlLabel
        control={
          <Switch checked={clusterChecked} onChange={handleSwitchChange} />
        }
        label="Cluster"
        labelPlacement="start"
      />
    </FormGroup>
  );

  const selectSplitGap = (
    <FormControl sx={{ minWidth: 120 }} size="small">
      <InputLabel id="demo-simple-select-label">Split</InputLabel>
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={split}
        label="split"
        onChange={handleSplitChange}
        MenuProps={MenuProps}
      >
        <MenuItem value={"1"}>1</MenuItem>
        <MenuItem value={"2"}>2</MenuItem>
        <MenuItem value={"3"}>3</MenuItem>
        <MenuItem value={"4"}>4</MenuItem>
        <MenuItem value={"5"}>5</MenuItem>
        <MenuItem value={"6"}>6</MenuItem>
        <MenuItem value={"7"}>7</MenuItem>
        <MenuItem value={"8"}>8</MenuItem>
        <MenuItem value={"9"}>9</MenuItem>
        <MenuItem value={"10"}>10</MenuItem>
      </Select>
    </FormControl>
  );

  return (
    <>
      <Fab
        className="Fab-afzal"
        sx={{
          margin: 0,
          // top: "auto",
          right: "40px",
          bottom: "55px",
          // left: "auto",
          position: "absolute",
        }}
        onClick={handleClick}
      >
        {open ? <CloseIcon /> : <SearchIcon color="primary" />}
      </Fab>
      <Popover
        open={open}
        // anchorEl={buttonPopup}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
      >
        <Grow in={open} {...(open ? { timeout: 300 } : { timeout: 300 })}>
          <Box>
            <Card
              sx={{
                maxWidth: 310,
                minHeight: 250,
                backgroundColor: "background.paper",
                color: "text.primary",
              }}
            >
              <CardHeader sx={{ paddingBottom: 0 }} title="Map Options" />
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "space-between",
                  }}
                >
                  {/* Sort By */}

                  <Typography variant="subtitle1">Sort By:</Typography>

                  <ToggleButtonGroup
                    color="primary"
                    value={timeButton}
                    exclusive
                    onChange={handleTimeButtonChange}
                  >
                    <ToggleButton sx={{ width: "100px" }} value="24hrs">
                      24 Hrs
                    </ToggleButton>
                    <ToggleButton
                      sx={{ width: "100px" }}
                      value="7days"
                      disabled={avgTime === "mm"}
                    >
                      7 Days
                    </ToggleButton>
                    <ToggleButton
                      sx={{ width: "100px" }}
                      value="30days"
                      disabled={avgTime === "mm"}
                    >
                      30 Days
                    </ToggleButton>
                  </ToggleButtonGroup>

                  {/* Filter By */}
                  <Box paddingBottom={1} paddingTop={2}>
                    <Typography variant="subtitle1">Filter:</Typography>

                    <Grid container rowSpacing={3}>
                      <Grid item xs={6}>
                        <Tooltip
                          title={
                            <>
                              Time frame restrictions for selecting data:
                              <br />
                              Daily: You can choose up to 6 months of data at
                              once.
                              <br />
                              Hourly: You can choose up to 1 month of data at
                              once.
                              <br />
                              Per Minute: You can choose up to 1 day of data at
                              once.
                            </>
                          }
                        >
                          <Button
                            variant="contained"
                            onClick={handleDurationPopOverOpen}
                            startIcon={<CalendarMonthIcon />}
                          >
                            Duration
                          </Button>
                        </Tooltip>
                      </Grid>
                      <Grid item xs={6}>
                        {/* <Link
                          to="/map/snapshot"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="link"
                        > */}
                        <Button
                          variant="contained"
                          startIcon={<ScreenshotMonitorIcon />}
                          onClick={handleSnapshotDialog}
                        >
                          Snapshot
                        </Button>
                      </Grid>
                      <Grid item xs={6}>
                        {selectAvgTime}
                      </Grid>
                      <Grid item xs={6}>
                        {selectPollutant}
                      </Grid>
                      <Grid item xs={6}>
                        {selectSplitGap}
                      </Grid>
                      <Grid item xs={6}>
                        {clusterSwitch}
                      </Grid>
                    </Grid>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Box>
        </Grow>
      </Popover>

      {/* Duration Selector PopOver */}
      <Popover
        open={durationButtonPopOver}
        // anchorEl={buttonPopup}
        onClose={handleDurationPopOverClose}
        anchorReference="anchorPosition"
        anchorPosition={{ top: 147, left: 1100 }}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        {/* Content goes here */}
        {/* <CustomDurationPopOver executeCustomDuration={handleCustomDuration} /> */}
        <CustomDurationPopOver
          executeCustomDuration={handleCustomDuration}
          maxDateRange={maxDate}
        />
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-around",
          }}
        >
          <ButtonGroup fullWidth>
            <Button
              onClick={handleDurationPopOverClose}
              size="large"
              variant="outlined"
              color="error"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDurationPopOverGo}
              size="large"
              variant="outlined"
              color="success"
            >
              Go
            </Button>
          </ButtonGroup>
        </Box>
      </Popover>

      <DialogScreenshot
        open={dialogOpen}
        onClose={handleCloseDialog}
        mapSS={mapScreenshot}
      />
    </>
  );
}
