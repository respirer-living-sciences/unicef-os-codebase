// import styled from "@emotion/styled";
import { styled } from "@mui/material/styles";
import {
  Button,
  ButtonGroup,
  Popover,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { borderRadius, Box } from "@mui/system";
import React from "react";
import "./duration-selector.css";
import { useState } from "react";
import CustomDurationPopOver from "./CustomDurationPopOver";
import useMediaQuery from "@mui/material/useMediaQuery";

export default function Selector(props) {
  const matches = useMediaQuery("(min-width:600px)");
  const [duration, setDuration] = useState("today");
  const [buttonPopup, setButtonPopup] = useState(null);
  const [customStartDate, setCustomStartDate] = useState();
  const [customEndDate, setCustomEndDate] = useState();
  const [customGo, setCustomGo] = useState(false);
  // let trigger = props.buttonPopupValue;

  //for passing data through props to HomeApp and selecting from toggleButtons
  const handleDuration = (event, newDuration) => {
    if (newDuration !== null) {
      setDuration(newDuration);
    }
    //child component calling a function in parent component using props, passing the data in the function's arguments to the parent. A neat hack!
    props.executeSelectorHandleChange(newDuration);
  };

  const handleCustomDuration = (customStart, customEnd) => {
    setCustomStartDate(customStart);
    setCustomEndDate(customEnd);
  };

  //handling clicks for popover
  const handleClickOpen = (event) => {
    setButtonPopup(true);
  };

  // this means the user didnt select any custom duration so the operation will not be performed
  const handleClose = () => {
    setButtonPopup(null);
    setCustomStartDate(null);
    setCustomEndDate(null);

    setCustomGo(false);
  };
  const handleSubmitCustom = () => {
    setButtonPopup(null);

    props.executeSelectorHandleChange("custom");

    props.executeFinalCustomDuration(customStartDate, customEndDate, true);
    setCustomGo(false);
  };

  //custom styles for ToggleButton
  const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
    "& .MuiToggleButtonGroup-grouped": {
      transition: "background-color 0.3s", // Add transition in base state
      borderRadius: "8px",

      "&:hover": {
        backgroundColor: theme.palette.action.hover,
      },
    },
  }));

  const StyledToggleButtonGroupTwo = styled(ToggleButtonGroup)(({ theme }) => ({
    backgroundColor: theme.palette.action.hover,
    borderRadius: "100px",
    padding: "4px",
    "& .MuiToggleButtonGroup-grouped": {
      textTransform: "none",
      transition: "all 0.3s ease !important",
      margin: "0",
      border: "none !important",
      padding: "6px 20px",
      color: theme.palette.text.primary,
      // fontWeight: "bold",
      borderRadius: "100px !important", // pill shape for buttons

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
    <>
      <Box className="durationContainer">
        {/* Desktop Screen */}

        <Box
          sx={{
            mt: 2,
            ml: 2,
            display: "flex",
            justifyContent: {
              xs: "stretch",
              md: "flex-start", // or "center" if you want centered
            },
          }}
        >
          <Box
            sx={{
              display: "flex",
              width: {
                xs: "100%", // Full width on small screens
                md: "auto",
              },
              overflowX: "auto", // allow horizontal scroll on small screens
            }}
          >
            <StyledToggleButtonGroupTwo
              value={duration}
              exclusive
              onChange={handleDuration}
              aria-label="durations"
              fullWidth
              sx={{
                width: "100%", // allow full width usage
                minWidth: "fit-content", // don't squish buttons
              }}
            >
              <ToggleButton
                value="live"
                aria-label="for live"
                sx={{
                  minWidth: "100px",
                  color: "black",
                }}
              >
                Live
              </ToggleButton>
              <ToggleButton
                value="today"
                aria-label="for today"
                sx={{
                  minWidth: "100px",
                  color: "black",
                }}
              >
                Today
              </ToggleButton>
              <ToggleButton
                value="7days"
                aria-label="for 7 days"
                sx={{
                  minWidth: "100px",
                  color: "black",
                }}
              >
                7 days
              </ToggleButton>
              <ToggleButton
                value="30days"
                aria-label="for 30 days"
                sx={{
                  minWidth: "100px",
                  color: "black",
                }}
              >
                30 days
              </ToggleButton>
              <ToggleButton
                onClick={handleClickOpen}
                value="custom"
                aria-label="custom"
                sx={{
                  minWidth: "100px",
                  color: "black",
                  whiteSpace: "nowrap",
                }}
              >
                {customStartDate && customEndDate
                  ? `${customStartDate} - ${customEndDate}`
                  : "Custom"}
              </ToggleButton>
            </StyledToggleButtonGroupTwo>

            <Popover
              open={buttonPopup}
              // anchorEl={buttonPopup}
              onClose={handleClose}
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
              <CustomDurationPopOver
                executeCustomDuration={handleCustomDuration}
              />
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-around",
                }}
              >
                <ButtonGroup fullWidth>
                  <Button
                    onClick={handleClose}
                    size="large"
                    variant="outlined"
                    color="error"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSubmitCustom}
                    size="large"
                    variant="outlined"
                    color="success"
                  >
                    Go
                  </Button>
                </ButtonGroup>
              </Box>
            </Popover>
          </Box>
        </Box>
      </Box>
    </>
  );
}
