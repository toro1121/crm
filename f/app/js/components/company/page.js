var React = require('react');
var ReactRouter = require('react-router');
var Link = ReactRouter.Link;
//action
var AppActionCreators = require('../../actions/AppActionCreators')({});
var CompanyActionCreators = require('../../actions/CompanyActionCreators');
//stores
var CompanyStore = require('../../stores/CompanyStore');
//jsx
var Control = require('../element/DataTable').Control;

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
        var state = {
            control: ['back', {
                type: 'custom',
                name: '編輯',
                class: 'btn-default',
                fn: function() {
                    this.history.pushState(null, '/main/company/edit/' + this.props.params.id);
                }.bind(this)
            }, {
                type: 'custom',
                name: '刪除',
                class: 'btn-default',
                fn: function() {
                    AppActionCreators.modal({
                        display: true,
                        message: 'Are you sure?',
                        button: [{
                            type: 'ok',
                            fn: function() {
                                CompanyActionCreators.del([this.props.params.id]);
                                if (!this.history.goBack()) {
                                    this.history.pushState(null, '/main/company');
                                }
                                AppActionCreators.modal({
                                    display: false
                                });
                            }.bind(this)
                        }, 'cancel']
                    });
                }.bind(this)
            }]
        };
        return (
            <div className="row">
                <Control state={state} handleClick={this.handleClick} />
                <div className="col-xs-12">
                    <div className="box">
                        <div className="box-header with-border" style={{verticalAlign:'bottom'}}>
                            <h3 className="box-title">
                                &nbsp;&nbsp;
                                <i className="fa fa-hospital-o"></i>
                                &nbsp;&nbsp;
                                {this.state.data.length ? this.state.data[0].name : ''}
                            </h3>
                        </div>
                        <div className="box-body">
                            <div className="col-sm-3">
                                <div className="form-group field">
                                    <label className="col-sm-4 control-label">產業</label>
                                    <div className="col-sm-8">
                                        {this.state.data.length && this.state.data[0].industry.length ?
                                            <Link to={'/main/company?id=' + this.state.data[0].industry[0].id}>{this.state.data[0].industry[0].name}</Link>
                                        : null}
                                    </div>
                                </div>
                            </div>
                            <div className="col-sm-3">
                                <div className="form-group field">
                                    <label className="col-sm-4 control-label">名稱</label>
                                    <div className="col-sm-8">{this.state.data.length ? this.state.data[0].name : ''}</div>
                                </div>
                            </div>
                            <div className="col-sm-3">
                                <div className="form-group field">
                                    <label className="col-sm-4 control-label">英文名稱</label>
                                    <div className="col-sm-8">{this.state.data.length ? this.state.data[0].ename : ''}</div>
                                </div>
                            </div>
                            <div className="col-sm-3">
                                <div className="form-group field">
                                    <label className="col-sm-4 control-label">簡稱</label>
                                    <div className="col-sm-8">{this.state.data.length ? this.state.data[0].sname : ''}</div>
                                </div>
                            </div>
                        </div>
                        <div className="box-footer">
                            <div className="col-sm-6">
                                <div className="form-group field">
                                    <label className="col-sm-2 control-label">統一編號</label>
                                    <div className="col-sm-10">{this.state.data.length ? this.state.data[0].number : ''}</div>
                                </div>
                            </div>
                            <div className="col-sm-3">
                                <div className="form-group field">
                                    <label className="col-sm-4 control-label">資本額</label>
                                    <div className="col-sm-8">{this.state.data.length ? this.state.data[0].capital : ''}</div>
                                </div>
                            </div>
                            <div className="col-sm-3">
                                <div className="form-group field">
                                    <label className="col-sm-4 control-label">人力規模</label>
                                    <div className="col-sm-8">{this.state.data.length ? this.state.data[0].scale : ''}</div>
                                </div>
                            </div>
                        </div>
                        <div className="box-footer">
                            <div className="col-sm-3">
                                <div className="form-group field">
                                    <label className="col-sm-4 control-label">電話</label>
                                    <div className="col-sm-8">{this.state.data.length ? this.state.data[0].phone : ''}</div>
                                </div>
                            </div>
                            <div className="col-sm-3">
                                <div className="form-group field">
                                    <label className="col-sm-4 control-label">傳真</label>
                                    <div className="col-sm-8">{this.state.data.length ? this.state.data[0].fax : ''}</div>
                                </div>
                            </div>
                            <div className="col-sm-6">
                                <div className="form-group field">
                                    <label className="col-sm-2 control-label">Email</label>
                                    <div className="col-sm-10">
                                        {this.state.data.length ? <a href={'mailto:' + this.state.data[0].email}>{this.state.data[0].email}</a> : null}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="box-footer">
                            <div className="col-sm-12">
                                <div className="form-group field">
                                    <label className="col-sm-1 control-label">地址</label>
                                    <div className="col-sm-11">{this.state.data.length ? this.state.data[0].address : ''}</div>
                                </div>
                            </div>
                        </div>
                        <div className="box-footer">
                            <div className="col-sm-12">
                                <div className="form-group field">
                                    <label className="col-sm-1 control-label">備註</label>
                                    <div className="col-sm-11">
                                        <pre>{this.state.data.length ? this.state.data[0].remark : ''}</pre>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    },
    handleChange: function(e) {
        this.setState(CompanyStore.getData());
    },
    handleClick: function(type, id, e) {
        if (!this.history.goBack()) {
            this.history.pushState(null, '/main/company');
        }
    }
});
