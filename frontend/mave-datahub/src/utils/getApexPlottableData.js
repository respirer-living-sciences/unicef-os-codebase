export default async function getApexPlottableData(JsonData, param, ts) {
  if (!Array.isArray(JsonData) || JsonData.length === 0) {
    return [];
  }

  // Static options — hoisted outside the loop since they don't change per item
  const dateFormatOptions = {
    month: "short",
    day: "2-digit",
    year: "2-digit",
    hour: "numeric",
    hour12: true,
    minute: "2-digit",
  };

  const isPm25 = param === "pm2.5cnc";

  const plottableData = JsonData.reduce((acc, n) => {
    // Skip items missing a timestamp
    if (!n?.dt_time) return acc;

    const formattedDate = new Date(n.dt_time).toLocaleDateString(
      "en-US",
      dateFormatOptions
    );

    // Safely extract the raw value depending on the param
    // pm2.5cnc is nested as n["pm2"]["5cnc"] due to CSV dot-splitting
    let rawValue;
    if (isPm25) {
      rawValue = n?.pm2?.["5cnc"] ?? n?.["pm2.5cnc"];
    } else {
      rawValue = n?.[param];
    }

    const parsed = parseFloat(rawValue);

    // Skip data points with missing or non-numeric values
    if (isNaN(parsed)) return acc;

    acc.push({ x: formattedDate, y: parsed.toFixed(2) });
    return acc;
  }, []);

  return plottableData;
}

