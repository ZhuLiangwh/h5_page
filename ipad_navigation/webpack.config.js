// webpack.config.js
module.exports = {
  entry: './src/js/index.js',
  output: {
    path: './dist', 
    filename: 'index.js'
  },
  resolve: {
    extensions: ['', '.coffee', '.js']
  }
}