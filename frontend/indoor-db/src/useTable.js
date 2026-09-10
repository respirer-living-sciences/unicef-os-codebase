import React from "react";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material";
import { useState } from "react";
import { styled } from "@mui/material/styles";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    // backgroundColor: "primary.main",
    // color: "white",
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

export default function useTable(finalMainData, headCells) {
  const [order, setOrder] = useState();
  const [orderBy, setOrderBy] = useState();

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
        <TableCell align="right">
          {item.pm25 != null && parseFloat(item.pm25).toFixed(2)}
        </TableCell>
        <TableCell align="right">
          {item.pm10 != null && parseFloat(item.pm10).toFixed(2)}
        </TableCell>
        <TableCell align="right">
          {item.pm1 != null && parseFloat(item.pm1).toFixed(2)}
        </TableCell>
        <TableCell align="right">
          {item.temp != null && parseFloat(item.temp).toFixed(2)}
        </TableCell>
        <TableCell align="right">
          {item.humidity != null && parseFloat(item.humidity).toFixed(2)}
        </TableCell>
        <TableCell align="right">{item.last_updated}</TableCell>
      </TableRow>
    );
  });

  return {
    tableBody,
    tableHead,
  };
}
