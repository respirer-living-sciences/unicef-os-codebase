const getRegressionMetrics = (regression) => {
  return [
    {
      regressionMetric: "Coefficient",
      value: regression.Coefficient,
    },
    {
      regressionMetric: "Intercept",
      value: regression.Intercept,
    },
    {
      regressionMetric: "MAE",
      value: regression.MAE,
    },
    {
      regressionMetric: "MAPE",
      value: regression.MAPE,
    },
    {
      regressionMetric: "Mean",
      value: regression.Mean,
    },
    {
      regressionMetric: "RMSE",
      value: regression.RMSE,
    },
    {
      regressionMetric: "Rsq",
      value: regression.Rsq,
    },
    {
      regressionMetric: "SD",
      value: regression.SD,
    },
    {
      regressionMetric: "Variation",
      value: regression.Variation,
    },
  ];
};

export default getRegressionMetrics;
