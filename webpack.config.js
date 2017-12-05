module.exports = (webpackConfig) => {
  // FilenameHash
  webpackConfig.output.chunkFilename = '[name].[hash].js' // http://webpack.github.io/docs/configuration.html#output-chunkfilename
  webpackConfig.module.noParse = /[\/\\]node_modules[\/\\]exceljs[\/\\]dist[\/\\]exceljs\.min\.js$/ //for windows ignore warning exceljs
  // webpackConfig.module.noParse = /[\/\\]node_modules[\/\\]react-excel-workbook[\/\\]node_modules[\/\\]xlsx[\/\\]jszip\.js$/ //for windows ignore warning exceljs
  // webpackConfig.module.noParse = /node_modules\/exceljs\/dist\/exceljs.js/ //for linux ignore warning exceljs
  // webpackConfig.module.noParse = /[\/\\]node_modules[\/\\]xlsx[\/\\]jszip\.js$/
  // ClassnasmeHash
  const cssLoaderOption = {
    importLoaders: 1,
    modules: true,
    localIdentName: '[hash:base64:5]',
  }
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


  // Alias
  webpackConfig.resolve.alias = {
    components: `${__dirname}/src/components`,
    utils: `${__dirname}/src/utils`,
    config: `${__dirname}/src/utils/config`,
    enums: `${__dirname}/src/utils/enums`,
  }

  return webpackConfig
}
