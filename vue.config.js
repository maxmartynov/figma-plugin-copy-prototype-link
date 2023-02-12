const webpack = require('webpack')
const HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')

module.exports = {
  css: {
    extract: false,
  },
  filenameHashing: false,
  chainWebpack: (config) => {
    config.plugins.delete('html')
    config.plugins.delete('preload')
    config.plugins.delete('prefetch')
    config.optimization.delete('splitChunks')
    config.entryPoints.delete('app')
  },
  configureWebpack: {
    plugins: [
      new webpack.DefinePlugin({
        global: {}, // Fix missing symbol error when running in developer VM
      }),
      new HtmlWebpackPlugin({
        template: './src/ui/index.html',
        filename: 'ui.html',
        inlineSource: '.(js)$',
        chunks: ['ui'],
      }),
      new HtmlWebpackInlineSourcePlugin(),
      new CopyPlugin([{from: './manifest.json', to: 'manifest.json'}]),
    ],
    entry: {
      ui: ['./src/ui/index.ts'],
      index: './src/index.ts',
    },
    output: {
      filename: '[name].js',
      chunkFilename: '[name].js',
    },
    node: {global: false},
  },
}
