import { Box, Paper, Typography, Stack, Skeleton, Grid, Chip, useTheme } from "@mui/material";
import { height } from "@mui/system";
import React, { useEffect, useLayoutEffect, useState } from "react";
// import ApexLineChart from "remote/ApexLineChart"; // Keep unused/commented if needed
// import CardMUI from "remote/CardMUI"; // Replaced with modern custom UI
import fetchMarkerDetailsChartData from "../services/map/FetchMarkerDetailsChartData";
import getColor from "../utils/getColorForTable";

export default function PopupDetails(props) {
  const theme = useTheme();

  const cardSx = {
    p: 1.5,
    borderRadius: 3,
    background: theme.palette.background.paper,
    border: `1px solid ${theme.palette.divider}`,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    position: "relative",
    overflow: "hidden",
    boxShadow: theme.palette.mode === 'dark' ? "0 4px 6px -1px rgba(0,0,0,0.3)" : "0 4px 6px -1px rgba(0,0,0,0.05)",
    transition: "transform 0.2s, box-shadow 0.2s",
    "&:hover": {
      transform: "translateY(-2px)",
      boxShadow: theme.palette.mode === 'dark' ? "0 10px 15px -3px rgba(0,0,0,0.5)" : "0 10px 15px -3px rgba(0,0,0,0.1)"
    }
  };

  const [loading, setLoading] = useState(false);
  const [markerDetailChart, setMarkerDetailChart] = useState([]);

  setTimeout(() => {
    window.dispatchEvent(new Event("resize"));
  }, 1);

  useEffect(() => {
    const executeAsyncFunction = async () => {
      setLoading(true);
      const finalChartData = await fetchMarkerDetailsChartData(
        props.popupFeatures.properties.imei,
        props.param,
        props.avgTime,
        props.split,
        props.durationStartDate,
        props.durationEndDate,
        props.api_key
      );
      setMarkerDetailChart([{ data: finalChartData, name: props.param }]);
      setLoading(false);
    };
    executeAsyncFunction();
  }, [
    props.durationEndDate,
    props.avgTime,
    props.split,
    props.param,
    props.timeButton,
    props.homeTimeButton,
  ]);

  let width = 650;
  let height = 250;

  const formatLastUpdated = (dateString) => {
    if (!dateString) return "N/A";
    try {
      // The API's raw hours/minutes are correct. We strip any existing timezone info, 
      // treat it as UTC, and format as UTC to guarantee the browser's local timezone offset 
      // DOES NOT shift the time forward or backward.
      let cleanString = dateString.replace(' ', 'T');
      cleanString = cleanString.replace(/(Z|[+-]\d{2}(:\d{2})?)$/, '');
      const date = new Date(cleanString + 'Z');

      if (isNaN(date.getTime())) return dateString;

      const formattedTime = new Intl.DateTimeFormat('en-US', {
        timeZone: 'UTC', // Lock output to UTC to strictly echo the parsed numbers
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      }).format(date);

      return `${formattedTime}`;
    } catch (e) {
      return dateString;
    }
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%', p: { xs: 1, md: 0 } }}>
      <Paper
        elevation={0}
        sx={{
          width: "100%",
          minWidth: { xs: '100%', md: 280 },
          maxWidth: 320,
          borderRadius: 4,
          overflow: "hidden",
          background: theme.palette.background.paper,
          color: theme.palette.text.primary,
          fontFamily: "'Inter', 'Roboto', sans-serif",
          boxShadow: theme.palette.mode === 'dark' ? "0px 10px 30px rgba(0, 0, 0, 0.4)" : "0px 10px 30px rgba(0, 0, 0, 0.08)",
          border: `1px solid ${theme.palette.divider}`,
        }}
      >
        {/* Header Section */}
        <Box
          sx={{
            background: "linear-gradient(135deg, #03C9D7 0%, #028e9b 100%)",
            p: 2,
            color: "white",
            position: "relative"
          }}
        >
          <Box sx={{ position: "absolute", top: 16, right: 16 }}>
            <Chip
              label={props.popupFeatures.properties.status == "ONLINE" ? "Online" : "Offline"}
              size="small"
              sx={{
                background: props.popupFeatures.properties.status == "ONLINE" ? "rgba(6, 243, 57, 0.25)" : "#EF4444",
                backdropFilter: "blur(4px)",
                color: "white",
                fontWeight: 700,
                fontSize: '0.75rem',
                border: "1px solid rgba(255,255,255,0.4)"
              }}
            />
          </Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 0.25, pr: 8, letterSpacing: '-0.2px', lineHeight: 1.2 }}>
            {props.popupFeatures.properties.location || "Unknown Location"}
          </Typography>
          <Typography variant="caption" sx={{ opacity: 0.9, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 1 }}>
            <span style={{ opacity: 0.7 }}>IMEI:</span> {props.popupFeatures.properties.imei}
          </Typography>
        </Box>

        {/* Content Section */}
        <Box sx={{ p: 2, background: theme.palette.mode === 'dark' ? '#0f172a' : '#f8fafc' }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1.5 }}>
            <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 800, letterSpacing: 1.2 }}>
              Air Quality Metrics
            </Typography>
            <Typography variant="caption" sx={{
              color: theme.palette.mode === 'dark' ? '#94a3b8' : '#64748b',
              fontWeight: 600,
              bgcolor: theme.palette.mode === 'dark' ? '#1e293b' : '#e2e8f0',
              px: 1.5,
              py: 0.5,
              borderRadius: 2
            }}>
              {formatLastUpdated(props.popupFeatures.properties.last_updated)}
            </Typography>
          </Box>

          <Grid container spacing={1.5}>
            {/* PM2.5 Card */}
            <Grid item xs={6}>
              <Paper
                elevation={0}
                sx={cardSx}
              >
                <Box
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: "4px",
                    backgroundColor: getColor(props.popupFeatures.properties["pm2.5cnc"], "pm2.5cnc") || "#ccc",
                  }}
                />
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, mt: 0.5, fontSize: '0.65rem' }}>
                  PM₂.₅
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 800, color: "text.primary", mt: 0.25 }}>
                  {props.popupFeatures.properties["pm2.5cnc"] !== undefined ? props.popupFeatures.properties["pm2.5cnc"] : "--"}
                </Typography>
                <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 600, fontSize: '0.6rem' }}>
                  µg/m³
                </Typography>
              </Paper>
            </Grid>

            {/* PM10 Card */}
            <Grid item xs={6}>
              <Paper
                elevation={0}
                sx={cardSx}
              >
                <Box
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: "4px",
                    backgroundColor: getColor(props.popupFeatures.properties.pm10cnc, "pm10cnc") || "#ccc",
                  }}
                />
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, mt: 0.5, fontSize: '0.65rem' }}>
                  PM₁₀
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 800, color: "text.primary", mt: 0.25 }}>
                  {props.popupFeatures.properties.pm10cnc !== undefined ? props.popupFeatures.properties.pm10cnc : "--"}
                </Typography>
                <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 600, fontSize: '0.6rem' }}>
                  µg/m³
                </Typography>
              </Paper>
            </Grid>

            {/* Temp Card */}
            <Grid item xs={6}>
              <Paper
                elevation={0}
                sx={cardSx}
              >
                <Box sx={{ position: "absolute", top: 0, left: 0, right: 0, height: "4px", backgroundColor: "#f59e0b" }} />
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, mt: 0.5, fontSize: '0.65rem' }}>
                  Temperature
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 800, color: "text.primary", mt: 0.25 }}>
                  {props.popupFeatures.properties.temp !== undefined ? props.popupFeatures.properties.temp : "--"}
                </Typography>
                <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 600, fontSize: '0.6rem' }}>
                  °C
                </Typography>
              </Paper>
            </Grid>

            {/* Humidity Card */}
            <Grid item xs={6}>
              <Paper
                elevation={0}
                sx={cardSx}
              >
                <Box sx={{ position: "absolute", top: 0, left: 0, right: 0, height: "4px", backgroundColor: "#0284c7" }} />
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, mt: 0.5, fontSize: '0.65rem' }}>
                  Humidity
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 800, color: "text.primary", mt: 0.25 }}>
                  {props.popupFeatures.properties.humidity !== undefined ? props.popupFeatures.properties.humidity : 42}
                </Typography>
                <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 600, fontSize: '0.6rem' }}>
                  %
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Box>
  );
}
