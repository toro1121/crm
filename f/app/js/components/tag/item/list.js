var React = require('react');
var ReactRouter = require('react-router');
//action
var AppActionCreators = require('../../../actions/AppActionCreators')({});
var TagActionCreators = require('../../../actions/TagActionCreators')({
    type: window.location.hash.split(/\//)[2] == 'tag' ? 'item' : window.location.hash.split(/\//)[2]
});
//stores
var TagStore = require('../../../stores/TagStore');
//jsx
var DataTable = require('../../element/DataTable');

module.exports = React.createClass({
    mixins: [ReactRouter.History],
    getInitialState: function() {
        var type = this.props.location.pathname.split(/\//)[2] == 'tag' ? 'item' : this.props.location.pathname.split(/\//)[2];
        var o = TagStore.getData(type, 'list');
        o.type = type;
        o.config.columns = [{
            title: '名稱',
            prop: 'name'
        }, type.match('item') ? {
            title: '顏色',
            prop: 'color',
            width: 30,
            render: (val, row) => (<div style={{width:'100%',height:'30px',background:'#'+row.color,borderRadius:'3px',display:'table'}}></div>)
        } : false, {
            title: '修改時間',
            prop: 'updated_at'
        }, {
            title: '修改者',
            prop: 'user',
            className: 'empty-cell',
            render: (val, row) => (<span>{row.user ? row.user.name : ''}</span>)
        }];
        o.config.button = {
            control: [type.match('item') ? {
                type: 'back',
                name: '回上一頁',
                fn: function() {
                    this.handleClick('back', false);
                }.bind(this)
            } : false, 'add', 'del'],
            table: ['checkbox', {
                type: 'control',
                button: ['edit', 'del']
            }]
        };
        return o;
    },
    componentWillReceiveProps: function() {
        setTimeout(function() {
            TagActionCreators.data(this.props.location.pathname.split(/\//)[2] == 'tag' ? 'item' : this.props.location.pathname.split(/\//)[2], false, this.props.params.parent_id);
        }.bind(this), 1);
    },
    componentWillMount: function() {
        TagStore.addChangeListener(this.handleChange);
        TagActionCreators.data(this.state.type, false, this.props.params.parent_id);
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
        var type = this.props.location.pathname.split(/\//)[2] == 'tag' ? 'item' : this.props.location.pathname.split(/\//)[2];
        this.setState({
            type: type,
            config: this.state.config,
            data: TagStore.getData(type, 'list').data
        });
    },
    handleClick: function(type, id, e) {
        switch (type) {
            case 'back':
                this.history.pushState(null, '/main/' + (this.state.type == 'item' ? 'tag' : this.state.type));
                break;
            case 'add':
                this.history.pushState(null, '/main/' + (this.state.type == 'item' ? 'tag' : this.state.type) + '/' + this.props.params.parent_id + '/add');
                break;
            case 'edit':
                this.history.pushState(null, '/main/' + (this.state.type == 'item' ? 'tag' : this.state.type) + '/' + this.props.params.parent_id + '/edit/' + id);
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
                            TagActionCreators.del(ids, this.props.params.parent_id);
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
