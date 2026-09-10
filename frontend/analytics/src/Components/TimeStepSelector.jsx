import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import React from "react";

export default function TimeStepSelector(props) {
  const { handleTimeStep, timeStep } = props;
  return (
    <FormControl size="small" fullWidth>
      <InputLabel id="demo-simple-select-label">Time Step</InputLabel>
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={timeStep}
        label="duration"
        onChange={handleTimeStep}
      >
        <MenuItem value={"hours"}>Hours</MenuItem>
        <MenuItem value={"minutes"}>Minutes</MenuItem>
        <MenuItem value={"days"}>Days</MenuItem>
      </Select>
    </FormControl>
  );
}
