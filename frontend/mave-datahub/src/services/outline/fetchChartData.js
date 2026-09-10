import getApexPlottableData from "../../utils/getApexPlottableData";
import getDurationForChart from "../../utils/getDurationForChart";
const csv = require("csvtojson");

export default async function fetchChartData(
  api_key,
  duration,
  finalCustomStartDate,
  finalCustomEndDate,
  selectedImei,
  priorityMetrics,
  intervalUnit,
  intervalValue,
) {
  const priorityMetricsString = priorityMetrics
    .map((metricItem) => metricItem.metric)
    .join(",");

  const ts = intervalUnit || "hh";
  const avg = intervalValue || "1";

  async function fetchGraphCSVData(graphStartDate, graphEndDate, selectedImei) {
    try {
      const starttime = "T00:00";
      const endtime = "T23:59";
      const csvURLGraph = `https://api.yourdomain.com/adp/v4/getDeviceDataParamPage/imei/${selectedImei}/params/${priorityMetricsString}/startdate/${graphStartDate}${starttime}/enddate/${graphEndDate}${endtime}/ts/${ts}/avg/${avg}/api/${api_key}`;
      const res = await fetch(csvURLGraph, {
        method: "GET",
        cache: "no-store",
      });

      if (!res.ok) {
        throw new Error("Error fetching CSV data for line chart");
      }

      const contentType = res.headers.get("content-type");
      if (contentType.includes("application/json")) {
        const data = await res.json();
        throw new Error(data?.message || "Expected CSV, received JSON");
      }

      const csvString = await res.text();
      return csvString;
    } catch (error) {
      throw error;
    }
  }

  async function getProcessedData(csvString) {
    return new Promise((resolve, reject) => {
      csv()
        .fromString(csvString)
        .then((deviceData) => {
          resolve(deviceData);
        })
        .catch((err) => reject(err));
    });
  }

  async function generateChartSeries() {
    const { graphStartDate, graphEndDate } = getDurationForChart(
      duration,
      finalCustomStartDate,
      finalCustomEndDate,
    );

    const csvData = await fetchGraphCSVData(
      graphStartDate,
      graphEndDate,
      selectedImei,
    );
    const jsonData = await getProcessedData(csvData);

    const chartSeriesArray = await Promise.all(
      priorityMetrics.map(async (metricObj) => {
        const plottableData = await getApexPlottableData(
          jsonData,
          metricObj.metric,
          ts,
        );
        return {
          data: plottableData,
          name: `${metricObj.label} (${metricObj.unit})`,
        };
      }),
    );

    return chartSeriesArray;
  }

  // --- 🔁 Retry logic wrapper ---
  async function fetchWithRetry(retries = 2, delay = 1500) {
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const chartSeriesArray = await generateChartSeries();

        if (chartSeriesArray && chartSeriesArray.length > 0) {
          return chartSeriesArray;
        }
      } catch (error) {}

      if (attempt < retries) {
        await new Promise((res) => setTimeout(res, delay));
      }
    }

    throw new Error("Failed to fetch valid chart data after retries");
  }

  // --- Run with retries ---
  return await fetchWithRetry(2, 1500); // 2 retries, 1.5s delay
}
