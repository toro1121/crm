var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var {
    sort, filter
} = require('react-data-components').utils;
//constants
var AppConstants = require('../constants/AppConstants');
//dispatcher
var AppDispatcher = require('../dispatcher/AppDispatcher');
//action
var TagActionCreators = require('../actions/TagActionCreators')({});
//custom
var _CONFIG = require('../config')();
var _COMMON = require('../common');

_COMMON.storageInit('tag');
// FIXME: change tag menu verible(data.all => menu)
var o = _COMMON.storageLoad('tag') ? _COMMON.storageLoad('tag') : {
    bool: null,
    message: null,
    type: 'group',
    data: {
        all: []
    },
    panel: {
        style: {
            display: 'none',
            top: 0,
            left: 0
        }
    },
    group: {
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
            pageNum: _CONFIG.pageNum,
            currentPage: 0,
            totalPages: 0,
            filterValue: {}
        }
    },
    item: {
        data: {
            all: [],
            filter: [],
            page: [],
            one: [],
            checkbox: []
        },
        config: {
            keys: ['name'],
            sortBy: {
                prop: 'updated_at',
                order: 'descending'
            },
            pageNum: _CONFIG.pageNum,
            currentPage: 0,
            totalPages: 0,
            filterValue: {}
        }
    },
    industry: {
        data: {
            all: [],
            filter: [],
            page: [],
            one: [],
            checkbox: []
        },
        config: {
            keys: ['name'],
            sortBy: {
                prop: 'updated_at',
                order: 'descending'
            },
            pageNum: _CONFIG.pageNum,
            currentPage: 0,
            totalPages: 0,
            filterValue: {}
        }
    },
    career: {
        data: {
            all: [],
            filter: [],
            page: [],
            one: [],
            checkbox: []
        },
        config: {
            keys: ['name'],
            sortBy: {
                prop: 'updated_at',
                order: 'descending'
            },
            pageNum: _CONFIG.pageNum,
            currentPage: 0,
            totalPages: 0,
            filterValue: {}
        }
    },
};
o.group.config.filter = {
    search: {
        filter: function(a, b) {
            a = (a + '').toLowerCase().trim();
            b = (b + '').toLowerCase().trim();
            return b.indexOf(a) >= 0;
        }
    }
}
o.item.config.filter = {
    search: {
        filter: function(a, b) {
            a = (a + '').toLowerCase().trim();
            b = (b + '').toLowerCase().trim();
            return b.indexOf(a) >= 0;
        }
    }
}
o.industry.config.filter = {
    search: {
        filter: function(a, b) {
            a = (a + '').toLowerCase().trim();
            b = (b + '').toLowerCase().trim();
            return b.indexOf(a) >= 0;
        }
    }
}
o.career.config.filter = {
    search: {
        filter: function(a, b) {
            a = (a + '').toLowerCase().trim();
            b = (b + '').toLowerCase().trim();
            return b.indexOf(a) >= 0;
        }
    }
}

var Store = assign({}, EventEmitter.prototype, {
    getData: function(type, arg1, arg2) {
        var v;
        if (type == 'all') {
            v = o.data.all;
        } else {
            switch (arg1) {
                case 'list':
                    v = {
                        config: o[type].config,
                        data: o[type].data
                    };
                    break;
                case 'select':
                    v = o[type].data.all;
                    break;
                default:
                    v = {
                        bool: o.bool,
                        message: o.message,
                        data: o[type].data.one
                    };
                    if (arg2) {
                        v.bool = null;
                        v.message = null;
                    }
            }
        }
        return v;
    },
    getDataById: function(type, id) {
        if (!o[type].data.one.length || o[type].data.one[0].id != id) {
            o[type].data.one = [];
            for (var i = 0; i < o[type].data.all.length; i++) {
                if (o[type].data.all[i].id == id) {
                    o[type].data.one.push(o[type].data.all[i]);
                    break;
                }
            }
        }
        return o[type].data.one;
    },
    getPanel: function() {
        return o.panel;
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
        Store.dispatch(action);

        switch (action.actionType) {
            case AppConstants.TAG_DATA_ALL:
                o.data.all = action.res.data;
                Store.emitChange('menu');
                return true;
                break;
            case AppConstants.TAG_ADD:
            case AppConstants.TAG_EDIT:
                o.bool = action.res.bool;
                o.message = action.res.message;
                if (action.res.type && action.res.data) {
                    o[action.res.type].data.one = action.res.data;
                }

                //reload menu tag.
                TagActionCreators.data('all');
                break;
            case AppConstants.TAG_PANEL:
                o.panel.style = action.data;
                break;
            default:
        }

        if (!action.actionType.match(/ONE|ADD|EDIT/)) {
            o[o.type].data.page = o[o.type].data.filter.slice(o[o.type].config.pageNum * o[o.type].config.currentPage, o[o.type].config.pageNum * o[o.type].config.currentPage + o[o.type].config.pageNum);
            o[o.type].config.totalPages = Math.ceil(o[o.type].data.filter.length / o[o.type].config.pageNum);
        }
        if (action.actionType.match(/TAG/)) {
            _COMMON.storageSave('tag', o);
            Store.emitChange('change');
        }

        return true;
    }),
    dispatch: function(action) {
        var TYPE = action.actionType.split(/\_/)[1];
        var type = TYPE.toLowerCase();
        if (!type.match(/group|item|industry|career/)) {
            return;
        }

        switch (action.actionType) {
            case AppConstants['TAG_' + TYPE + '_DATA_ALL']:
                o.type = type;
                o[type].data.all = action.res.data;
                o[type].data.filter = sort(o[type].config.sortBy, o[type].data.all);
                for (var i in o[type].config.filterValue);
                if (i) {
                    o[type].data.filter = filter(o[type].config.filter, o[type].config.filterValue, o[type].data.all);
                }
                if (o[type].data.checkbox.length) {
                    var checkbox = [];
                    for (var i = 0; i < o[type].data.all.length; i++) {
                        for (var j = 0; j < o[type].data.checkbox.length; j++) {
                            if (o[type].data.all[i].id == o[type].data.checkbox[j]) {
                                o[type].data.all[i].checked = true;
                                checkbox.push(o[type].data.all[i].id);
                                break;
                            }
                        }
                    }
                    if (checkbox.length) {
                        checkbox.sort();
                    }
                    o[type].data.checkbox = checkbox;
                }

                //reload menu tag.
                TagActionCreators.data('all');
                break;
            case AppConstants['TAG_' + TYPE + '_DATA_ONE']:
                o[type].data.one = action.res.data;
                break;
            case AppConstants['TAG_' + TYPE + '_DATA_SORT']:
                o[type].config.sortBy = action.sortBy;
                o[type].data.filter = sort(o[type].config.sortBy, o[type].data.filter);
                break;
            case AppConstants['TAG_' + TYPE + '_DATA_PAGE']:
                o[type].config.currentPage = action.currentPage;
                break;
            case AppConstants['TAG_' + TYPE + '_DATA_FILTER']:
                o[type].config.filterValue[action.name] = action.value;
                o[type].data.filter = filter(o[type].config.filter, o[type].config.filterValue, o[type].data.all);
                o[type].config.currentPage = 0;
                break;
            case AppConstants['TAG_' + TYPE + '_CHECKBOX']:
                if (action.id == 'all') {
                    for (var i = 0; i < o[type].data.all.length; i++) {
                        for (var j = 0; j < o[type].data.page.length; j++) {
                            if (o[type].data.all[i].id == o[type].data.page[j].id) {
                                if (action.className) {
                                    o[type].data.all[i].checked = false;
                                    o[type].data.checkbox.splice(o[type].data.checkbox.indexOf(o[type].data.all[i].id), 1);
                                } else {
                                    o[type].data.all[i].checked = true;
                                    o[type].data.checkbox.push(o[type].data.all[i].id);
                                    o[type].data.checkbox.sort();
                                }
                                break;
                            }
                        }
                    }
                } else {
                    var id = parseInt(action.id);
                    var index = o[type].data.checkbox.indexOf(id);
                    if (index < 0) {
                        o[type].data.checkbox.push(id);
                        o[type].data.checkbox.sort();
                    } else {
                        o[type].data.checkbox.splice(index, 1);
                    }
                    for (var i = 0; i < o[type].data.all.length; i++) {
                        if (o[type].data.all[i].id == id) {
                            o[type].data.all[i].checked = o[type].data.all[i].checked ? false : true;
                            break;
                        }
                    }
                }
                break;
        }
    }
});

module.exports = Store;
