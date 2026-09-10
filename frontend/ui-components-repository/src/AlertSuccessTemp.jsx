import { Alert, Box, IconButton, Slide } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import React, { useState } from "react";

export default function AlertSuccessTemp(props) {
  const { bottom, left, open, widthPerc, duration } = props;
  const [alertOpen, setAlertOpen] = useState(open);
  setTimeout(() => setAlertOpen(false), duration ? duration : 5000);

  //   setGetTestSuccessAlertOpen(true);
  //   setTimeout(() => setGetTestSuccessAlertOpen(false), 5000);
  return (
    <Box
      sx={{
        zIndex: "999",
        width: { xs: "70%", sm: widthPerc ? widthPerc : "25%" },
        position: "absolute",
        bottom: bottom ? bottom : "3%",
        left: left ? left : { xs: "18%", sm: "38%" },
        // bottom: "-14%",
        // left: "55%",
      }}
    >
      <Slide direction="up" in={alertOpen} mountOnEnter unmountOnExit>
        <Alert
          severity="success"
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
          <b>{props.successMsg}</b>
        </Alert>
      </Slide>
    </Box>
  );
}
