const getPlottableData = (data, selectedParameter) => {
  const plottableData = Object.keys(data).map((item) => {
    const firstDeviceProperites = {
      x: item,
      y: parseInt(data[item][selectedParameter]),
    };
    return firstDeviceProperites;
  });
  return plottableData;
};

export default getPlottableData;
