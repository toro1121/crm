var React = require('react');
//action
var AppActionCreators = require('../../actions/AppActionCreators')({});
//store
var AppStore = require('../../stores/AppStore');

module.exports = React.createClass({
    getInitialState: function() {
        return AppStore.getModal();
    },
    componentWillMount: function() {
        AppStore.addChangeListener(this.handleChange);
    },
    componentWillUnmount: function() {
        AppStore.removeChangeListener(this.handleChange);
    },
    render: function() {
        return this.state.display ? (
            <div className="modal">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={this.handleClick}>
                                <span aria-hidden="true">&times;</span>
                            </button>
                            <h4 className="modal-title" dangerouslySetInnerHTML={{__html: this.state.title}}></h4>
                        </div>
                        <div className="modal-body">
                            <p>{this.state.message}</p>
                        </div>
                        <div className="modal-footer">
                            {this.state.button.map(function(value, key) {
                                return (
                                    <button type="button" className={'btn ' + value.class} onClick={value.fn} key={key}>{value.name}</button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        ) : <div />;
    },
    handleChange: function(e) {
        this.setState(AppStore.getModal());
    },
    handleClick: function(type, e) {
        AppActionCreators.modal({
            display: false
        });
    }
});
