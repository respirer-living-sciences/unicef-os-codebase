export default function getMonitorPoints(res) {
  let monitorpoints = res.imei_details.map((elem) => {
    let imeiDetailsObject = {
      imei: elem.imei,
      locality:
        elem.values[0].locality !== (null || undefined)
          ? elem.values[0].locality
          : elem.values[0].imei,
      city: elem.values[0].city,
    };
    return imeiDetailsObject;
  });
  return monitorpoints;
}
