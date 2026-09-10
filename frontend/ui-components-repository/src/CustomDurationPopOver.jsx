import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file

import React from "react";
import { useState } from "react";
import { DateRange } from "react-date-range";
import "./cardmui.css";
import { Box } from "@mui/system";
import { useEffect } from "react";

let endFullDate;
export default function CustomDurationPopOver(props) {
  const [state, setState] = useState([
    {
      startDate: props.customStart ? new Date(props.customStart) : new Date(),
      endDate: props.customEnd ? new Date(props.customEnd) : null,
      key: "selection",
    },
  ]);
  const [maxDate, setMaxDate] = useState();
  const [minDate, setMinDate] = useState();

  const start = state[0].startDate;
  const end = state[0].endDate;

  const dd = ("0" + start.getDate()).slice(-2);
  const mm = ("0" + (start.getMonth() + 1)).slice(-2); // getMonth() returns month from 0 to 11
  const yy = start.getFullYear();
  const startFullDate = `${yy}-${mm}-${dd}`;

  if (state[0].endDate !== null) {
    const enddd = ("0" + end.getDate()).slice(-2);
    const endmm = ("0" + (end.getMonth() + 1)).slice(-2); // getMonth() returns month from 0 to 11
    const endyy = end.getFullYear();
    endFullDate = `${endyy}-${endmm}-${enddd}`;
  }

  function handleSelect(item) {
    const startDate = new Date(item.selection.startDate);
    const localMinDate = new Date(startDate);
    setMinDate(localMinDate);
    const localMaxDate = new Date(startDate);
    if (props.maxDateRange || props.maxDateRange === 0) {
      const today = new Date();
      // Calculate the difference in milliseconds
      const differenceInMilliseconds = today - localMinDate;

      // Convert milliseconds to days
      const millisecondsPerDay = 24 * 60 * 60 * 1000;
      const differenceInDays = differenceInMilliseconds / millisecondsPerDay;

      if (differenceInDays <= props.maxDateRange) {
        localMaxDate.setDate(localMaxDate.getDate() + differenceInDays);
        setMaxDate(localMaxDate);
      } else {
        localMaxDate.setDate(localMaxDate.getDate() + props.maxDateRange); // Max range depends on time step selected.
        setMaxDate(localMaxDate);
      }
    }
    // if (endDate > maxDate) {
    //   endDate.setDate(startDate.getDate() + 7);
    // }
    setState([item.selection]);
  }

  useEffect(() => {
    props.executeCustomDuration(startFullDate, endFullDate);
  });
  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <DateRange
        onChange={handleSelect}
        moveRangeOnFirstSelection={false}
        ranges={state}
        maxDate={new Date()}
        minDate={minDate}
      />
    </Box>
  );
}
