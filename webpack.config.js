const path = require('path');
module.exports = {
  context: path.resolve(__dirname, 'src'),
  entry: './app.js',
  output: {
    path: path.resolve(__dirname),
    filename: 'index.js',
  },
};
