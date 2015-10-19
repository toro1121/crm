var React = require('react');
var Link = require('react-router').Link;
//action
var TagActionCreators = require('../../actions/TagActionCreators')({});
//store
var TagStore = require('../../stores/TagStore');
//jsx
var Checkbox = require('../element/Checkbox');

// TODO: tag panel.
module.exports = React.createClass({
    getInitialState: function() {
        return {
            data: TagStore.getData('all'),
            panel: TagStore.getPanel()
        };
    },
    componentWillMount: function() {
        TagStore.addChangeListener(this.handleChange);
        TagActionCreators.data('all');
    },
    componentWillUnmount: function() {
        TagStore.removeChangeListener(this.handleChange);
    },
    render: function() {
        return (
            <ul className="tagPanel" style={this.state.panel.style}>
                <li onClick={this.handleClick.bind(this, 'close')}>
                    <h5>
                        <i className="fa fa-tags"></i>
                        &nbsp;貼標籤
                    </h5>
                </li>
                <li>
                    <div className="input-group">
                        <span className="input-group-addon">
                            <i className="fa fa-search"></i>
                        </span>
                        <input type="search" className="form-control" />
                        <span className="input-group-addon link">
                            <i className="fa fa-close"></i>
                        </span>
                    </div>
                </li>
                <div className="body">
                    {this.state.data.map(function(value, key){
                        return(
                            <li key={key}>
                                <span><Checkbox id={'checkbox_' + value.id} className={value.checked ? 'checked' : ''} handleClick={this.handleClick} /></span>
                                <span>{value.name}</span>
                            </li>
                        );
                    }.bind(this))}
                </div>
                <li>
                    <Link to="tagGroupAdd">建立標籤</Link>
                </li>
                <li>
                    <Link to="tagGroup">管理標籤</Link>
                </li>
                <li>
                    <a href="javascript:void(0)" onClick={this.handleClick.bind(this, 'save')}>套用</a>
                </li>
            </ul>
        );
    },
    handleChange: function(e) {
        this.setState({
            data: TagStore.getData('all'),
            panel: TagStore.getPanel()
        });
    },
    handleClick: function(type, e) {
        switch (type) {
            case 'save':
                // TODO: client add tag.
                console.log('save');
            case 'close':
                var o = this.state;
                o.panel.style.display = 'none';
                this.setState(o);
                break;
        }
    }
});
