const HtmlWebPackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");

const deps = require("./package.json").dependencies;
module.exports = (_, argv) => ({
  output: {
    publicPath:
      argv.mode === "development"
        ? (process.env.PUBLIC_PATH || "http://localhost:your_frontend_port/")
        : "https://yourfrontend-domain.com/mave-datahub/",
  },

  resolve: {
    extensions: [".tsx", ".ts", ".jsx", ".js", ".json"],
  },

  devServer: {
    port: process.env.PORT ? parseInt(process.env.PORT, 10) : "auto",
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
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        use: [
          {
            loader: "file-loader",
          },
        ],
      },
    ],
  },

  plugins: [
    new ModuleFederationPlugin({
      name: "shell",
      filename: "remoteEntry.js",
      //       remotes: {
      //   remote:
      //     // argv.mode === "development"
      //     //   ? "remote@http://localhost:your_frontend_port/remoteEntry.js" :
      //     "remote@https://yourfrontend-domain.com/ui-components-repository/remoteEntry.js",
      //   home:
      //     // argv.mode === "development"
      //     //   ? "home@http://localhost:your_frontend_port/remoteEntry.js" :
      //     "home@https://yourfrontend-domain.com/outline/remoteEntry.js",
      //   map:
      //     // argv.mode === "development"
      //     //   ? "map@http://localhost:your_frontend_port/remoteEntry.js" :
      //     "map@https://yourfrontend-domain.com/monitors-map/remoteEntry.js",
      //   login:
      //     // argv.mode === "development"
      //     //   ? "login@http://localhost:your_frontend_port/remoteEntry.js" :
      //     "login@https://yourfrontend-domain.com/auth-app/remoteEntry.js",
      //   downloadtool:
      //     // argv.mode === "development"
      //     //   ? "downloadtool@http://localhost:your_frontend_port/remoteEntry.js" :
      //     "downloadtool@https://yourfrontend-domain.com/data-download-tool/remoteEntry.js",
      //   analytics:
      //     argv.mode === "development"
      //       ? "analytics@http://localhost:your_frontend_port/remoteEntry.js" :
      //       "analytics@https://yourfrontend-domain.com/analytics/remoteEntry.js",
      //   calendar_heatmap:
      //     // argv.mode === "development"
      //     //   ? "calendar_heatmap@http://localhost:your_frontend_port/remoteEntry.js" :
      //     "calendar_heatmap@https://yourfrontend-domain.com/calendar-heatmap/remoteEntry.js",
      //   shell:
      //     argv.mode === "development"
      //       ? "shell@http://localhost:your_frontend_port/remoteEntry.js"
      //       : "shell@https://yourfrontend-domain.com/mave-datahub/remoteEntry.js",
      //   // store:
      //   //   argv.mode === "development"
      //   //     ? "store@http://localhost:your_frontend_port/remoteEntry.js"
      //   //     : "store@https://yourfrontend-domain.com/store/remoteEntry.js",
      //   comparison:
      //     // argv.mode === "development"
      //     //   ? "comparison@http://localhost:your_frontend_port/remoteEntry.js" :
      //     "comparison@https://yourfrontend-domain.com/comparative-analysis/remoteEntry.js",
      //   device_management:
      //     // argv.mode === "development"
      //     //   ? "device_management@http://localhost:your_frontend_port/remoteEntry.js" :
      //     "device_management@https://yourfrontend-domain.com/device-management/remoteEntry.js",
      // },

      // All remotes are now loaded DYNAMICALLY via src/utils/loadRemote.js.
      // Removing them from here means the MF runtime will NOT fetch any
      // remoteEntry.js file at startup — they are injected on demand by each
      // page component when it is first rendered.
      remotes: {},
      exposes: {},
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
    new CopyWebpackPlugin({
      patterns: [{ from: "public/firebase-messaging-sw.js", to: "." }],
    }),
    new HtmlWebPackPlugin({
      template: "./src/index.html",
    }),
  ],
});
