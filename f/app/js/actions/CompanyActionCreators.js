var assign = require('object-assign');

module.exports = assign(require('./AppActionCreators')({
    type1: 'company'
}), {});
