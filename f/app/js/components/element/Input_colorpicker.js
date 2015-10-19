var React = require('react');
//vendor
require('jquery-ui.css');
require('colorpicker.css');

module.exports = React.createClass({
    componentDidMount: function() {
        $(function() {
            $('#color').colorpicker({
                altField: '#color',
                parts: ['map', 'bar'],
                layout: {
                    map: [0, 0, 1, 1],
                    bar: [1, 0, 1, 1]
                },
                part: {
                    map: {
                        size: 128
                    },
                    bar: {
                        size: 128
                    }
                }
            });
        });
    },
    render: function() {
        return (
        	<input type="text" className="form-control" id="color" defaultValue={this.props.value ? this.props.value : 'ff0000'} />
    	);
    }
});
