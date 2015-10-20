var React = require('react');
var ReactRouter = require('react-router');
//action
var AppActionCreators = require('../../actions/AppActionCreators')({});
var CompanyActionCreators = require('../../actions/CompanyActionCreators');
//stores
var CompanyStore = require('../../stores/CompanyStore');
var UserStore = require('../../stores/UserStore');
//custom
var _COMMON = require('../../common');
//jsx
var Select = require('../element/Select');

module.exports = React.createClass({
    mixins: [ReactRouter.History],
    getInitialState: function() {
        var o = CompanyStore.getData(false, true);
        o.data = CompanyStore.getDataById(this.props.params.id);
        if (!o.data.length) {
            CompanyActionCreators.data(this.props.params.id);
        }
        return o;
    },
    componentWillMount: function() {
        CompanyStore.addChangeListener(this.handleChange);
    },
    componentWillUnmount: function() {
        CompanyStore.removeChangeListener(this.handleChange);
    },
    render: function() {
        return (
            <div className="row">
                <div className="col-xs-12">
                    <div className="box">
                        <div className="box-header with-border">
                            <button type="submit" className="btn btn-default btn-sm" onClick={this.handleClick}>
                                回上一頁
                            </button>
                            <h3 className="box-title"></h3>
                        </div>
                        <form className="form-horizontal" onSubmit={this.handleSubmit}>
                            <input type="hidden" ref="id" value={this.state.data.length ? this.state.data[0].id : ''} />
                            <div className="box-body">
                                <div className="col-sm-6">
                                    <div className="form-group">
                                        <label htmlFor="industry" className="col-sm-2 control-label">產業</label>
                                        <div className="col-sm-10">
                                            <Select type="industry" ref="industry" value={this.state.data.length && this.state.data[0].industry.length ? this.state.data[0].industry[0].id : ''} handleChange={this.handleChange} />
                                        </div>
                                    </div>
                                </div>
                                <div className="col-sm-6">
                                    <div className="form-group">
                                        <label htmlFor="name" className="col-sm-2 control-label">名稱</label>
                                        <div className="col-sm-10">
                                            <input type="text" className="form-control" id="name" placeholder="名稱" ref="name" value={this.state.data.length ? this.state.data[0].name : ''} onChange={this.handleChange} />
                                        </div>
                                    </div>
                                </div>
                                <div className="col-sm-6">
                                    <div className="form-group">
                                        <label htmlFor="phone" className="col-sm-2 control-label">電話</label>
                                        <div className="col-sm-10">
                                            <input type="text" className="form-control" id="phone" placeholder="電話" ref="phone" value={this.state.data.length ? this.state.data[0].phone : ''} onChange={this.handleChange} />
                                        </div>
                                    </div>
                                </div>
                                <div className="col-sm-6">
                                    <div className="form-group">
                                        <label htmlFor="mail" className="col-sm-2 control-label">Mail</label>
                                        <div className="col-sm-10">
                                            <input type="mail" className="form-control" id="mail" placeholder="Mail" ref="mail" value={this.state.data.length ? this.state.data[0].mail : ''} onChange={this.handleChange} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="box-footer">
                                <div className="col-sm-12">
                                <div className="form-group">
                                    <label htmlFor="remark" className="col-sm-1 control-label">備註</label>
                                    <div className="col-sm-11">
                                        <textarea className="form-control" rows="5" placeholder="備註" ref="remark" value={this.state.data.length ? this.state.data[0].remark : ''} onChange={this.handleChange}></textarea>
                                    </div>
                                </div>
                                </div>
                            </div>
                            <div className="box-footer">
                                <button type="submit" className="btn btn-info btn-sm pull-right">
                                    編輯
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    },
    handleChange: function(e) {
        if (e) {
            this.setState(React.addons.update(this.state, {
                data: [{
                    $merge: _COMMON.stateMerge(e)
                }]
            }));
        } else {
            this.setState(CompanyStore.getData());
            if (this.state.bool) {
                setTimeout(function() {
                    AppActionCreators.modal({
                        display: true,
                        message: this.state.message,
                        button: [{
                            type: 'ok',
                            fn: function() {
                                this.history.pushState(null, '/main/company');
                                AppActionCreators.modal({
                                    display: false
                                });
                            }.bind(this)
                        }]
                    });
                }.bind(this), 1);
            }
        }
    },
    handleSubmit: function(e) {
        e.preventDefault();
        var data = _COMMON.getInputData(this.refs);
        if (data.name) {
            data.user_id = UserStore.getData('profile').data.id;
            CompanyActionCreators.edit(data);
        }
    },
    handleClick: function(e) {
        this.history.pushState(null, '/main/company');
    }
});