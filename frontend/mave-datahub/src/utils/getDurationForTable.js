import moment from "moment";
import getDateInTimeZone from "./getDateInTimeZone";

const getDurationForTable = (
  duration,
  finalCustomStartDate,
  finalCustomEndDate,
  output_timezone,
) => {
  const timezone = output_timezone;
  const now = new Date();

  const { date: todayDateStr } = getDateInTimeZone(timezone, now);
  const getFormattedDate = (offsetDays) => {
    const date = new Date(now);
    date.setDate(now.getDate() - offsetDays);
    return getDateInTimeZone(timezone, date).date;
  };

  let startDate, endDate, startTime, endTime, hoursOrDays, hoursDaysValue;

  switch (duration) {
    case "today":
      startDate = endDate = todayDateStr;
      hoursOrDays = "dd";
      hoursDaysValue = "1";
      startTime = "T00:00";
      endTime = "T23:59";
      break;

    case "7days":
      startDate = getFormattedDate(6);
      endDate = todayDateStr;
      hoursOrDays = "dd";
      hoursDaysValue = "7";
      startTime = "T00:00";
      endTime = "T23:59";
      break;

    case "30days":
      startDate = getFormattedDate(29);
      endDate = todayDateStr;
      hoursOrDays = "dd";
      hoursDaysValue = "30";
      startTime = "T00:00";
      endTime = "T23:59";
      break;

    case "custom":
      startDate = finalCustomStartDate;
      endDate = finalCustomEndDate;
      const dayDiff = moment(endDate).diff(moment(startDate), "days") + 1;
      hoursOrDays = "dd";
      hoursDaysValue = dayDiff;
      startTime = "T00:00";
      endTime = "T23:59";
      break;

    case "live":
      const nowMinus1Min = new Date(now.getTime() - 1 * 60 * 1000);
      const nowMinus5Min = new Date(now.getTime() - 5 * 60 * 1000);

      const start = getDateInTimeZone(timezone, nowMinus5Min);
      const end = getDateInTimeZone(timezone, nowMinus1Min);

      startDate = start.date;
      endDate = end.date;
      startTime = `T${start.time}`;
      endTime = `T${end.time}`;
      hoursOrDays = "mm";
      hoursDaysValue = "5";
      break;

    default:
      // fallback to "custom" if duration is null/undefined
      startDate = finalCustomStartDate;
      endDate = finalCustomEndDate;
      const fallbackDiff = moment(endDate).diff(moment(startDate), "days") + 1;
      hoursOrDays = "dd";
      hoursDaysValue = fallbackDiff;
      startTime = "T00:00";
      endTime = "T23:59";
      break;
  }

  return {
    startDate,
    endDate,
    startTime,
    endTime,
    hoursOrDays,
    hoursDaysValue,
  };
};

export default getDurationForTable;
