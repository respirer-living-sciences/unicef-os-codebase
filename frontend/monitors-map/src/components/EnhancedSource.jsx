// import React from "react";
// import { Source, Layer } from "react-map-gl";
// import { clusterLayer } from "../layers/clusterLayer";
// import { clusterCountLayer } from "../layers/clusterCountLayer";

// export const EnhancedSource = ({
//   clusterChecked,
//   mapGeoJsonData,
//   pollutant,
//   loading,
// }) => {
//   let pollutantValueLayer;
//   let unclusteredPointLayer;

//   if (clusterChecked === false) {
//     return (
//       <Source
//         id="mavemonitors"
//         type="geojson"
//         // data="https://docs.mapbox.com/mapbox-gl-js/assets/earthquakes.geojson"
//         // data="https://www.nps.gov/lib/npmap.js/4.0.0/examples/data/national-parks.geojson"
//         data={mapGeoJsonData}
//         cluster={clusterChecked}
//         clusterMaxZoom={10}
//         clusterRadius={22}
//       >
//         <Layer {...clusterLayer} />
//         <Layer {...clusterCountLayer} />
//         <Layer {...unclusteredPointLayer} />
//         <Layer {...pollutantValueLayer} />
//       </Source>
//     );
//   } else {
//     return (
//       <Source
//         id="mavemonitors"
//         type="geojson"
//         // data="https://docs.mapbox.com/mapbox-gl-js/assets/earthquakes.geojson"
//         // data="https://www.nps.gov/lib/npmap.js/4.0.0/examples/data/national-parks.geojson"
//         data={mapGeoJsonData}
//         cluster={clusterChecked}
//         clusterMaxZoom={10}
//         clusterRadius={22}
//       >
//         <Layer {...clusterLayer} />
//         <Layer {...clusterCountLayer} />
//         <Layer {...unclusteredPointLayer} />
//         <Layer {...pollutantValueLayer} />
//       </Source>
//     );
//   }
// };
