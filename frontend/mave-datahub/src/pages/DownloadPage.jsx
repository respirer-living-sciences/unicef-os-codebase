import React, { useState, useEffect } from "react";
import MfeFallback from "../components/MfeFallback";
import { useStore } from "../store/store";
import { loadRemote } from "../utils/loadRemote";

const DownloadTool = React.lazy(() =>
  loadRemote(
    "downloadtool",
    "https://yourfrontend-domain.com/data-download-tool/remoteEntry.js",
    "./DownloadTool",
  ).then((mod) => ({ default: mod.default ?? mod })),
);
import * as XLSX from "xlsx";
import axios from "axios";
import moment from "moment";

export default function DownloadPage({ username, api_key }) {
  const [deviceData, setDeviceData] = useState([]);
  const [urlParamsData, setUrlParamsData] = useState({
    imeis: "",
    params: "",
    durationStartDate: "",
    durationEndDate: "",
    timeStep: "",
    average: "",
    gaps: 0,
  });
  const [fetchDeviceDataStatus, setFetchDeviceDataStatus] = useState({
    loading: true,
    error: false,
    errorMsg: null,
  });
  const [downloadStatus, setDownloadStatus] = useState({
    loading: false,
    error: false,
    errorMsg: null,
  });
  const [downloadProgress, setDownloadProgress] = useState(0);

  const imeiURL = `https://api.yourdomain.com/adp/v4/check_user_imei/user/${username}`;

  // use global state variable for userConfig data from zustand.
  const userConfigData = useStore((state) => state.userConfig);
  const themeMode = useStore((state) => state.themeMode);

  // global state from store for activeAppTitle when app is changed in sidebar drawer. This will prevent active app to change to initial value on reload
  const setActiveAppTitle = useStore((state) => state.setActiveAppTitle);

  setActiveAppTitle("Download");

  // Fetch IMEI data from server and make a list of imeis with their locality
  useEffect(() => {
    async function fetchIMEIData() {
      try {
        const res = await fetch(imeiURL);
        if (!res.ok) {
          setFetchDeviceDataStatus({
            loading: false,
            error: true,
            errorMsg: res.status + " " + res.statusText + "!",
          });
        } else {
          const response = res.json();
          setFetchDeviceDataStatus((prevStatus) => ({
            ...prevStatus,
            loading: false,
          }));
          return response;
        }
      } catch (err) {
        setFetchDeviceDataStatus({
          loading: false,
          error: true,
          errorMsg: "error CAUGHT while fetching data",
        });
      }
    }

    async function callAsyncFunctions() {
      const res = await fetchIMEIData();
      const monitorPoints = res.imei_details.map((elem) => {
        let imeiDetailsObject = {
          imei: elem.imei,
          locality:
            elem.values[0].locality !== (null || undefined)
              ? elem.values[0].locality
              : elem.values[0].imei,
          city: elem.values[0].city,
        };
        return imeiDetailsObject;
      });

      setDeviceData(monitorPoints);
    }

    callAsyncFunctions();
  }, []);

  // Define a function to handle the data received from the child component
  const handleUrlData = (urlData) => {
    setUrlParamsData(urlData);
  };

  const handleSubmitDownload = async () => {
    setDownloadStatus((prevStatus) => ({
      ...prevStatus,
      loading: true,
    }));

    if (
      urlParamsData.imeis === "" ||
      urlParamsData.params === "" ||
      urlParamsData.timeStep === "" ||
      urlParamsData.average === ""
    ) {
      // alert("Fill all select options");
      setDownloadStatus({
        loading: false,
        error: true,
        errorMsg: "Please fill all options",
      });
    } else {
      try {
        const {
          imeis,
          params,
          durationStartDate,
          durationEndDate,
          timeStep,
          average,
          gaps,
        } = urlParamsData;

        let downloadUrl = `https://api.yourdomain.com/adp/v4/getModeledData/project/${username}/imei/${imeis}/params/${params}/startdate/${durationStartDate}/enddate/${durationEndDate}/ts/${timeStep}/avg/${average}/api/${api_key}`;

        fetch(downloadUrl, {
          method: "GET",
          cache: "no-store", // Disable caching
        })
          .then((response) => response.blob())
          .then((blob) => {
            const tempUrl = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = tempUrl;
            const fileName = `${
              username + "_" + durationStartDate + "_to_" + durationEndDate
            }`;
            // a.download ="mave_device_data"
            a.download = `${fileName}.zip`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            setDownloadStatus({
              loading: false,
              error: false,
              errorMsg: null,
            });
          });
      } catch (err) {
        setDownloadStatus({ loading: false, error: true, errorMsg: err });
      }
    }
  };

  return (
    <React.Suspense fallback={<MfeFallback />}>
      <DownloadTool
        username={username}
        dropDownParamsList={userConfigData.all_metrics}
        onUrlDataChange={handleUrlData}
        onSubmitDownload={handleSubmitDownload}
        deviceData={deviceData}
        downloadStatus={downloadStatus}
        fetchDeviceDataStatus={fetchDeviceDataStatus}
        downloadToolOptions={downloadToolOptions}
        downloadProgress={downloadProgress}
        themeMode={themeMode}
      />
    </React.Suspense>
  );
}

const downloadToolOptions = {
  select1: {
    selectionTitle: "Duration",
    // options: ["Today", "7days", "Custom"],
    options: ["Today", "7 days", "30 days", "Custom"],
  },
};

const userrr = {
  priority_metrics: [
    {
      metric: "pm2.5cnc",
      label: "PM2.5",
      unit: "µg/m³",
    },
    {
      metric: "pm10cnc",
      label: "PM10",
      unit: "µg/m³",
    },
    {
      metric: "temp",
      label: "Temperature",
      unit: "°C",
    },
    {
      metric: "humidity",
      label: "Humidity",
      unit: "%",
    },
  ],
  all_metrics: [
    {
      metric: "pm2.5cnc",
      label: "PM2.5",
      unit: "µg/m³",
    },
    {
      metric: "pm10cnc",
      label: "PM10",
      unit: "µg/m³",
    },
    {
      metric: "temp",
      label: "Temperature",
      unit: "°C",
    },
    {
      metric: "humidity",
      label: "Humidity",
      unit: "%",
    },
    {
      metric: "battery",
      label: "Battery Level",
    },
    {
      metric: "power_avl",
      label: "Power Avl",
    },
  ],
  map_center: ["21.170240", "72.831062"],
  map_zoom_level: 5,
};
