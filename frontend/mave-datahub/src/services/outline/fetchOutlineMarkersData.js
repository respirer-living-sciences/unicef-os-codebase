async function fetchOutlineMarkersData(geoJsonURL, deviceData) {
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

  function getProcessedData(monitorPoints) {
    // add important properties to include in the monitorPoints from deviceData (such as pm10, pm1 etc pollutants)
    const mergedArray = monitorPoints.map((item) => {
      const matchedItem = deviceData.find(
        (obj) => obj.deviceid === item.properties.imei
      );
      if (matchedItem) {
        return {
          ...item,
          properties: {
            ...item.properties,
            dt_time: matchedItem.dt_time,
            "pm2.5cnc": parseInt(matchedItem["pm2.5cnc"]),
            pm10cnc: parseInt(matchedItem.pm10cnc),
            temp: parseInt(matchedItem.temp),
            humidity: parseInt(matchedItem.humidity),
          },
        };
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
          },
        };
      }
    });
    return mergedArray;
  }

  async function callAsyncFunctionsForMarkersData() {
    const geoJsonRes = await fetchGeoJsonData();
    const features = geoJsonRes.features;

    const monitorPoints = features.map((elem) => {
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

    const mergedData = getProcessedData(monitorPoints);

    const IMEIGeoJSON = {
      type: "FeatureCollection",
      features: mergedData,
    };

    return IMEIGeoJSON;
  }

  const geoJsonFinalRes = await callAsyncFunctionsForMarkersData();
  return geoJsonFinalRes;
}

export default fetchOutlineMarkersData;
