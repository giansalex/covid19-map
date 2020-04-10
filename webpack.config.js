const TerserJSPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const path = require('path');

module.exports = {
  entry: {
      main: [
        './node_modules/leaflet/dist/images/marker-icon-2x.png',
        './node_modules/leaflet/dist/images/marker-shadow.png',
        './node_modules/leaflet/dist/leaflet.css',
        './node_modules/leaflet.markercluster/dist/MarkerCluster.css',
        './node_modules/leaflet.markercluster/dist/MarkerCluster.Default.css',
        './css/index.css',
        './js/index.js'
      ]
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
  },
  optimization: {
    minimizer: [new TerserJSPlugin({}), new OptimizeCSSAssetsPlugin({})],
  },
  plugins: [new MiniCssExtractPlugin()],
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
          outputPath: 'images'
        },
      },
    ],
  },
};