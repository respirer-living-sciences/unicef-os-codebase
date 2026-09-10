import { transformApiDataToGeoJSON } from "./TransformApiDataToGeoJSON";

export const fetchNewMapData = async (geoJsonURL) => {
  try {
    const response = await fetch(geoJsonURL);

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const rawData = await response.json();

    if (!Array.isArray(rawData)) {
      throw new Error("Invalid API response format");
    }

    const geoJson = transformApiDataToGeoJSON(rawData);
    return geoJson;
  } catch (error) {
    throw error;
  }
};
