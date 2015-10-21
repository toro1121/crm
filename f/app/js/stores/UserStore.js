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
var AppActionCreators = require('../actions/AppActionCreators')({});
var UserActionCreators = require('../actions/UserActionCreators');
//custom
var _CONFIG = require('../config');

var timer = false;
var o = {
    bool: null,
    message: null,
    data: {
        all: [],
        filter: [],
        page: [],
        one: []
    },
    profile: {
        status: null,
        data: {}
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
            case 'profile':
                v = o[arg1];
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
            case AppConstants.USER_STATUS:
                // o.message = action.res.message;
                o.profile.status = action.res.bool;
                o.profile.data = action.res.data;

                //一分鐘檢查一次登入狀態
                if (timer) {
                    clearTimeout(timer);
                    timer = false;
                }
                if (o.profile.status) {
                    timer = setTimeout(function() {
                        UserActionCreators.userStatus();
                    }, 60000);
                }

                Store.emitChange('status');
                return true;
                break;
            case AppConstants.USER_LOGINOUT:
                o.profile.status = action.res.bool;
                o.profile.data = action.res.data;
                //檢查登入狀態
                UserActionCreators.userStatus();
                Store.emitChange('status');
                return true;
            case AppConstants.USER_REGISTER:
            case AppConstants.USER_FORGET:
                o.bool = action.res.bool;
                o.message = action.res.message;

                if (action.res.bool) {
                    setTimeout(function() {
                        AppActionCreators.modal({
                            display: true,
                            message: action.res.message,
                            button: ['ok']
                        });
                    }, 1);
                }
                break;
            case AppConstants.USER_ADD:
            case AppConstants.USER_EDIT:
                o.bool = action.res.bool;
                o.message = action.res.message;
                if (action.res.data) {
                    o.data.one = action.res.data;
                }
                if (action.res.isProfile) {
                    o.profile.data = action.res.data[0];
                    Store.emitChange('status');
                }
                break;
            default:
        }

        if (action.actionType.match(/USER/)) {
            Store.emitChange('change');
        }

        return true;
    })
});

module.exports = Store;
