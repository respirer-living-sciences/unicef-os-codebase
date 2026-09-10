import React from "react";
import { Box, Typography, Divider, Stack } from "@mui/material";

const MapSummaryCard = ({ title = "Summary", summaryText }) => {
  if (!summaryText) return null;

  const match = summaryText.match(/Total Devices:\s*(\d+)\s*\|\s*Online:\s*(\d+)\s*\|\s*Offline:\s*(\d+)/i);
  const isStructured = !!match;
  const total = isStructured ? match[1] : null;
  const online = isStructured ? match[2] : null;
  const offline = isStructured ? match[3] : null;

  return (
    <Box
      sx={{
        backgroundColor: (theme) =>
          theme.palette.mode === "dark"
            ? "rgba(30, 41, 59, 0.75)"
            : "rgba(255, 255, 255, 0.8)",
        border: (theme) =>
          theme.palette.mode === "dark"
            ? "1px solid rgba(255, 255, 255, 0.08)"
            : "1px solid rgba(0, 0, 0, 0.06)",
        borderRadius: "16px",
        boxShadow: (theme) =>
          theme.palette.mode === "dark"
            ? "0 8px 32px 0 rgba(0, 0, 0, 0.3)"
            : "0 8px 32px 0 rgba(3, 201, 215, 0.05)",
        padding: "12px 18px",
        minWidth: 260,
        maxWidth: 340,
        backdropFilter: "blur(16px)",
        transition: "all 0.3s ease-in-out",
      }}
    >
      {/* Header */}
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1.5 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              backgroundColor: "#10B981",
              animation: "pulse 1.8s infinite ease-in-out",
              "@keyframes pulse": {
                "0%": {
                  transform: "scale(0.9)",
                  boxShadow: "0 0 0 0 rgba(16, 185, 129, 0.7)",
                },
                "70%": {
                  transform: "scale(1)",
                  boxShadow: "0 0 0 6px rgba(16, 185, 129, 0)",
                },
                "100%": {
                  transform: "scale(0.9)",
                  boxShadow: "0 0 0 0 rgba(16, 185, 129, 0)",
                },
              },
            }}
          />
          <Typography
            variant="subtitle2"
            sx={{
              fontWeight: 700,
              fontSize: "0.75rem",
              color: "text.primary",
              letterSpacing: "0.5px",
              textTransform: "uppercase",
            }}
          >
            {title}
          </Typography>
        </Box>
      </Box>

      {isStructured ? (
        <Stack
          direction="row"
          spacing={2}
          divider={<Divider orientation="vertical" flexItem sx={{ opacity: 0.3 }} />}
          justifyContent="space-between"
          alignItems="center"
        >
          {/* Total Devices */}
          <Box sx={{ textAlign: "center", flex: 1 }}>
            <Typography variant="h5" sx={{ fontWeight: 800, color: "#03C9D7", lineHeight: 1.1 }}>
              {total}
            </Typography>
            <Typography
              variant="caption"
              sx={{ color: "text.secondary", fontWeight: 700, fontSize: "0.6rem", textTransform: "uppercase", letterSpacing: "0.5px" }}
            >
              Total
            </Typography>
          </Box>

          {/* Online Devices */}
          <Box sx={{ textAlign: "center", flex: 1 }}>
            <Typography variant="h5" sx={{ fontWeight: 800, color: "#10B981", lineHeight: 1.1 }}>
              {online}
            </Typography>
            <Typography
              variant="caption"
              sx={{ color: "text.secondary", fontWeight: 700, fontSize: "0.6rem", textTransform: "uppercase", letterSpacing: "0.5px" }}
            >
              Online
            </Typography>
          </Box>

          {/* Offline Devices */}
          <Box sx={{ textAlign: "center", flex: 1 }}>
            <Typography variant="h5" sx={{ fontWeight: 800, color: "#EF4444", lineHeight: 1.1 }}>
              {offline}
            </Typography>
            <Typography
              variant="caption"
              sx={{ color: "text.secondary", fontWeight: 700, fontSize: "0.6rem", textTransform: "uppercase", letterSpacing: "0.5px" }}
            >
              Offline
            </Typography>
          </Box>
        </Stack>
      ) : (
        <Typography
          variant="body2"
          sx={{
            color: "text.secondary",
            lineHeight: 1.5,
            fontWeight: 500,
          }}
        >
          {summaryText}
        </Typography>
      )}
    </Box>
  );
};

export default MapSummaryCard;
