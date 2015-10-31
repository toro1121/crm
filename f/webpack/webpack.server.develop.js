var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var util = require('util');

var config = require('./webpack.config.develop');
var _CONFIG = config._CONFIG;

new WebpackDevServer(webpack(config), {
    contentBase: _CONFIG._DIR_APP,
    hot: true,
    stats: {
        colors: true
    },
    // headers: {
    //     'Access-Control-Allow-Origin': '*'
    // },
}).listen(_CONFIG._PORT, _CONFIG._HOST, function(err, res) {
    if (err) {
        console.log(err);
    }
    var url = (util.format('http://%s:%d', _CONFIG._HOST, _CONFIG._PORT));
    console.log('Listening as ' + url);
});
