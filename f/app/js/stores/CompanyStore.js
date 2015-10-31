var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var {
    sort, filter
} = require('react-data-components').utils;
//constants
var AppConstants = require('../constants/AppConstants');
//dispatcher
var AppDispatcher = require('../dispatcher/AppDispatcher');
//custom
var _CONFIG = require('../../../config')();
var _COMMON = require('../common');

_COMMON.storageInit('company');
var o = _COMMON.storageLoad('company') ? _COMMON.storageLoad('company') : {
    bool: null,
    message: null,
    data: {
        all: [],
        filter: [],
        page: [],
        one: [],
        checkbox: []
    },
    config: {
        keys: ['id'],
        sortBy: {
            prop: 'updated_at',
            order: 'descending'
        },
        pageNum: _CONFIG._NUM_PAGE,
        currentPage: 0,
        totalPages: 0,
        filterValue: {}
    }
};
o.config.filter = {
    search: {
        filter: function(a, b) {
            a = (a + '').toLowerCase().trim();
            b = (b + '').toLowerCase().trim();
            return b.indexOf(a) >= 0;
        }
    }
}

var Store = assign({}, EventEmitter.prototype, {
    getData: function(arg1, arg2) {
        var v;
        switch (arg1) {
            case 'list':
                v = {
                    config: o.config,
                    data: o.data
                };
                break;
            case 'select':
                v = o.data.all;
                break;
            default:
                v = {
                    bool: o.bool,
                    message: o.message,
                    data: o.data.one
                };
                if (arg2) {
                    v.bool = null;
                    v.message = null;
                }
        }
        return v;
    },
    getDataById: function(id) {
        if (!o.data.one.length || o.data.one[0].id != id) {
            o.data.one = [];
            for (var i = 0; i < o.data.all.length; i++) {
                if (o.data.all[i].id == id) {
                    o.data.one.push(o.data.all[i]);
                    break;
                }
            }
        }
        return o.data.one;
    },
    //
    emitChange: function(type) {
        this.emit(type ? type : 'change');
    },
    addChangeListener: function(callback, type) {
        this.on(type ? type : 'change', callback);
    },
    removeChangeListener: function(callback, type) {
        this.removeListener(type ? type : 'change', callback);
    },
    //
    dispatchToken: AppDispatcher.register(function(payload) {
        var action = payload.action;
        switch (action.actionType) {
            case AppConstants.COMPANY_DATA_ALL:
                o.data.all = action.res.data;
                o.data.filter = sort(o.config.sortBy, o.data.all);
                for (var i in o.config.filterValue);
                if (i) {
                    o.data.filter = filter(o.config.filter, o.config.filterValue, o.data.all);
                }

                //
                if (action.res.tagId) {
                    var tmp = [];
                    for (var i in o.data.filter) {
                        for (var j in o.data.filter[i].industry) {
                            if (o.data.filter[i].industry[j].id == action.res.tagId) {
                                tmp.push(o.data.filter[i]);
                                break;
                            }
                        }
                    }
                    o.data.filter = tmp;
                }

                if (o.data.checkbox.length) {
                    var checkbox = [];
                    for (var i = 0; i < o.data.all.length; i++) {
                        for (var j = 0; j < o.data.checkbox.length; j++) {
                            if (o.data.all[i].id == o.data.checkbox[j]) {
                                o.data.all[i].checked = true;
                                checkbox.push(o.data.all[i].id);
                                break;
                            }
                        }
                    }
                    if (checkbox.length) {
                        checkbox.sort();
                    }
                    o.data.checkbox = checkbox;
                }
                break;
            case AppConstants.COMPANY_DATA_ONE:
                o.data.one = action.res.data;
                break;
            case AppConstants.COMPANY_DATA_SORT:
                o.config.sortBy = action.sortBy;
                o.data.filter = sort(o.config.sortBy, o.data.filter);
                break;
            case AppConstants.COMPANY_DATA_PAGE:
                o.config.currentPage = action.currentPage;
                break;
            case AppConstants.COMPANY_DATA_FILTER:
                o.config.filterValue[action.name] = action.value;
                o.data.filter = filter(o.config.filter, o.config.filterValue, o.data.all);
                o.config.currentPage = 0;
                break;
            case AppConstants.COMPANY_ADD:
            case AppConstants.COMPANY_EDIT:
                o.bool = action.res.bool;
                o.message = action.res.message;
                if (action.res.data) {
                    o.data.one = action.res.data;
                }
                break;
            case AppConstants.COMPANY_CHECKBOX:
                if (action.id == 'all') {
                    for (var i = 0; i < o.data.all.length; i++) {
                        for (var j = 0; j < o.data.page.length; j++) {
                            if (o.data.all[i].id == o.data.page[j].id) {
                                if (action.className) {
                                    o.data.all[i].checked = false;
                                    o.data.checkbox.splice(o.data.checkbox.indexOf(o.data.all[i].id), 1);
                                } else {
                                    o.data.all[i].checked = true;
                                    o.data.checkbox.push(o.data.all[i].id);
                                    o.data.checkbox.sort();
                                }
                                break;
                            }
                        }
                    }
                } else {
                    var id = parseInt(action.id);
                    var index = o.data.checkbox.indexOf(id);
                    if (index < 0) {
                        o.data.checkbox.push(id);
                        o.data.checkbox.sort();
                    } else {
                        o.data.checkbox.splice(index, 1);
                    }
                    for (var i = 0; i < o.data.all.length; i++) {
                        if (o.data.all[i].id == id) {
                            o.data.all[i].checked = o.data.all[i].checked ? false : true;
                            break;
                        }
                    }
                }
                break;
            default:
        }

        if (!action.actionType.match(/ONE|ADD|EDIT/)) {
            o.data.page = o.data.filter.slice(o.config.pageNum * o.config.currentPage, o.config.pageNum * o.config.currentPage + o.config.pageNum);
            o.config.totalPages = Math.ceil(o.data.filter.length / o.config.pageNum);
        }
        if (action.actionType.match(/COMPANY/)) {
            _COMMON.storageSave('company', o);
            Store.emitChange();
        }

        return true;
    })
});

module.exports = Store;
