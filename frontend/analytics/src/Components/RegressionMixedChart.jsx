import React, { useMemo } from "react";
import ReactApexChart from "react-apexcharts";
import { useTheme } from "@mui/material/styles";
import { Card, CardHeader, Box } from "@mui/material";

/**
 * RegressionMixedChart
 *
 * Props:
 *   regression       - object with X_test, y_test, y_prediction arrays
 *   selectedParameter - string ("pm2.5cnc" or other) used for axis labels
 */
export default function RegressionMixedChart({ regression, selectedParameter }) {
  const theme = useTheme();

  const paramLabel = selectedParameter === "pm2.5cnc" ? "PM₂.₅" : "PM₁₀";
  const isDark = theme.palette.mode === "dark";

  const series = useMemo(
    () => [
      {
        name: "Scatter plot",
        type: "scatter",
        data: regression.X_test.map((x, i) => ({
          x: parseFloat(x),
          y: parseFloat(regression.y_test[i]),
        })),
      },
      {
        name: "Regression line",
        type: "line",
        data: regression.X_test.map((x, i) => ({
          x: parseFloat(x),
          y: parseFloat(regression.y_prediction[i]),
        })),
      },
    ],
    [regression],
  );

  const options = useMemo(
    () => ({
      chart: {
        id: "regression-mixed-chart",
        background: "transparent",
        toolbar: { show: true },
        zoom: { enabled: true },
        animations: { enabled: true, speed: 600 },
        fontFamily: "Open Sans, sans-serif",
        foreColor: theme.palette.text.secondary,
      },
      theme: { mode: theme.palette.mode },
      stroke: {
        width: [0, 2],
        curve: "smooth",
        dashArray: [0, 4],
      },
      markers: {
        size: [4, 0],
        colors: ["#03C9D7"],
        strokeColors: "#fff",
        strokeWidth: 1,
        hover: { sizeOffset: 2 },
      },
      colors: ["#03C9D7", "#FF6B6B"],
      xaxis: {
        type: "numeric",
        title: {
          text: `Reference ${paramLabel}`,
          style: { color: isDark ? "#94A3B8" : "#64748B" },
        },
        labels: {
          style: { colors: isDark ? "#94A3B8" : "#64748B" },
          formatter: (value) => (value !== undefined && value !== null ? Number(value).toFixed(1) : value),
        },
      },
      yaxis: {
        title: {
          text: `Mave ${paramLabel}`,
          style: { color: isDark ? "#94A3B8" : "#64748B" },
        },
        labels: {
          style: { colors: isDark ? "#94A3B8" : "#64748B" },
          formatter: (value) => (value !== undefined && value !== null ? Number(value).toFixed(1) : value),
        },
      },
      legend: {
        position: "top",
        horizontalAlign: "center",
        labels: { colors: isDark ? "#F1F5F9" : "#1E293B" },
      },
      tooltip: {
        shared: false,
        intersect: true,
        theme: theme.palette.mode,
        y: {
          formatter: (value) => (value !== undefined && value !== null ? Number(value).toFixed(1) : value),
        },
      },
      grid: {
        borderColor: isDark ? "#334155" : "#E2E8F0",
      },
    }),
    [theme.palette.mode, paramLabel, isDark, theme.palette.text.secondary],
  );

  return (
    <Box className="mui-card-linechart" sx={{ width: "100%" }}>
      <style>{`
        .apexcharts-tooltip.apexcharts-theme-light,
        .apexcharts-tooltip.apexcharts-theme-dark {
          background: ${isDark ? "#1E293B" : "#FFFFFF"} !important;
          color: ${isDark ? "#F8FAFC" : "#0F172A"} !important;
          border: 1px solid ${isDark ? "#334155" : "#E2E8F0"} !important;
          box-shadow: ${isDark ? "0 10px 15px -3px rgba(0, 0, 0, 0.5)" : "0 10px 15px -3px rgba(0, 0, 0, 0.1)"} !important;
        }
        .apexcharts-tooltip-title {
          background: ${isDark ? "#334155" : "#F1F5F9"} !important;
          border-bottom: 1px solid ${isDark ? "#475569" : "#E2E8F0"} !important;
          color: ${isDark ? "#F8FAFC" : "#0F172A"} !important;
        }
        .apexcharts-tooltip-text,
        .apexcharts-tooltip-text-label,
        .apexcharts-tooltip-text-value,
        .apexcharts-tooltip-text-z-label,
        .apexcharts-tooltip-text-z-value {
          color: ${isDark ? "#F8FAFC" : "#0F172A"} !important;
        }
        .apexcharts-tooltip-series-group {
          background: ${isDark ? "#1E293B" : "#FFFFFF"} !important;
        }
        .apexcharts-legend-text {
          color: ${isDark ? "#F1F5F9" : "#4b4f56ff"} !important;
        }
      `}</style>
      <Card
        sx={{
          width: "100%",
          maxHeight: 550,
          borderRadius: 2,
          boxShadow: theme.palette.mode === 'light' ? "1px 1px 4px 1px rgb(175 175 175 / 90%)" : "none",
        }}
      >
        <CardHeader
          title="Scatter Plot"
          titleTypographyProps={{
            sx: {
              fontSize: "18px",
              fontFamily: "Open Sans, sans-serif",
              fontWeight: "600",
            },
          }}
        />
        <ReactApexChart
          key={theme.palette.mode}
          type="line"
          height={420}
          series={series}
          options={options}
        />
      </Card>
    </Box>
  );
}
