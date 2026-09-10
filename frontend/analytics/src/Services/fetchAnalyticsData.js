export default async function fetchAnalyticsData(
  maveMonitorValue,
  ncapMonitorValue,
  durationStartDate,
  durationEndDate,
  timeStep,
  average,
  selectedParameter,
) {
  let loading;
  let error;
  let fetchErrorStatus;

  const getData = async () => {
    const regressionURL = `https://api.yourdomain.com/adp/v4/regression?device_imei=${maveMonitorValue}&ref_imei=${ncapMonitorValue}&from_date=${durationStartDate}&to_date=${durationEndDate}&ts=${timeStep}&avg=${average}&device_param=${selectedParameter}&ref_param=${selectedParameter}`;
    try {
      const regressionRes = await fetch(regressionURL);
      if (!regressionRes.ok) {
        error = true;
        loading = false;
        fetchErrorStatus = res.status + " " + res.statusText + "!";
      } else {
        const response = regressionRes.json();
        loading = false;
        return response;
      }
    } catch (err) {
      error = true;
      loading = false;
    }
  };
  const callAsyncFunction = async () => {
    const res = await getData();
    return res;
  };
  const res = await callAsyncFunction();
  return { res, error, loading, fetchErrorStatus };
}
