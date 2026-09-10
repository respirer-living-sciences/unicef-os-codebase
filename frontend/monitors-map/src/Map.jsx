import React, { useEffect, useState, useMemo } from "react";
import { useRef } from "react";
import { Map, Source, Layer, Popup, Marker } from "react-map-gl";
import LoadingSpinner from "remote/LoadingSpinner";
// import parksData from "../parks.geojson";
// import earthquakesData from "../earthquakes.geojson";
import MarkerDetailsComponent from "./components/MarkerDetailsComponent";
import MapControllerCard from "./components/MapControllerCard";
// import { useStore } from "store/store";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import "./styles/map-styles.css";

const csv = require("csvtojson");

import ColorIndex from "./components/ColorIndex";
import getDurationSelector from "./utils/getDurationSelector";

// import {clusterLayer, clusterCountLayer, unclusteredPointLayer} from './layers';
import { clusterLayer, clusterCountLayer } from "./layers/layers";
import ColorLegend from "./components/ColorLegend";
import PollutantSelector from "./components/PollutantSelector";
import MapSummaryCard from "./components/MapSummaryCard";
const MAPBOX_TOKEN = ""; // Set your mapbox token here

export default function App(props) {
  const [themeMode, setThemeMode] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("theme-mode") || "light";
    }
    return "light";
  });

  useEffect(() => {
    if (typeof document === "undefined") return;
    const observer = new MutationObserver(() => {
      const currentTheme =
        document.documentElement.getAttribute("data-theme") || "light";
      setThemeMode(currentTheme);
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    return () => observer.disconnect();
  }, []);

  const dynamicTheme = useMemo(() => {
    const isLight = themeMode === "light";
    return createTheme({
      palette: {
        mode: themeMode,
        primary: {
          main: "#03C9D7",
          light: "#33D4DF",
          dark: "#028C96",
        },
        secondary: {
          main: "#10B981",
        },
        background: {
          default: isLight ? "#F8FAFC" : "#0F172A",
          paper: isLight ? "#FFFFFF" : "#1E293B",
        },
        text: {
          primary: isLight ? "#1E293B" : "#F1F5F9",
          secondary: isLight ? "#64748B" : "#94A3B8",
        },
        divider: isLight ? "rgba(226, 232, 240, 0.8)" : "rgba(51, 65, 85, 0.8)",
      },
      typography: {
        fontFamily: '"Inter", "Open Sans", "Helvetica", "Arial", sans-serif',
        allVariants: {
          fontFamily: '"Inter", "Open Sans", "Helvetica", "Arial", sans-serif',
        },
        button: {
          textTransform: "none",
          fontWeight: 600,
        },
      },
      shape: {
        borderRadius: 12,
      },
      components: {
        MuiCard: {
          styleOverrides: {
            root: {
              backgroundImage: "none",
              boxShadow: isLight
                ? "0px 4px 20px rgba(0, 0, 0, 0.03)"
                : "0px 4px 20px rgba(0, 0, 0, 0.2)",
              border: isLight
                ? "1px solid rgba(226, 232, 240, 0.8)"
                : "1px solid rgba(51, 65, 85, 0.8)",
            },
          },
        },
        MuiPaper: {
          styleOverrides: {
            root: {
              backgroundImage: "none",
            },
          },
        },
      },
    });
  }, [themeMode]);

  const api_key = props.api_key || localStorage.getItem("api_key");
  const username = props.username || localStorage.getItem("username");

  let mapToday = new Date();
  const day = ("0" + mapToday.getUTCDate()).slice(-2);
  const month = ("0" + (mapToday.getUTCMonth() + 1)).slice(-2); // getUTCMonth() returns month from 0 to 11
  const year = mapToday.getUTCFullYear();
  const fullDate = `${year}-${month}-${day}`;

  const [showPopup, setShowPopup] = useState(false);
  const [homeTimeButton, setHomeTimeButton] = useState(props.timeButton);

  // setting state from child controller component

  const [avgTime, setAvgTime] = useState("hh");
  // const [param, setParam] = useState(
  //   props.dropDownParamsList.find((metric) => metric.metric === "globetemp")
  //     .metric
  // );
  const [param, setParam] = useState(props.dropDownParamsList[0].metric);
  const [timeButton, setTimeButton] = useState("24hrs");
  const [split, setSplit] = useState("1");
  const [durationStartDate, setDurationStartDate] = useState(fullDate);
  const [durationEndDate, setDurationEndDate] = useState(fullDate);
  const [clusterChecked, setClusterChecked] = useState(true);
  const [popupFeatures, setPopupFeatures] = useState();
  const [selectedPollutantUI, setSelectedPollutantUI] = useState(
    props.dropDownParamsList?.[0]?.metric || "",
  );

  // changeActiveApp("Map");

  const mapRef = useRef();

  const onClick = (event) => {
    // Guard: no features clicked
    if (!event?.features || event.features.length === 0) {
      return;
    }

    if (event.features[0].properties.cluster === true) {
      const feature = event.features[0];
      const clusterId = feature.properties.cluster_id;

      const mapboxSource = mapRef.current.getSource("mavemonitors");

      mapboxSource.getClusterExpansionZoom(clusterId, (err, zoom) => {
        if (err) {
          return;
        }

        mapRef.current.easeTo({
          center: feature.geometry.coordinates,
          zoom,
          duration: 600,
        });
      });
    } else if (event.features[0].layer.id === "unclustered-point") {
      let feature = event.features[0];
      setPopupFeatures(feature); //once a unclustered marker is clicked I am sending the feature to datahub MFE app for the selected marker to make the markerDetails comp for Popup.
      mapRef.current.easeTo({
        center: feature.geometry.coordinates,
        duration: 600,
      });

      //bcuz in points geometry in GeoJSON data the longitude is the first in [long, lat]

      //when popup closing(when setShowPopup(false)) and popup opening(when setShowPopup(true)) events happen at the same time while clicking on another unclustered layer while a popup is open in another coordinate, it misbehaves. so setting a timeout for the showPopup var to be true again seems to have fixed the issue. Nice!

      setTimeout(() => {
        setShowPopup(true);
      }, 1);
    }
  };

  let paramValueLayer;
  let unclusteredPointLayer;

  paramValueLayer = {
    id: "param-value",
    type: "symbol",
    source: "mavemonitors",
    filter: ["!", ["has", "point_count"]],
    layout: {
      "text-field": `{${param}}`,
      "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
      "text-size": 12,
    },
    paint: {
      "text-color": themeMode === "dark" ? "#ffffff" : "#000000",
    },
  };

  unclusteredPointLayer = {
    id: "unclustered-point",
    type: "circle",
    source: "mavemonitors",
    filter: ["!", ["has", "point_count"]],
    paint: {
      // "circle-opacity": 0.8,
      // "circle-stroke-opacity": 0.8,
      "circle-color": themeMode === "dark" ? "#1E293B" : "#fff",
      "circle-pitch-alignment": "map",
      "circle-blur": 0.1,
      "circle-radius": 11,
      "circle-stroke-width": 4,
      "circle-stroke-color": [
        "case",
        [
          "any",
          ["==", ["get", "status"], "OFFLINE"],
          ["==", ["get", "status"], "offline"],
          ["==", ["get", "status"], 0],
          ["==", ["get", "status"], "0"],
        ],
        "#808080",
        props.getUnclusteredCircleColor(param),
      ],
    },
  };

  const EnhancedSource = () => {
    if (clusterChecked === false) {
      return (
        <Source
          id="mavemonitors"
          type="geojson"
          data={props.mapGeoJsonData}
          cluster={clusterChecked}
          clusterMaxZoom={10}
          clusterRadius={22}
        >
          <Layer {...clusterLayer} />
          <Layer {...clusterCountLayer} />
          <Layer {...unclusteredPointLayer} />
          <Layer {...paramValueLayer} />
        </Source>
      );
    } else {
      return (
        <Source
          id="mavemonitors"
          type="geojson"
          data={props.mapGeoJsonData}
          cluster={clusterChecked}
          clusterMaxZoom={10}
          clusterRadius={22}
        >
          <Layer {...clusterLayer} />
          <Layer {...clusterCountLayer} />
          <Layer {...unclusteredPointLayer} />
          <Layer {...paramValueLayer} />
        </Source>
      );
    }
  };

  const handleMouseMove = (event) => {
    if (!mapRef.current) return;

    const canvas = mapRef.current.getCanvas();

    if (event.features && event.features.length > 0) {
      canvas.style.cursor = "pointer";
    } else {
      canvas.style.cursor = "";
    }
  };

  const handleMouseLeave = () => {
    if (!mapRef.current) return;
    mapRef.current.getCanvas().style.cursor = "";
  };

  return (
    <ThemeProvider theme={dynamicTheme}>
      <div id="full-map">
        <div
          style={{
            position: "absolute",
            top: "80px",
            right: "30px",
            zIndex: 1000,
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            alignItems: "flex-end",
          }}
        >
          <MapSummaryCard title="Live Status" summaryText={props.summaryText} />
          <PollutantSelector
            options={props.dropDownParamsList}
            value={param}
            onChange={setParam}
          />
        </div>

        {props.mapGeoJsonFetchStatus.loading && (
          <div
            style={{
              position: "absolute",
              bottom: "42%",
              right: "50%",
              zIndex: "999",
            }}
          >
            <LoadingSpinner />
          </div>
        )}
        {props.mapGeoJsonFetchStatus.error && (
          <div
            style={{
              position: "absolute",
              bottom: "55%",
              right: "40%",
              zIndex: "999",
            }}
          >
            <p style={{ color: "red" }}>
              {"Error Occured! " + props.mapGeoJsonFetchStatus.errorMsg}
            </p>
          </div>
        )}

        <Map
          initialViewState={{
            // latitude: 20.5937,
            // longitude: 74.9629,
            zoom: props.initialMapZoom,
            latitude: props.initialMapCenter[0],
            longitude: props.initialMapCenter[1],
            // zoom: 4.8,
            // pitch: 20,
          }}
          // onMove={evt => {
          //   setViewport(evt.viewport);
          // }}
          style={{
            width: props.width ? props.width : "100vw",
            height: props.height ? props.height : "100vh",
          }}
          //Note: Map doesnt work without the style prop in react-map-gl v7
          mapStyle={
            themeMode === "dark"
              ? "mapbox://styles/mapbox/dark-v11"
              : "mapbox://styles/afzalrespirer/clypmn1zv006y01pc5vrn21d7"
          }
          mapboxAccessToken={MAPBOX_TOKEN}
          interactiveLayerIds={[clusterLayer.id, unclusteredPointLayer.id]}
          onClick={onClick}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          ref={mapRef}
          preserveDrawingBuffer={true}
        >
          <EnhancedSource />

          {showPopup && (
            <Popup
              longitude={popupFeatures.geometry.coordinates[0]}
              latitude={popupFeatures.geometry.coordinates[1]}
              anchor="bottom"
              onClose={() => {
                setShowPopup(false);
                setPopupFeatures(null);
              }}
              onOpen={() => undefined}
              maxWidth="100%"
            >
              <props.PopupDetailsComponent
                api_key={api_key}
                popupFeatures={popupFeatures}
                avgTime={avgTime}
                param={param}
                timeButton={timeButton}
                homeTimeButton={homeTimeButton}
                split={split}
                durationStartDate={durationStartDate}
                durationEndDate={durationEndDate}
              />
            </Popup>
          )}
        </Map>

        {/* {props.activeApp === "Map" && <ColorIndex param={param} />} */}
        {props.activeApp === "Map" && (
          <ColorLegend
            selectedPollutant={param}
            selectedPollutantLabel={
              props.dropDownParamsList.find((metric) => metric.metric === param)
                ? props.dropDownParamsList.find(
                    (metric) => metric.metric === param,
                  ).label
                : "NA"
            }
            // selectedPollutantLabel={props.dropDownParamsList[0].label}
          />
        )}
      </div>
    </ThemeProvider>
  );
}
