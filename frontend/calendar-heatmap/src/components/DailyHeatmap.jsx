import React from "react";
import "../daily_heatmap.css";
import { DailyComponent } from "./DailyComponent";

export const DailyHeatmap = (props) => {
  // Callback to notify parent when a date tile is clicked
  const executeDateTileOnClick = (date_time) => {
    props.dateTileOnClick(date_time);
  };

  /**
   * DAILY data from backend
   * One entry per date
   * Example:
   * {
   *   timestamp: "2025-01-03 00:00:00",
   *   pm2_5: 42 | "NULL"
   * }
   */
  const dailyData = props.daily_hourly;

  // Selected pollutant / metric
  const selected_metric = props.selected_metric;

  /* ----------------------------
     Calendar header (Sun–Sat)
  ----------------------------- */
  const days = ["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat"];
  const grid = days.map((day) => (
    <div
      key={day}
      style={{
        fontFamily: "Open Sans, sans-serif",
        fontSize: "12px",
        fontWeight: 600,
        textTransform: "uppercase",
        color: "#8b95a5",
        letterSpacing: "1px",
        textAlign: "center",
        paddingBottom: "8px",
        borderBottom: "2px solid #f0f2f5",
        marginBottom: "8px"
      }}
    >
      {day}
    </div>
  ));

  /* -------------------------------------------------------
     Convert backend DAILY data → lookup object
     - Backend already sends daily averages
     - Preserve NULL values for missing data
  -------------------------------------------------------- */
  const dailyAvgData = {};

  dailyData.forEach((item) => {
    const date = item.timestamp.split(" ")[0];

    const value = item[selected_metric];

    // Preserve NULL if backend sends it
    dailyAvgData[date] =
      value === null || value === "NULL" || value === ""
        ? "NA"
        : Math.round(value);
  });

  /* -------------------------------------------------------
     Grid positioning
     - Uses the first available date to align calendar
  -------------------------------------------------------- */
  const grid_value = getPosition(dailyAvgData);

  function getPosition(data) {
    // Safety fallback
    if (!Object.keys(data).length) return 1;

    const firstDate = new Date(Object.keys(data)[0]);

    // JS getDay(): 0 = Sun, 6 = Sat
    const dayOfWeek = firstDate.getDay();

    // CSS grid columns: 1–7
    return dayOfWeek === 0 ? 1 : dayOfWeek + 1;
  }

  /* ----------------------------
     Render
  ----------------------------- */
  return (
    <div style={{ marginRight: "4%" }}>
      <div
        id="calendar-container"
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "16px",
          boxShadow: "0 8px 30px rgba(0, 0, 0, 0.04)",
          border: "1px solid rgba(0, 0, 0, 0.03)",
          padding: "24px 30px",
          marginTop: "16px",
          transition: "all 0.3s ease"
        }}
      >
        <div
          id="app-calendar"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(7, 1fr)",
            gap: "14px",
          }}
        >
          {/* Days of week header */}
          {grid}

          {/* One tile per date */}
          {Object.keys(dailyAvgData).map((date) => (
            <DailyComponent
              key={date}
              date_time={date}
              selected_metric={selected_metric}
              pm25={dailyAvgData[date]}
              changeView={executeDateTileOnClick}
              gridColumnValue={grid_value}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
