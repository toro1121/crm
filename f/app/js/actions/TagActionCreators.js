var assign = require('object-assign');
//constants
var AppConstants = require('../constants/AppConstants');

module.exports = function(config) {
    return assign(require('./AppActionCreators')({
        type1: 'tag',
        type2: config.type
    }), {
        data: function(type, id, parent_id) {
            if (type == 'all') {
                this.ajax({
                    url: '/tag'
                }, AppConstants['TAG_DATA_ALL']);
            } else if (parent_id) {
                if (id) {
                    this.ajax({
                        url: '/tag/' + type + '/' + parent_id + '/' + id
                    }, AppConstants['TAG_' + type.toUpperCase() + '_DATA_ONE']);
                } else {
                    this.ajax({
                        url: '/tag/' + type + '/' + parent_id
                    }, AppConstants['TAG_' + type.toUpperCase() + '_DATA_ALL']);
                }
            } else if (id) {
                this.ajax({
                    url: '/tag/' + type + '/' + id
                }, AppConstants['TAG_' + type.toUpperCase() + '_DATA_ONE']);
            } else {
                this.ajax({
                    url: '/tag/' + type
                }, AppConstants['TAG_' + type.toUpperCase() + '_DATA_ALL']);
            }
        },
        del: function(id, parent_id) {
            this.ajax({
                type: 'DELETE',
                url: '/tag/' + id,
                data: {
                    parent_id: parent_id,
                    id: id
                }
            }, parent_id ? AppConstants.TAG_ITEM_DATA_ALL : AppConstants.TAG_GROUP_DATA_ALL);
        }
    });
}
