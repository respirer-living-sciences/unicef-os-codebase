// Simple in-memory cache
const geoJsonCache = {};

const getMapIMEIData = async (geoJsonUrl) => {
  try {
    // If we already have cached data, return it immediately
    if (geoJsonCache[geoJsonUrl]) {
      return geoJsonCache[geoJsonUrl];
    }

    const response = await fetch(geoJsonUrl);
    if (!response.ok) {
      throw new Error(
        "Error occurred while fetching getMapIMEIData with status " +
          response.status +
          " " +
          response.statusText
      );
    }

    const finalResponse = await response.json();

    // Save to cache before returning
    geoJsonCache[geoJsonUrl] = finalResponse;

    return finalResponse;
  } catch (err) {
    throw err;
  }
};

export default getMapIMEIData;
