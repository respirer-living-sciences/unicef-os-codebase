const csv = require("csvtojson");

async function fetchMonitorsMapData(
  geoJsonURL,
  durationStartDate,
  durationEndDate,
  mapStartTime,
  mapEndTime,
  hoursOrDays,
  hoursDaysValue,
  api_key,
  allMetrics,
) {
  let monitorPoints;
  let csvString;
  let allMetricsString = allMetrics
    .map((metricItem) => metricItem.metric)
    .join(",");

  async function fetchGeoJsonData() {
    try {
      const res = await fetch(geoJsonURL);
      if (!res.ok) {
        throw new Error("error occured at fetchingIMEIData");
      } else {
        const response = res.json();
        return response;
      }
    } catch (err) {
      throw err;
    }
  }

  async function fetchCSVData(imeisString) {
    try {
      const csvURLMarker = `https://api.yourdomain.com/adp/v4/getDeviceDataParam/imei/${imeisString}/params/${allMetricsString}/startdate/${durationStartDate}${mapStartTime}/enddate/${durationEndDate}${mapEndTime}/ts/${hoursOrDays}/avg/${hoursDaysValue}/api/${api_key}?gaps=1`;

      const res = await fetch(csvURLMarker, {
        method: "get",
        headers: {
          "content-type": "text/csv;charset=UTF-8",
        },
      });
      if (!res.ok) {
        throw new Error("error occured at fetchingCSVData");
      }
      return new Promise((resolve, reject) => {
        if (res.status === 200) {
          res.text().then((data) => {
            csvString = data;
            resolve(csvString);
          });
        } else {
          reject("error occured while fetching CSV data");
        }
      });
    } catch (err) {
      throw err;
    }
  }

  function getProcessedData(csvString, monitorPoints) {
    let transformedData;
    // convert the csvstring to jsonObj
    return new Promise((resolve, reject) => {
      csv()
        .fromString(csvString)
        .then((deviceData) => {
          const foundParam = allMetrics.find(
            (item) => item.metric === "pm2.5cnc",
          );
          // fix the csv to json converted data where there is an array of objects where each object has the 5cnc property nested within the pm2 property.
          if (foundParam) {
            transformedData = deviceData.map((deviceDataItem) => {
              const { pm2, ...rest } = deviceDataItem; //exclude pm2 from each item
              return {
                ...rest,
                "pm2.5cnc": deviceDataItem.pm2["5cnc"],
              };
            });

            // add important properties to include in the monitorPoints from deviceData (such as pm10, pm1 etc pollutants)
            const mergedArray = monitorPoints.map((item) => {
              const matchedItem = transformedData.find(
                (obj) => obj.deviceid === item.properties.imei,
              );
              if (matchedItem) {
                const newProperties = {
                  ...item.properties,
                  dt_time: matchedItem.dt_time,
                };

                allMetrics.forEach(({ metric }) => {
                  if (matchedItem[metric] !== undefined) {
                    if (metric === "comodel") {
                      newProperties[metric] = Number(
                        parseFloat(matchedItem[metric]).toFixed(1),
                      );
                    } else {
                      newProperties[metric] = parseInt(matchedItem[metric]);
                    }
                  }
                });

                return { ...item, properties: newProperties };
              } else {
                return {
                  ...item,
                  properties: {
                    ...item.properties,
                    dt_time: null,
                    "pm2.5cnc": null,
                    pm10cnc: null,
                    temp: null,
                    humidity: null,
                    battery: null,
                    power_avl: null,
                  },
                };
              }
            });

            resolve(mergedArray);
          } else {
            transformedData = deviceData.map((deviceDataItem) => {
              const { pm2, ...rest } = deviceDataItem; //exclude pm2 from each item
              return {
                ...rest,
                "pm2.5cnc": null,
              };
            });
            const mergedArray = monitorPoints.map((item) => {
              return {
                ...item,
                properties: {
                  ...item.properties,
                  dt_time: null,
                  "pm2.5cnc": null,
                  pm10cnc: null,
                  temp: null,
                  humidity: null,
                  battery: null,
                  power_avl: null,
                },
              };
            });
            resolve(mergedArray);
          }
        });
    });
  }

  async function callAsyncFunctionsForMap() {
    // const IMEIRes = await fetchIMEIDataForCSV();
    // const allIMEIs = IMEIRes.map((item) => {
    //   return item.imei;
    // });

    const geoJsonRes = await fetchGeoJsonData();
    const features = geoJsonRes.features;
    const allGeoIMEIs = features.map((item) => {
      return item.properties.imei;
    });
    const sampleGeometry = features[0].geometry.coordinates;
    let imeisString = "";

    imeisString = allGeoIMEIs.join();

    const csvDataRes = await fetchCSVData(imeisString);

    monitorPoints = features.map((elem) => {
      let d = elem.properties.last_updated.split("T")[0];
      let t = elem.properties.last_updated.split("T")[1];
      t = t.split("Z")[0];
      let date = new Date(d);
      date = date.toDateString();
      let last_updated = date + " " + t;
      let newImeiDetailsObject = {
        type: "Feature",
        id: elem.properties.imei,
        properties: {
          imei: elem.properties.imei,
          city: elem.properties.city,
          location: elem.properties.locality,
          last_updated: last_updated,
        },
        geometry: {
          type: "Point",
          coordinates: [
            parseFloat(elem.geometry.coordinates[0]),
            parseFloat(elem.geometry.coordinates[1]),
          ],
        },
      };
      return newImeiDetailsObject;
    });

    const mergedData = await getProcessedData(csvDataRes, monitorPoints);

    const IMEIGeoJSON = {
      type: "FeatureCollection",
      features: mergedData,
    };

    return IMEIGeoJSON;
  }

  const geoJsonFinalRes = await callAsyncFunctionsForMap();
  return geoJsonFinalRes;
}

export default fetchMonitorsMapData;
