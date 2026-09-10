const HtmlWebPackPlugin = require("html-webpack-plugin");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");

const deps = require("./package.json").dependencies;
module.exports = (_, argv) => ({
  output: {
    publicPath:
      argv.mode === "development"
        ? (process.env.PUBLIC_PATH || "http://localhost:your_frontend_port/")
        : "https://yourfrontend-domain.com/ui-components-repository/",
  },

  resolve: {
    extensions: [".tsx", ".ts", ".jsx", ".js", ".json"],
  },

  devServer: {
    port: process.env.PORT ? parseInt(process.env.PORT, 10) : "auto", // configure PORT or your_frontend_port
    historyApiFallback: true,
  },

  module: {
    rules: [
      {
        test: /\.m?js/,
        type: "javascript/auto",
        resolve: {
          fullySpecified: false,
        },
      },
      {
        test: /\.(css|s[ac]ss)$/i,
        use: ["style-loader", "css-loader", "postcss-loader"],
      },
      {
        test: /\.(ts|tsx|js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
    ],
  },

  plugins: [
    new ModuleFederationPlugin({
      name: "remote",
      filename: "remoteEntry.js",
      remotes: {},
      exposes: {
        "./CardsCarousel": "./src/CardsCarousel.jsx",
        "./CardMUI": "./src/CardMUI.jsx",
        "./DurationSelector": "./src/DurationSelector.jsx",
        "./ApexLineChart": "./src/ApexLineChart.jsx",
        "./CustomDurationPopOver": "./src/CustomDurationPopOver.jsx",
        "./CardTiles": "./src/CardTiles.jsx",
        "./OutlineTable": "./src/OutlineTable.jsx",
        "./LoadingSpinner": "./src/LoadingSpinner.jsx",
        "./ApexHeatmapChart": "./src/ApexHeatmapChart.jsx",
        "./AlertSuccessTemp": "./src/AlertSuccessTemp.jsx",
        "./AlertFailure": "./src/AlertFailure.jsx",
        "./SortableTableComponent": "./src/SortableTableComponent.jsx",
        "./LoadingSpinner2": "./src/LoadingSpinner2.jsx",
        "./ValueCardsGrid": "./src/ValueCardsGrid.jsx",
        "./AdvancedLineChart": "./src/AdvancedLineChart.jsx",
        "./DataIntervalSelector": "./src/DataIntervalSelector.jsx",
        "./HealthTips": "./src/HealthTips.jsx",
        "./PaginationComponent": "./src/PaginationComponent.jsx",
      },
      shared: {
        ...deps,
        react: {
          singleton: true,
          requiredVersion: deps.react,
        },
        "react-dom": {
          singleton: true,
          requiredVersion: deps["react-dom"],
        },
        "@mui/material": {
          singleton: true,
          requiredVersion: deps["@mui/material"],
        },
        "@emotion/react": {
          singleton: true,
          requiredVersion: deps["@emotion/react"],
        },
        "@emotion/styled": {
          singleton: true,
          requiredVersion: deps["@emotion/styled"],
        },
      },
    }),
    new HtmlWebPackPlugin({
      template: "./src/index.html",
    }),
  ],
});
