const csv = require("csvtojson");

async function fetchMarkerDetailsChartData(
  imei,
  param,
  avgTime,
  split,
  durationStartDate,
  durationEndDate,
  api_key,
) {
  async function fetchCSVData() {
    let csvURL = `https://api.yourdomain.com/adp/v4/getDeviceDataParam/imei/${imei}/params/${param}/startdate/${durationStartDate}T00:00/enddate/${durationEndDate}T23:59/ts/${avgTime}/avg/${split}/api/${api_key}`;

    const res = await fetch(csvURL, {
      method: "get",
      headers: {
        "content-type": "text/csv;charset=UTF-8",
      },
    });
    if (!res.ok) {
    }
    return new Promise((resolve, reject) => {
      if (res.status === 200) {
        res.text().then((data) => {
          let csvString = data;
          resolve(csvString);
        });
      } else {
        reject("error occured while fetching CSV data");
      }
    });
  }

  function getProcessedData(csvString) {
    // convert the csvstring to jsonObj
    return new Promise((resolve, reject) => {
      csv()
        .fromString(csvString)
        .then((deviceData) => {
          const transformedData = deviceData.map((deviceDataItem) => {
            const { pm2, ...rest } = deviceDataItem; //exclude pm2 from each item
            if (param === "pm2.5cnc") {
              return {
                ...rest,
                "pm2.5cnc": deviceDataItem.pm2["5cnc"],
              };
            } else {
              return { ...rest };
            }
          });
          resolve(transformedData);
        });
    });
  }

  async function plotXYData(JsonData, param) {
    const pm25dataArrayofObj = JsonData.map((n) => {
      var properties = {
        x: n["dt_time"],
        y: parseFloat(n[param]).toFixed(2),
      };

      return properties;
    });
    return pm25dataArrayofObj;
  }

  async function executeAsyncFunctions() {
    const response = await fetchCSVData();
    const JsonData = await getProcessedData(response);
    let finalXYData = await plotXYData(JsonData, param);
    // let chartSeriesArray = [];
    // chartSeriesArray.push({ data: finalXYData, name: pollutant });
    return finalXYData;
  }

  const finalChartData = await executeAsyncFunctions();
  return finalChartData;
}

export default fetchMarkerDetailsChartData;
