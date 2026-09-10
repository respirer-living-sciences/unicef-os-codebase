export default async function getApexPlottableData(JsonData, param) {
  const plottableData = JsonData.map((n) => {
    const dateStr = n["dt_time"];
    const date = new Date(dateStr);

    const options = {
      month: "short",
      day: "2-digit",
      year: "2-digit",
      hour: "numeric",
      hour12: true,
    };
    const formattedDate = date.toLocaleDateString("en-US", options);

    // I had to add condition here for pm2.5 because the JSON data translated from CSV format was not able to translate the dot in pm2.5cnc properly.
    if (param === "pm2.5cnc") {
      var properties = {
        x: formattedDate,
        y: parseFloat(n["pm2"]["5cnc"]).toFixed(2),
      };
      return properties;
    } else {
      var properties = {
        x: formattedDate,
        y: parseFloat(n[param]).toFixed(2),
      };
      return properties;
    }
  });
  return plottableData;
}
