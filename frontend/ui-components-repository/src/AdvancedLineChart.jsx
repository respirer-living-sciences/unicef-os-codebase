import React, { useState, useEffect, useRef, useMemo } from "react";
import Chart from "react-apexcharts";
import moment from "moment";
import { Skeleton, Box, useTheme } from "@mui/material";

const isSafari = () => {
  if (typeof window === 'undefined') return false;
  return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
};

const sanitizeSeriesData = (seriesArray) => {
  if (!Array.isArray(seriesArray)) return [];

  const needsTimestampConversion = isSafari();
  const INPUT_DATE_FORMAT = "MMM DD, h:mm A";

  return seriesArray.map(series => {
    if (!series || !Array.isArray(series.data)) {
      return { ...series, data: [] };
    }

    const sanitizedData = series.data.map(point => {
      let finalY = null;
      let finalX = point.x;
      const yValue = point.y;

      if (yValue === null || yValue === undefined || yValue === "") {
        finalY = null;
      } else if (typeof yValue === 'string') {
        const parsedY = parseFloat(String(yValue).replace(/,/g, ''));
        finalY = isFinite(parsedY) ? parsedY : null;
      } else if (typeof yValue === 'number' && isFinite(yValue)) {
        finalY = yValue;
      } else {
        finalY = null;
      }

      if (needsTimestampConversion && typeof point.x === 'string') {
        const m = moment(point.x, INPUT_DATE_FORMAT);
        if (m.isValid()) {
          finalX = m.valueOf();
        } else {
          finalX = point.x;
        }
      } else if (typeof point.x === 'number' && !needsTimestampConversion) {
        finalX = point.x;
      }

      return { x: finalX, y: finalY };
    })
      .filter(point => needsTimestampConversion ? isFinite(point.x) : true);

    return { ...series, data: sanitizedData };
  });
};

const AdvancedLineChart = ({
  pollutantName,
  headerTitle,
  noDataText,
  seriesData,
  colorStops,
  colorStops2,
  chartKey,
  isLoading,
}) => {
  const theme = useTheme();
  const chartRef = useRef(null);
  const [finalSeriesData, setFinalSeriesData] = useState([]);
  const safeSeriesData = sanitizeSeriesData(seriesData);

  useEffect(() => {
    const hasValidDataPoints = safeSeriesData.some((s) =>
      s.data && s.data.some(p => p.y !== null && p.y !== undefined)
    );

    let calculatedFinalSeries;

    if (hasValidDataPoints) {
      calculatedFinalSeries = safeSeriesData.filter(s =>
        s.data && s.data.some(p => p.y !== null && p.y !== undefined)
      );
    } else {
      calculatedFinalSeries = [];
    }

    setFinalSeriesData(calculatedFinalSeries);

  }, [seriesData, chartKey]);

  const shouldRenderChart = typeof window !== "undefined" && finalSeriesData.length > 0;

  useEffect(() => {
    if (!shouldRenderChart && chartRef.current && chartRef.current.chart) {
      chartRef.current.chart.updateSeries([]);
    }
  }, [chartKey, shouldRenderChart]);

  const options = useMemo(() => ({
    title: {
      text: headerTitle,
      style: {
        fontSize: "14px",
        fontWeight: "bold",
        fontFamily: "open sans",
        color: theme.palette.text.primary,
      },
    },
    chart: {
      height: 350,
      type: "area",
      fontFamily: "'Open Sans', sans-serif",
      toolbar: { show: false },
      foreColor: theme.palette.text.secondary,
    },
    fill: {
      colors: ["#B8FFC780"],
      type: "gradient",
      gradient: {
        shade: theme.palette.mode === "light" ? "light" : "dark",
        shadeIntensity: 1,
        opacityFrom: 1,
        opacityTo: 1,
        type: "vertical",
        colorStops: [colorStops, colorStops2],
      },
    },
    dataLabels: { enabled: false },
    stroke: {
      curve: "smooth",
      colors: ["#00FF00", "#00D22D"],
      width: [1.5, 1],
    },
    grid: {
      borderColor: theme.palette.divider,
    },
    xaxis: {
      type: "datetime",
      tickAmount: 5,
      labels: {
        rotate: 0,
        style: {
          colors: theme.palette.text.secondary,
        },
        formatter: function (value) {
          const date = new Date(Number(value));
          const formatter = new Intl.DateTimeFormat("en-US", {
            month: "short",
            day: "2-digit",
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          });
          return formatter.format(date);
        },
      },
      axisBorder: {
        color: theme.palette.divider,
      },
      axisTicks: {
        color: theme.palette.divider,
      },
    },
    yaxis: {
      title: {
        text: pollutantName,
        style: {
          color: theme.palette.text.secondary,
          fontSize: "15px",
          fontWeight: 300,
        },
      },
      labels: {
        style: {
          colors: theme.palette.text.secondary,
        },
      },
    },
    legend: { show: false },
    tooltip: {
      theme: theme.palette.mode,
      style: { fontSize: "12px" },
      enabledOnSeries: [0],
      marker: { show: false },
    },
    markers: {
      colors: [theme.palette.text.secondary, "transparent"],
      strokeColors: [theme.palette.text.primary, "transparent"],
      hover: { size: 4 },
    },
    noData: {
      text: noDataText,
      style: {
        color: theme.palette.text.primary,
        fontSize: "18px",
        fontFamily: "Open Sans",
      },
    },
    series: finalSeriesData,
  }), [
    headerTitle,
    pollutantName,
    noDataText,
    colorStops,
    colorStops2,
    finalSeriesData,
    theme,
  ]);

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-screen-xl" style={{ color: theme.palette.text.primary }}>
        {isLoading ? (
          <Box sx={{ height: 366, width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
            <Skeleton variant="rectangular" width="100%" height={334} sx={{ borderRadius: 1 }} />
          </Box>
        ) : shouldRenderChart ? (
          <Chart
            ref={chartRef}
            type="area"
            options={options}
            series={finalSeriesData}
            height={366}
            width="100%"
            key={`${chartKey || "default-chart"}-${theme.palette.mode}`}
          />
        ) : (
          <div className="apexcharts-nodata" style={{ ...options.noData.style, display: "flex", height: 366, justifyContent: "center", alignItems: "center" }}>
            {noDataText}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdvancedLineChart;
