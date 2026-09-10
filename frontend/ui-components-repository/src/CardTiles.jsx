import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";

export default function CardTiles(props) {
  const theme = useTheme();
  const isLight = theme.palette.mode === "light";

  return (
    <Card
      sx={{
        background: isLight ? "linear-gradient(135deg, #f8f9fc 0%, #eef1f8 100%)" : "linear-gradient(135deg, #1E293B 0%, #0F172A 100%)",
        borderRadius: "12px",
        border: isLight ? "1px solid rgba(0, 0, 0, 0.06)" : "1px solid rgba(255, 255, 255, 0.06)",
        boxShadow: isLight ? "0 2px 8px rgba(0, 0, 0, 0.04)" : "0 2px 8px rgba(0, 0, 0, 0.2)",
        transition: "all 0.25s ease",
        overflow: "visible",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: isLight ? "0 6px 20px rgba(3, 201, 215, 0.15)" : "0 6px 20px rgba(3, 201, 215, 0.25)",
          borderColor: isLight ? "rgba(3, 201, 215, 0.3)" : "rgba(3, 201, 215, 0.5)",
        },
      }}
    >
      <CardContent sx={{ p: "14px 16px !important" }}>
        <Typography
          sx={{
            fontSize: "11px",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.8px",
            color: isLight ? "#8b95a5" : "#94A3B8",
            fontFamily: "Open Sans, sans-serif",
            mb: 0.5,
          }}
        >
          {props.tileHeading}
        </Typography>
        <Box sx={{ display: "flex", alignItems: "baseline" }}>
          <Typography
            sx={{
              fontSize: "20px",
              fontWeight: 700,
              color: isLight ? "#1a2332" : "#F1F5F9",
              fontFamily: "Open Sans, sans-serif",
              lineHeight: 1.2,
            }}
          >
            {props.value}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}
