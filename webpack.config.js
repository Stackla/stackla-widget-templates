const path = require("path")
const slsw = require("serverless-webpack")
const CopyWebpackPlugin = require("copy-webpack-plugin")

module.exports = {
  entry: slsw.lib.entries,
  module: {
    rules: [
      {
        exclude: /node_modules/,
        test: /\.ts$/,
        use: {
          loader: "swc-loader"
        }
      }
    ]
  },
  devtool: "inline-source-map",
  node: {
    __dirname: false,
    __filename: false
  },
  output: {
    filename: "[name].js",
    libraryTarget: "commonjs2",
    path: path.resolve(__dirname, "server/")
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        { from: "views", to: "views" },
        { from: "dist", to: "dist" }
      ]
    })
  ],
  resolve: {
    extensions: [".ts", ".js"]
  }
}
