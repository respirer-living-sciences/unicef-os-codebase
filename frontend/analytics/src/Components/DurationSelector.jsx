import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import React from "react";

export default function DurationSelector(props) {
  const {
    durationButton,
    handleDurationButton,
    handleDurationPopOverOpen,
    durationStartDate,
    durationEndDate,
  } = props;

  return (
    <FormControl size="small" fullWidth>
      <InputLabel id="demo-simple-select-label">Duration</InputLabel>
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={durationButton}
        label="duration"
        onChange={handleDurationButton}
      >
        {/* <MenuItem value={"today"}>Today</MenuItem> */}
        <MenuItem value={"7days"}>7 Days</MenuItem>
        <MenuItem value={"30days"}>30 Days</MenuItem>
        <MenuItem value={"custom"} onClick={handleDurationPopOverOpen}>
          {durationButton === "custom" && durationStartDate && durationEndDate
            ? `${durationStartDate} - ${durationEndDate}`
            : "Custom"}
        </MenuItem>
      </Select>
    </FormControl>
  );
}
