import { limits } from "./getLimitsForColorStops";

const getColorStops = (chartData = [], pollutant) => {
  // Safety: if no data or invalid pollutant, return empty color stops
  if (!pollutant || !Array.isArray(chartData) || chartData.length === 0) {
    return [];
  }

  // Safety: get limits for this pollutant
  const pollutantLimits = limits?.[pollutant];

  // Default gradient stop if limits not found
  if (!pollutantLimits) {
    return [
      { offset: 0, color: "#9cd036", opacity: 1 },
      { offset: 25, color: "#9cd036", opacity: 1 },
      { offset: 50, color: "#9cd036", opacity: 1 },
      { offset: 75, color: "#9cd036", opacity: 1 },
      { offset: 100, color: "#9cd036", opacity: 1 },
    ];
  }

  // Helper to safely read nested limits
  const getLimit = (category, bound) =>
    parseFloat(pollutantLimits?.[category]?.[bound] ?? NaN);

  const severeLower = getLimit("severe", "lowerLimit");
  const veryPoorLower = getLimit("veryPoor", "lowerLimit");
  const veryPoorUpper = getLimit("veryPoor", "upperLimit");
  const poorLower = getLimit("poor", "lowerLimit");
  const poorUpper = getLimit("poor", "upperLimit");
  const moderateLower = getLimit("moderate", "lowerLimit");
  const moderateUpper = getLimit("moderate", "upperLimit");
  const satisfactoryLower = getLimit("satisfactory", "lowerLimit");
  const satisfactoryUpper = getLimit("satisfactory", "upperLimit");
  const goodUpper = getLimit("good", "upperLimit");

  const calcOffset = (filterFn) => {
    const count = chartData.filter(filterFn).length;
    return Math.floor((count / chartData.length) * 100);
  };

  const severeOffset = !isNaN(severeLower)
    ? calcOffset((d) => parseFloat(d.y) >= severeLower)
    : 0;

  const veryPoorOffset =
    !isNaN(veryPoorLower) && !isNaN(veryPoorUpper)
      ? calcOffset(
          (d) =>
            parseFloat(d.y) >= veryPoorLower && parseFloat(d.y) < veryPoorUpper,
        ) + severeOffset
      : severeOffset;

  const poorOffset =
    !isNaN(poorLower) && !isNaN(poorUpper)
      ? calcOffset(
          (d) => parseFloat(d.y) >= poorLower && parseFloat(d.y) < poorUpper,
        ) + veryPoorOffset
      : veryPoorOffset;

  const moderateOffset =
    !isNaN(moderateLower) && !isNaN(moderateUpper)
      ? calcOffset(
          (d) =>
            parseFloat(d.y) >= moderateLower && parseFloat(d.y) < moderateUpper,
        ) + poorOffset
      : poorOffset;

  const satisfactoryOffset =
    !isNaN(satisfactoryLower) && !isNaN(satisfactoryUpper)
      ? calcOffset(
          (d) =>
            parseFloat(d.y) >= satisfactoryLower &&
            parseFloat(d.y) < satisfactoryUpper,
        ) + moderateOffset
      : moderateOffset;

  const goodOffset = !isNaN(goodUpper)
    ? calcOffset((d) => parseFloat(d.y) < goodUpper) + satisfactoryOffset
    : satisfactoryOffset;

  const colorStops = [];

  if (
    !isNaN(severeLower) &&
    chartData.some((d) => parseFloat(d.y) >= severeLower)
  ) {
    colorStops.push({
      offset: severeOffset || 10,
      color: "#F55301",
      opacity: 1,
    });
  }

  if (
    !isNaN(veryPoorLower) &&
    !isNaN(veryPoorUpper) &&
    chartData.some(
      (d) =>
        parseFloat(d.y) >= veryPoorLower && parseFloat(d.y) < veryPoorUpper,
    )
  ) {
    colorStops.push({
      offset: veryPoorOffset || 10,
      color: "#df6c27",
      opacity: 1,
    });
  }

  if (
    !isNaN(poorLower) &&
    !isNaN(poorUpper) &&
    chartData.some(
      (d) => parseFloat(d.y) >= poorLower && parseFloat(d.y) < poorUpper,
    )
  ) {
    colorStops.push({ offset: poorOffset || 10, color: "#f08c24", opacity: 1 });
  }

  if (
    !isNaN(moderateLower) &&
    !isNaN(moderateUpper) &&
    chartData.some(
      (d) =>
        parseFloat(d.y) >= moderateLower && parseFloat(d.y) < moderateUpper,
    )
  ) {
    colorStops.push({
      offset: moderateOffset || 10,
      color: "#fdb025",
      opacity: 1,
    });
  }

  if (
    !isNaN(satisfactoryLower) &&
    !isNaN(satisfactoryUpper) &&
    chartData.some(
      (d) =>
        parseFloat(d.y) >= satisfactoryLower &&
        parseFloat(d.y) < satisfactoryUpper,
    )
  ) {
    colorStops.push({
      offset: satisfactoryOffset || 10,
      color: "#ded934",
      opacity: 1,
    });
  }

  if (!isNaN(goodUpper) && chartData.some((d) => parseFloat(d.y) < goodUpper)) {
    colorStops.push({ offset: goodOffset || 10, color: "#9cd036", opacity: 1 });
  }

  return colorStops;
};

export default getColorStops;
