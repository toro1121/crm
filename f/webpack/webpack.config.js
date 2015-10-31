var webpack = require('webpack');
var path = require('path');
var util = require('util');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var autoprefixer = require('autoprefixer-core');
var csswring = require('csswring');

module.exports = function(env) {
    //讀入參數設定檔
    var _CONFIG = require('../config.js')(env);

    var entry = {
        bundle: [_CONFIG._DIR_APP + '/js/app'],
        vendor: []
    };
    var output = {
        path: _CONFIG._DIR_APP,
        publicPath: '/' + (_CONFIG._ENV == 'develop' ? '' : 'crm/'),
        filename: 'js/[name].[hash:8].js'
    };
    var resolve = {
        alias: {},
        extensions: ['', '.js', '.jsx', '.css', '.scss', '.sass']
    };
    var module = {
        noParse: [],
        loaders: [{
            test: /\.(png|jp(e)*g|gif|svg)\?*\w*/,
            loader: 'url-loader?limit=5120&name=image/[name].[hash:8].[ext]'
        }, {
            test: /\.(woff(2)*|ttf|eot)\?*\w*/,
            loader: 'url-loader?limit=5120&name=font/[name].[hash:8].[ext]'
        }, {
            test: /\.(js|jsx)$/,
            loaders: ['react-hot', 'babel'],
            include: path.resolve(__dirname, '../app/js')
        }]
    };
    var pugins = [
        new webpack.DefinePlugin({
            NODE_ENV: JSON.stringify(_CONFIG._ENV)
        }),
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            'window.jQuery': 'jquery',
            'root.jQuery': 'jquery'
        }),
        // TODO: CommonsChunkPlugin http://segmentfault.com/a/1190000003499526
        new webpack.optimize.CommonsChunkPlugin('vendor', 'js/vendor.[hash:8].js'),
        new HtmlWebpackPlugin({
            title: _CONFIG._NAME_F,
            filename: 'index.html',
            template: _CONFIG._DIR_APP + '/index.template.html',
            inject: 'body'
        })
    ];

    switch (_CONFIG._ENV) {
        case 'develop':
            entry.bundle.push(util.format('webpack-dev-server/client?http://%s:%d', _CONFIG._HOST, _CONFIG._PORT), 'webpack/hot/dev-server');
            module.loaders.push({
                test: /\.s(c|a)ss$/,
                loaders: ['style', 'css', 'postcss', 'sass'],
                includePath: _CONFIG._DIR_NODE + '/compass-mixins/lib'
            }, {
                test: /\.css$/,
                loaders: ['style', 'css']
            });
            pugins.push(
                new webpack.HotModuleReplacementPlugin()
            );
            break;
        case 'deploy.test':
        case 'deploy.aws':
            output.path = _CONFIG._DIR_APP + '/../dist';
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
    //jQuery
    addVendor('js', 'jquery', _CONFIG._DIR_BOWER + '/jquery/dist/jquery.min');
    //jQuery UI
    addVendor('js', 'jquery-ui', _CONFIG._DIR_BOWER + '/jquery-ui/jquery-ui.min');
    addVendor('css', 'jquery-ui.css', _CONFIG._DIR_BOWER + '/jquery-ui/themes/ui-lightness/jquery-ui.min');
    //bootstrap
    addVendor('css', 'bootstrap.css', _CONFIG._DIR_BOWER + '/bootstrap/dist/css/bootstrap.min');
    addVendor('js', 'bootstrap', _CONFIG._DIR_BOWER + '/bootstrap/dist/js/bootstrap.min');
    //Admin-LTE
    addVendor('css', 'font-awesome.css', _CONFIG._DIR_BOWER + '/font-awesome/css/font-awesome.min');
    addVendor('css', '_all-skins.css', _CONFIG._DIR_BOWER + '/admin-lte/dist/css/skins/_all-skins.min');
    addVendor('css', 'ionicons.css', _CONFIG._DIR_BOWER + '/ionicons/css/ionicons.min');
    addVendor('css', 'fullcalendar.min.css', _CONFIG._DIR_BOWER + '/admin-lte/plugins/fullcalendar/fullcalendar.min.css');
    addVendor('css', 'fullcalendar.print.css', _CONFIG._DIR_BOWER + '/admin-lte/plugins/fullcalendar/fullcalendar.print');
    addVendor('js', 'slimScroll', _CONFIG._DIR_BOWER + '/admin-lte/plugins/slimScroll/jquery.slimscroll.min');
    addVendor('js', 'fastclick', _CONFIG._DIR_BOWER + '/admin-lte/plugins/fastclick/fastclick');
    //colorpicker
    addVendor('js', 'colorpicker', _CONFIG._DIR_BOWER + '/colorpicker/jquery.colorpicker');
    addVendor('css', 'colorpicker.css', _CONFIG._DIR_BOWER + '/colorpicker/jquery.colorpicker.css');
    //react-data-components
    addVendor('css', 'react-data-components.css', _CONFIG._DIR_NODE + '/react-data-components/css/table-twbs');
    addVendor('css', 'react-select.css', _CONFIG._DIR_NODE + '/react-select/dist/default');
    //Admin-LTE css
    addVendor('css', 'AdminLTE.css', _CONFIG._DIR_BOWER + '/admin-lte/dist/css/AdminLTE.min');

    return {
        _CONFIG: _CONFIG,
        //webpack options
        entry: entry,
        output: output,
        postcss: [autoprefixer, csswring],
        resolve: resolve,
        module: module,
        plugins: pugins
    };
};
