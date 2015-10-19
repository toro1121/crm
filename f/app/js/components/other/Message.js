var React = require('react');

module.exports = React.createClass({
    render: function() {
        return (
            <p className="login-box-msg" dangerouslySetInnerHTML={{__html: this.props.message}}></p>
        );
    }
});
