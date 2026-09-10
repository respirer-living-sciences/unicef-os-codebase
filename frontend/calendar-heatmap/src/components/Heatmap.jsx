import React, {
  forwardRef,
  useImperativeHandle,
  useState,
  useEffect,
} from "react";
import Chart from "react-apexcharts";

export const Heatmap = forwardRef((props, ref) => {
  const { daily_hourly, date_time, selected_metric, renderedMetric } = props;

  const getDataArray = (metric) => {
    return daily_hourly
      .filter((e) => e.timestamp.split(" ")[0] === date_time)
      .map((n) => ({
        x: n.timestamp.split(" ")[1].split(":")[0],
        y: parseInt(n[metric]) || null,
      }));
  };

  const [chartOptions, setChartOptions] = useState({
    chart: {
      id: "basic-heatmap",
    },
    title: {
      text: date_time,
      align: "center",
      margin: 20,
      offsetY: 20,
      style: {
        fontSize: "25px",
      },
    },
    legend: {
      showForSingleSeries: true,
      position: "bottom",
      itemMargin: {
        horizontal: 5,
        vertical: 15,
      },
    },
    xaxis: {
      type: "category",
      axisTicks: {
        show: true,
        borderType: "solid",
        color: "#78909C",
        height: 6,
        offsetX: -9,
      },
      labels: {
        offsetX: -9,
        trim: true,
      },
      tickAmount: 26,
      tickPlacement: "on",
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
    dataLabels: {
      style: {
        colors: ["#333"],
      },
      background: {
        enabled: true,
        foreColor: "#fff",
        padding: 4,
        borderRadius: 2,
        borderWidth: 1,
        borderColor: "#fff",
        opacity: 0.9,
        dropShadow: {
          enabled: false,
        },
      },
      formatter: function (val) {
        return val === null ? "" : val;
      },
    },
    plotOptions: {
      bar: {
        horizontal: true,
      },
      heatmap: {
        radius: 10,
        colorScale: {
          ranges: getColorRanges(selected_metric),
        },
      },
    },
  });

  const [series, setSeries] = useState([
    {
      name: renderedMetric,
      data: getDataArray(selected_metric),
    },
  ]);

  // Update chart when props change
  useEffect(() => {
    const newData = getDataArray(selected_metric);
    setSeries([{ name: renderedMetric, data: newData }]);

    setChartOptions((prev) => ({
      ...prev,
      title: { ...prev.title, text: date_time },
      plotOptions: {
        ...prev.plotOptions,
        heatmap: {
          ...prev.plotOptions.heatmap,
          colorScale: {
            ranges: getColorRanges(selected_metric),
          },
        },
      },
    }));
  }, [daily_hourly, date_time, selected_metric, renderedMetric]);

  // Expose update method to parent
  useImperativeHandle(ref, () => ({
    updateCharts() {
      const toggledMetric =
        selected_metric === "pm2.5cnc" ? "pm10cnc" : "pm2.5cnc";
      const newData = getDataArray(toggledMetric);

      setSeries([{ name: renderedMetric, data: newData }]);

      setChartOptions((prev) => ({
        ...prev,
        plotOptions: {
          ...prev.plotOptions,
          heatmap: {
            ...prev.plotOptions.heatmap,
            colorScale: {
              ranges: getColorRanges(toggledMetric),
            },
          },
        },
      }));
    },
  }));

  return (
    <div className="chartContainer">
      <Chart
        options={chartOptions}
        series={series}
        type="heatmap"
        width="100%"
        height="300"
      />
    </div>
  );
});

function getColorRanges(metric) {
  const isPM10 = metric === "pm10cnc";
  return [
    {
      from: 0,
      to: isPM10 ? 50 : 30,
      color: "#1EC82F",
      name: "very good",
    },
    {
      from: isPM10 ? 51 : 31,
      to: isPM10 ? 100 : 60,
      color: "#1BF030",
      name: "good",
    },
    {
      from: isPM10 ? 101 : 61,
      to: isPM10 ? 250 : 90,
      color: "#F3DC0C",
      name: "medium",
    },
    {
      from: isPM10 ? 251 : 91,
      to: isPM10 ? 350 : 120,
      color: "#FFA621",
      name: "high",
    },
    {
      from: isPM10 ? 351 : 121,
      to: isPM10 ? 430 : 250,
      color: "#FF0F0F",
      name: "very high",
    },
    {
      from: isPM10 ? 431 : 251,
      to: 1000,
      color: "#BA0909",
      name: "severe",
    },
  ];
}

export default Heatmap;
