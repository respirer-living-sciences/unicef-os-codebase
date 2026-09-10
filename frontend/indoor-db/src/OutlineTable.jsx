import React, { useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Card, TableSortLabel } from "@mui/material";
import { styled } from "@mui/material/styles";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const theme = createTheme({
  typography: {
    allVariants: {
      fontFamily: "Open Sans",
    },
  },
  palette: {
    primary: {
      main: "#03C9D7",
      light: "#757ce8",
    },
    secondary: {
      main: "#f44336",
    },
  },
});

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    // backgroundColor: "primary.main",
    // color: "white",
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 24,
  },
}));

export default function BasicTable(props) {
  const [data, setData] = useState(finalMainData);
  const [order, setOrder] = useState();
  const [orderBy, setOrderBy] = useState();
  // const tableBody = props.tableBody;
  // const tableHead = props.tableHead;
  const headCells = props.headCells;
  const finalMainData = props.finalMainData;

  const handleSortRequest = (cellId) => {
    const isAsc = orderBy === cellId && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(cellId);
  };

  function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
  }

  function getComparator(order, orderBy) {
    return order === "desc"
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  }

  function descendingComparator(a, b, orderBy) {
    if (b[orderBy] === null && orderBy !== "locality") {
      b[orderBy] = 0;
    }
    if (a[orderBy] === null && orderBy !== "locality") {
      a[orderBy] = 0;
    }
    if (orderBy !== "locality") {
      if (parseInt(b[orderBy]) < parseInt(a[orderBy])) {
        return -1;
      }
      if (parseInt(b[orderBy]) > parseInt(a[orderBy])) {
        return 1;
      }
    } else {
      if (b[orderBy] < a[orderBy]) {
        return -1;
      }
      if (b[orderBy] > a[orderBy]) {
        return 1;
      }
    }
    return 0;
  }

  function recordsAfterSorting(finalMainData) {
    return stableSort(finalMainData, getComparator(order, orderBy));
  }

  const finalSortedData = recordsAfterSorting(finalMainData);

  const tableHead = (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <StyledTableCell
            sx={{ fontSize: 16 }}
            key={headCell.id}
            sortDirection={orderBy === headCell.id ? order : false}
            align={headCell.align ? "right" : "left"}
          >
            {headCell.disableSorting ? (
              headCell.label
            ) : (
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : "asc"}
                onClick={() => {
                  handleSortRequest(headCell.id);
                }}
              >
                {headCell.label}
              </TableSortLabel>
            )}
          </StyledTableCell>
        ))}
      </TableRow>
    </TableHead>
  );

  const tableBody = finalSortedData.map((item) => {
    let pm25Color;
    let pm10Color;
    let co2concColor;
    let ambTempColor;
    let humidityColor;
    let tempColor;

    if (item["pm25"] === null) {
      pm25Color = "black";
    } else if (item["pm25"] > 0 && item["pm25"] <= 30) {
      pm25Color = "#1EC82F";
    } else if (item["pm25"] > 30 && item["pm25"] <= 60) {
      pm25Color = "#1BF030";
    } else if (item["pm25"] > 60 && item["pm25"] <= 90) {
      pm25Color = "#F3DC0C";
    } else if (item["pm25"] > 90 && item["pm25"] <= 120) {
      pm25Color = "#FFA621";
    } else if (item["pm25"] > 120 && item["pm25"] <= 250) {
      pm25Color = "#FF0F0F";
    } else if (item["pm25"] > 250) {
      pm25Color = "#BA0909";
    }

    if (item["pm10"] === null) {
      pm10Color = "black";
    } else if (item["pm10"] > 0 && item["pm10"] <= 50) {
      pm10Color = "#1EC82F";
    } else if (item["pm10"] > 50 && item["pm10"] <= 100) {
      pm10Color = "#1BF030";
    } else if (item["pm10"] > 100 && item["pm10"] <= 250) {
      pm10Color = "#F3DC0C";
    } else if (item["pm10"] > 250 && item["pm10"] <= 350) {
      pm10Color = "#FFA621";
    } else if (item["pm10"] > 350 && item["pm10"] <= 430) {
      pm10Color = "#FF0F0F";
    } else if (item["pm10"] > 430) {
      pm10Color = "#BA0909";
    }

    if (item["co2conc"] === null) {
      co2concColor = "black";
    } else if (item["co2conc"] > 0 && item["co2conc"] <= 30) {
      co2concColor = "#1EC82F";
    } else if (item["co2conc"] > 30 && item["co2conc"] <= 60) {
      co2concColor = "#1BF030";
    } else if (item["co2conc"] > 60 && item["co2conc"] <= 90) {
      co2concColor = "#F3DC0C";
    } else if (item["co2conc"] > 90 && item["co2conc"] <= 120) {
      co2concColor = "#FFA621";
    } else if (item["co2conc"] > 120 && item["co2conc"] <= 250) {
      co2concColor = "#FF0F0F";
    } else if (item["co2conc"] > 250) {
      co2concColor = "#BA0909";
    }

    if (item["ambTemp"] === null) {
      ambTempColor = "black";
    } else if (item["ambTemp"] > 0 && item["ambTemp"] <= 35) {
      ambTempColor = "#1EC82F";
    } else if (item["ambTemp"] > 35 && item["ambTemp"] <= 40) {
      ambTempColor = "#1BF030";
    } else if (item["ambTemp"] > 40 && item["ambTemp"] <= 43) {
      ambTempColor = "#F3DC0C";
    } else if (item["ambTemp"] > 43 && item["ambTemp"] <= 50) {
      ambTempColor = "#FFA621";
    } else if (item["ambTemp"] > 50 && item["ambTemp"] <= 70) {
      ambTempColor = "#FF0F0F";
    } else if (item["ambTemp"] > 70) {
      ambTempColor = "#BA0909";
    }

    return (
      <TableRow
        key={item.imei}
        hover
        onClick={(event) =>
          props.callHandlePlotGraph(event, item.imei, item.locality)
        }
        sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
      >
        <TableCell component="th" scope="item">
          {item.imei}
        </TableCell>
        <TableCell align="right">{item.locality}</TableCell>
        <TableCell align="right" sx={{ fontWeight: "bold", color: pm25Color }}>
          {item.pm25 != null && parseFloat(item.pm25).toFixed(2)}
        </TableCell>
        <TableCell align="right" sx={{ fontWeight: "bold", color: pm10Color }}>
          {item.pm10 != null && parseFloat(item.pm10).toFixed(2)}
        </TableCell>
        <TableCell
          align="right"
          sx={{ fontWeight: "bold", color: co2concColor }}
        >
          {item.co2conc != null && parseFloat(item.co2conc).toFixed(2)}
        </TableCell>
        <TableCell
          align="right"
          sx={{ fontWeight: "bold", color: ambTempColor }}
        >
          {item.ambTemp != null && parseFloat(item.ambTemp).toFixed(2)}
        </TableCell>
        <TableCell
          align="right"
          sx={{ fontWeight: "bold", color: co2concColor }}
        >
          {item.tvocconc != null && parseFloat(item.tvocconc).toFixed(2)}
        </TableCell>
        <TableCell
          align="right"
          sx={{ fontWeight: "bold", color: co2concColor }}
        >
          {item.windspeed != null && parseFloat(item.windspeed).toFixed(2)}
        </TableCell>
        <TableCell align="right" sx={{ fontWeight: "bold", color: pm10Color }}>
          {item.humidity != null && parseFloat(item.humidity).toFixed(2)}
        </TableCell>
        <TableCell align="right">{item.last_updated}</TableCell>
      </TableRow>
    );
  });
  return (
    <ThemeProvider theme={theme}>
      <Card
        sx={{
          m: "0 20px 0 20px",
          borderRadius: 2,
          boxShadow: "1px 1px 4px 1px rgb(175 175 175 / 90%)",
          // borderRadius: "10px 0 0 10px",
        }}
      >
        <TableContainer component={Paper} sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label="sticky table" sx={{ minWidth: 650 }}>
            {tableHead}
            <TableBody>{tableBody}</TableBody>
          </Table>
        </TableContainer>
      </Card>
    </ThemeProvider>
  );
}
