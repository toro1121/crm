var React = require('react');
var ReactRouter = require('react-router');
var Link = ReactRouter.Link;
//action
var AppActionCreators = require('../../actions/AppActionCreators')({});
var CompanyActionCreators = require('../../actions/CompanyActionCreators');
//stores
var CompanyStore = require('../../stores/CompanyStore');
//jsx
var DataTable = require('../element/DataTable');

module.exports = React.createClass({
    mixins: [ReactRouter.History],
    getInitialState: function() {
        var o = CompanyStore.getData('list');
        o.config.columns = [{
            title: '名稱',
            prop: 'name',
            render: (val, row) => (<Link to={'/main/company/page/' + row.id}>{row.name}</Link>)
        }, {
            title: '產業',
            render: (val, row) => (row.industry.length ? <Link to={'/main/company?id=' + row.industry[0].id}>{row.industry[0].name}</Link> : '')
        }, {
            title: '電話',
            prop: 'phone'
        }, {
            title: '地址',
            prop: 'address'
        }, {
            title: '修改時間',
            prop: 'updated_at'
        }, {
            title: '修改者',
            prop: 'user',
            className: 'empty-cell',
            render: (val, row) => (<span>{row.user ? row.user.name : ''}</span>)
        }];
        o.config.button = {
            control: ['add', 'del'],
            table: ['checkbox', {
                type: 'control',
                button: ['edit', 'del']
            }]
        };
        return o;
    },
    componentWillReceiveProps: function() {
        setTimeout(function() {
            CompanyActionCreators.data(false, this.props.location.query.id);
        }.bind(this), 1);
    },
    componentWillMount: function() {
        CompanyStore.addChangeListener(this.handleChange);
        CompanyActionCreators.data(false, this.props.location.query.id);
    },
    componentWillUnmount: function() {
        CompanyStore.removeChangeListener(this.handleChange);
    },
    render: function() {
        return (
            <div className="row list">
                <DataTable.Control state={this.state.config.button} handleClick={this.handleClick} />
                <div className="col-xs-12">
                    <div className="box">
                        <div className="box-body">
                            <DataTable.Table state={this.state} handleClick={this.handleClick} handleSort={CompanyActionCreators.sort} handleChangePage={CompanyActionCreators.page} handleSearch={CompanyActionCreators.filter} />
                        </div>
                    </div>
                </div>
            </div>
        );
    },
    handleChange: function(e) {
        this.setState(CompanyStore.getData('list'));
    },
    handleClick: function(type, id, e) {
        switch (type) {
            case 'add':
                this.history.pushState(null, '/main/company/add');
                break;
            case 'edit':
                this.history.pushState(null, '/main/company/edit/' + id);
                break;
            case 'del':
                AppActionCreators.modal(id == 'all' && !this.state.data.checkbox.length ? {
                    display: true,
                    message: '請先勾選欲刪除項目!',
                    button: ['ok']
                } : {
                    display: true,
                    message: 'Are you sure?',
                    button: [{
                        type: 'ok',
                        fn: function() {
                            var ids = id == 'all' ? this.state.data.checkbox : [id];
                            CompanyActionCreators.del(ids);
                            AppActionCreators.modal({
                                display: false
                            });
                        }.bind(this)
                    }, 'cancel']
                });
                break;
            case 'checkbox':
                CompanyActionCreators.checkbox(id, e);
                break;
        }
    }
});
