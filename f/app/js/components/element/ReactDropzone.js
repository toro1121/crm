var React = require('react');
var Dropzone = require('react-dropzone');
var assign = require('object-assign');
//custom
var _CONFIG = require('../../config');

module.exports = React.createClass({
    render: function() {
        var opt = this.props.options;
        var style = [{
            borderRadius: '8px',
            display: 'inline-block'
        }, {
            width: '88px',
            height: '88px',
            padding: '8px',
            border: '2px dashed #bbb',
            cursor: 'pointer'
        }, {
            width: '88px',
            height: '88px',
            marginLeft: '15px',
            verticalAlign: 'top'
        }];
        var photo = _CONFIG.apiUrl + '/user/file/' + opt.id + '?' + opt.file;
        return (
            <div>
	            <Dropzone style={assign({}, style[0], style[1])} multiple={typeof opt.multiple == 'boolean' ? opt.mutiple : false} onDrop={this.props.handleDrop}>
	        		<div>把圖片拖曳至此，或是點擊上傳圖片。</div>
	        	</Dropzone>
	        	<img style={assign({}, style[0], style[2])} src={photo} />
        	</div>
        );
    }
});
