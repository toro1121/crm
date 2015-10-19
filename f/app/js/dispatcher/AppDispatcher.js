var Dispatcher = require('flux').Dispatcher;
var assign = require('object-assign');
//constants
var AppConstants = require('../constants/AppConstants');

module.exports = assign(new Dispatcher(), {
    handleServerAction: function(action) {
        this.dispatch({
            source: AppConstants.SERVER_ACTION,
            action: action
        });
    },
    handleViewAction: function(action) {
        this.dispatch({
            source: AppConstants.VIEW_ACTION,
            action: action
        });
    },
    handleRouterAction: function(path) {
        this.dispatch({
            source: AppConstants.ROUTER_ACTION,
            action: path
        });
    }
});
