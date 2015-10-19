var React = require('react');
var Select = require('react-select');
//store
var TagStore = require('../../stores/TagStore');
//vendor
require('react-select.css');

// TODO: 共用
module.exports = React.createClass({
    getInitialState: function() {
        return {
            options: this.getOptions(TagStore.getData('all'))
        };
    },
    componentWillMount: function() {
        TagStore.addChangeListener(this.handleChange, 'menu');
    },
    componentWillUnmount: function() {
        TagStore.removeChangeListener(this.handleChange, 'menu');
    },
    render: function() {
        var value = [];
        if (this.props.value) {
            for (var key in this.props.value) {
                value.push(this.props.value[key].id);
            }
        }
        return (
            <Select placeholder="標籤" multi options={this.state.options} value={value} />
        );
    },
    handleChange: function(e) {
        this.setState({
            options: this.getOptions(TagStore.getData('all'))
        });
    },
    getOptions: function(data) {
        var v = [];
        for (var key in data) {
            v.push({
                value: data[key].id,
                label: data[key].name
            });
        }
        return v;
    }
});
