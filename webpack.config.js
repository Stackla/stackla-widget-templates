const path = require("path")
const slsw = require("serverless-webpack")
const { DefinePlugin } = require("webpack")
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
    }),
    new DefinePlugin({
      NODE_ENV: JSON.stringify(process.env.NODE_ENV),
      APP_ENV: JSON.stringify(process.env.APP_ENV)
    })
  ],
  resolve: {
    extensions: [".ts", ".js"]
  }
}
