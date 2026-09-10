import React from "react";
import Card from "@mui/material/Card";
import MoodRoundedIcon from "@mui/icons-material/MoodRounded";
import SentimentNeutralOutlinedIcon from "@mui/icons-material/SentimentNeutralOutlined";
import { Box, Skeleton, Typography } from "@mui/material";

export default function HealthTipsCard({ value, isLoading }) {
  const textTips = {
    general: [
      { range: [0, 60], text: "It's a good day to be active outside." },
      { range: [60.01, 120], text: "It's okay to be active outside." },
      { range: [120.01, Infinity], text: "Limit proplonged outdoor exertion" },
    ],
    sensitive: [
      { range: [0, 60], text: "It's a good day to be active outside." },
      {
        range: [60.01, 120],
        text: "Consider reducing prolonged or heavy exertion. Watch for symptoms such as coughing or shortness of breath. These are signs to take it easier.",
      },
      {
        range: [120.01, 250],
        text: "Avoid prolonged or heavy outdoor exertion",
      },
      { range: [250.01, Infinity], text: "Avoid all outdoor exertion" },
    ],
  };

  //   const value = selectedDistrictDailyData.find((item) => item["PM2.5"])[
  //     "PM2.5"
  //   ];

  const generalPeopleInfo = textTips["general"].find(({ range }) => {
    const [min, max] = range;
    return value >= min && value <= max;
  });

  const generalPeopleTextForValue = generalPeopleInfo
    ? generalPeopleInfo.text
    : "unknown";

  const sensitivePeopleInfo = textTips["sensitive"].find(({ range }) => {
    const [min, max] = range;
    return value >= min && value <= max;
  });

  const sensitivePeopleTextForValue = sensitivePeopleInfo
    ? sensitivePeopleInfo.text
    : "unknown";

  return (
    <Box>
      <Typography variant="h5" fontWeight="600" color="black">
        Health Tips
      </Typography>

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 2,
          mt: 2,
          mb: 3,
        }}
      >
        {/* General People Card */}
        <Card
          sx={{
            width: "100%",
            height: 132,
            borderRadius: 2,
            border: 1,
            borderColor: "primary.main",
            boxShadow: "none",
            bgcolor: "#FCFCFC",
            display: "flex",
            alignItems: "flex-start",
            pl: 3,
            pt: 2,
          }}
        >
          <Box display="flex" flexDirection="column">
            <Box display="flex" alignItems="center" gap={1.5}>
              {value < 120 ? (
                <MoodRoundedIcon
                  fontSize="large"
                  sx={{
                    bgcolor: "#B5E4CA",
                    borderRadius: "50%",
                    p: 0.5,
                    color: "success.main",
                  }}
                />
              ) : (
                <SentimentNeutralOutlinedIcon
                  fontSize="large"
                  sx={{
                    bgcolor: "#FFE7E4",
                    borderRadius: "50%",
                    p: 0.5,
                    color: "error.main",
                  }}
                />
              )}
              <Typography variant="h6" fontWeight={500}>
                General People
              </Typography>
            </Box>
            {isLoading ? (
              <Skeleton
                variant="text"
                width="80%"
                height={24}
                sx={{ mt: 1, pl: 5.5 }}
              />
            ) : (
              <Typography
                sx={{
                  mt: 1,
                  pl: 5.5,
                  fontSize: 16,
                  color: "text.secondary",
                  fontWeight: 500,
                }}
              >
                {value == null ? "No Tips found" : generalPeopleTextForValue}
              </Typography>
            )}
          </Box>
        </Card>

        {/* Sensitive People Card */}
        <Card
          sx={{
            width: "100%",
            height: 132,
            borderRadius: 2,
            border: 1,
            borderColor: "primary.main",
            boxShadow: "none",
            bgcolor: "#FCFCFC",
            display: "flex",
            alignItems: "flex-start",
            pl: 3,
            pt: 2,
          }}
        >
          <Box display="flex" flexDirection="column">
            <Box display="flex" alignItems="center" gap={1.5}>
              {value < 60 ? (
                <MoodRoundedIcon
                  fontSize="large"
                  sx={{
                    bgcolor: "#B5E4CA",
                    borderRadius: "50%",
                    p: 0.5,
                    color: "success.main",
                  }}
                />
              ) : (
                <SentimentNeutralOutlinedIcon
                  fontSize="large"
                  sx={{
                    bgcolor: "#FFE7E4",
                    borderRadius: "50%",
                    p: 0.5,
                    color: "error.main",
                  }}
                />
              )}
              <Typography variant="h6" fontWeight={500}>
                Sensitive People
              </Typography>
            </Box>
            {isLoading ? (
              <Skeleton
                variant="text"
                width="80%"
                height={24}
                sx={{ mt: 1, pl: 5.5 }}
              />
            ) : (
              <Typography
                sx={{
                  mt: 1,
                  pl: 5.5,
                  fontSize: 16,
                  color: "text.secondary",
                  fontWeight: 500,
                }}
              >
                {value == null ? "No Tips found" : sensitivePeopleTextForValue}
              </Typography>
            )}
          </Box>
        </Card>
      </Box>
    </Box>
  );
}
