import React, { useState, useEffect } from "react";
import MfeFallback from "../components/MfeFallback";
import { loadRemote } from "../utils/loadRemote";

const Map = React.lazy(() =>
  loadRemote(
    "map",
    "https://yourfrontend-domain.com/monitors-map/remoteEntry.js",
    "./Map",
  ).then((mod) => ({ default: mod.default ?? mod })),
);
import fetchMonitorsMapData from "../services/map/FetchMonitorsMapData";
import fetchMarkerDetailsChartData from "../services/map/FetchMarkerDetailsChartData";
import { useStore } from "../store/store";
import PopupDetails from "../components/PopupDetails";
import { getUnclusteredCircleColor } from "../utils/getUnclusteredCircleColor";
import { fetchNewMapData } from "../services/map/fetchNewMapData";

export default function MapPage({
  username,
  api_key,
  // mapGeoJsonData,
  // mapGeoJsonFetchStatus,
}) {
  const geoJsonURL = `https://api.yourdomain.com/adp/v4/getMapImei/username/${username}`;

  // use global state variable for userConfig data from zustand.
  const userConfigData = useStore((state) => state.userConfig);

  // global state from store for activeAppTitle when app is changed in sidebar drawer. This will prevent active app to change to initial value on reload
  const setActiveAppTitle = useStore((state) => state.setActiveAppTitle);

  useEffect(() => {
    setActiveAppTitle("Map");
  }, [setActiveAppTitle]);

  let mapToday = new Date();
  const day = ("0" + mapToday.getUTCDate()).slice(-2);
  const month = ("0" + (mapToday.getUTCMonth() + 1)).slice(-2); // getUTCMonth() returns month from 0 to 11
  const year = mapToday.getUTCFullYear();
  const fullDate = `${year}-${month}-${day}`;

  // setting state from child controller component
  const [avgTime, setAvgTime] = useState("");
  const [pollutant, setPollutant] = useState("pm2.5cnc");
  const [timeButton, setTimeButton] = useState("24hrs");
  const [split, setSplit] = useState();
  const [durationStartDate, setDurationStartDate] = useState(fullDate);
  const [durationEndDate, setDurationEndDate] = useState(fullDate);
  const [mapStartTime, setMapStartTime] = useState("T00:00");
  const [mapEndTime, setMapEndTime] = useState("T23:59");
  const [hoursOrDays, setHoursOrDays] = useState("hh");
  const [hoursDaysValue, setHoursDaysValue] = useState("24");
  const [clusterChecked, setClusterChecked] = useState(true);
  const [mapGeoJsonData, setMapGeoJsonData] = useState([]);
  const [mapGeoJsonFetchStatus, setMapGeoJsonFetchStatus] = useState({
    loading: true,
    error: false,
    errorMsg: null,
  });
  const [summaryText, setSummaryText] = useState("");

  useEffect(() => {
    async function executeAsyncFunction() {
      setMapGeoJsonFetchStatus({
        loading: true,
        error: false,
        errorMsg: null,
      });
      try {
        const geoJsonFinalRes = await fetchNewMapData(geoJsonURL);
        setMapGeoJsonFetchStatus((prevStatus) => ({
          ...prevStatus,
          loading: false,
        }));
        setMapGeoJsonData(geoJsonFinalRes);

        let devices = geoJsonFinalRes.features;
        let totalDevices = devices.length;
        let onlineDevices = devices.filter(
          (d) => d.properties.status === "ONLINE",
        ).length;
        let offlineDevices = totalDevices - onlineDevices;
        setSummaryText(
          `Total Devices: ${totalDevices} | Online: ${onlineDevices} | Offline: ${offlineDevices}`,
        );
      } catch (error) {
        setMapGeoJsonFetchStatus({
          loading: false,
          error: true,
          errorMsg: error.message,
        });
      }
    }
    executeAsyncFunction();
  }, []);

  return (
    <React.Suspense fallback={<MfeFallback />}>
      <Map
        username={username}
        mapGeoJsonData={mapGeoJsonData}
        mapGeoJsonFetchStatus={mapGeoJsonFetchStatus}
        // onSelectParams={handleSelectParams}
        fetchMarkerDetailsChartData={fetchMarkerDetailsChartData}
        initialMapCenter={userConfigData.map_center}
        initialMapZoom={userConfigData.map_zoom_level}
        activeApp="Map"
        PopupDetailsComponent={PopupDetails}
        dropDownParamsList={userConfigData.priority_metrics}
        getUnclusteredCircleColor={getUnclusteredCircleColor}
        summaryText={summaryText}
      />
    </React.Suspense>
  );
}
