var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var util = require('util');

var config = require('./webpack.config.develop');
var server = config.config;

new WebpackDevServer(webpack(config), {
    contentBase: server.webDir,
    hot: true,
    stats: {
        colors: true
    },
}).listen(server.port, server.host, function(err, res) {
    if (err) {
        console.log(err);
    }
    var url = (util.format('http://%s:%d', server.host, server.port));
    console.log('Listening as ' + url);
});
