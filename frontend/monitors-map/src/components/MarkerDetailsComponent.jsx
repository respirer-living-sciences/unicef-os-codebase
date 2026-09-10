import { Box } from "@mui/material";
import { height } from "@mui/system";
import React, { useEffect, useLayoutEffect, useState } from "react";
import ApexLineChart from "remote/ApexLineChart";
import CardMUI from "remote/CardMUI";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

export default function MarkerDetailsComponent(props) {

  const [loading, setLoading] = useState(false);
  const [markerDetailChart, setMarkerDetailChart] = useState([]);

  setTimeout(() => {
    window.dispatchEvent(new Event("resize"));
  }, 1);

  useEffect(() => {
    const executeAsyncFunction = async () => {
      setLoading(true);
      const finalChartData = await props.fetchMarkerDetailsChartData(
        props.imei,
        props.pollutant,
        props.avgTime,
        props.split,
        props.durationStartDate,
        props.durationEndDate,
        props.api_key
      );
      setMarkerDetailChart([{ data: finalChartData, name: props.pollutant }]);
      setLoading(false);
    };
    executeAsyncFunction();
  }, [
    props.durationEndDate,
    props.avgTime,
    props.split,
    props.pollutant,
    props.timeButton,
    props.homeTimeButton,
  ]);

  let width = 650;
  let height = 250;
  return (
    <>
      <Box
        sx={{
          display: { md: "flex", xs: "none" },
          justifyContent: "space-around",
          alignItems: "center",
        }}
      >
        <CardMUI
          Key={props.imei}
          title={props.location}
          subHeadingOne="IMEI"
          subHeadingOneValue={props.imei}
          subHeadingTwo="Last Updated"
          subHeadingTwoValue={props.lastUpdated}
          miniCardHeadingOne="PM25"
          miniCardHeadingOneValue={props.pm25}
          miniCardHeadingTwo="PM10"
          miniCardHeadingTwoValue={props.pm10}
          miniCardHeadingThree="Humidity"
          miniCardHeadingThreeValue={42}
        />
        {loading && (
          <Stack spacing={1}>
            <Skeleton variant="rounded" width={340} height={300} />
          </Stack>
        )}
        {!loading && (
          <ApexLineChart
            width={width}
            height={height}
            series={markerDetailChart}
          />
        )}
      </Box>

      {/* mobile */}

      <Box
        sx={{
          display: { md: "none", xs: "block" },
          justifyContent: "space-around",
          alignItems: "center",
          // margin: "10px",
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
          <Stack>
            <Stack
              direction="row"
              spacing={2}
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography variant="subtitle1">IMEI</Typography>
              <Typography variant="subtitle1">
                <b>{props.imei}</b>
              </Typography>
            </Stack>
            <Stack
              direction="row"
              spacing={2}
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography variant="subtitle1">Location</Typography>
              <Typography variant="subtitle1">
                <b>{props.location}</b>
              </Typography>
            </Stack>
            <Stack
              direction="row"
              spacing={2}
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography variant="subtitle1">Last Updated</Typography>
              <Typography variant="subtitle1">
                <b>{props.lastUpdated}</b>
              </Typography>
            </Stack>
            <Stack
              direction="row"
              spacing={2}
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography variant="subtitle1">PM2.5</Typography>
              <Typography variant="subtitle1">
                <b>{props.pm25}</b>
              </Typography>
            </Stack>
            <Stack
              direction="row"
              spacing={2}
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography variant="subtitle1">PM10</Typography>
              <Typography variant="subtitle1">
                <b>{props.pm10}</b>
              </Typography>
            </Stack>
          </Stack>
        </Box>

        {loading && (
          <Stack spacing={1}>
            <Skeleton variant="rounded" width={width} height={height} />
          </Stack>
        )}

        {!loading && (
          <ApexLineChart
            width={width}
            height={height}
            series={markerDetailChart}
          />
        )}
      </Box>
    </>
  );
}
