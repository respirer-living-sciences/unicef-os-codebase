import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Typography,
} from "@mui/material";
import { Box, positions } from "@mui/system";
import React, { Component } from "react";
import Chart from "react-apexcharts";
import InfoIcon from "@mui/icons-material/Info";
import { useTheme } from "@mui/material/styles";

class ApexLineChartComponent extends Component {
  constructor(props) {
    super(props);

    const series = this.props.series;

    const width = this.props.width;
    const yaxisTitle = this.props.yaxisTitle;
    const tickAmount = props.tickAmount ? props.tickAmount : 10;
    // this.updateCharts = this.updateCharts.bind(this);

    this.state = {
      options: {
        chart: {
          id: "basic-line",
          fontFamily: "Open Sans",
          foreColor: props.theme.palette.text.secondary,
        },
        theme: {
          mode: props.theme.palette.mode,
        },
        yaxis: {
          title: {
            text: yaxisTitle,
            style: {
              color: "#6F767E",
              fontSize: "15px",
              fontWeight: 300,
            },
          },
        },
        xaxis: {
          // type: "datetime",
          offsetY: 35,
          title: {
            text: "Time",
            style: {
              color: "#6F767E",
              fontSize: "15px",
              // fontFamily: "Inter, Arial, sans-serif",
              fontWeight: 300,
              // letterSpacing: "3px",
            },
          },
          labels: {
            rotate: 0,
          },
          tickAmount: tickAmount ? tickAmount : 10,
        },
        stroke: {
          curve: "smooth",
          width: 2,
        },
        markers: {
          size: this.props.data1 ? (this.props.data1.length < 150 ? 3 : 0) : 3,
        },
        legend: {
          showForSingleSeries: false,
          showForNullSeries: false,
          fontSize: "14px",
          position: "top",
        },
        colors: [
          props.color1 ? props.color1 : "#03C9D7",
          props.color2 ? props.color2 : "#66DA26",
          props.color3 ? props.color3 : "#FF9800",
          props.color4 ? props.color4 : props.color5 ? props.color5 : "#f44336",
          "#757ce8",
        ],
      },

      series: series,
    };
  }

  componentDidUpdate(prevProps) {
    const { series, yaxisTitle, theme } = this.props;

    // Update series if changed
    if (prevProps.series !== series) {
      this.setState({ series });
    }
    if (
      prevProps.yaxisTitle !== yaxisTitle ||
      prevProps.theme.palette.mode !== theme.palette.mode
    ) {
      this.setState((prevState) => ({
        options: {
          ...prevState.options,
          chart: {
            ...prevState.options.chart,
            foreColor: theme.palette.text.secondary,
          },
          theme: {
            ...prevState.options.theme,
            mode: theme.palette.mode,
          },
          yaxis: {
            ...prevState.options.yaxis,
            title: {
              ...prevState.options.yaxis.title,
              text: yaxisTitle,
            },
          },
        },
      }));
    }
  }

  render() {
    return (
      <Box className="mui-card-linechart">
        <Card
          sx={{
            width: "100%",
            maxHeight: this.props.maxHeight ? this.props.maxHeight : 550,
            borderRadius: 2,
            boxShadow:
              this.props.theme.palette.mode === "light"
                ? "1px 1px 4px 1px rgb(175 175 175 / 90%)"
                : "none",
          }}
        >
          <CardHeader
            title={
              this.props.headerTitle ? this.props.headerTitle : "Line Chart"
            }
            titleTypographyProps={{ sx: { fontSize: "18px" } }}
          />

          <Chart
            options={this.state.options}
            series={this.state.series}
            type="line"
            height={this.props.height ? this.props.height : "450"}
          />
          {this.props.legendDisclaimer && (
            <CardContent>
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <InfoIcon />
                <Typography sx={{ ml: 1, mb: 2 }} variant="caption">
                  <i>{this.props.legendDisclaimer}</i>
                </Typography>
              </Box>
            </CardContent>
          )}
        </Card>
      </Box>
    );
  }
}

export default function ApexLineChart(props) {
  const theme = useTheme();
  return <ApexLineChartComponent {...props} theme={theme} />;
}
