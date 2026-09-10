export default async function FetchMaveDeviceDataService(
  imeiURL,
  devicesGroupName
) {
  let imeiLoading;
  let imeiError;
  let imeiFetchErrorStatus;
  const getData = async () => {
    try {
      const res = await fetch(imeiURL);
      if (!res.ok) {
        imeiLoading = false;
        imeiError = true;
        imeiFetchErrorStatus =
          res.status +
          " " +
          res.statusText +
          `error occured for ${devicesGroupName} ` +
          "!";
      } else {
        const response = res.json();
        return response;
      }
    } catch (err) {
      imeiLoading = false;
      imeiError = true;
      imeiFetchErrorStatus = `error CAUGHT while fetching data for ${devicesGroupName}`;
    }
  };

  const callAsyncFunction = async () => {
    const res = await getData();
    return res;
  };
  const res = await callAsyncFunction();
  return { res, imeiError, imeiLoading, imeiFetchErrorStatus };
}
