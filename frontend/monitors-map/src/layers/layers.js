export const clusterLayer = {
  id: "clusters",
  type: "circle",
  //Edit: The source in the Layer is overwritten by the data provided in the Source as a component. So the layer will still work if we dont specify the source. XX I believe the "source" points to "earthquakes" which we set in Source Component above Layer Comp in the id prop.
  // source: "earthquakes",
  filter: ["has", "point_count"],
  paint: {
    "circle-color": [
      "step",
      ["get", "point_count"],
      "#A2ECE6",
      10,
      "#03C9D7",
      25,
      "#f1f075",
    ],
    "circle-radius": ["step", ["get", "point_count"], 30, 10, 36, 25, 50],
  },
};

export const clusterCountLayer = {
  id: "cluster-count",
  type: "symbol",
  source: "mavemonitors",
  filter: ["has", "point_count"],
  layout: {
    "text-field": "{point_count_abbreviated}",
    "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
    "text-size": 18,
  },
};

// if (pollutant === "pm2.5cnc") {
//   !loading
//     ? (pollutantValueLayer = {
//         id: "pollutant-value",
//         type: "symbol",
//         source: "mavemonitors",
//         filter: ["!", ["has", "point_count"]],
//         layout: {
//           "text-field": `{${pollutantName}}`,
//           "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
//           "text-size": 12,
//         },
//       })
//     : (pollutantValueLayer = {
//         id: "pollutant-value",
//         type: "symbol",
//         source: "mavemonitors",
//         filter: ["!", ["has", "point_count"]],
//         layout: {
//           "text-field": "?",
//           "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
//           "text-size": 12,
//         },
//       });
//   // unclusteredPointLayer = {
//   //   id: "unclustered-point",
//   //   type: "symbol",
//   //   // source: "mavemonitors",
//   //   filter: ["!", ["has", "point_count"]],
//   //   layout: {
//   //     "icon-image": "rectangle-blue-3",
//   //   },
//   // };
//   unclusteredPointLayer = {
//     id: "unclustered-point",
//     type: "circle",
//     source: "mavemonitors",
//     filter: ["!", ["has", "point_count"]],
//     paint: {
//       // "circle-opacity": 0.8,
//       // "circle-stroke-opacity": 0.8,
//       "circle-color": "#fff",
//       "circle-pitch-alignment": "map",
//       "circle-blur": 0.1,
//       "circle-radius": 11,
//       "circle-stroke-width": 4,
//       "circle-stroke-color": [
//         "step",
//         ["get", "pm25"],
//         "#1EC82F",
//         30,
//         "#1BF030",
//         60,
//         "#F3DC0C",
//         90,
//         "#FFA621",
//         120,
//         "#FF0F0F",
//         250,
//         "#BA0909",
//       ],
//     },
//   };

//   // Using the symbol to render icon imported image failed.
//   // unclusteredPointLayer = {
//   //   id: "unclustered-point",
//   //   type: "symbol",
//   //   source: "mavemonitors",
//   //   filter: ["!", ["has", "point_count"]],
//   //   layout: {
//   //     "icon-image": myCustomSvg, // use the imported SVG file here
//   //     "icon-size": 0.6,
//   //     "icon-allow-overlap": true,
//   //     "icon-anchor": "bottom", // adjust as needed
//   //     "text-field": "{pm25}",
//   //     "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
//   //     "text-offset": [0, 1.5],
//   //     "text-anchor": "top",
//   //     "text-size": 10,
//   //     "text-allow-overlap": true,
//   //     "icon-ignore-placement": true,
//   //   },
//   //   paint: {
//   //     "icon-opacity": 0.8,
//   //     "icon-color": "#fff",
//   //     "icon-halo-width": 4,
//   //     "icon-halo-color": [
//   //       "step",
//   //       ["get", "pm25"],
//   //       "#1EC82F",
//   //       30,
//   //       "#1BF030",
//   //       60,
//   //       "#F3DC0C",
//   //       90,
//   //       "#FFA621",
//   //       120,
//   //       "#FF0F0F",
//   //       250,
//   //       "#BA0909",
//   //     ],
//   //   },
//   // };
// } else if (pollutant === "pm10cnc") {
//   !loading
//     ? (pollutantValueLayer = {
//         id: "pollutant-value",
//         type: "symbol",
//         source: "mavemonitors",
//         filter: ["!", ["has", "point_count"]],
//         layout: {
//           "text-field": "{pm10}",
//           "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
//           "text-size": 12,
//         },
//       })
//     : (pollutantValueLayer = {
//         id: "pollutant-value",
//         type: "symbol",
//         source: "mavemonitors",
//         filter: ["!", ["has", "point_count"]],
//         layout: {
//           "text-field": "?",
//           "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
//           "text-size": 12,
//         },
//       });
//   unclusteredPointLayer = {
//     id: "unclustered-point",
//     type: "circle",
//     source: "mavemonitors",
//     filter: ["!", ["has", "point_count"]],
//     paint: {
//       "circle-stroke-color": [
//         "step",
//         ["get", "pm10"],
//         "#1EC82F",
//         50,
//         "#1BF030",
//         100,
//         "#F3DC0C",
//         250,
//         "#FFA621",
//         350,
//         "#FF0F0F",
//         430,
//         "#BA0909",
//       ],

//       "circle-color": "#fff",
//       "circle-pitch-alignment": "map",
//       "circle-blur": 0.1,
//       "circle-radius": 11,
//       "circle-stroke-width": 4,
//     },
//   };
// }
