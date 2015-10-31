var assign = require('object-assign');
//constants
var AppConstants = require('../constants/AppConstants');

module.exports = assign(require('./AppActionCreators')({
    type1: 'user'
}), {
    userStatus: function(data) {
        this.ajax({
            url: '/user/status',
            data: data
        }, AppConstants.USER_STATUS);
    },
    userLogin: function(data) {
        this.ajax({
            url: '/user/login',
            data: data
        }, AppConstants.USER_LOGINOUT);
    },
    userLogout: function(data) {
        this.ajax({
            url: '/user/logout',
            data: data
        }, AppConstants.USER_LOGINOUT);
    },
    userRegister: function(data) {
        this.ajax({
            url: '/user/register',
            data: data
        }, AppConstants.USER_REGISTER);
    },
    userForget: function(data) {
        this.ajax({
            url: '/user/forget',
            data: data
        }, AppConstants.USER_FORGET);
    }
});
