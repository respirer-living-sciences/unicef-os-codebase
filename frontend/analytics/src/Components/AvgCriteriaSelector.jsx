import { FormControl, TextField } from "@mui/material";
import React from "react";

export default function AvgCriteriaSelector(props) {
  const { average, handleAverageCriteria } = props;
  return (
    <FormControl size="small" fullWidth>
      <TextField
        id="time-step"
        size="small"
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
}
