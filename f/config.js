var path = require('path');
var assign = require('object-assign');

module.exports = function(env) {
    var _CONFIG = {
        _ENV: env ? env : NODE_ENV
    };

    switch (_CONFIG._ENV) {
        case 'deploy.test':
            _CONFIG._HOST = '192.168.99.99';
            break;
        case 'deploy.aws':
            _CONFIG._HOST = '54.179.147.135';
            break;
        default:
            _CONFIG._HOST = 'localhost';
    }
    _CONFIG = assign({}, _CONFIG, {
        _PORT: 80,

        _NAME_F: 'Toro',
        _NAME_S: 'T',
        _VERSION: '0.1.0',

        // dataTable一頁幾筆資料
        _NUM_PAGE: 15
    });
    _CONFIG._URL_API = '//' + (_CONFIG._ENV == 'develop' ? '192.168.99.99' : _CONFIG._HOST) + '/crm/api';
    _CONFIG._URL_GITHUB = 'https://github.com/toro1121/crm';

    _CONFIG._DIR_APP = path.resolve(__dirname, 'app');
    _CONFIG._DIR_NODE = _CONFIG._DIR_APP + '/../node_modules';
    _CONFIG._DIR_BOWER = _CONFIG._DIR_APP + '/../bower_components';
    // if (!bool) {
    //     o.browser = {
    //         version: (window.navigator.userAgent.toLowerCase().match(/.(?:rv|it|ra|ie)[\/: ]([\d.]+)/) || [0, '0'])[1]
    //     };
    // }
    return _CONFIG;
};
