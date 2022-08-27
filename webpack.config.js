const path = require("path");
const fs = require('fs');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const webpack = require("webpack");
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
// const ignore = new webpack.IgnorePlugin(new RegExp("/(node_modules|ckeditor)/"));
//  Some constants to webpack different scenarios
const PRODUCTION = "production";
const STAGING = "staging";
const DEVELOPMENT = "development";
let ENVIROMENT = DEVELOPMENT;
const DEFAULT_BRAND = "orion";

//  Some constants to deploy different scenarios
let DEFAULT_ENV = "DEV";
const ENVS = [
  "PROD", "STAGING", "DEV"
]

/*
- Experimental white label behavior, for now, given a brand,
  we chose options for that brand.
- Better webpack configuration practice would be to
  create separate configs for production and development
*/

module.exports = (env, { mode }) => {
  DEFAULT_ENV = process.env.NODE_ENV === "staging" ? "STAGING" : process.env.NODE_ENV === "production" ? "PROD" : "DEV"
  const shouldGzip = process.env.REACT_APP_COMPRESS !== "false";
  /* Check if we are going to WEBPACK development or normal production,
  remember that webpack development "build-dev" in package.json is just
  for development or local testing purposes*
  */
  if (mode === PRODUCTION) {
    ENVIROMENT = PRODUCTION
  }

  const ENV = process.env.npm_config_env? process.env.npm_config_env : DEFAULT_ENV ;

  ////================== Validating if "env" flag is correct
  if (!ENVS.includes(ENV)) {
    console.log(
      '\n', '\x1b[1m', '\x1b[31m',
      `ERROR: ENV: "${ENV}" IS NONE OF "PROD", "STAGING" "DEV"`,
      '\x1b[0m', '\n'
    );
    return 1;
  }

  return {

    mode: ENVIROMENT,
    entry: "./src/index.js",
    /*output options*/
    output: {
      path: path.resolve(__dirname, "./build"), // If changed, we need to change it at ./iisConfig
      filename: "static/js/[name].[contenthash].js",
      chunkFilename: "static/js/[name].[contenthash].js",
      assetModuleFilename: 'static/media/[name][ext]',
      publicPath: '/'
    },
    /* Loaders */
    module: {
      rules: [
        {
          test: /\.(js|jsx|ts|tsx)$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader"
          },
        },
        {
          test: /\.(png|jpg|jpeg|gif)$/,
          type: "asset",
        },
        {
          test: /\.(scss|sass)$/,
          exclude: /node_modules/,
          use: [
            {
              loader: ENVIROMENT === PRODUCTION
                ? MiniCssExtractPlugin.loader
                : "style-loader"
            },
            {
              loader: 'css-loader',
              options: {
                sourceMap: true,
              }
            },
            {
              loader: 'sass-loader',
              options: {
                sourceMap: true,
              }
            }
          ],
        },
        {
          test: /\.(css)$/,
          use: ['style-loader','css-loader']
        },
        {
          test: /\.svg$/i,
          issuer: /\.[jt]sx?$/,
          use: ['@svgr/webpack', 'url-loader'],
        },
      ]
    },

    /* Alias: main concept to apply white label.
      Given a brand we can import its configuration at any place,
      example: import THEMEA from "@theme"
    */
    resolve: {
      extensions: [".js", ".json", ".jsx", ".scss"],
      alias: {
          "@appFont": path.resolve(__dirname, `src/assets/fonts/fonts.scss`),
          "@appConfig": path.resolve(__dirname, `src/config/appConfig/appConfig.js`),
      }
    },

    /* Optimize chunks for better production's
      bundle performance, can be improved more.
    */
    optimization: {
      splitChunks: {
        cacheGroups: {
          vendors: {
            test: /[\\/]node_modules[\\/]/, ///< put all used node_modules modules in this chunk
            name: "vendor", ///< name of bundle
            chunks: "all" ///< type of code to put in this bundle
          }
        }
      },
    },

    /* Helpers for webpack */
    plugins: [
      new CleanWebpackPlugin({
        protectWebpackAssets: false,
        cleanAfterEveryBuildPatterns: ['*.LICENSE.txt'],
      }),
      new HtmlWebpackPlugin({
        template: "public/index.html",
        favicon: path.resolve(__dirname, `src/assets/images/Favicon.ico`),
      }),
      new MiniCssExtractPlugin({
        filename: "static/css/[name].css",
        chunkFilename: "css/[id].css"
      }),
      new webpack.DefinePlugin({
        ENVIROMENT: JSON.stringify(ENV),
      }),
      new CaseSensitivePathsPlugin(),
      // ignore
    ],

    devtool: ENVIROMENT === PRODUCTION ? false : "source-map",

    devServer: {
      historyApiFallback: true,
      port: 3000,
      open: true,
      hot: true,
    },
    stats: {
      errorDetails: true,
    },
  }
}