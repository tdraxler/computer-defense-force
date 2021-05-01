const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: {
    // "scripts/react-app": path.join(__dirname, "src", "app.js"),
    'scripts/game': path.join(__dirname, 'src', 'game.js'),
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      }
    ]
  },
  resolve: {
    extensions: ['*', '.js', '.jsx']
  },
  output: {
    path: path.join(__dirname, 'public'),
    filename: '[name].js',
    publicPath: '/'
  }, 
  plugins: [
    //new webpack.HotModuleReplacementPlugin(),
  ],
  devServer: {
    hot: true,
    historyApiFallback: true
  }
};