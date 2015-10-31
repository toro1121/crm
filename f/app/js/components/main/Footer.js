var React = require('react');
//custom
var _CONFIG = require('../../../../config')();

module.exports = React.createClass({
    render: function() {
        return (
            <footer className="main-footer">
				<div className="pull-right hidden-xs">
					<b>Version</b> 
					&nbsp;{_CONFIG._VERSION}
				</div>
				<strong>
					Copyright &copy; 2014-2015&nbsp;
					<a href={_CONFIG._URL_GITHUB} target="_blank">{_CONFIG._NAME_F}</a>
					.&nbsp;
				</strong>
				All rights reserved.
			</footer>
        );
    }
});
