export const pollutantRanges = {
  "pm2.5cnc": [
    { min: 0, max: 30, color: "#1EC82F", text: "Good" }, // Green
    { min: 30.01, max: 60, color: "#1BF030", text: "Satisfactory" }, // Yellow
    { min: 60.01, max: 90, color: "#F3DC0C", text: "Moderate" }, // Orange
    { min: 90.01, max: 120, color: "#FFA621", text: "Poor" }, // Red
    { min: 120.01, max: 250, color: "#FF0F0F", text: "Very Poor" }, // Purple
    { min: 250.01, max: Infinity, color: "#BA0909", text: "Severe" }, // Maroon
  ],
  pm10cnc: [
    { min: 0, max: 50, color: "#1EC82F", text: "Good" }, // Green
    { min: 50.01, max: 100, color: "#1BF030", text: "Satisfactory" }, // Yellow
    { min: 100.01, max: 250, color: "#F3DC0C", text: "Moderate" }, // Orange
    { min: 250.01, max: 350, color: "#FFA621", text: "Poor" }, // Red
    { min: 350.01, max: 430, color: "#FF0F0F", text: "Very Poor" }, // Purple
    { min: 430.01, max: Infinity, color: "#BA0909", text: "Severe" }, // Maroon
  ],
  // pm10cnc: [
  //   { min: 0, max: 50, color: "#9cd036", text: "Good" }, // Green
  //   { min: 50.01, max: 100, color: "#ded934", text: "Satisfactory" }, // Yellow
  //   { min: 100.01, max: 250, color: "#fdb025", text: "Moderate" }, // Orange
  //   { min: 250.01, max: 350, color: "#f08c24", text: "Poor" }, // Red
  //   { min: 350.01, max: 430, color: "#df6c27", text: "Very Poor" }, // Purple
  //   { min: 430.01, max: Infinity, color: "#F55301", text: "Severe" }, // Maroon
  // ],
  pm1cnc: [
    { min: 0, max: 30, color: "#1EC82F", text: "Good" }, // Green
    { min: 30.01, max: 60, color: "#1BF030", text: "Satisfactory" }, // Yellow
    { min: 60.01, max: 90, color: "#F3DC0C", text: "Moderate" }, // Orange
    { min: 90.01, max: 120, color: "#FFA621", text: "Poor" }, // Red
    { min: 120.01, max: 250, color: "#FF0F0F", text: "Very Poor" }, // Purple
    { min: 250.01, max: Infinity, color: "#BA0909", text: "Severe" }, // Maroon
  ],
  temp: [
    { min: 0, max: 30, color: "#1EC82F", text: "Good" }, // Green
    { min: 30.01, max: 35, color: "#1BF030", text: "Satisfactory" }, // Yellow
    { min: 35.01, max: 38, color: "#F3DC0C", text: "Moderate" }, // Orange
    { min: 38.01, max: 42, color: "#FFA621", text: "Poor" }, // Red
    { min: 42.01, max: 48, color: "#FF0F0F", text: "Very Poor" }, // Purple
    { min: 48.01, max: Infinity, color: "#BA0909", text: "Severe" }, // Maroon
  ],
  humidity: [
    { min: 0, max: 20.09, color: "#1EC82F", text: "Good" }, // Green
    { min: 20.1, max: 60.09, color: "#1BF030", text: "Satisfactory" }, // Yellow
    { min: 60.1, max: 75.09, color: "#F3DC0C", text: "Moderate" }, // Orange
    { min: 75.1, max: 85.09, color: "#FFA621", text: "Poor" }, // Red
    { min: 85.1, max: 95.09, color: "#FF0F0F", text: "Very Poor" }, // Purple
    { min: 95.1, max: Infinity, color: "#BA0909", text: "Severe" }, // Maroon
  ],
  SO2: [
    { min: 0, max: 40, color: "#1EC82F", text: "Good" }, // Green
    { min: 40.01, max: 80, color: "#1BF030", text: "Satisfactory" }, // Yellow
    { min: 80.01, max: 380, color: "#F3DC0C", text: "Moderate" }, // Orange
    { min: 380.01, max: 800, color: "#FFA621", text: "Poor" }, // Red
    { min: 800.01, max: 1600, color: "#FF0F0F", text: "Very Poor" }, // Purple
    { min: 1600.01, max: Infinity, color: "#BA0909", text: "Severe" }, // Maroon
  ],
  aqi: [
    { min: 0, max: 40, color: "#1EC82F", text: "Good" }, // Green
    { min: 40.01, max: 80, color: "#1BF030", text: "Satisfactory" }, // Yellow
    { min: 80.01, max: 380, color: "#F3DC0C", text: "Moderate" }, // Orange
    { min: 380.01, max: 800, color: "#FFA621", text: "Poor" }, // Red
    { min: 800.01, max: 1600, color: "#FF0F0F", text: "Very Poor" }, // Purple
    { min: 1600.01, max: Infinity, color: "#BA0909", text: "Severe" }, // Maroon
  ],
  sound_db: [
    { min: 0, max: 40, color: "#1EC82F", text: "Good" }, // Green
    { min: 40.01, max: 60, color: "#1BF030", text: "Satisfactory" }, // Yellow
    { min: 60.01, max: 90, color: "#F3DC0C", text: "Moderate" }, // Orange
    { min: 90.01, max: 110, color: "#FFA621", text: "Poor" }, // Red
    { min: 110.01, max: 130, color: "#FF0F0F", text: "Very Poor" }, // Purple
    { min: 130.01, max: Infinity, color: "#BA0909", text: "Severe" }, // Maroon
  ],
  // ... other pollutants ...
};
