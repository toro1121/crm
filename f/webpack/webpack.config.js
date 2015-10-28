var webpack = require('webpack');
var assign = require('object-assign');
var path = require('path');
var util = require('util');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var autoprefixer = require('autoprefixer-core');
var csswring = require('csswring');

/*
 * 設定參數
 */
var config = assign({}, {
    host: 'localhost',
    port: 80,
    webDir: path.resolve(__dirname, '../app'),
}, require('../app/js/config.js')('webpack'));
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
        // publicPath: config.appDir,
        filename: 'js/[name].[hash:8].js'
    };
    var resolve = {
        alias: {},
        extensions: ['', '.js', '.jsx', '.css', '.scss', '.sass']
    };

    var filePath = '';
    switch (option.status) {
        case 'deploy.test':
            filePath = '/';
            break;
        case 'deploy.prod':
            filePath = '/crm/'
            break;
    }

    var module = {
        noParse: [],
        loaders: [{
            test: /\.(png|jp(e)*g|gif|svg)\?*\w*/,
            loader: 'url-loader?limit=5120&name=' + filePath + 'image/[name].[hash:8].[ext]'
        }, {
            test: /\.(woff(2)*|ttf|eot)\?*\w*/,
            loader: 'url-loader?limit=5120&name=' + filePath + 'font/[name].[hash:8].[ext]'
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
        // TODO: CommonsChunkPlugin http://segmentfault.com/a/1190000003499526
        new webpack.optimize.CommonsChunkPlugin('vendor', 'js/vendor.[hash:8].js'),
        new HtmlWebpackPlugin({
            title: config.website.name1,
            filename: 'index.html',
            template: config.webDir + '/index.template.html',
            inject: 'body'
        })
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
        case 'deploy.test':
        case 'deploy.prod':
            output.path = config.webDir + '/../dist';
            module.loaders.push({
                test: /\.s(c|a)ss$/,
                loader: ExtractTextPlugin.extract('style', 'css!postcss!sass'),
                includePath: path.resolve(__dirname, './node_modules/compass-mixins/lib')
            }, {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract('style', 'css')
            });
            pugins.push(
                new ExtractTextPlugin('css/style.[hash:8].css'),
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
        //js自動加入entry.vender
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
