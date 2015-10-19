var webpack = require('webpack');
var path = require('path');
var util = require('util');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var autoprefixer = require('autoprefixer-core');
var csswring = require('csswring');

/*
 * 設定參數
 */
var config = {
    host: 'localhost',
    port: 80,
    webDir: path.resolve(__dirname, '../app'),
};
config.appDir = config.webDir + '/js';
config.bowerDir = config.webDir + '/../bower_components';
config.nodeDir = config.webDir + '/../node_modules';

module.exports = function(option) {
    var entry = {
        bundle: [config.appDir + '/app'],
        vendor: []
    };
    var output = {
        path: config.appDir,
        publicPath: '/js',
        filename: '[name].js'
    };
    var resolve = {
        // root : [config.appDir, config.bowerDir, config.nodeDir],
        alias: {},
        extensions: ['', '.js', '.jsx', '.css', '.scss', '.sass']
    };
    var module = {
        noParse: [],
        loaders: [{
            test: /\.(png|jp(e)*g|gif|svg)\?*\w*/,
            loaders: ['url'],
            limit: 8192
        }, {
            test: /\.(woff(2)*|ttf|eot)\?*\w*/,
            loaders: ['url'],
            limit: 8192
        }, {
            test: /\.(js|jsx)$/,
            loaders: ['react-hot', 'babel'],
            include: path.resolve(__dirname, '../app/js')
        }]
    };
    var pugins = [
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            'window.jQuery': 'jquery',
            'root.jQuery': 'jquery'
        }),
        new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor.js')
    ];

    switch (option.status) {
        case 'develop':
            entry.bundle.push(util.format('webpack-dev-server/client?http://%s:%d', config.host, config.port), 'webpack/hot/dev-server');
            module.loaders.push({
                test: /\.s(c|a)ss$/,
                loaders: ['style', 'css', 'postcss', 'sass'],
                includePath: path.resolve(__dirname, './node_modules/compass-mixins/lib')
            }, {
                test: /\.css$/,
                loaders: ['style', 'css']
            });
            pugins.push(
                new webpack.HotModuleReplacementPlugin()
            );
            break;
        case 'deploy':
            output.path = config.webDir + '/../dist/js';
            module.loaders.push({
                test: /\.s(c|a)ss$/,
                loader: ExtractTextPlugin.extract('style', 'css!postcss!sass'),
                includePath: path.resolve(__dirname, './node_modules/compass-mixins/lib')
            }, {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract('style', 'css')
            });
            pugins.push(
                new HtmlWebpackPlugin({
                    filename: '../index.html',
                    template: config.webDir + '/index.template.html'
                }),
                new ExtractTextPlugin('../css/bundle.css'),
                new webpack.optimize.UglifyJsPlugin({
                    compress: {
                        warnings: false
                    }
                }),
                new webpack.optimize.DedupePlugin(),
                new webpack.NoErrorsPlugin()
            );
            break;
    }

    //add vendor
    var addVendor = function(type, name, path) {
        resolve.alias[name] = path;
        module.noParse.push(new RegExp('^' + name + '$'));
        if (type === 'js') {
            entry.vendor.push(name);
        }
    };
    addVendor('js', 'jquery', config.bowerDir + '/jquery/dist/jquery.min');

    //jQuery UI
    addVendor('js', 'jquery-ui', config.bowerDir + '/jquery-ui/jquery-ui.min');
    addVendor('css', 'jquery-ui.css', config.bowerDir + '/jquery-ui/themes/ui-lightness/jquery-ui.min');

    //bootstrap
    addVendor('css', 'bootstrap.css', config.bowerDir + '/bootstrap/dist/css/bootstrap.min');
    addVendor('js', 'bootstrap', config.bowerDir + '/bootstrap/dist/js/bootstrap.min');

    addVendor('css', 'font-awesome.css', config.bowerDir + '/font-awesome/css/font-awesome.min');
    addVendor('css', '_all-skins.css', config.bowerDir + '/admin-lte/dist/css/skins/_all-skins.min');
    addVendor('css', 'ionicons.css', config.bowerDir + '/ionicons/css/ionicons.min');
    addVendor('css', 'fullcalendar.min.css', config.bowerDir + '/admin-lte/plugins/fullcalendar/fullcalendar.min.css');
    addVendor('css', 'fullcalendar.print.css', config.bowerDir + '/admin-lte/plugins/fullcalendar/fullcalendar.print');

    addVendor('js', 'slimScroll', config.bowerDir + '/admin-lte/plugins/slimScroll/jquery.slimscroll.min');

    addVendor('js', 'fastclick', config.bowerDir + '/admin-lte/plugins/fastclick/fastclick');

    //colorpicker
    addVendor('js', 'colorpicker', config.bowerDir + '/colorpicker/jquery.colorpicker');
    addVendor('css', 'colorpicker.css', config.bowerDir + '/colorpicker/jquery.colorpicker.css');

    addVendor('css', 'react-data-components.css', config.nodeDir + '/react-data-components/css/table-twbs');
    addVendor('css', 'react-select.css', config.nodeDir + '/react-select/dist/default');

    addVendor('css', 'AdminLTE.css', config.bowerDir + '/admin-lte/dist/css/AdminLTE.min');

    return {
        webDir: config.webDir,
        host: config.host,
        port: config.port,
        entry: entry,
        output: output,
        postcss: [autoprefixer, csswring],
        resolve: resolve,
        module: module,
        plugins: pugins
    };
};
