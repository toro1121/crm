var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
//constants
var AppConstants = require('../constants/AppConstants');
//dispatcher
var AppDispatcher = require('../dispatcher/AppDispatcher');
//action
var AppActionCreators = require('../actions/AppActionCreators')({});

var CHANGE_EVENT = 'change';
var o = {
    modal: {
        display: false,
        title: '訊息',
        message: null,
        button: [],
    }
};

var Store = assign({}, EventEmitter.prototype, {
    getModal: function() {
        return o.modal;
    },
    //
    emitChange: function() {
        this.emit(CHANGE_EVENT);
    },
    addChangeListener: function(callback) {
        this.on(CHANGE_EVENT, callback);
    },
    removeChangeListener: function(callback) {
        this.removeListener(CHANGE_EVENT, callback);
    },
    //
    dispatchToken: AppDispatcher.register(function(payload) {
        var action = payload.action;
        switch (action.actionType) {
            case AppConstants.MODAL_STATUS:
                o.modal = assign(o.modal, action.res);

                var defaultButton = [{
                    type: 'ok',
                    name: '確認',
                    class: 'btn-info',
                    fn: function() {
                        AppActionCreators.modal({
                            display: false
                        });
                    }
                }, {
                    type: 'cancel',
                    name: '取消',
                    class: 'btn-default',
                    fn: function() {
                        AppActionCreators.modal({
                            display: false
                        });
                    }
                }];
                var button = [];

                for (var i = 0; i < o.modal.button.length; i++) {
                    if (typeof o.modal.button[i] === 'string' || typeof o.modal.button[i] === 'object') {
                        if (o.modal.button[i].type == 'custom') {
                            button.push(assign({
                                class: 'btn-default',
                                fn: function() {}
                            }, o.modal.button[i]));
                        } else {
                            for (var j = 0; j < defaultButton.length; j++) {
                                if (o.modal.button[i] == defaultButton[j].type) {
                                    button.push(defaultButton[j]);
                                    break;
                                } else if (o.modal.button[i].type == defaultButton[j].type) {
                                    button.push(assign(defaultButton[j], o.modal.button[i]));
                                    break;
                                }
                            }
                        }
                    }
                }
                o.modal.button = button;

                Store.emitChange();
                break;
        }

        return true;
    })
});

module.exports = Store;
