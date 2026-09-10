// export const GetSafeLimit = (pollutantParam) => {
//   let pollutantLimit;

//   if (pollutantParam === "PM₂.₅ (µg/m³)") {
//     pollutantLimit = 60;
//   } else if (pollutantParam === "PM₁₀ (µg/m³)") {
//     pollutantLimit = 100;
//   } else if (
//     pollutantParam === "NO₂ (µg/m³)" ||
//     pollutantParam === "SO₂ (µg/m³)"
//   ) {
//     pollutantLimit = 80;
//   } else if (pollutantParam === "O₃ (µg/m³)") {
//     pollutantLimit = 100;
//   } else if (pollutantParam === "CO (mg/m³)") {
//     pollutantLimit = 2.0;
//   }
//   return pollutantLimit;
// };

export const GetSafeLimit = (pollutantParam) => {
  switch (pollutantParam) {
    case "PM₂.₅ (µg/m³)":
      return 60;
    case "PM2.5 (µg/m³)":
      return 60;
    case "PM₁₀ (µg/m³)":
      return 100;
    case "PM10 (µg/m³)":
      return 100;
    case "Temperature (°C)":
      return null;
    case "Humidity (%)":
      return null;
    case "NO2 (µg/m³)":
      return 80;
    case "NO₂ (µg/m³)":
      return 80;
    case "SO2 (µg/m³)":
      return 80;
    case "SO₂ (µg/m³)":
      return 80;
    case "O3 (µg/m³)":
      return 100;
    case "O₃ (µg/m³)":
      return 100;
    case "CO₂ (ppm)":
      return null; // CO2 does not have a safe limit in this context
    case "CO2 (µg/m³)":
      return null; // CO2 does not have a safe limit in this context
    case "Noise (db)":
      return null;
    case "TVOC (ppb)":
      return null;
    case "CO (mg/m³)":
      return 2.0;

    case "PM₂.₅(OPC) (µg/m³)":
      return 60;
    case "COOP1 (mV)":
      return null;
    case "O3OP1 (mV)":
      return null;
    case "SO₂OP₁ (mV)":
      return null;
    case "SO2OP1 (mV)":
      return null;
    case "NO2OP1 (mV)":
      return null;
    case "NO₂OP₁ (mV)":
      return null;

    case "PM₁ (µg/m³)":
      return null;
    case "PM1 (µg/m³)":
      return null;
    case "WS (m/s)":
      return null;
    case "WD (degree)":
      return null;
    case "PRESSURE (hPa)":
      return null;
    case "Pressure (hPa)":
      return null;

    case "Globe Temperature (°C)":
      return null;
    case "Wet Bulb Globe Temperature (°C)":
      return null;
    case "Ambient Temperature (°C)":
      return null;
    case "Waterless Wet Bulb Temperature (°C)":
      return null;
    case "Waterless Wet Bulb Humidity (%)":
      return null;
    case "AQI ()":
      return 100;
    case "aqi ()":
      return 100;
    case "aqi":
      return 100;
    case "NH₃ (µg/m³)":
      return 400;
    default:
      return null; // or some default value
  }
};
