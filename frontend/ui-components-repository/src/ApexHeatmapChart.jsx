import React, { forwardRef, useImperativeHandle, useState } from "react";
import Chart from "react-apexcharts";

export const ApexHeatmapChart = forwardRef((props, ref) => {
  const [state, setState] = useState({
    legend: {
      showForSingleSeries: true,
      position: "bottom",
      itemMargin: {
        horizontal: 5,
        vertical: 15,
      },
    },
    title: {
      text: "Percentage Correlation Heatmap",
      align: "center",
      margin: 20,
      offsetY: 20,
      style: {
        fontSize: "25px",
      },
    },
    chart: {
      id: "basic-heatmap",
    },

    yaxis: {
      labels: {
        show: true,
        style: {
          colors: ["black"],
          fontSize: "15px",
        },
      },
    },
    xaxis: {
      labels: {
        show: true,
        style: {
          colors: ["black"],
          fontSize: "15px",
        },
      },
    },
    dataLabels: {
      // enabled: true,
      // textAnchor: 'start',
      // offsetX: 20,
      style: {
        //   fontSize: '12px',
        colors: ["#333"],
      },
      //   background: {
      //     enabled: true,
      //     foreColor: "#fff",
      //     padding: 4,
      //     borderRadius: 2,
      //     borderWidth: 1,
      //     borderColor: "#fff",
      //     opacity: 0.9,
      //     dropShadow: {
      //       enabled: false,
      //       top: 1,
      //       left: 1,
      //       blur: 1,
      //       color: "#000",
      //       opacity: 0.45,
      //     },
      //   },
      formatter: function (val, { ctx, seriesIndex, dataPointIndex, w }) {
        if (val === null) {
          return "";
        } else {
          return val;
        }
      },
    },
    plotOptions: {
      bar: {
        horizontal: true,
      },
      heatmap: {
        enableShades: false,
        radius: 8,
        colorScale: {
          ranges: [
            {
              from: 0,
              to: 25,
              color: "#E32227",
              name: "very low",
            },
            {
              from: 26,
              to: 50,
              color: "#ff7000",
              name: "low",
            },
            {
              from: 51,
              to: 75,
              color: "#FFFF5C",
              name: "medium",
            },
            {
              from: 76,
              to: 100,
              color: "#00D100",
              name: "high",
            },
          ],
        },
      },
    },

    series: props.correlationData,
  });

  useImperativeHandle(ref, () => ({
    updateCharts() {
      setState({
        plotOptions: {
          bar: {
            horizontal: true,
          },
          heatmap: {
            enableShades: false,
            radius: 8,
            colorScale: {
              ranges: [
                {
                  from: 1,
                  to: 25,
                  color: "#FF2400",
                  name: "very low",
                },
                {
                  from: 26,
                  to: 50,
                  color: "#ff7000",
                  name: "low",
                },
                {
                  from: 51,
                  to: 75,
                  color: "#FFFF00",
                  name: "medium",
                },
                {
                  from: 76,
                  to: 100,
                  color: "#1BF030",
                  name: "high",
                },
              ],
            },
          },
        },

        series: props.correlationData,
      });
    },
  }));

  return (
    <div className="chartContainer">
      <Chart
        options={state}
        series={state.series}
        type="heatmap"
        width="100%"
        height={props.correlationData.length > 10 ? "800" : "600"}
      />
    </div>
  );
});

export default ApexHeatmapChart;
