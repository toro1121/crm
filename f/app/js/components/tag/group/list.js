var React = require('react');
var ReactRouter = require('react-router');
var Link = ReactRouter.Link;
//action
var AppActionCreators = require('../../../actions/AppActionCreators')({});
var TagActionCreators = require('../../../actions/TagActionCreators')({
    type: 'group'
});
//stores
var TagStore = require('../../../stores/TagStore');
//jsx
var DataTable = require('../../element/DataTable');

module.exports = React.createClass({
    mixins: [ReactRouter.History],
    getInitialState: function() {
        var o = TagStore.getData('group', 'list');
        var style = function(color) {
            return {
                width: '100%',
                height: '30px',
                background: '#' + color,
                borderRadius: '3px',
                display: 'table'
            };
        };
        o.config.columns = [{
            title: '名稱',
            prop: 'name',
            render: (val, row) => (
                <Link to={'/main/tag/' + row.id}>
                    {row.name}
                    &nbsp;&nbsp;
                    <span style={{color:'#ccc'}}>( {row.child.length} )</span>
                </Link>
            )
        }, {
            title: '顏色',
            prop: 'color',
            width: 30,
            render: (val, row) => (
                <div style={style(val)}></div>
            )
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
                button: ['view', 'edit', 'del']
            }]
        };
        return o;
    },
    componentWillMount: function() {
        TagStore.addChangeListener(this.handleChange);
        TagActionCreators.data('group');
    },
    componentWillUnmount: function() {
        TagStore.removeChangeListener(this.handleChange);
    },
    render: function() {
        return (
            <div className="row list">
                <DataTable.Control state={this.state.config.button} handleClick={this.handleClick} />
                <div className="col-xs-12">
                    <div className="box">
                        <div className="box-body">
                            <DataTable.Table state={this.state} handleClick={this.handleClick} handleSort={TagActionCreators.sort} handleChangePage={TagActionCreators.page} handleSearch={TagActionCreators.filter} />
                        </div>
                    </div>
                </div>
            </div>
        );
    },
    handleChange: function() {
        this.setState(TagStore.getData('group', 'list'));
    },
    handleClick: function(type, id, e) {
        switch (type) {
            case 'view':
                this.history.pushState(null, '/main/tag/' + id);
                break;
            case 'add':
                this.history.pushState(null, '/main/tag/add');
                break;
            case 'edit':
                this.history.pushState(null, '/main/tag/edit/' + id);
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
                            TagActionCreators.del(ids);
                            AppActionCreators.modal({
                                display: false
                            });
                        }.bind(this)
                    }, 'cancel']
                });
                break;
            case 'checkbox':
                TagActionCreators.checkbox(id, e);
                break;
            case 'link':
                break;
        }
    }
});
