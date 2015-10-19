var assign = require('object-assign');
//constants
var AppConstants = require('../constants/AppConstants');
//dispatcher
var AppDispatcher = require('../dispatcher/AppDispatcher');

module.exports = assign(require('./AppActionCreators')({
    type1: 'client'
}), {
    tagPanel: function(type, data) {
        switch (type) {
            case 'style':
                var actionType = AppConstants.TAG_PANEL;
                break;
        }
        AppDispatcher.handleViewAction({
            actionType: actionType,
            data: data
        });
    }
});
