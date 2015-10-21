var React = require('react');
//jsx
var Header = require('./main/Header');
var Menu = require('./main/Menu');
var Footer = require('./main/Footer');
var ContentHeader = require('./main/ContentHeader');
//vendor
require('_all-skins.css');

module.exports = React.createClass({
    render: function() {
        return (
            <div className="wrapper">
                <Header state={this.props.state} />
                <Menu />
                <div className="content-wrapper">
                    <ContentHeader routes={this.props.routes} location={this.props.location} />
                    <section className="content">
                        {this.props.children}
                    </section>
                </div>
                <Footer />
                <div className="control-sidebar-bg"></div>
            </div>
        );
    }
});
