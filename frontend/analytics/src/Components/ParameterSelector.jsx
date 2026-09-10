import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import React from "react";

const paramsList = [
  {
    metric: "pm2.5cnc",
    label: "PM₂.₅",
    unit: "µg/m³",
  },
  {
    metric: "pm10cnc",
    label: "PM₁₀",
    unit: "µg/m³",
  },
];

export default function ParameterSelector(props) {
  const { handleParameter, parameter } = props;
  return (
    <FormControl size="small" fullWidth>
      <InputLabel id="parameter-select-label">Parameter</InputLabel>
      <Select
        labelId="parameter-select-label"
        id="parameter-select"
        value={parameter}
        label="Parameter"
        onChange={handleParameter}
      >
        {paramsList.map((param) => (
          <MenuItem key={param.metric} value={param.metric}>
            {param.label} ({param.unit})
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
