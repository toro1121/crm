var React = require('react');
//custom
var _CONFIG = require('../../../../config')();

module.exports = React.createClass({
    render: function() {
        return (
            <div className="login-logo">
				<a href="#/">
					<b>{_CONFIG._NAME_F}</b>
					CRM
				</a>
			</div>
        );
    }
});
