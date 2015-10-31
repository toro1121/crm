var React = require('react');
var Dropzone = require('react-dropzone');
//custom
var _CONFIG = require('../../../../config')();

module.exports = React.createClass({
    getInitialState: function() {
        return {};
    },
    render: function() {
        var opt = this.props.options;
        var photo = _CONFIG._URL_API + '/file/' + (opt.file && opt.file.length ? opt.file[0].id + '?' + opt.file[0].name : 'false');
        return (
            <div className="dropzone">
                <div className="uploader">
                    <Dropzone multiple={typeof opt.multiple == 'boolean' ? opt.mutiple : false} onDrop={this.props.handleDrop}>
                        <div>把圖片拖曳至此，或是點擊上傳圖片。</div>
                    </Dropzone>
                </div>
                {opt.multiple ?
                <div className="imageShowArea">
                    
                </div>
                :
                <img src={photo} />}
            </div>
        );
    },
    handleChange: function(e) {},
    handleClick: function(type, id, e) {

    }
});
