import * as React from "react";
import { Box, Button } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import { blue } from "@mui/material/colors";
import MaveLogo from "../images/respirer-logo-new-1024x576-1.png";
import randomPic from "../images/pexels-tara-winstead.jpg";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import Slide from "@mui/material/Slide";
import html2canvas from "html2canvas";
import * as htmlToImage from "html-to-image";
import { toPng, toJpeg, toBlob, toPixelData, toSvg } from "html-to-image";
import { useRef } from "react";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function SimpleDialog(props) {
  const snapshotRef = useRef();
  const { onClose, open, mapSS } = props;
  const logo = localStorage.getItem("logo");
  localStorage.setItem("mave-logo", MaveLogo);
  const localMave = localStorage.getItem("mave-logo");

  const handleClose = () => {
    onClose();
  };

  const handleSaveScreenshot = () => {
    // const canvas = document.getElementById("snapshot-download");
    const snapshotDiv = snapshotRef.current;
    html2canvas(snapshotDiv, {
      useCORS: true, // enable cross-origin resource sharing
      allowTaint: true,
    }) // allow images to be captured from another origin)
      .then((canvas) => {
        const link = document.createElement("a");
        link.download = "screenshot.png";
        link.href = canvas.toDataURL("image/jpeg", 1);
        link.click();
      })
      .catch(function (error) {});

    onClose();
  };

  return (
    <Dialog
      fullScreen
      onClose={handleClose}
      open={open}
      TransitionComponent={Transition}
    >
      <AppBar sx={{ position: "relative" }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={handleClose}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
            Map SnapShot
          </Typography>
          <Button autoFocus color="inherit" onClick={handleSaveScreenshot}>
            save
          </Button>
        </Toolbar>
      </AppBar>

      <div ref={snapshotRef}>
        <Box className="logo-ss" sx={{ display: "flex", mb: 2 }}>
          <img
            src={localMave}
            alt="Mave-Logo"
            // style={{ marginLeft: "24%" }}
            width="200px"
            height="100px"
          />
          <img src={logo} alt="logo" width="300px" />
        </Box>
        <div className="map-ss">
          <img src={mapSS} alt="mapSS" />
        </div>
      </div>
    </Dialog>
  );
}
