const csv = require("csvtojson");

export default async function fetchLastMinuteData(
  api_key,
  StartDateTime,
  EndDateTime,
  selectedImei,
  priorityMetrics,
) {
  let priorityMetricsString = priorityMetrics
    .map((metricItem) => metricItem.metric)
    .join(",");

  async function fetchGraphCSVData(StartDateTime, EndDateTime, selectedImei) {
    try {
      const csvURLGraph = `https://api.yourdomain.com/adp/v4/getDeviceDataParam/imei/${selectedImei}/params/${priorityMetricsString}/startdate/${StartDateTime}/enddate/${EndDateTime}/ts/mm/avg/1/api/${api_key}`;

      const res = await fetch(csvURLGraph, {
        method: "get",
        cache: "no-store", // Disable caching

        headers: {
          "content-type": "text/csv;charset=UTF-8",
        },
      });
      if (!res.ok) {
        throw new Error("error occured at fetchingCSVData for line chart");
      }

      const contentType = res.headers.get("content-type");

      if (contentType.includes("application/json")) {
        const data = await res.json();

        if (data.message === "unsuccessful") {
          throw new Error("Request responded with unsuccessful message");
        } else {
          throw new Error("Request was successful but not in CSV format");
        }
      } else {
        // Handle successful response (CSV)
        const data = await res.text();
        let csvString = data;
        return csvString;
      }
    } catch (error) {
      throw error;
    }
  }

  function getProcessedData(csvString) {
    // convert the csvstring to jsonObj
    return new Promise((resolve, reject) => {
      csv()
        .fromString(csvString)
        .then((deviceData) => {
          // fix the csv to json converted data where there is an array of objects where each object has the 5cnc property nested within the pm2 property.
          const transformedData = deviceData.map((deviceDataItem) => {
            const { pm2, ...rest } = deviceDataItem; //exclude pm2 from each item
            if (deviceDataItem["pm2"]) {
              return {
                ...rest,
                "pm2.5cnc": deviceDataItem.pm2["5cnc"],
              };
            } else {
              return {
                ...rest,
              };
            }
          });

          resolve(transformedData);
        });
    });
  }

  async function executeAsyncFunctions() {
    const response = await fetchGraphCSVData(
      StartDateTime,
      EndDateTime,
      selectedImei,
    );
    const jsonData = await getProcessedData(response);

    return jsonData;
  }

  const lastMinuteData = await executeAsyncFunctions();

  return lastMinuteData;
}
