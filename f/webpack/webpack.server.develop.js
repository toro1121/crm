var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var util = require('util');

var config = require('./webpack.config.develop');

new WebpackDevServer(webpack(config), {
    contentBase: config.webDir,
    hot: true,
    stats: {
        colors: true
    },
}).listen(config.port, config.host, function(err, res) {
    if (err) {
        console.log(err);
    }
    var url = (util.format('http://%s:%d', config.host, config.port));
    console.log('Listening as ' + url);
});
