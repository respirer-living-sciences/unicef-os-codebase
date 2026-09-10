import React from "react";
import "./cardmui.css";
import {
  styled,
  Card,
  CardContent,
  Typography,
  Grid,
  Divider,
  Stack,
} from "@mui/material";
import { Box } from "@mui/system";

const PollutantCard = styled(Card)({
  maxWidth: 90,
  padding: "5px 20px",
  borderRadius: 10,
  margin: "10px 5px",
});

const PollutantCardBoxes = styled(Box)({
  maxWidth: 90,
  minHeight: 50,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
});

export default function CardMUI(props) {
  return (
    <Box className="mui-card">
      <Card
        sx={{
          maxWidth: 360,
          borderRadius: 5,
          textAlign: "center",
        }}
      >
        <CardContent>
          <Typography
            component="div"
            variant="h6"
            fontWeight="600"
            gutterBottom
          >
            {props.title}
          </Typography>
          <Divider></Divider>

          <Stack
            direction="row"
            spacing={0.5}
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="subtitle1" color="rgb(150, 150, 150)">
              {props.subHeadingOne}:
            </Typography>
            <Typography variant="subtitle1">
              {props.subHeadingOneValue}
            </Typography>
          </Stack>
          <Stack
            direction="row"
            spacing={0.5}
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="subtitle1" color="rgb(150, 150, 150)">
              {props.subHeadingTwo}:
            </Typography>
            <Typography variant="subtitle1">
              {props.subHeadingTwoValue}
            </Typography>
          </Stack>

          {/* //Box containing all 3 child cards */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-around",
              alignItems: "center",
            }}
          >
            {/* //Pollutant CARD 1 */}
            <PollutantCard
              sx={{ bgcolor: `${props.miniCardHeadingOneBgColor}` }}
            >
              <PollutantCardBoxes>
                <Typography variant="body2" mb={1}>
                  {props.miniCardHeadingOne}
                </Typography>
                <Typography
                  variant="subtitle1"
                  fontWeight="600"
                  sx={{ color: props.miniCardHeadingOneValueColor }}
                >
                  {props.miniCardHeadingOneValue}
                </Typography>
              </PollutantCardBoxes>
            </PollutantCard>
            {/* //Pollutant CARD 2 */}
            <PollutantCard
              sx={{ bgcolor: `${props.miniCardHeadingTwoBgColor}` }}
            >
              <PollutantCardBoxes>
                <Typography variant="body2" mb={1}>
                  {props.miniCardHeadingTwo}
                </Typography>
                <Typography variant="subtitle1" fontWeight="600">
                  {props.miniCardHeadingTwoValue}
                </Typography>
              </PollutantCardBoxes>
            </PollutantCard>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
