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
    let pm1Color;
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

    if (item["pm1"] === null) {
      pm1Color = "black";
    } else if (item["pm1"] > 0 && item["pm1"] <= 30) {
      pm1Color = "#1EC82F";
    } else if (item["pm1"] > 30 && item["pm1"] <= 60) {
      pm1Color = "#1BF030";
    } else if (item["pm1"] > 60 && item["pm1"] <= 90) {
      pm1Color = "#F3DC0C";
    } else if (item["pm1"] > 90 && item["pm1"] <= 120) {
      pm1Color = "#FFA621";
    } else if (item["pm1"] > 120 && item["pm1"] <= 250) {
      pm1Color = "#FF0F0F";
    } else if (item["pm1"] > 250) {
      pm1Color = "#BA0909";
    }

    if (item["temp"] === null) {
      tempColor = "black";
    } else if (item["temp"] > 0 && item["temp"] <= 35) {
      tempColor = "#1EC82F";
    } else if (item["temp"] > 35 && item["temp"] <= 40) {
      tempColor = "#1BF030";
    } else if (item["temp"] > 40 && item["temp"] <= 43) {
      tempColor = "#F3DC0C";
    } else if (item["temp"] > 43 && item["temp"] <= 50) {
      tempColor = "#FFA621";
    } else if (item["temp"] > 50 && item["temp"] <= 70) {
      tempColor = "#FF0F0F";
    } else if (item["temp"] > 70) {
      tempColor = "#BA0909";
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
        <TableCell align="right" sx={{ fontWeight: "bold", color: pm1Color }}>
          {item.pm1 != null && parseFloat(item.pm1).toFixed(2)}
        </TableCell>
        <TableCell align="right" sx={{ fontWeight: "bold", color: tempColor }}>
          {item.temp != null && parseFloat(item.temp).toFixed(2)}
        </TableCell>
        <TableCell align="right" sx={{ fontWeight: "bold", color: pm10Color }}>
          {item.humidity != null && parseFloat(item.humidity).toFixed(2)}
        </TableCell>
        <TableCell align="right">{item.last_updated}</TableCell>
      </TableRow>
    );
  });
  return (
    <Card
      sx={{
        m: "0 20px 0 20px",
      }}
    >
      <TableContainer component={Paper} sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table" sx={{ minWidth: 650 }}>
          {tableHead}
          <TableBody>{tableBody}</TableBody>
        </Table>
      </TableContainer>
    </Card>
  );
}
