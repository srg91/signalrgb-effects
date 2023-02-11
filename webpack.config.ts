import webpack from "webpack";

import HtmlWebpackPlugin from "html-webpack-plugin";
import HtmlInlineScriptPlugin from "html-inline-script-webpack-plugin";
import resolver from "./src/utils/build/EffectResolver";

const config: webpack.Configuration = {
  mode: "production",
  entry: resolver.entries(),
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  plugins: Object.values(resolver.options())
    .map((options) => {
      return new HtmlWebpackPlugin(options) as webpack.WebpackPluginInstance;
    })
    .concat([new HtmlInlineScriptPlugin()]),
};

export default config;
