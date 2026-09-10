import React from "react";
import MfeFallback from "../components/MfeFallback";
import { useStore } from "../store/store";
import { loadRemote } from "../utils/loadRemote";

const CalendarHeatmap = React.lazy(() =>
  loadRemote(
    "calendar_heatmap",
    "https://yourfrontend-domain.com/calendar-heatmap/remoteEntry.js",
    "./CalendarHeatmap",
  ).then((mod) => ({ default: mod.default ?? mod })),
);

export default function CalendarHeatmapPage({ username }) {
  // use global state variable for userConfig data from zustand.
  //   const userConfigData = useStore((state) => state.userConfig);

  // global state from store for activeAppTitle when app is changed in sidebar drawer. This will prevent active app to change to initial value on reload
  const setActiveAppTitle = useStore((state) => state.setActiveAppTitle);
  const userConfigData = useStore((state) => state.userConfig);

  setActiveAppTitle("Analytics");

  return (
    <React.Suspense fallback={<MfeFallback />}>
      <CalendarHeatmap
        username={username}
        dropDownParamsList={userConfigData.all_metrics}
      />
    </React.Suspense>
  );
}
