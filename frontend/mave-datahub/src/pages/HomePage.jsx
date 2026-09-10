import React, { useState, useEffect } from "react";
import MfeFallback from "../components/MfeFallback";
import { loadRemote } from "../utils/loadRemote";

const HomeApp = React.lazy(() =>
  loadRemote(
    "home",
    "https://yourfrontend-domain.com/outline/remoteEntry.js",
    "./HomeApp",
  ).then((mod) => ({ default: mod.default ?? mod })),
);
import fetchTableData from "../services/outline/fetchTableData";
import fetchChartData from "../services/outline/fetchChartData";
import fetchMonitorsMapData from "../services/map/FetchMonitorsMapData";
import fetchMarkerDetailsChartData from "../services/map/FetchMarkerDetailsChartData";
import { useStore } from "../store/store";
import getColor from "../utils/getColorForTable";
import PopupDetails from "../components/PopupDetails";
import { getUnclusteredCircleColor } from "../utils/getUnclusteredCircleColor";
import getMapIMEIData from "../services/general/getMapImeiData";
// import fetchOutlineMarkersData from "../services/outline/fetchOutlineMarkersData";
// import fetchLastMinuteData from "../services/outline/fetchLastMinuteData";

export default function HomePage(props) {
  const api_key = props.api_key || localStorage.getItem("api_key");
  const username = props.username || localStorage.getItem("username");
  const password = props.password || localStorage.getItem("password");
  const email = props.email || localStorage.getItem("email");
  let mapToday = new Date();
  const day = ("0" + mapToday.getUTCDate()).slice(-2);
  const month = ("0" + (mapToday.getUTCMonth() + 1)).slice(-2); // getUTCMonth() returns month from 0 to 11
  const year = mapToday.getUTCFullYear();
  const fullDate = `${year}-${month}-${day}`;

  const imeiURL = `https://api.yourdomain.com/adp/v4/check_user_imei/user/${username}`;

  const userConfigURL = `https://api.yourdomain.com/adp/v4/user_config/${username}`;

  // const geoJsonURL = `https://api.yourdomain.com/v4/getMapImei/username/${username}`;
  const geoJsonURL = `https://api.yourdomain.com/adp/v4/getMapImei/username/${username}`;

  const userConfigData = useStore((state) => state.userConfig);

  // global state from store for activeAppTitle when app is changed in sidebar drawer. This will prevent active app to change to initial value on reload
  const setActiveAppTitle = useStore((state) => state.setActiveAppTitle);

  let intervalUnit = userConfigData?.data_interval?.unit;
  let intervalValue = userConfigData?.data_interval?.value;

  setActiveAppTitle("Home");

  let outLineTableHeadCells = [
    {
      id: "imei",
      label: "IMEI",
      minWidth: 120,
      datatype: "num",
      type: "normal",
    },
    {
      id: "locality",
      label: "Locality",
      minWidth: 250,
      align: "left",
      datatype: "str",
      type: "normal",
    },
    {
      id: "last_updated",
      label: "last updated",
      minWidth: 200,
      align: "left",
      datatype: "str",
    },
    ...userConfigData.priority_metrics.map((item) => ({
      id: item.metric,
      label: item.label,
      subLabel: item.unit,
      datatype: "num",
      minWidth: 100,
      align: "left",
      isParam: true,
      type: "float",
    })),
  ];

  const [tableData, setTableData] = useState([]);
  const [newSelectedImei, setNewSelectedImei] = useState();
  const [newSelectedLocality, setNewSelectedLocality] = useState();
  const [outlineDuration, setOutlineDuration] = useState("today");
  const [outlineChartInterval, setOutlineChartInterval] = useState({
    unit: intervalUnit || "hh",
    value: intervalValue || "1",
  });
  const [outlineChartData, setOutlineChartData] = useState([]);
  const [tableDataFetchStatus, setTableDataFetchStatus] = useState({
    loading: true,
    error: false,
    errorMsg: null,
  });
  const [outlineChartFetchStatus, setOutlineChartFetchStatus] = useState({
    loading: true,
    error: false,
    errorMsg: null,
  });
  const [customDurationSelected, setCustomDurationSelected] = useState();
  const [customDurationSubmitted, setCustomDurationSubmitted] = useState();
  const [finalCustomStartDate, setFinalCustomStartDate] = useState();
  const [finalCustomEndDate, setFinalCustomEndDate] = useState();
  const [tablePage, setTablePage] = useState(1);
  const [totalMonitorsLength, setTotalMonitorsLength] = useState();

  const handleSelectParams = () => {};

  useEffect(() => {
    if (
      (outlineDuration === "custom" && !customDurationSubmitted) ||
      outlineDuration === null
    ) {
      return;
    }

    let intervalId;

    async function executeAsyncFunction() {
      // const isFirstLoad = tableData.length === 0;

      setTableDataFetchStatus({
        loading: true,
        error: false,
        errorMsg: null,
      });

      try {
        const {
          finalTableData,
          selectedImei,
          selectedLocality,
          numberofImeis,
        } = await fetchTableData(
          imeiURL,
          outlineDuration,
          finalCustomStartDate,
          finalCustomEndDate,
          api_key,
          userConfigData.priority_metrics,
          userConfigData.output_timezone,
          tablePage,
        );
        setTotalMonitorsLength(numberofImeis);
        setTableData(finalTableData);
        setNewSelectedImei((prev) => prev || selectedImei);
        setNewSelectedLocality((prev) => prev || selectedLocality);

        if (outlineDuration === "live") {
          const mapImeiData = await getMapIMEIData(geoJsonURL);
          // Extract IMEIs with status: 1 from mapImeiData
          const imeisWithStatus1 = mapImeiData.features
            .filter((feature) => feature.properties.status === 1)
            .map((feature) => feature.properties.imei);
          if (imeisWithStatus1.length === 0) {
            setTableDataFetchStatus({
              loading: false,
              error: true,
              errorMsg: "There are no devices online currently.",
            });
          } else {
            setTableDataFetchStatus((prev) => ({ ...prev, loading: false }));
          }
        } else {
          setTableDataFetchStatus((prev) => ({ ...prev, loading: false }));
        }
      } catch (error) {
        setTableDataFetchStatus({
          loading: false,
          error: true,
          errorMsg: error.message,
        });
      }
    }

    // Run immediately on mount
    executeAsyncFunction();

    if (outlineDuration === "live") {
      // Set interval to re-fetch every 5 minutes
      intervalId = setInterval(
        () => {
          executeAsyncFunction();
        },
        5 * 60 * 1000,
      ); // 5 minutes
    }

    // Cleanup function
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [outlineDuration, customDurationSubmitted, tablePage]);

  const handleNewImeiSelected = (newImei, locality) => {
    setNewSelectedImei(newImei);
    setNewSelectedLocality(locality);
  };

  // fetch outline chart data
  useEffect(() => {
    let intervalId;
    if (
      (outlineDuration === "custom" && !customDurationSubmitted) ||
      outlineDuration === null
    ) {
      return;
    }

    async function executeAsyncFunction() {
      // const isFirstLoad = tableData.length === 0;
      setOutlineChartFetchStatus({
        loading: true,
        error: false,
        errorMsg: null,
      });
      try {
        const chartSeriesArray = await fetchChartData(
          api_key,
          outlineDuration,
          finalCustomStartDate,
          finalCustomEndDate,
          newSelectedImei,
          userConfigData.priority_metrics,
          outlineChartInterval.unit,
          outlineChartInterval.value,
        );

        setOutlineChartData(chartSeriesArray);

        setOutlineChartFetchStatus((prevStatus) => ({
          ...prevStatus,
          loading: false,
        }));
      } catch (error) {
        setOutlineChartFetchStatus({
          loading: false,
          error: true,
          errorMsg: error.message,
        });
      }
    }

    if (newSelectedImei) {
      executeAsyncFunction();
    }

    if (outlineDuration === "live") {
      // Set interval to re-fetch every 5 minutes
      intervalId = setInterval(
        () => {
          executeAsyncFunction();
        },
        5 * 60 * 1000,
      ); // 5 minutes
    }

    // Cleanup function
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [
    outlineDuration,
    newSelectedImei,
    customDurationSubmitted,
    outlineChartInterval,
  ]);

  const handleSelectOutlineDuration = (outlineDuration) => {
    setOutlineDuration(outlineDuration);
  };

  const handleSelectOutlineChartInterval = (outlineChartInterval) => {
    setOutlineChartInterval(outlineChartInterval);
  };

  const handleCustomDurationSelected = (
    customStartDate,
    customEndDate,
    value,
  ) => {
    // setCustomDurationSelected(!value);
    setCustomDurationSubmitted(value);
    setFinalCustomStartDate(customStartDate);
    setFinalCustomEndDate(customEndDate);
  };

  return (
    <React.Fragment>
      <React.Suspense fallback={<MfeFallback />}>
        <HomeApp
          username={username}
          finalTableData={tableData}
          selectedImei={newSelectedImei}
          selectedLocality={newSelectedLocality}
          onSelectDuration={handleSelectOutlineDuration}
          onSelectInterval={handleSelectOutlineChartInterval}
          tableDataFetchStatus={tableDataFetchStatus}
          finalChartData={outlineChartData}
          outlineChartFetchStatus={outlineChartFetchStatus}
          onSelectNewImei={handleNewImeiSelected}
          headCells={outLineTableHeadCells}
          onSelectParams={handleSelectParams}
          // mapGeoJsonData={mapGeoJsonData}
          // // mapGeoJsonFetchStatus={mapGeoJsonFetchStatus}
          fetchMarkerDetailsChartData={fetchMarkerDetailsChartData}
          initialMapCenter={userConfigData.map_center}
          initialMapZoom={userConfigData.map_zoom_level}
          userConfigData={userConfigData}
          getColor={getColor}
          onSubmitCustomDuration={handleCustomDurationSelected}
          activeApp="Home"
          PopupDetailsComponent={PopupDetails}
          dropDownParamsList={userConfigData.all_metrics}
          getUnclusteredCircleColor={getUnclusteredCircleColor}
          setTablePage={setTablePage}
          totalMonitorsLength={totalMonitorsLength}
          // lastMinuteData={lastMinuteData[0]}
        />
      </React.Suspense>
    </React.Fragment>
  );
}
