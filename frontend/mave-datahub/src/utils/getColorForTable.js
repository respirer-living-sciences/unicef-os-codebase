const getColor = (value, paramName) => {
  const colorRanges = {
    "pm2.5cnc": [
      { range: [0, 30], color: "#1EC82F" },
      { range: [30.01, 60], color: "#1BF030" },
      { range: [60.01, 90], color: "#F3DC0C" },
      { range: [90.01, 120], color: "#FFA621" },
      { range: [120.01, 250], color: "#FF0F0F" },
      { range: [250.01, Infinity], color: "#BA0909" },
    ],
    pm1cnc: [
      { range: [0, 30], color: "#1EC82F" },
      { range: [30.01, 60], color: "#1BF030" },
      { range: [60.01, 90], color: "#F3DC0C" },
      { range: [90.01, 120], color: "#FFA621" },
      { range: [120.01, 250], color: "#FF0F0F" },
      { range: [250.01, Infinity], color: "#BA0909" },
    ],
    pm10cnc: [
      { range: [0, 50], color: "#1EC82F" },
      { range: [50.01, 100], color: "#1BF030" },
      { range: [100.01, 250], color: "#F3DC0C" },
      { range: [250.01, 350], color: "#FFA621" },
      { range: [350.01, 430], color: "#FF0F0F" },
      { range: [430.01, Infinity], color: "#BA0909" },
    ],
    temp: [
      { range: [0, 35], color: "#1EC82F" },
      { range: [35.01, 40], color: "#1BF030" },
      { range: [40.01, 43], color: "#F3DC0C" },
      { range: [45.01, 50], color: "#FFA621" },
      { range: [50.01, 70], color: "#FF0F0F" },
      { range: [70.01, Infinity], color: "#BA0909" },
    ],
    humidity: [
      { range: [0, 15], color: "#BA0909" },
      { range: [1.01, 30], color: "#C18441" },
      { range: [30.01, 60], color: "#37A13C" },
      { range: [60.01, 80], color: "#3A9EAE" },
      { range: [80.01, Infinity], color: "#3A4773" },
    ],
    sound_db: [
      { range: [0, 60], color: "#1EC82F" },
      { range: [60.01, 80], color: "#1BF030" },
      { range: [80.01, 90], color: "#F3DC0C" },
      { range: [90.01, 110], color: "#FFA621" },
      { range: [110.01, 130], color: "#FF0F0F" },
      { range: [130.01, Infinity], color: "#BA0909" },
    ],
  };

  if (value === null) {
    return "black";
  }

  const ranges = colorRanges[paramName];
  if (!ranges) {
    return "black";
  }

  for (const range of ranges) {
    const [min, max] = range.range;
    if (value >= min && value <= max) {
      return range.color;
    }
  }

  return "black"; // Default color
};

export default getColor;

// const getColor = (value, paramName) => {
//   // let color = "black";
//   let color;
//   // pm25
//   if (paramName === "pm2.5cnc" || paramName === "pm1cnc") {
//     if (value === null) {
//       color = "black";
//     } else if (value >= 0 && value <= 30) {
//       color = "#1EC82F";
//     } else if (value > 30 && value <= 60) {
//       color = "#1BF030";
//     } else if (value > 60 && value <= 90) {
//       color = "#F3DC0C";
//     } else if (value > 90 && value <= 120) {
//       color = "#FFA621";
//     } else if (value > 120 && value <= 250) {
//       color = "#FF0F0F";
//     } else if (value > 250) {
//       color = "#BA0909";
//     }
//   }

//   // pm10
//   else if (paramName === "pm10cnc") {
//     if (value === null) {
//       color = "black";
//     } else if (value >= 0 && value <= 50) {
//       color = "#1EC82F";
//     } else if (value > 50 && value <= 100) {
//       color = "#1BF030";
//     } else if (value > 100 && value <= 250) {
//       color = "#F3DC0C";
//     } else if (value > 250 && value <= 350) {
//       color = "#FFA621";
//     } else if (value > 350 && value <= 430) {
//       color = "#FF0F0F";
//     } else if (value > 430) {
//       color = "#BA0909";
//     }
//   }

//   // temp
//   else if (paramName === "temp") {
//     if (value === null) {
//       color = "black";
//     } else if (value >= 0 && value <= 35) {
//       color = "#1EC82F";
//     } else if (value > 35 && value <= 40) {
//       color = "#1BF030";
//     } else if (value > 40 && value <= 43) {
//       color = "#F3DC0C";
//     } else if (value > 43 && value <= 50) {
//       color = "#FFA621";
//     } else if (value > 50 && value <= 70) {
//       color = "#FF0F0F";
//     } else if (value > 70) {
//       color = "#BA0909";
//     }
//   }

//   // humidity
//   else if (paramName === "humidity") {
//     if (value === null) {
//       color = "black";
//     } else if (value >= 0 && value < 40) {
//       color = "#F3DC0C";
//     } else if (value >= 40 && value <= 60) {
//       color = "#1BF030";
//     } else if (value > 60) {
//       color = "#FF0F0F";
//     }
//   }

//   return color;
// };

// export default getColor;
