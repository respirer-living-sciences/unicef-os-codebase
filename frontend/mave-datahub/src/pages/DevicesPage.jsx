import React, { useState, useEffect, useMemo } from "react";
import MfeFallback from "../components/MfeFallback";
import { useStore } from "../store/store";
import { loadRemote } from "../utils/loadRemote";

const DevicesTable = React.lazy(() =>
  loadRemote(
    "device_management",
    "https://yourfrontend-domain.com/device-management/remoteEntry.js",
    // "http://localhost:your_frontend_port/remoteEntry.js",
    "./DevicesTable",
  ).then((mod) => ({ default: mod.default ?? mod })),
);
import getMapIMEIDataNoCache from "../services/general/getMapImeiDataNoCache";
import moment from "moment";
import getIcon from "../utils/getIcon";

export default function DevicesPage({ username }) {
  const [geoJsonDataFetchStatus, setGeoJsonDataFetchStatus] = useState({
    loading: true,
    error: false,
    errorMsg: null,
  });

  // Store ONLY raw API response
  const [rawDevices, setRawDevices] = useState([]);

  // Zustand global state
  const setActiveAppTitle = useStore((state) => state.setActiveAppTitle);
  const themeMode = useStore((state) => state.themeMode);

  useEffect(() => {
    setActiveAppTitle("Device Info");
  }, [setActiveAppTitle]);

  const geoJsonUrl = `https://api.yourdomain.com/adp/v4/getDeviceStatus/username/${username}`;

  useEffect(() => {
    let isMounted = true;

    setGeoJsonDataFetchStatus({
      loading: true,
      error: false,
      errorMsg: null,
    });

    const fetchDevices = async () => {
      try {
        const data = await getMapIMEIDataNoCache(geoJsonUrl);
        if (!isMounted) return;

        setRawDevices(Array.isArray(data) ? data : []);
        setGeoJsonDataFetchStatus({
          loading: false,
          error: false,
          errorMsg: null,
        });
      } catch (err) {
        if (!isMounted) return;

        setGeoJsonDataFetchStatus({
          loading: false,
          error: true,
          errorMsg: err.message,
        });
      }
    };

    fetchDevices();

    return () => {
      isMounted = false;
    };
  }, [geoJsonUrl]);

  // 🔹 Memoized transformation (runs ONLY when rawDevices changes)
  const finalGeoJsonData = useMemo(() => {
    if (!rawDevices.length) return [];

    return rawDevices.map((item) => {
      const [lat, long] = item.latLong
        ? item.latLong.split(",").map((v) => parseFloat(v.trim()))
        : [null, null];

      return {
        ...item,

        // Normalize status
        status:
          item.status === 1 || item.status === "ONLINE" ? "ONLINE" : "OFFLINE",

        // Derived fields
        lat,
        long,
        latLong: lat && long ? `${lat.toFixed(7)} / ${long.toFixed(7)}` : null,

        // Format date (keeping moment for consistency)
        last_updated: item.last_updated
          ? moment(item.last_updated.split("Z")[0]).format(
              "ddd, MMM D YYYY, h:mm a",
            )
          : null,

        // Normalize power source
        powerSource: item.powerSource === "Mains" ? "Power" : "Battery",

        // Normalize battery
        battery:
          item.battery !== null && item.battery !== undefined
            ? parseInt(item.battery)
            : null,
      };
    });
  }, [rawDevices]);

  return (
    <React.Suspense fallback={<MfeFallback />}>
      <DevicesTable
        username={username}
        finalMainData={finalGeoJsonData}
        headCells={deviceManagementTableHeadCells}
        geoJsonDataFetchStatus={geoJsonDataFetchStatus}
        filterProperties={["imei", "locality", "city", "state"]}
        getIcon={getIcon}
        themeMode={themeMode}
      />
    </React.Suspense>
  );
}

/* ------------------------------------------------------------------ */
/* --------------------- TABLE COLUMN DEFINITIONS -------------------- */
/* ------------------------------------------------------------------ */

const deviceManagementTableHeadCells = [
  { id: "imei", label: "IMEI", minWidth: 120, datatype: "num", type: "int" },
  {
    id: "locality",
    label: "Locality",
    minWidth: 100,
    align: "left",
    datatype: "str",
    type: "normal",
  },
  {
    id: "city",
    label: "City",
    minWidth: 100,
    align: "left",
    datatype: "str",
    type: "normal",
  },
  {
    id: "state",
    label: "State",
    minWidth: 100,
    align: "left",
    datatype: "str",
    type: "normal",
  },
  {
    id: "latLong",
    label: "Location",
    minWidth: 100,
    align: "left",
    datatype: "num",
    disableSorting: true,
    type: "coord",
  },
  {
    id: "last_updated",
    label: "Last updated",
    minWidth: 120,
    align: "left",
    datatype: "str",
    disableSorting: true,
    type: "date",
  },
  {
    id: "status",
    label: "Status",
    minWidth: 120,
    align: "left",
    datatype: "str",
    statusIcon: true,
    type: "normal",
  },
  {
    id: "powerSource",
    label: "Power Source",
    minWidth: 120,
    align: "left",
    datatype: "str",
    type: "normal",
  },
  {
    id: "battery",
    label: "Battery Level",
    minWidth: 120,
    align: "left",
    datatype: "num",
    batteryIcon: true,
    type: "perc",
  },
];
