import * as React from "react";
import PropTypes from "prop-types";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import {
  Link,
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";

import HomeIcon from "@mui/icons-material/Home";
import MapIcon from "@mui/icons-material/Map";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import SearchIcon from "@mui/icons-material/Search";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import InboxIcon from "@mui/icons-material/Inbox";
import QueryStatsIcon from "@mui/icons-material/QueryStats";
import Popover from "@mui/material/Popover";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import DesktopMacIcon from "@mui/icons-material/DesktopMac";
import AndroidIcon from "@mui/icons-material/Android";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import Grow from "@mui/material/Grow";
import Collapse from "@mui/material/Collapse";

import {
  Avatar,
  Badge,
  Button,
  MenuItem,
  MenuList,
  Paper,
  Switch,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";

import { useRef, useState } from "react";

import styled from "@emotion/styled";

import { useTheme } from "@mui/material/styles";
import { useStore } from "./store/store";
import MaveLogo from "./images/respirer-logo-new-1024x576-1.png";
import AIILSGLogo from "./images/AIILSGLogo.png";
import UNICEFLogo from "./images/UNICEF Logo_ForEveryChild_Cyan_Vertical_RGB__144ppi_ENG.png";
import AiisLogo from "./images/AiisLogo.png";
import MahaLogo from "./images/MahaLogo.png";
import UmicoreLogo from "./images/UmicoreLogo.png";
import UnicefLogo from "./images/UnicefLogo.png";
import ChintanLogo from "./images/chintan_logo.png";
import WellSpurLogo from "./images/wellspur_logo.jpg";
import logoBig from "./images/logo_big.png";
import camfilLogo from "./images/camfil-logo.svg";
import oneavantedemoLogo from "./images/oneavantedemo.png";

import { requestForToken } from "./firebase";

const drawerWidth = 260;

const Icons = styled(Box)({
  display: "flex",
  alignItems: "center",
});

const MaterialUISwitch = styled(Switch)(({ theme }) => ({
  width: 62,
  height: 34,
  padding: 7,
  "& .MuiSwitch-switchBase": {
    margin: 1,
    padding: 0,
    transform: "translateX(6px)",
    transition: theme.transitions.create(["transform"], {
      duration: theme.transitions.duration.shortest,
    }),
    "&.Mui-checked": {
      color: "#fff",
      transform: "translateX(22px)",
      "& .MuiSwitch-thumb": {
        backgroundColor: "#003892",
      },
      "& .MuiSwitch-thumb:before": {
        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
          "#fff",
        )}" d="M4.2 2.5l-.7 1.8-1.8.7 1.8.7.7 1.8.6-1.8L6.7 5l-1.9-.7-.6-1.8zm15 8.3a6.7 6.7 0 11-6.6-6.6 5.8 5.8 0 006.6 6.6z"/></svg>')`,
      },
      "& + .MuiSwitch-track": {
        opacity: 1,
        backgroundColor: "#8796A5",
      },
    },
  },
  "& .MuiSwitch-thumb": {
    backgroundColor: "#001e3c",
    width: 32,
    height: 32,
    transition: theme.transitions.create(["background-color"], {
      duration: theme.transitions.duration.shortest,
    }),
    "&::before": {
      content: "''",
      position: "absolute",
      width: "100%",
      height: "100%",
      left: 0,
      top: 0,
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center",
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
        "#fff",
      )}" d="M9.305 1.667V3.75h1.389V1.667h-1.39zm-4.707 1.95l-.982.982L5.09 6.072l.982-.982-1.473-1.473zm10.802 0L13.927 5.09l.982.982 1.473-1.473-.982-.982zM10 5.139a4.872 4.872 0 00-4.862 4.86A4.872 4.872 0 0010 14.862 4.872 4.872 0 0014.86 10 4.872 4.872 0 0010 5.139zm0 1.389A3.462 3.462 0 0113.471 10a3.462 3.462 0 01-3.473 3.472A3.462 3.462 0 016.527 10 3.462 3.462 0 0110 6.528zM1.665 9.305v1.39h2.083v-1.39H1.666zm14.583 0v1.39h2.084v-1.39h-2.084zM5.09 13.928L3.616 15.4l.982.982 1.473-1.473-.982-.982zm9.82 0l-.982.982 1.473 1.473.982-.982-1.473-1.473zM9.305 16.25v2.083h1.389V16.25h-1.39z"/></svg>')`,
    },
  },
  "& .MuiSwitch-track": {
    opacity: 1,
    backgroundColor: "#aab4be",
    borderRadius: 20 / 2,
    transition: theme.transitions.create(["background-color", "opacity"], {
      duration: theme.transitions.duration.shortest,
    }),
  },
}));

const DEFAULT_PROFILE_AVATAR_SRC = "";

const getProfileAvatarSrc = (username, logo) => {
  switch (username) {
    case "camfil":
      return camfilLogo;
    case "oneavantedemo":
      return oneavantedemoLogo;
    case "rcues":
      return UmicoreLogo;
    default:
      return logo || DEFAULT_PROFILE_AVATAR_SRC;
  }
};

export default function ResponsiveDrawer(props) {
  const theme = useTheme();
  const isLightMode = theme.palette.mode === "light";
  const glassSurfaceStyles = {
    backgroundColor: isLightMode
      ? "rgba(255, 255, 255, 0.8)"
      : "rgba(30, 41, 59, 0.85)",
    backdropFilter: "blur(12px)",
    borderColor: theme.palette.divider,
  };

  const activeAppTitle = useStore((state) => state.activeAppTitle);
  const themeMode = useStore((state) => state.themeMode);
  const setThemeMode = useStore((state) => state.setThemeMode);

  React.useEffect(() => {
    setView(activeAppTitle);
  });

  const { window } = props;
  const [mobileOpen, setMobileOpen] = useState(false);
  const [view, setView] = useState("Home");
  const [analyticsView, setAnalyticsView] = useState("Regression Analytics");
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userButtonRef = useRef(null);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleChange = (event, nextView) => {
    if (nextView !== null) {
      setView(nextView);
    }
    if (nextView != "Analytics") {
      setAnalyticsView("Regression Analytics");
    }
  };

  const handleAnalyticsAppChange = (event, nextApp) => {
    if (nextApp !== null) {
      setAnalyticsView(nextApp);
    }
  };

  const container =
    window !== undefined ? () => window().document.body : undefined;

  const handlePopoverOpen = () => {
    setUserMenuOpen(true);
  };
  const handlePopoverClose = () => {
    setUserMenuOpen(false);
  };

  const handleLogout = async (event) => {
    try {
      const email = props.email || localStorage.getItem("email");
      const password = localStorage.getItem("password");
      const fcmToken = await requestForToken();

      if (fcmToken && email && password) {
        const formData = new FormData();
        formData.append("email", email);
        formData.append("password", password);
        formData.append("fcm_token", fcmToken);
        formData.append("device_type", "browser");

        await fetch("https://api.yourdomain.com/adp/v4/sync-logout-token", {
          method: "POST",
          body: formData,
        });
      }
    } catch (error) {}

    localStorage.clear();
    if (typeof globalThis !== "undefined" && globalThis.location) {
      globalThis.location.replace("/mave-datahub");
    }
  };

  const location = useLocation();
  const urlParams = new URLSearchParams(location.search);
  const platform = urlParams.get("platform");

  const drawerListsData = [
    {
      linkTo: "/home",
      text: "Home",
      icon: <HomeIcon fontSize="small" sx={{ mr: 2 }} />,
    },
    {
      linkTo: "/map",
      text: "Map",
      icon: <MapIcon fontSize="small" sx={{ mr: 2 }} />,
    },
    {
      linkTo: "/analytics",
      text: "Analytics",
      icon: <AnalyticsIcon fontSize="small" sx={{ mr: 2 }} />,
      subMenu: (
        <MenuList sx={{ ml: 3 }}>
          <ToggleButtonGroup
            orientation="vertical"
            value={analyticsView}
            exclusive
            onChange={handleAnalyticsAppChange}
          >
            <ToggleButton
              value="Regression Analytics"
              sx={{
                justifyContent: "flex-start",
                width: "200px",
                padding: "6px 12px",
                borderRadius: "10px",
                border: 0,
                "&.Mui-selected": {
                  transition: "0.3s",
                  backgroundColor: "rgba(3, 201, 215, 0.15)",
                  fontWeight: "600",
                  color: "primary.main",
                  backdropFilter: "blur(4px)",
                  borderRight: "4px solid #03C9D7",
                  "&:hover": {
                    backgroundColor: "rgba(3, 201, 215, 0.25)",
                  },
                },
                "&:hover": {
                  backgroundColor: "rgba(218, 218, 218, 0.4)",
                  transition: "0.3s",
                },
              }}
              size="small"
            >
              <Typography
                variant="body2"
                sx={{
                  width: "200px",
                  textAlign: "left",
                  pl: 1,
                  textTransform: "none",
                  fontSize: "13px",
                }}
              >
                Regression Analytics
              </Typography>
            </ToggleButton>

            <ToggleButton
              sx={{
                justifyContent: "flex-start",
                width: "200px",
                padding: "6px 12px",
                borderRadius: "10px",
                border: 0,
                "&.Mui-selected": {
                  transition: "0.3s",
                  backgroundColor: "rgba(3, 201, 215, 0.15)",
                  fontWeight: "600",
                  color: "primary.main",
                  backdropFilter: "blur(4px)",
                  borderRight: "4px solid #03C9D7",
                  "&:hover": {
                    backgroundColor: "rgba(3, 201, 215, 0.25)",
                  },
                },
                "&:hover": {
                  backgroundColor: "rgba(218, 218, 218, 0.4)",
                  transition: "0.3s",
                },
              }}
              value="Calendar Heatmap"
              size="small"
            >
              <Link
                to="/analytics/calendar-heatmap"
                className="link"
                style={{ width: "100%", textAlign: "left" }}
              >
                <Typography
                  variant="body2"
                  sx={{ pl: 1, textTransform: "none", fontSize: "13px" }}
                >
                  Calendar Heatmap
                </Typography>
              </Link>
            </ToggleButton>

            <ToggleButton
              sx={{
                justifyContent: "flex-start",
                width: "200px",
                padding: "6px 12px",
                borderRadius: "10px",
                border: 0,
                "&.Mui-selected": {
                  transition: "0.3s",
                  backgroundColor: "rgba(3, 201, 215, 0.15)",
                  fontWeight: "600",
                  color: "primary.main",
                  backdropFilter: "blur(4px)",
                  borderRight: "4px solid #03C9D7",
                  "&:hover": {
                    backgroundColor: "rgba(3, 201, 215, 0.25)",
                  },
                },
                "&:hover": {
                  backgroundColor: "rgba(218, 218, 218, 0.4)",
                  transition: "0.3s",
                },
              }}
              value="Compare"
              size="small"
            >
              <Link
                to="/analytics/comparative-analysis"
                className="link"
                style={{ width: "100%", textAlign: "left" }}
              >
                <Typography
                  variant="body2"
                  sx={{ pl: 1, textTransform: "none", fontSize: "13px" }}
                >
                  Compare
                </Typography>
              </Link>
            </ToggleButton>
          </ToggleButtonGroup>
        </MenuList>
      ),
    },
    {
      linkTo: "/download",
      text: "Download",
      icon: <CloudDownloadIcon fontSize="small" sx={{ mr: 2 }} />,
    },
    {
      linkTo: "/device-management",
      text: "Device Info",
      icon: <DesktopMacIcon fontSize="small" sx={{ mr: 2 }} />,
    },
  ];

  const drawer = (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      <Toolbar
        sx={{ padding: "16px 20px 8px 20px", background: "transparent" }}
      >
        <Link to="/home" className="link" style={{ width: "100%" }}>
          <Box display="flex" justifyContent="center" mt={2} mb={1}>
            <img
              src={MaveLogo}
              alt="Mave-Logo"
              width="200px"
              height="100px"
            />
          </Box>
        </Link>
      </Toolbar>
      {/* <Divider /> */}
      <List>
        {drawerListsData.map((item) => {
          const { linkTo, text, icon, subMenu } = item;
          return (
            <Link key={text} to={linkTo} className="link">
              <ListItem>
                <ToggleButtonGroup
                  orientation="vertical"
                  value={view}
                  exclusive
                  onChange={handleChange}
                >
                  <ToggleButton
                    value={text}
                    sx={{
                      justifyContent: "space-between",
                      width: "210px",
                      padding: "8px 16px",
                      borderRadius: "10px",
                      border: 0,
                      "&.Mui-selected": {
                        transition: "0.3s",
                        backgroundColor: "rgba(3, 201, 215, 0.15)", // Semi-transparent primary
                        fontWeight: "600",
                        color: "primary.main", // Maintain primary text color instead of white for glass look
                        backdropFilter: "blur(4px)",
                        borderRight: "4px solid #03C9D7", // Accent stroke on the side
                        "&:hover": {
                          backgroundColor: "rgba(3, 201, 215, 0.25)",
                        },
                      },
                      "&:hover": {
                        backgroundColor: isLightMode
                          ? "rgba(229, 229, 229, 1)"
                          : "rgba(220, 220, 220, 0.15)", // transparent hover
                        transition: "0.3s",
                      },
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      {icon}
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: "inherit", fontSize: "14px" }}
                      >
                        {text}
                      </Typography>
                    </Box>
                    {subMenu &&
                      (view === text ? <ExpandLess /> : <ExpandMore />)}
                  </ToggleButton>
                  <Collapse in={view === text} timeout="auto" unmountOnExit>
                    {subMenu}
                  </Collapse>
                </ToggleButtonGroup>
              </ListItem>
            </Link>
          );
        })}
      </List>
      {props.logo && (
        <div>
          {props.username !== "rcues" &&
            props.username !== "camfil" &&
            props.username !== "oneavantedemo" && (
              <Box
                mt={3}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                }}
                className="Logo"
              >
                <img src={props.logo} alt="logo" width="170px" />
              </Box>
            )}
          {props.username === "rcues" && (
            <Box
              mt={1}
              mb={3}
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "15px",
              }}
              className="Logo"
            >
              <img src={UmicoreLogo} alt="UmicoreLogo" width="110px" />
              <img src={MahaLogo} alt="MahaLogo" width="100px" />
              <img src={AiisLogo} alt="AiisLogo" width="90px" />
              <img src={UnicefLogo} alt="UnicefLogo" width="100px" />
            </Box>
          )}
          {props.username === "camfil" && (
            <Box
              mt={3}
              mb={3}
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "25px",
              }}
              className="Logo"
            >
              <img src={camfilLogo} alt="camfilLogo" width="130px" />
              <img src={logoBig} alt="logoRespirer-2" width="80px" />
            </Box>
          )}
          {props.username === "oneavantedemo" && (
            <Box
              mt={3}
              mb={3}
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "25px",
              }}
              className="Logo"
            >
              <img
                src={oneavantedemoLogo}
                alt="oneavantedemoLogo"
                width="130px"
              />
            </Box>
          )}
        </div>
      )}

      {!props.logo && props.username === "yes" && (
        <Box
          mt={1}
          mb={3}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "15px",
          }}
          className="Logo"
        >
          <img src={ChintanLogo} alt="ChintanLogo" width="130px" />
          <img src={WellSpurLogo} alt="WellSpurLogo" width="130px" />
        </Box>
      )}
      {}
    </Box>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        color="default"
        elevation={0}
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          ...glassSurfaceStyles,
          borderBottom: `1px solid ${theme.palette.divider}`,
          boxShadow: "none",
        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          {props.projectTitle && (
            <Box sx={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <Typography color="text.secondary" variant="subtitle1">
                {props.projectTitle}
              </Typography>
            </Box>
          )}
          <IconButton
            sx={{
              mr: 2,
              display: { sm: "flex", xs: "none" },
            }}
            variant="h6"
            noWrap
            component="div"
          >
            {/* <SearchIcon sx={{ color: "#949DB2" }} /> */}
          </IconButton>

          {/* All the icons in the appbar except the above two*/}
          <Icons>
            <MaterialUISwitch
              checked={themeMode === "dark"}
              onChange={(event) =>
                setThemeMode(event.target.checked ? "dark" : "light")
              }
              inputProps={{ "aria-label": "Toggle theme mode" }}
              sx={{ mr: 1.5 }}
            />
            {}

            <Button
              ref={userButtonRef}
              sx={{ textTransform: "none" }}
              onClick={handlePopoverOpen}
            >
              <Box sx={{ display: "flex", gap: "10px", alignItems: "center" }}>
                {}
                <Box
                  sx={{ display: "flex", gap: "10px", alignItems: "center" }}
                >
                  <Typography color="text.secondary" variant="subtitle1">
                    Hi,
                  </Typography>
                  <Typography
                    color="text.secondary"
                    sx={{ fontWeight: "bold" }}
                    variant="subtitle1"
                  >
                    {props.username}
                  </Typography>
                </Box>
              </Box>
            </Button>
          </Icons>
          <Popover
            open={userMenuOpen}
            anchorEl={userMenuOpen ? userButtonRef.current : null}
            onClose={handlePopoverClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            TransitionComponent={Grow}
            transitionDuration={500}
          >
            <Paper>
              <List sx={{ padding: "30px" }}>
                <Box className="popover-title" component="div">
                  <Typography variant="h6">User Profile</Typography>
                </Box>
                <Box>
                  <Box
                    className="popover-user-details"
                    component="div"
                    mt="20px"
                    mb="20px"
                  >
                    <Box
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                      alignContent="center"
                    >
                      <Avatar
                        sx={{
                          width: 100,
                          height: 100,
                          "& img": {
                            objectFit:
                              getProfileAvatarSrc(props.username, props.logo) ==
                              DEFAULT_PROFILE_AVATAR_SRC
                                ? "fill"
                                : "contain",
                          },
                        }}
                        mr={3}
                        src={getProfileAvatarSrc(props.username, props.logo)}
                      />
                      <Box ml="16px">
                        <Typography variant="h6">{props.username}</Typography>
                        <Typography variant="caption">
                          {/* props.userRole */}
                          administrator
                        </Typography>
                        <Box display="flex">
                          <MailOutlineIcon
                            fontSize="small"
                            sx={{ mr: "5px" }}
                          />
                          <Typography variant="subtitle2" color="#5a5a5a">
                            {props.email}
                            {/* waatavaran@urbansciences.in */}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                  <Divider />
                  {/* list items My profile, Inbox */}
                  {}
                </Box>
                <Button
                  variant="contained"
                  color="primary"
                  size="medium"
                  sx={{
                    width: "100%",
                    margin: "15px 0 0",
                    color: "#ffffff",
                  }}
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </List>
            </Paper>
          </Popover>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              ...glassSurfaceStyles,
              borderRight: `1px solid ${theme.palette.divider}`,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              ...glassSurfaceStyles,
              borderRight: `1px solid ${theme.palette.divider}`,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
    </Box>
  );
}
