var assign = require('object-assign');
//constants
var AppConstants = require('../constants/AppConstants');
//dispatcher
var AppDispatcher = require('../dispatcher/AppDispatcher');
//custom
var _CONFIG = require('../../../config')();

module.exports = function(config) {
    var o = {
        ajax: function(options, actionType) {
            options.url = _CONFIG._URL_API + options.url;
            //如果env = develop
            if (_CONFIG._ENV == 'develop') {
                options.xhrFields = {
                    withCredentials: true
                };
                options.data = assign({}, {
                    env: _CONFIG._ENV
                }, options.data);
            }
            $.ajax(assign({
                type: 'GET',
                dataType: 'json',
                success: function(res) {
                    if (actionType) {
                        AppDispatcher.handleViewAction({
                            actionType: actionType,
                            res: res
                        });
                    }
                }.bind(this)
            }, options));
        }
    };
    if (typeof config.type1 == 'undefined') {
        o.modal = function(data) {
            AppDispatcher.handleViewAction({
                actionType: AppConstants.MODAL_STATUS,
                res: data
            });
        };
    } else {
        var TYPE = config.type1.toUpperCase();
        o.data = function(id, tagId) {
            if (id) {
                this.ajax({
                    url: '/' + config.type1 + '/' + id
                }, AppConstants[TYPE + '_DATA_ONE']);
            } else {
                var setting = {
                    url: '/' + config.type1
                };
                if (tagId) {
                    setting.success = function(res) {
                        res.tagId = tagId;
                        AppDispatcher.handleViewAction({
                            actionType: AppConstants[TYPE + '_DATA_ALL'],
                            res: res
                        });
                    }
                }
                this.ajax(setting, AppConstants[TYPE + '_DATA_ALL']);
            }
        };
        o.add = function(data) {
            this.ajax({
                type: 'POST',
                url: '/' + config.type1,
                data: data
            }, AppConstants[TYPE + '_ADD']);
        };
        o.edit = function(data) {
            this.ajax({
                type: 'PUT',
                url: '/' + config.type1 + '/' + data.id,
                data: data
            }, AppConstants[TYPE + '_EDIT']);
        };
        o.del = function(id) {
            this.ajax({
                type: 'DELETE',
                url: '/' + config.type1 + '/' + id,
                data: {
                    id: id
                }
            }, AppConstants[TYPE + '_DATA_ALL']);
        };
        o.file = function(file) {
            var data = new FormData();
            data.append('file', file);
            this.ajax({
                type: 'POST',
                cache: false,
                processData: false,
                contentType: false,
                url: '/file',
                data: data
            });
        };
        o.sort = function(sortBy) {
            AppDispatcher.handleViewAction({
                actionType: AppConstants[TYPE + (config.type2 ? '_' + config.type2.toUpperCase() : '') + '_DATA_SORT'],
                sortBy: sortBy
            });
        };
        o.page = function(currentPage) {
            AppDispatcher.handleViewAction({
                actionType: AppConstants[TYPE + (config.type2 ? '_' + config.type2.toUpperCase() : '') + '_DATA_PAGE'],
                currentPage: currentPage
            });
        };
        o.filter = function(name, value) {
            var v = typeof value === 'object' ? value.target.value : value;
            AppDispatcher.handleViewAction({
                actionType: AppConstants[TYPE + (config.type2 ? '_' + config.type2.toUpperCase() : '') + '_DATA_FILTER'],
                name: name,
                value: v
            });
        };
        o.checkbox = function(id, className) {
            AppDispatcher.handleViewAction({
                actionType: AppConstants[TYPE + (config.type2 ? '_' + config.type2.toUpperCase() : '') + '_CHECKBOX'],
                id: id,
                className: className
            });
        };
    }

    return o;
};
