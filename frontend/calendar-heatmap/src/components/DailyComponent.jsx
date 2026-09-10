import React, { useEffect } from "react";

export function DailyComponent(props) {
  let color = "#E5E7EB"; // default = no data
  let textColor = "#6B7280";

  // Handle null / undefined / NaN FIRST
  if (props.pm25 === null || props.pm25 === undefined || isNaN(props.pm25)) {
    color = "#E5E7EB";
    textColor = "#6B7280";
  } else if (props.selected_metric === "pm2.5cnc") {
    if (props.pm25 <= 30) {
      color = "#1EC82F";
      textColor = "#000";
    } else if (props.pm25 <= 60) {
      color = "#1BF030";
      textColor = "#000";
    } else if (props.pm25 <= 90) {
      color = "#F3DC0C";
      textColor = "#000";
    } else if (props.pm25 <= 120) {
      color = "#DC143C";
      textColor = "#fff";
    } else if (props.pm25 <= 250) {
      color = "#B22222";
      textColor = "#fff";
    } else {
      color = "#8B0000";
      textColor = "#fff";
    }
  } else {
    // PM10
    if (props.pm25 <= 50) {
      color = "#1EC82F";
      textColor = "#000";
    } else if (props.pm25 <= 100) {
      color = "#1BF030";
      textColor = "#000";
    } else if (props.pm25 <= 250) {
      color = "#F3DC0C";
      textColor = "#000";
    } else if (props.pm25 <= 350) {
      color = "#DC143C";
      textColor = "#fff";
    } else if (props.pm25 <= 430) {
      color = "#B22222";
      textColor = "#fff";
    } else {
      color = "#8B0000";
      textColor = "#fff";
    }
  }

  const logValue = () => undefined;

  //used to apply grid column value to each days tile in a month
  useEffect(() => {
    document.getElementsByClassName("day")[0].style.gridColumn =
      props.gridColumnValue;
  });

  //This code makes the date appear in each dailyComponent tile in the mm dd format. The dates are brought from the masterData that has all the data for the month.
  function getMonthDateFormat() {
    let year = props.date_time.split("-")[0];
    let month = props.date_time.split("-")[1];
    let date = props.date_time.split("-")[2];

    let d = new Date(year, month - 1, date);
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    let monthName = monthNames[d.getMonth()];

    let monthAndDate = monthName + ` ${date}`;
    return monthAndDate;
  }
  return (
    <div
      className="day"
      onClick={() => {
        props.changeView(props.date_time);
        logValue();
      }}
      style={{
        backgroundColor: color,
        borderRadius: "12px",
        padding: "16px 12px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        cursor: "pointer",
        minHeight: "100px",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = "0 8px 16px rgba(0,0,0,0.12)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.06)";
      }}
    >
      <div
        className="date"
        style={{
          color: textColor ? textColor : "default",
          fontFamily: "Open Sans, sans-serif",
          fontSize: "12px",
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: "0.5px",
          opacity: 0.9,
          marginBottom: "8px",
        }}
        id="date_id_point"
      >
        {getMonthDateFormat()}
      </div>

      <div
        className="metric"
        style={{
          color: textColor ? textColor : "default",
          fontFamily: "Open Sans, sans-serif",
          fontSize: "28px",
          fontWeight: 700,
          lineHeight: 1.1,
        }}
      >
        {props.pm25}
      </div>
    </div>
  );
}
