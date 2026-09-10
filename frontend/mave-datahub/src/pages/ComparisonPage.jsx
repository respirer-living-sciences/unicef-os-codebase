import React from "react";
import MfeFallback from "../components/MfeFallback";
import { useStore } from "../store/store";
import { loadRemote } from "../utils/loadRemote";

const Comparison = React.lazy(() =>
  loadRemote(
    "comparison",
    "https://yourfrontend-domain.com/comparative-analysis/remoteEntry.js",
    "./Comparison",
  ).then((mod) => ({ default: mod.default ?? mod })),
);

export default function ComparisonPage({ username }) {
  // use global state variable for userConfig data from zustand. We will use this once all the data for this page is being fetched in Mave-datahub MFE
  const userConfigData = useStore((state) => state.userConfig);

  // global state from store for activeAppTitle when app is changed in sidebar drawer. This will prevent active app to change to initial value on reload
  const setActiveAppTitle = useStore((state) => state.setActiveAppTitle);

  setActiveAppTitle("Analytics");
  return (
    <React.Suspense fallback={<MfeFallback />}>
      <Comparison
        username={username}
        dropDownParamsList={userConfigData.all_metrics}
      />
    </React.Suspense>
  );
}
