import React from "react";
import MfeFallback from "../components/MfeFallback";
import { useStore } from "../store/store";
import { loadRemote } from "../utils/loadRemote";

const Analytics_chart = React.lazy(() =>
  loadRemote(
    "analytics",
    "https://yourfrontend-domain.com/analytics/remoteEntry.js",
    "./Analytics_chart",
  ).then((mod) => ({ default: mod.default ?? mod })),
);

export default function AnalyticsPage({ username }) {
  // use global state variable for userConfig data from zustand. We will use this once all the data for this page is being fetched in Mave-datahub MFE
  const userConfigData = useStore((state) => state.userConfig);

  // global state from store for activeAppTitle when app is changed in sidebar drawer. This will prevent active app to change to initial value on reload
  const setActiveAppTitle = useStore((state) => state.setActiveAppTitle);

  setActiveAppTitle("Analytics");

  return (
    <React.Suspense fallback={<MfeFallback />}>
      <Analytics_chart
        username={username}
        dropDownParamsList={userConfigData.priority_metrics}
      />
    </React.Suspense>
  );
}
