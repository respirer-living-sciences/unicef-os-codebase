// import styled from "@emotion/styled";
import { styled } from "@mui/material/styles";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import "./duration-selector.css";
import { useState } from "react";
import useMediaQuery from "@mui/material/useMediaQuery";

export default function DataIntervalSelector(props) {
  // const matches = useMediaQuery("(min-width:600px)");
  let initialInterval;
  if (props.initialInterval) {
    initialInterval = intervalObjToString(props.initialInterval);
  } else {
    initialInterval = "hh-1"; // Default to "hh-1" if no initialInterval prop is provided
  }
  const [interval, setInterval] = useState(initialInterval);

  //for passing data through props to HomeApp and selecting from toggleButtons
  const handleIntervalChange = (event, newInterval) => {
    if (newInterval !== null) {
      setInterval(newInterval);
      const [unit, value] = newInterval.split("-");

      //child component calling a function in parent component using props, passing the data in the function's arguments to the parent. A neat hack!
      props.executeIntervalHandleChange?.({ unit, value });
    }
  };

  function intervalObjToString(interval) {
    return `${interval.unit}-${interval.value}`;
  }

  const StyledToggleButtonGroupTwo = styled(ToggleButtonGroup)(({ theme }) => ({
    backgroundColor: theme.palette.action.hover,
    borderRadius: "100px",
    padding: "6px",
    "& .MuiToggleButtonGroup-grouped": {
      textTransform: "none",
      transition: "all 0.3s ease !important",
      margin: "0",
      border: "none !important",
      padding: "6px 20px",
      color: theme.palette.text.primary,
      borderRadius: "100px !important",

      "&.Mui-selected": {
        color: "white",
        backgroundColor: theme.palette.primary.main,
        boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
        "&:hover": {
          backgroundColor: theme.palette.primary.main,
        },
      },
      "&.Mui-disabled": {
        border: "0 !important",
      },
      "&:not(:first-of-type)": {
        borderLeft: "none !important",
      },
    },
  }));

  return (
    <Box
      sx={{
        ml: 5,
        mt: 2,
        display: "flex",
        justifyContent: {
          xs: "stretch",
          md: "flex-start",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          width: {
            xs: "100%", // full width on small screens
            md: "auto",
          },
          overflowX: "auto", // allow horizontal scroll on small screens
        }}
      >
        <StyledToggleButtonGroupTwo
          value={interval}
          exclusive
          onChange={handleIntervalChange}
          aria-label="intervals"
          sx={{
            width: "100%",
            minWidth: "fit-content",
          }}
        >
          <ToggleButton value="mm-15" sx={{ minWidth: "80px", color: "text.primary" }}>
            15 mins
          </ToggleButton>

          <ToggleButton value="mm-30" sx={{ minWidth: "80px", color: "text.primary" }}>
            30 mins
          </ToggleButton>

          <ToggleButton value="hh-1" sx={{ minWidth: "80px", color: "text.primary", whiteSpace: "nowrap" }}>
            1 hour
          </ToggleButton>
        </StyledToggleButtonGroupTwo>
      </Box>
    </Box>
  );
}
