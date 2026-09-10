import getDurationForTable from "../../utils/getDurationForTable";
const csv = require("csvtojson");

const imeiCache = {};
let numberofImeis = 0;

export default async function fetchTableData(
  imeiURL,
  duration,
  finalCustomStartDate,
  finalCustomEndDate,
  api_key,
  priorityMetrics,
  output_timezone = "Asia/Kolkata", // default to Asia/Kolkata if not provided
  tablePage = 1, // default to 1 if not provided
) {
  let selectedImei;
  let selectedLocality;
  // let mainData;
  let priorityMetricsString = priorityMetrics
    .map((metricItem) => metricItem.metric)
    .join(",");

  async function fetchIMEIData(imeiURL) {
    try {
      // Return from cache if available
      if (imeiCache[imeiURL]) {
        return imeiCache[imeiURL];
      }

      const res = await fetch(imeiURL, { cache: "default" });

      if (!res.ok) {
        throw new Error("Error occurred while fetching IMEI data!");
      }

      const jsonRes = await res.json();

      const imeiListObject = jsonRes.imei_details.map((elem) => {
        const d = elem["values"][0].last_updated;
        const date = new Date(+d);
        const last_updated = date.toDateString();

        return {
          imei: elem["imei"],
          state: elem["values"][0].state,
          city: elem["values"][0].city,
          locality: elem["values"][0].locality,
          last_updated,
        };
      });

      if (imeiListObject.length === 0) {
        throw new Error("Error occurred while fetching IMEI list");
      }

      // Save to cache before returning
      imeiCache[imeiURL] = imeiListObject;

      return imeiListObject;
    } catch (err) {
      throw err;
    }
  }

  async function fetchCSVData(
    imeisString,
    startDate,
    endDate,
    startTime,
    endTime,
    hoursOrDays,
    hoursDaysValue,
  ) {
    try {
      // const csvURL = `https://api.yourdomain.com/v4/getDeviceDataParam/imei/${imeisString}/params/${priorityMetricsString}/startdate/${startDate}${startTime}/enddate/${endDate}${endTime}/ts/${hoursOrDays}/avg/${hoursDaysValue}/api/${api_key}?gaps=1`;
      const csvURL = `https://mave.yourdomain.com/adp/v4/getDeviceDataParamPage/imei/${imeisString}/params/${priorityMetricsString}/startdate/${startDate}${startTime}/enddate/${endDate}${endTime}/ts/${hoursOrDays}/avg/${hoursDaysValue}/api/${api_key}?gaps=1&page=${tablePage}`;

      const res = await fetch(csvURL);
      if (!res.ok) {
        throw new Error("error occured at fetchingCSVData");
      }
      if (res.message) {
        throw new Error("message:IMEI does not belong to you");
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

  function getProcessedData(imeiData, csvString) {
    // convert the csvstring to jsonObj
    return new Promise((resolve, reject) => {
      csv()
        .fromString(csvString)
        .then((deviceData) => {
          const NH3_UGM3_TO_PPM = 24.45 / (17.03 * 1000);

          const transformedData = deviceData.map((deviceDataItem) => {
            const { pm2, nh3, ...rest } = deviceDataItem;

            let nh3Formatted = nh3;

            if (nh3 && !isNaN(nh3)) {
              const nh3Ugm3 = Number(nh3);
              const nh3Ppm = nh3Ugm3 * NH3_UGM3_TO_PPM;

              nh3Formatted = `${nh3Ugm3.toFixed(2)} (${nh3Ppm.toFixed(2)} ppm)`;
            }

            return {
              ...rest,
              "pm2.5cnc": pm2 ? pm2["5cnc"] : undefined,
              nh3: nh3Formatted,
            };
          });

          // merge imeiData with transformedData for devices to include locality and other props

          let mergedData = [];
          // Iterate over objects in imeiData
          imeiData.forEach((imeiObj) => {
            // Find matching object in transformedData based on device_id
            const matchingObj = transformedData.find(
              (transformedObj) => transformedObj.deviceid === imeiObj.imei,
            );

            if (matchingObj) {
              // Merge properties from both objects
              const mergedObj = { ...imeiObj, ...matchingObj };
              mergedData.push(mergedObj);
            }
          });

          resolve(mergedData);
        });
    });
  }

  async function callAsyncFunctions() {
    const res = await fetchIMEIData(imeiURL);
    const allIMEIs = res.map((item) => {
      return item.imei;
    });
    numberofImeis = allIMEIs.length;

    // setSelectedImei(allIMEIs[0]);
    selectedImei = allIMEIs[0];
    selectedLocality = res[0].locality;
    let imeisString = "";
    for (let i = 0; i < allIMEIs.length; i++) {
      if (i === 0) {
        imeisString += `${allIMEIs[i]}`;
      } else {
        imeisString += `,${allIMEIs[i]}`;
      }
    }
    // setimeis(imeisString);

    const {
      startDate,
      endDate,
      startTime,
      endTime,
      hoursOrDays,
      hoursDaysValue,
    } = getDurationForTable(
      duration,
      finalCustomStartDate,
      finalCustomEndDate,
      output_timezone,
    );

    const csvDataRes = await fetchCSVData(
      imeisString,
      startDate,
      endDate,
      startTime,
      endTime,
      hoursOrDays,
      hoursDaysValue,
    );

    const finalMainData = await getProcessedData(res, csvDataRes);
    return finalMainData;
  }
  const finalTableData = await callAsyncFunctions();
  return {
    finalTableData,
    selectedImei,
    selectedLocality,
    numberofImeis,
  };
}
