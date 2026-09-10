import React, { useMemo, useState } from "react";
import Table from "@mui/material/Table";
// import TableBody from "@mui/material/TableBody";
// import { styled } from "@mui/material/styles";
// import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TableSortLabel from "@mui/material/TableSortLabel";
import { useEffect } from "react";
import { styled } from "@mui/material/styles";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import {
  Box,
  Button,
  Collapse,
  IconButton,
  InputAdornment,
  TextField,
  Toolbar,
  Tooltip,
  Typography,
  Skeleton,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import SearchIcon from "@mui/icons-material/Search";
import DownloadIcon from "@mui/icons-material/Download";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { ThemeProvider, createTheme } from "@mui/material/styles";
import LoadingButton from "@mui/lab/LoadingButton";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    fontSize: 14,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({}));

// Note: This reusable component should have necessary props (mentioned below) passed into it.
export default function SortableTable(props) {
  const { columns, finalMainData, isLoading, totalNumOfMonitors } = props;
  const [order, setOrder] = useState();
  const [orderBy, setOrderBy] = useState();
  const [cellIdDatatype, setCellIdDatatype] = useState();
  const [open, setOpen] = useState(false);
  const [expandedRowIndex, setExpandedRowIndex] = useState();
  const [expandedRowData, setExpandedRowData] = useState([]);
  const [searchValue, setSearchValue] = useState(null);
  const [summaryText, setSummaryText] = useState({
    total: 0,
    online: 0,
    offline: 0,
  });
  const [filterFn, setFilterFn] = useState({
    fn: (items) => {
      return items;
    },
  });

  let totalDevices = "-",
    onlineDevices = "-",
    offlineDevices = "-",
    summaryTextVar;

  useEffect(() => {
    setOpen(false);
    setExpandedRowIndex(-1);
    const devices = finalMainData;

    totalDevices = devices.length;
    onlineDevices = devices.filter((d) => d.status === "ONLINE").length;
    offlineDevices = totalDevices - onlineDevices;
    summaryTextVar = {
      total: totalDevices,
      online: onlineDevices,
      offline: offlineDevices,
    };
    setSummaryText(summaryTextVar);
  }, [finalMainData]);

  const handleSearch = (e) => {
    const target = e.target;
    const searchTerms = target.value.split(",").map((term) => term.trim());
    setFilterFn({
      fn: (items) => {
        if (target.value === "") {
          return items;
        } else {
          return finalMainData.filter((x) =>
            props.filterProperties.some(
              (property) =>
                x[property] != null &&
                searchTerms.some((term) =>
                  x[property].toLowerCase().includes(term.toLowerCase()),
                ),
            ),
          );
        }
      },
    });
  };

  const handleSortRequest = (cellId, datatype) => {
    const isAsc = orderBy === cellId && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(cellId);
    setCellIdDatatype(datatype);
    setOpen(false);
    setExpandedRowIndex(-1);
  };

  function stableSort(array, comparator) {
    const stabilized = array.map((el, index) => [el, index]);
    stabilized.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });

    return stabilized.map((el) => el[0]);
  }

  function getComparator(order, orderBy) {
    return order === "desc"
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  }

  function descendingComparator(a, b, orderBy) {
    if (b[orderBy] === null && cellIdDatatype !== "str") {
      b[orderBy] = 0;
    }
    if (a[orderBy] === null && cellIdDatatype !== "str") {
      a[orderBy] = 0;
    }
    if (cellIdDatatype !== "str") {
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

  function recordsAfterSorting(filteredMainData) {
    return stableSort(filteredMainData, getComparator(order, orderBy));
  }

  const finalSortedData = useMemo(
    () => recordsAfterSorting(filterFn.fn(finalMainData)),
    [order, orderBy, finalMainData, filterFn],
  );
  // useEffect(() => {
  //   moveSortedDataUp(finalSortedData);
  // }, [orderBy, order]);

  const handleExpandRow = (rowId, index) => {
    setOpen(true);
    if (index === expandedRowIndex) {
      setExpandedRowIndex(-1);
    } else {
      setExpandedRowIndex(index);
    }
    // execute data fetching for the expanded row.
    const rowsData = props.fetchExpandedRowData(rowId);
    setExpandedRowData(rowsData);
  };

  const onDownloadCsv = () => {
    props.downloadCsv(finalSortedData);
  };

  const tableBody = isLoading
    ? Array.from(
        new Array(
          totalNumOfMonitors && totalNumOfMonitors <= 10
            ? totalNumOfMonitors
            : 10,
        ),
      ).map((_, index) => (
        <React.Fragment key={`skeleton-${index}`}>
          <StyledTableRow>
            {props.isExpandable && (
              <StyledTableCell>
                <Skeleton animation="wave" width={24} height={24} />
              </StyledTableCell>
            )}
            {columns.map((columnItem, colIndex) => (
              <StyledTableCell key={colIndex} align={columnItem.align}>
                <Skeleton animation="wave" height={24} />
              </StyledTableCell>
            ))}
          </StyledTableRow>
        </React.Fragment>
      ))
    : finalSortedData.map((item, index) => {
        let isExpanded = index === expandedRowIndex;
        let bgColor;
        let textColor;
        if (isExpanded) {
          bgColor = "#F5F5F5";
          if (item.inActive) {
            // bgColor = "rgba(255,0,0, 0.1)";
            bgColor = "#FF0000D4";
            textColor = "#fff";
          }
        } else if (item.inActive) {
          bgColor = "#FF0000D4";
          textColor = "#fff";
        }
        const rowContent = (
          <StyledTableRow
            hover
            onClick={(event) =>
              props.onRowClick &&
              props.onRowClick(
                event,
                item[columns[0].id],
                item[columns[1].id],
                item,
              )
            }
            sx={{
              // backgroundColor: bgColor ? bgColor : "inherit",
              backgroundColor:
                item[columns[0].id] === props.selectedImei
                  ? "rgba(3, 201, 215, 0.08)"
                  : "inherit",
              color: textColor,
              ":hover": { color: item.inActive && "#000" },
              "&:last-child td, &:last-child th": { border: 0 },
              cursor: "pointer",
            }}
          >
            {props.isExpandable && (
              <TableCell>
                <IconButton
                  aria-label="expand row"
                  size="small"
                  onClick={() => handleExpandRow(item[columns[0].id], index)}
                >
                  {isExpanded ? (
                    <KeyboardArrowUpIcon />
                  ) : (
                    <KeyboardArrowDownIcon />
                  )}
                </IconButton>
              </TableCell>
            )}
            {columns.map((columnItem, colIndex) => {
              let finalValue;
              if (columnItem.datatype == "num" && item[columnItem.id] != null) {
                if (columnItem.type == "int") {
                  finalValue = item[columnItem.id];
                } else if (columnItem.type == "float") {
                  const rawVal = item[columnItem.id];
                  if (rawVal == null || rawVal == "") {
                    finalValue = null;
                  } else {
                    const num = Number(rawVal);
                    finalValue = Number.isFinite(num) ? num.toFixed(1) : rawVal;
                  }
                } else if (columnItem.type == "perc") {
                  finalValue = item[columnItem.id] + "%";
                } else if (columnItem.type == "coord") {
                  finalValue = item[columnItem.id];
                } else {
                  finalValue = item[columnItem.id];
                }
              } else if (
                columnItem.datatype == "str" &&
                item[columnItem.id] != null
              ) {
                finalValue = item[columnItem.id];
              } else if (item[columnItem.id] === null) {
                finalValue = null;
              } else {
                finalValue = item[columnItem.id];
              }
              let icon =
                props.getIcon &&
                props.getIcon(columnItem.id, item[columnItem.id]);
              return (
                <StyledTableCell
                  sx={
                    columnItem.isParam && {
                      color: props.getColor(item[columnItem.id], columnItem.id),
                      // backgroundColor:
                      //   props.getColor(item[columnItem.id], columnItem.id) + "21",

                      fontWeight: "bold",
                    }
                  }
                  key={colIndex}
                  component="th"
                  scope="item"
                  align={columnItem.align}
                >
                  <Box
                    className={
                      columnItem.type === "coord" ? "coord" : undefined
                    }
                    sx={
                      columnItem.type === "coord"
                        ? {
                            display: "flex",
                            justifyContent: "left",
                            alignItems: "center",
                            textAlign: "left",
                            gap: 1,
                            "&:hover": {
                              cursor: "pointer",
                              color: "blue",
                              textDecoration: "underline",
                              transition: "0.1s",
                            },
                          }
                        : {
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 1,
                            width: "100%", // Take up available cell width instead of expanding table
                          }
                    }
                  >
                    {icon}
                    {columnItem.type === "coord" ? (
                      <Tooltip title="open in Google Maps" arrow followCursor>
                        <a
                          className="hover-link"
                          href={`https://www.google.com/maps/search/?api=1&query=${item.lat},${item.long}`}
                          target="_blank"
                          rel="noreferrer"
                          style={{ textDecoration: "none", color: "inherit" }}
                        >
                          {finalValue}
                        </a>
                      </Tooltip>
                    ) : columnItem.datatype === "str" &&
                      typeof finalValue === "string" &&
                      finalValue.length > 40 ? (
                      <Tooltip title={finalValue} arrow placement="top">
                        <span
                          style={{
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            wordBreak: "break-word",
                          }}
                        >
                          {finalValue}
                        </span>
                      </Tooltip>
                    ) : (
                      finalValue
                    )}
                  </Box>
                </StyledTableCell>
              );
            })}
          </StyledTableRow>
        );

        return (
          <React.Fragment key={index}>
            {props.onRowClick ? (
              <Tooltip
                title="Click to visualize monitor data in a chart"
                arrow
                placement="top"
                followCursor
              >
                {rowContent}
              </Tooltip>
            ) : (
              rowContent
            )}
            {props.isExpandable && isExpanded && (
              <StyledTableRow>
                <StyledTableCell
                  style={{ paddingBottom: 0, paddingTop: 0 }}
                  colSpan={6}
                >
                  <Collapse in={open && isExpanded} timeout="auto">
                    {expandedRowData}
                  </Collapse>
                </StyledTableCell>
              </StyledTableRow>
            )}
          </React.Fragment>
        );
      });

  return (
    <React.Fragment>
      {props.isSearchable && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "end",
          }}
        >
          <TextField
            sx={{ width: { xs: "100%", sm: "500px" }, m: { xs: 2 } }}
            // fullWidth
            id="search-bar"
            variant="outlined"
            helperText={props.searchHelperText && props.searchHelperText}
            // label="Search by IMEI, SIM, Alias or Customer Name"
            value={null}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            placeholder={props.searchPlaceHolder}
            onChange={handleSearch}
          />
          {props.isDownloadable && (
            <LoadingButton
              sx={{ m: "1.2em", width: "max-content", borderRadius: "50px" }}
              variant="contained"
              color="secondary"
              onClick={onDownloadCsv}
              loadingPosition="start"
              loading={false}
              startIcon={<DownloadIcon />}
            >
              Export CSV
            </LoadingButton>
          )}

          <Box sx={{ display: "flex", alignItems: "center", gap: 2, m: 2 }}>
            <Typography variant="body2" color="text.primary">
              Total devices = {summaryText.total}
            </Typography>

            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              {props.getIcon && props.getIcon("status", "ONLINE")}
              <Typography variant="body2" color="text.primary">
                Online = {summaryText.online}
              </Typography>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              {props.getIcon && props.getIcon("status", "OFFLINE")}
              <Typography variant="body2" color="text.primary">
                Offline = {summaryText.offline}
              </Typography>
            </Box>
          </Box>
        </div>
      )}
      <TableContainer
        component={Paper}
        sx={{
          maxWidth: "100%",
          ...(props.tableHeight && { maxHeight: props.tableHeight }),
        }}
      >
        <Table stickyHeader size="small" aria-label="simple table">
          <TableHead>
            <TableRow>
              {props.isExpandable && <StyledTableCell sx={{ width: 40 }} />}
              {columns.map((column) => {
                return (
                  <StyledTableCell
                    key={column.id}
                    sortDirection={orderBy === column.id ? order : false}
                    align={column.align && column.align}
                    sx={{ minWidth: column.minWidth ? column.minWidth : 100 }}
                  >
                    {column.disableSorting ? (
                      <div>
                        <Typography
                          variant="body2"
                          display="inline"
                          fontWeight="600"
                        >
                          {column.label}
                          {column.subLabel && (
                            <Typography
                              variant="caption"
                              component="span"
                              sx={{ fontWeight: "normal" }}
                            >
                              ({column.subLabel})
                            </Typography>
                          )}
                        </Typography>
                      </div>
                    ) : (
                      <TableSortLabel
                        active={orderBy === column.id}
                        direction={orderBy === column.id ? order : "asc"}
                        onClick={() => {
                          handleSortRequest(column.id, column.datatype);
                        }}
                      >
                        <div>
                          <Typography
                            variant="body2"
                            display="inline"
                            fontWeight="600"
                          >
                            {column.label}
                            {column.subLabel && (
                              <Typography
                                variant="caption"
                                component="span"
                                sx={{ fontWeight: "normal" }}
                              >
                                &#160;({column.subLabel})
                              </Typography>
                            )}
                          </Typography>
                        </div>
                      </TableSortLabel>
                    )}
                  </StyledTableCell>
                );
              })}
            </TableRow>
          </TableHead>
          {tableBody}
        </Table>
      </TableContainer>
    </React.Fragment>
  );
}
