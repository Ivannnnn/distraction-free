const path = require('path')

module.exports = {
  devtool: 'cheap-module-source-map',
  entry: {
    'contentScripts/reddit': './src/contentScripts/reddit',
    'contentScripts/twitter': './src/contentScripts/twitter',
    'contentScripts/facebook': './src/contentScripts/facebook',
    'contentScripts/youtube': './src/contentScripts/youtube',
    'contentScripts/linkedin': './src/contentScripts/linkedin',
    background: './src/background'
  },
  output: {
    path: path.resolve(__dirname, 'dist')
  }
}
