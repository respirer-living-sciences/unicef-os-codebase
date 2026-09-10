import React from "react";
import { useTheme } from "@mui/material/styles";
import "../styles/ColorLegend.css";
import { pollutantRanges } from "../utils/colorLegendRanges";
// import { useZustandStore } from "@/store/zustandStore";

const ColorLegend = ({ selectedPollutant, selectedPollutantLabel }) => {
  const theme = useTheme();
  //   let pollutant = useZustandStore((state) => state.pollutant).toUpperCase();

  // Get ranges based on the provided pollutant
  let ranges = pollutantRanges[selectedPollutant];

  if (!ranges) {
    ranges = [
      { min: 0, max: 0, color: "#1EC82F", text: "Good" }, // Green
      { min: 0, max: 0, color: "#1BF030", text: "Satisfactory" }, // Yellow
      { min: 0, max: 0, color: "#F3DC0C", text: "Moderate" }, // Orange
      { min: 0, max: 0, color: "#FFA621", text: "Poor" }, // Red
      { min: 0, max: 0, color: "#FF0F0F", text: "Very Poor" }, // Purple
      { min: 0, max: Infinity, color: "#BA0909", text: "Severe" }, // Maroon
    ];
  }

  // Function to format labels, showing infinity symbol if the value is Infinity or not a number
  const formatLabel = (value) => {
    if (value === Infinity) {
      return "";
    } else {
      return parseInt(value);
    }
  };

  return (
    <div
      className="legend-container"
      style={{
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary,
        border: `1px solid ${theme.palette.divider}`,
        boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.15)",
      }}
    >
      <div className="pollutant">
        <p>{selectedPollutantLabel}</p>
      </div>
      <div className="color-legend">
        <div className="desc-labels">
          {ranges.map((range, index) => (
            <span key={index} className="text-sm" style={{ color: theme.palette.text.secondary }}>
              {range.text}
            </span>
          ))}
        </div>
        <div className="color-bar">
          {ranges.map((range, index) => (
            <div
              key={index}
              className="color-range"
              style={{ backgroundColor: range.color }}
            ></div>
          ))}
        </div>
        <div className="labels">
          {ranges.map((range, index) => (
            <span key={index} className="text-sm" style={{ color: theme.palette.text.secondary }}>
              {parseInt(range.min)}
            </span>
          ))}
          {/* <span>{parseInt(ranges[ranges.length - 1].max)}</span> */}
          <span className="text-sm" style={{ color: theme.palette.text.secondary }}>
            {formatLabel(ranges[ranges.length - 1].max)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ColorLegend;
