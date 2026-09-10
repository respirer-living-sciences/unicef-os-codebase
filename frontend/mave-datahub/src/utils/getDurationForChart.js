import getDateInTimeZone from "./getDateInTimeZone";
import moment from "moment";

const getDurationParams = (
  duration,
  finalCustomStartDate,
  finalCustomEndDate,
  output_timezone
) => {
  const timezone = output_timezone;
  const now = new Date();

  const getDateNDaysAgo = (n) => {
    const date = new Date(now);
    date.setDate(date.getDate() - n);
    return {
      raw: date,
      formatted: getDateInTimeZone(timezone, date).date,
    };
  };

  const safeCustomStart = finalCustomStartDate
    ? moment(finalCustomStartDate).format("YYYY-MM-DD")
    : null;

  const safeCustomEnd = finalCustomEndDate
    ? moment(finalCustomEndDate).format("YYYY-MM-DD")
    : null;

  const { date: todayDateStr } = getDateInTimeZone(timezone, now);

  let graphStartDate, graphEndDate;
  let graphSevenDaysAgo = null;
  let graphThirtyDaysAgo = null;

  switch (duration) {
    case "today":
    case "live":
      graphStartDate = todayDateStr;
      graphEndDate = todayDateStr;
      break;

    case "7days":
      const sevenDaysAgo = getDateNDaysAgo(6);
      graphSevenDaysAgo = sevenDaysAgo.raw;
      graphStartDate = sevenDaysAgo.formatted;
      graphEndDate = todayDateStr;
      break;

    case "30days":
      const thirtyDaysAgo = getDateNDaysAgo(29);
      graphThirtyDaysAgo = thirtyDaysAgo.raw;
      graphStartDate = thirtyDaysAgo.formatted;
      graphEndDate = todayDateStr;
      break;

    case "custom":
    default:
      if (!safeCustomStart || !safeCustomEnd) {
        graphStartDate = todayDateStr;
        graphEndDate = todayDateStr;
      } else {
        graphStartDate = safeCustomStart;
        graphEndDate = safeCustomEnd;
      }
      break;
  }

  return {
    graphStartDate,
    graphEndDate,
    graphSevenDaysAgo,
    graphThirtyDaysAgo,
  };
};

export default getDurationParams;
