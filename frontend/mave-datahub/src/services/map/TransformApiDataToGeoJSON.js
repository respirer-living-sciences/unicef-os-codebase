const normalizeKeys = (item) => {
  const keyMap = {
    pm25: "pm2.5cnc",
    pm10: "pm10cnc",
  };

  return Object.entries(item).reduce((acc, [key, value]) => {
    acc[keyMap[key] || key] = value;
    return acc;
  }, {});
};

export const transformApiDataToGeoJSON = (apiData = []) => {
  return {
    type: "FeatureCollection",
    features: apiData.map((rawItem) => {
      const item = normalizeKeys(rawItem);

      // Default coordinates
      let lat = 0;
      let lon = 0;

      if (typeof item.latLong === "string") {
        const parts = item.latLong.split(",").map((v) => Number(v.trim()));
        if (parts.length === 2 && !parts.some(Number.isNaN)) {
          lat = parts[0];
          lon = parts[1];
        }
      }

      const excludedKeys = new Set([
        "imei",
        "locality",
        "city",
        "state",
        "latLong",
        "last_updated",
        "status",
      ]);

      // Auto-include present & future pollutants
      const dynamicMetrics = Object.entries(item).reduce(
        (acc, [key, value]) => {
          if (excludedKeys.has(key)) return acc;

          if (typeof value === "number") {
            acc[key] = Number.isFinite(value) ? value : 0;
          }

          return acc;
        },
        {}
      );

      return {
        type: "Feature",
        id: item.imei ?? crypto.randomUUID(),
        properties: {
          imei: item.imei ?? "UNKNOWN",
          city: item.city ?? "",
          state: item.state ?? "",
          location: item.locality ?? "",
          last_updated: item.last_updated ?? null,
          status: item.status ?? "UNKNOWN",
          ...dynamicMetrics,
        },
        geometry: {
          type: "Point",
          coordinates: [lon, lat], // [0, 0] fallback
        },
      };
    }),
  };
};
