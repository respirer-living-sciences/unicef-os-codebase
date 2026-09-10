import React from "react";
import { Box, FormControl, Select, MenuItem, InputLabel } from "@mui/material";

export default function PollutantSelector({ options = [], value, onChange }) {
  return (
    <Box
      sx={{
        backgroundColor: "background.paper",
        color: "text.primary",
        borderRadius: 2,
        boxShadow: 3,
        padding: "6px 10px",
        minWidth: 180,
      }}
    >
      <FormControl fullWidth size="small">
        <InputLabel id="pollutant-select-label">Pollutant</InputLabel>

        <Select
          labelId="pollutant-select-label"
          value={value}
          label="Pollutant"
          onChange={(e) => onChange(e.target.value)}
        >
          {options.map((item) => (
            <MenuItem key={item.metric} value={item.metric}>
              {item.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}
