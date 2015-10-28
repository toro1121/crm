var React = require('react');
//custom
var _CONFIG = require('../../config')();

module.exports = React.createClass({
    render: function() {
        return (
            <footer className="main-footer">
				<div className="pull-right hidden-xs">
					<b>Version</b> 
					&nbsp;{_CONFIG.website.version}
				</div>
				<strong>
					Copyright &copy; 2014-2015&nbsp;
					<a href={_CONFIG.website.url} target="_blank">{_CONFIG.website.name1}</a>
					.&nbsp;
				</strong>
				All rights reserved.
			</footer>
        );
    }
});
