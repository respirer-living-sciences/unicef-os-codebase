import React from "react";
import moment from "moment";

export default function getDurationSelector(
  duration,
  finalCustomStartDate,
  finalCustomEndDate
) {
  let tableToday = new Date();
  let tableSevenDaysAgo = tableToday;
  let tableThirtyDaysAgo = tableToday;

  let day = ("0" + tableToday.getUTCDate()).slice(-2);
  let month = ("0" + (tableToday.getUTCMonth() + 1)).slice(-2); // getUTCMonth() returns month from 0 to 11
  let year = tableToday.getUTCFullYear();
  let fullDate = `${year}-${month}-${day}`;

  let startDate;
  let endDate;
  let hoursOrDays;
  let hoursDaysValue;
  let endTime;
  let startTime;

  if (duration == null) {
    duration = "custom";
  }

  if (duration == "today") {
    //assigning value to params
    endDate = fullDate;
    startDate = fullDate;
    hoursOrDays = "hh";
    hoursDaysValue = "24";
    startTime = "T00:00";
    endTime = "T23:59";
  } else if (duration == "7days") {
    tableSevenDaysAgo.setDate(tableToday.getDate() - 6);
    tableToday = new Date();
    day = ("0" + tableSevenDaysAgo.getUTCDate()).slice(-2);
    month = ("0" + (tableSevenDaysAgo.getUTCMonth() + 1)).slice(-2); // getUTCMonth() returns month from 0 to 11
    year = tableSevenDaysAgo.getUTCFullYear();
    const sevenDaysAgoFullDate = `${year}-${month}-${day}`;
    //assigning value to params
    endDate = fullDate;
    startDate = sevenDaysAgoFullDate;
    hoursOrDays = "dd";
    hoursDaysValue = "7";
    startTime = "T15:00";
    endTime = "T15:00";
  } else if (duration == "30days") {
    tableThirtyDaysAgo.setDate(tableToday.getDate() - 29);
    tableToday = new Date();
    day = ("0" + tableThirtyDaysAgo.getUTCDate()).slice(-2);
    month = ("0" + (tableThirtyDaysAgo.getUTCMonth() + 1)).slice(-2); // getUTCMonth() returns month from 0 to 11
    year = tableThirtyDaysAgo.getUTCFullYear();
    const tableThirtyDaysAgoFullDate = `${year}-${month}-${day}`;

    //assigning value to params
    endDate = fullDate;
    startDate = tableThirtyDaysAgoFullDate;
    hoursOrDays = "dd";
    hoursDaysValue = "30";
    startTime = "T15:00";
    endTime = "T15:00";
  } else if (duration == "custom") {
    endDate = finalCustomEndDate;
    startDate = finalCustomStartDate;
    hoursOrDays = "dd";

    //Calculating the difference / duration of custom selected dates
    let endDateMoment = moment(endDate);
    let startDateMoment = moment(startDate);
    let dayDiff = endDateMoment.diff(startDateMoment, "day");

    hoursDaysValue = dayDiff + 1;
    startTime = "T15:00";
    endTime = "T15:00";
  }

  return {
    startDate,
    endDate,
    startTime,
    endTime,
    hoursOrDays,
    hoursDaysValue,
  };
}
