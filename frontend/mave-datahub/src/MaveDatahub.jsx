import React, { useEffect, useState } from "react";
import MfeFallback from "./components/MfeFallback";
import "./index.css";
import Sidebar from "./Sidebar";
import Box from "@mui/material/Box";
// import Login from "login/Login";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
// import { StoreProvider } from "store/store";
import { Typography } from "@mui/material";
import fetchMonitorsMapData from "./services/map/FetchMonitorsMapData";
import HomePage from "./pages/HomePage";
// import MapPage from "./pages/MapPage";
import { useStore } from "./store/store";
import { loadRemote } from "./utils/loadRemote";
import { initGA, trackPageView } from "./googleAnalytics";
import NotificationSyncer from "./NotificationSyncer";

// ---------------------------------------------------------------------------
// DYNAMIC REMOTE COMPONENTS
// Each React.lazy below defers loading that remote's remoteEntry.js until the
// component is first about to render. Nothing is fetched at startup.
// ---------------------------------------------------------------------------

// ui-components-repository — only fetched when the loading spinner is needed
// (i.e. while userConfig is still being fetched after login).
const LoadingSpinner = React.lazy(() =>
  loadRemote(
    "remote", // window.remote — the global scope name
    "https://yourfrontend-domain.com/ui-components-repository/remoteEntry.js",
    "./LoadingSpinner", // the key in that remote's `exposes` config
  ).then((mod) => ({ default: mod.default ?? mod })),
);

// auth-app — only fetched when the user is NOT logged in.
const Login = React.lazy(() =>
  loadRemote(
    "login",
    "https://yourfrontend-domain.com/auth-app/remoteEntry.js",
    "./Login",
  ).then((mod) => ({ default: mod.default ?? mod })),
);

const DownloadPage = React.lazy(() => import("./pages/DownloadPage"));
const AnalyticsPage = React.lazy(() => import("./pages/AnalyticsPage"));
const MapPage = React.lazy(() => import("./pages/MapPage"));
const ComparisonPage = React.lazy(() => import("./pages/ComparisonPage"));
const DevicesPage = React.lazy(() => import("./pages/DevicesPage"));
const CalendarHeatmapPage = React.lazy(
  () => import("./pages/CalendarHeatmapPage"),
);
const PrivacyPolicyPage = React.lazy(() => import("./pages/PrivacyPolicyPage"));
import ReactGA from "react-ga4";

export default function MaveDatahub(props) {
  const user = localStorage.getItem("user");
  const logo = localStorage.getItem("logo");
  const email = localStorage.getItem("email");
  const password = localStorage.getItem("password");

  const api_key = props.api_key || localStorage.getItem("api_key");
  const username = props.username || localStorage.getItem("username");

  const userConfigURL = `https://api.yourdomain.com/adp/v4/user_config/${username}`;

  // get these global state variables and setters from Zustand
  // We initialize and set the userConfigData here so that we can use in every other component and also since Mave Datahub will always get rendered initially, thus providing this state to all other MFE components.
  const setUserConfigData = useStore((state) => state.setUserConfigData);
  const userConfigData = useStore((state) => state.userConfig);

  useEffect(() => {
    // log user out if user is present but password is not present in localstorage
    if (username && !localStorage.getItem("password")) {
      localStorage.removeItem("user");
      localStorage.removeItem("logo");
      localStorage.removeItem("email");
      localStorage.removeItem("api_key");
      localStorage.removeItem("username");
      window.location.href = "/mave-datahub";
    }
    const fetchUserConfig = async () => {
      try {
        const response = await fetch(userConfigURL);
        const dynamicMetricsRes = await response.json();
        setUserConfigData(dynamicMetricsRes);
      } catch (err) {}
    };
    fetchUserConfig();

    // Google Analytics
    initGA();
    trackPageView();
  }, []);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const platform = urlParams.get("platform");

    if (platform === "mobile_app") {
      ReactGA.set({
        user_properties: {
          platform: "mobile_app",
        },
      });
    }
  }, []);

  const App = () => {
    const location = useLocation();
    const isPrivacyPolicy = location.pathname === "/privacy-policy";

    return (
      <Box>
        {user && !isPrivacyPolicy && (
          <NotificationSyncer email={email} password={password} />
        )}
        {isPrivacyPolicy ? null : user ? (
          <Sidebar
            username={username}
            logo={logo}
            email={email}
            projectTitle={userConfigData?.project_title}
          />
        ) : (
          <React.Suspense fallback={<MfeFallback />}>
            <Login />
          </React.Suspense>
        )}
      </Box>
    );
  };

  const NotFound = () => (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Typography variant="h2">Not Found</Typography>
    </Box>
  );

  const UserConfigLoadingSpinner = () => {
    <Box
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
      }}
    >
      <LoadingSpinner />
    </Box>;
  };

  return (
    <BrowserRouter basename="/mave-datahub">
      <App />
      <Routes>
        <Route
          path="/"
          element={
            user &&
            (userConfigData.map_center ? (
              <HomePage />
            ) : (
              <UserConfigLoadingSpinner />
            ))
          }
        />
        <Route
          path="/mave-datahub"
          element={
            user &&
            (userConfigData.map_center ? (
              <HomePage />
            ) : (
              <UserConfigLoadingSpinner />
            ))
          }
        />
        <Route
          path="/home"
          element={
            user &&
            (userConfigData.map_center ? (
              <HomePage />
            ) : (
              <UserConfigLoadingSpinner />
            ))
          }
        />
        <Route
          path="/map"
          element={
            user &&
            (userConfigData.map_center ? (
              <React.Suspense fallback={<MfeFallback />}>
                <MapPage username={username} api_key={api_key} />
              </React.Suspense>
            ) : (
              <UserConfigLoadingSpinner />
            ))
          }
        />
        <Route
          path="/download"
          element={
            user &&
            (userConfigData.all_metrics ? (
              <React.Suspense fallback={<MfeFallback />}>
                <DownloadPage username={username} api_key={api_key} />
              </React.Suspense>
            ) : (
              <UserConfigLoadingSpinner />
            ))
          }
        />
        <Route
          path="/analytics"
          element={
            user && (
              <React.Suspense fallback={<MfeFallback />}>
                <AnalyticsPage username={username} />
              </React.Suspense>
            )
          }
        />
        <Route
          path="/analytics/calendar-heatmap"
          element={
            user &&
            (userConfigData.all_metrics ? (
              <React.Suspense fallback={<MfeFallback />}>
                <CalendarHeatmapPage username={username} />
              </React.Suspense>
            ) : (
              <UserConfigLoadingSpinner />
            ))
          }
        />
        <Route
          path="/analytics/comparative-analysis"
          element={
            user && (
              <React.Suspense fallback={<MfeFallback />}>
                <ComparisonPage username={username} />
              </React.Suspense>
            )
          }
        />
        <Route
          path="/device-management"
          element={
            user &&
            (userConfigData.all_metrics ? (
              <React.Suspense fallback={<MfeFallback />}>
                <DevicesPage username={username} />
              </React.Suspense>
            ) : (
              <UserConfigLoadingSpinner />
            ))
          }
        />
        <Route
          path="/privacy-policy"
          element={
            <React.Suspense fallback={<MfeFallback />}>
              <PrivacyPolicyPage />
            </React.Suspense>
          }
        />
        <Route path="*" element={user && <NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
