var React = require('react');
var ReactRouter = require('react-router');
var Link = ReactRouter.Link;
//action
var AppActionCreators = require('../../actions/AppActionCreators')({});
var ClientActionCreators = require('../../actions/ClientActionCreators');
//stores
var ClientStore = require('../../stores/ClientStore');
//jsx
var DataTable = require('../element/DataTable');
var TagPanel = require('../element/TagPanel');

module.exports = React.createClass({
    mixins: [ReactRouter.History],
    getInitialState: function() {
        var o = ClientStore.getData('list');
        o.config.columns = [{
            title: '姓名',
            prop: 'name',
            render: (val, row) => (<Link to={'/main/client/page/' + row.id}>{row.name}</Link>)
        }, {
            title: '公司',
            render: (val, row) => (row.company ? <Link to={'/main/company/page/' + row.company.id}>{row.company.name}</Link> : '')
        }, {
            title: '職位',
            render: (val, row) => (row.career.length ? <Link to={'/main/client?id=' + row.career[0].id}>{row.career[0].name}</Link> : '')
        }, {
            title: '電話',
            prop: 'phone'
        }, {
            title: '手機',
            prop: 'mobile'
        }, {
            title: 'Mail',
            prop: 'email',
            render: (val, row) => (<a href={'mailto:' + row.email}>{row.email}</a>)
        }, {
            title: '標籤',
            className: 'tag',
            render: (val, row) => <div className="tag">{row.tag.map(function(value, key){
                var style = {
                    background: '#' + value.color
                };
                var query = {id:value.id};
                return (<span key={key} style={style}><Link to={'/main/client'} query={query}>{value.name}</Link></span>);
            })}</div>
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
            control: [
                // TODO: 多筆貼標籤
                // {
                //     type: 'custom',
                //     name: <span><i className="fa fa-tags"></i>&nbsp;貼標籤</span>,
                //     class: 'btn-info',
                //     fn: function(e) {
                //         this.handleClick('tag', false, e);
                //     }.bind(this)
                // }, 
                'add', 'del'
            ],
            table: ['checkbox', {
                type: 'control',
                button: ['edit', 'del']
            }]
        };
        return o;
    },
    componentWillReceiveProps: function() {
        setTimeout(function() {
            ClientActionCreators.data(false, this.props.location.query.id);
        }.bind(this), 1);
    },
    componentWillMount: function() {
        ClientStore.addChangeListener(this.handleChange);
        ClientActionCreators.data(false, this.props.location.query.id);
    },
    componentWillUnmount: function() {
        ClientStore.removeChangeListener(this.handleChange);
    },
    render: function() {
        return (
            <div className="row list tag">
                <TagPanel />
                <DataTable.Control state={this.state.config.button} handleClick={this.handleClick} />
                <div className="col-xs-12">
                    <div className="box">
                        <div className="box-body">
                            <DataTable.Table state={this.state} handleClick={this.handleClick} handleSort={ClientActionCreators.sort} handleChangePage={ClientActionCreators.page} handleSearch={ClientActionCreators.filter} />
                        </div>
                    </div>
                </div>
            </div>
        );
    },
    handleChange: function(e) {
        this.setState(ClientStore.getData('list'));
    },
    handleClick: function(type, id, e) {
        switch (type) {
            case 'add':
                this.history.pushState(null, '/main/client/add');
                break;
            case 'edit':
                this.history.pushState(null, '/main/client/edit/' + id);
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
                            ClientActionCreators.del(ids);
                            AppActionCreators.modal({
                                display: false
                            });
                        }.bind(this)
                    }, 'cancel']
                });
                break;
            case 'checkbox':
                ClientActionCreators.checkbox(id, e);
                break;
            case 'tag':
                if (this.state.data.checkbox.length) {
                    var obj = e.target.tagName == 'BUTTON' ? $(e.target) : $(e.target).parents('button:first');
                    ClientActionCreators.tagPanel('style', {
                        display: 'block',
                        top: obj.position().top + 3,
                        left: obj.position().left + 100
                    });
                } else {
                    AppActionCreators.modal({
                        display: true,
                        message: '請先勾選欲標籤客戶!',
                        button: ['ok']
                    });
                }
                break;
        }
    }
});
