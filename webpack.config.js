// const webpack = require('webpack')
const Dotenv = require('dotenv-webpack')

module.exports = (webpackConfig) => {
  // FilenameHash
  webpackConfig.output.chunkFilename = '[name].[hash].js' // http://webpack.github.io/docs/configuration.html#output-chunkfilename
  webpackConfig.module.noParse = /[/\\]node_modules[/\\]exceljs[/\\]dist[/\\]exceljs\.min\.js$/ // for windows ignore warning exceljs
  // ClassnasmeHash
  // console.log(webpackConfig.module)
  // const cssLoaders = webpackConfig.module.loaders[3].loader.split('!')
  // webpackConfig.module.loaders[3].loader = cssLoaders.map(item => {
  //   if (item.startsWith('css')) {
  //     return `css?${JSON.stringify(cssLoaderOption)}`
  //   }
  //   return item
  // }).join('!')

  // PreLoaders
  // webpackConfig.module.preLoaders = [{
  //   test: /\.js$/,
  //   enforce: 'pre',
  //   loader: 'eslint',
  // }]

  webpackConfig.plugins.push(new Dotenv())

  // plugins: [
  //   new webpack.DefinePlugin({
  //     // A common mistake is not stringifying the "production" string.
  //     'process.env.NODE_ENV': JSON.stringify('production')
  //   }),
  //   new webpack.optimize.UglifyJsPlugin({
  //     compress: {
  //       warnings: false
  //     }
  //   })
  // ]
  // Alias
  webpackConfig.resolve.alias = {
    components: `${__dirname}/src/components`,
    services: `${__dirname}/src/services`,
    models: `${__dirname}/src/models`,
    utils: `${__dirname}/src/utils`,
    config: `${__dirname}/src/utils/config`,
    enums: `${__dirname}/src/utils/enums`,
    themes: `${__dirname}/src/themes`,
    common: `${__dirname}/src/models/common`
  }
  webpackConfig.resolve.modules = ['node_modules']

  webpackConfig.loaders = [
    { exclude: ['node_modules'], loader: 'babel', test: /\.jsx?$/ },
    { loader: 'style-loader!css-loader', test: /\.css$/ },
    { loader: 'url-loader', test: /\.gif$/ },
    { loader: 'file-loader', test: /\.(ttf|eot|svg)$/ }
  ]

  return webpackConfig
}
