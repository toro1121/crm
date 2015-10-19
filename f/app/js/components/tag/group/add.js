var React = require('react');
var ReactRouter = require('react-router');
//action
var AppActionCreators = require('../../../actions/AppActionCreators')({});
var TagActionCreators = require('../../../actions/TagActionCreators')({
    type: 'group'
});
//stores
var TagStore = require('../../../stores/TagStore');
var UserStore = require('../../../stores/UserStore');
//custom
var _COMMON = require('../../../common');
//jsx
var Input_colorpicker = require('../../element/Input_colorpicker');

module.exports = React.createClass({
    mixins: [ReactRouter.History],
    getInitialState: function() {
        return TagStore.getData('group', false, true);
    },
    componentWillMount: function() {
        TagStore.addChangeListener(this.handleChange);
    },
    componentWillUnmount: function() {
        TagStore.removeChangeListener(this.handleChange);
    },
    render: function() {
        return (
            <div className="row">
                <div className="col-xs-12">
                    <div className="box">
                        <div className="box-header with-border">
                            <button type="button" className="btn btn-default btn-sm" onClick={this.handleClick}>
                                回上一頁
                            </button>
                            <h3 className="box-title"></h3>
                        </div>
                        <form className="form-horizontal" onSubmit={this.handleSubmit}>
                            <div className="box-body">
                                <div className="col-sm-12">
                                    <div className="form-group">
                                        <label htmlFor="name" className="col-sm-1 control-label">名稱</label>
                                        <div className="col-sm-11">
                                            <input type="text" className="form-control" id="name" placeholder="名稱" ref="name" />
                                        </div>
                                    </div>
                                </div>
                                <div className="col-sm-12">
                                    <div className="form-group">
                                        <label htmlFor="color" className="col-sm-1 control-label">顏色</label>
                                        <div className="col-sm-11">
                                            <Input_colorpicker ref="color" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="box-footer">
                                <button type="submit" className="btn btn-info btn-sm pull-right">
                                    新增
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    },
    handleChange: function(e) {
        this.setState(TagStore.getData('group'));
        if (this.state.bool) {
            setTimeout(function() {
                AppActionCreators.modal({
                    display: true,
                    message: this.state.message,
                    button: [{
                        type: 'ok',
                        fn: function() {
                            this.history.pushState(null, '/main/tag');
                            AppActionCreators.modal({
                                display: false
                            });
                        }.bind(this)
                    }]
                });
            }.bind(this), 1);
        }
    },
    handleSubmit: function(e) {
        e.preventDefault();
        var data = _COMMON.getInputData(this.refs);
        if (data.name) {
            data.user_id = UserStore.getData('profile').data.id;
            data.tagType = 'group';
            TagActionCreators.add(data);
        }
    },
    handleClick: function(e) {
        this.history.pushState(null, '/main/tag');
    }
});
