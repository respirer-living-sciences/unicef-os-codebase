const getMapIMEIDataNoCache = async (geoJsonUrl) => {
  try {
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

    return finalResponse;
  } catch (err) {
    throw err;
  }
};

export default getMapIMEIDataNoCache;
