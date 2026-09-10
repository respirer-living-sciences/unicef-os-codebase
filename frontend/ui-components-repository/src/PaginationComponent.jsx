import React from "react";
import {
  Box,
  Button,
  Stack,
  Typography,
  IconButton,
  Tooltip,
} from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

export default function PaginationBar({ page, totalPages, onChange }) {
  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    onChange(newPage);
  };

  // Smart range (shows nearby pages + ellipsis)
  const getPageNumbers = () => {
    const delta = 1;
    const range = [];
    for (
      let i = Math.max(1, page - delta);
      i <= Math.min(totalPages, page + delta);
      i++
    ) {
      range.push(i);
    }
    return range;
  };

  return (
    <Box
      display="flex"
      justifyContent="flex-end"
      alignItems="center"
      my={2}
      mx={1}
    >
      <Stack direction="row" spacing={1} alignItems="center">
        {/* Prev Icon Button */}
        <Tooltip title="Previous Page">
          <span>
            <IconButton
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
              sx={{
                color: page === 1 ? "text.disabled" : "primary.main",
                border: "1px solid",
                borderColor: page === 1 ? "divider" : "rgba(0,0,0,0.12)",
                borderRadius: "10px",
                "&:hover": {
                  backgroundColor: (theme) => theme.palette.action.hover,
                },
              }}
            >
              <ArrowBackIosNewIcon fontSize="small" />
            </IconButton>
          </span>
        </Tooltip>

        {/* First Page */}
        {page > 2 && (
          <>
            <Button
              variant="outlined"
              size="small"
              onClick={() => handlePageChange(1)}
              sx={{ borderRadius: "10px", fontWeight: 500 }}
            >
              1
            </Button>
            {page > 3 && (
              <Typography variant="body2" color="text.secondary">
                ...
              </Typography>
            )}
          </>
        )}

        {/* Middle Pages */}
        {getPageNumbers().map((p) => (
          <Button
            key={p}
            variant={p === page ? "contained" : "outlined"}
            color={p === page ? "primary" : "inherit"}
            size="small"
            onClick={() => handlePageChange(p)}
            sx={{
              minWidth: 36,
              borderRadius: "10px",
              fontWeight: p === page ? 600 : 500,
              transition: "all 0.2s ease",
            }}
          >
            {p}
          </Button>
        ))}

        {/* Last Page */}
        {page < totalPages - 1 && (
          <>
            {page < totalPages - 2 && (
              <Typography variant="body2" color="text.secondary">
                ...
              </Typography>
            )}
            <Button
              variant="outlined"
              size="small"
              onClick={() => handlePageChange(totalPages)}
              sx={{ borderRadius: "10px", fontWeight: 500 }}
            >
              {totalPages}
            </Button>
          </>
        )}

        {/* Next Icon Button */}
        <Tooltip title="Next Page">
          <span>
            <IconButton
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPages}
              sx={{
                color: page === totalPages ? "text.disabled" : "primary.main",
                border: "1px solid",
                borderColor:
                  page === totalPages ? "divider" : "rgba(0,0,0,0.12)",
                borderRadius: "10px",
                "&:hover": {
                  backgroundColor: (theme) => theme.palette.action.hover,
                },
              }}
            >
              <ArrowForwardIosIcon fontSize="small" />
            </IconButton>
          </span>
        </Tooltip>
      </Stack>
    </Box>
  );
}
