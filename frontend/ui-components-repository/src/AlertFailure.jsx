import { Alert, Box, IconButton, Slide } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import React, { useState } from "react";

export default function Alerts(props) {
  const [alertOpen, setAlertOpen] = useState(true);
  const fetchErrorStatus = props.fetchErrorStatus;
  return (
    <Box
      sx={{
        zIndex: "999",
        width: { xs: "70%", sm: "25%" },
        position: "absolute",
        bottom: "3%",
        left: { xs: "18%", sm: "38%" },
      }}
    >
      <Slide direction="up" in={alertOpen} mountOnEnter unmountOnExit>
        <Alert
          variant="outlined"
          severity="error"
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => {
                setAlertOpen(false);
              }}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
          sx={{ mb: 2 }}
        >
          <b>{`Error occured while fetching IMEI data ${fetchErrorStatus}`}</b>
        </Alert>
      </Slide>
    </Box>
  );
}
