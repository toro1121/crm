var React = require('react');
var Router = require('react-router');
var Link = Router.Link;
//action
var TagActionCreators = require('../../actions/TagActionCreators')({});
//store
var TagStore = require('../../stores/TagStore');

module.exports = React.createClass({
    getInitialState: function() {
        return {
            data: TagStore.getData('all')
        }
    },
    componentWillMount: function() {
        TagStore.addChangeListener(this.handleChange, 'menu');
        TagActionCreators.data('all');
    },
    componentWillUnmount: function() {
        TagStore.removeChangeListener(this.handleChange, 'menu');
    },
    render: function() {
        var data = this.state.data;
        var tmp = [];
        for (var i = 0; i < data.length; i++) {
            if (data[i].id === data[i].parent_id) {
                tmp.push(data[i]);
            }
        }
        data = tmp;

        var s = function(color) {
            return {
                background: {
                    background: color
                },
                color: {
                    color: color
                }
            };
        }

        //無標籤數量
        var tmp = require('../../stores/ClientStore').getData('select');
        var noneTagNum = 0;
        for (var i in tmp) {
            if (!tmp[i].tag.length) {
                noneTagNum++;
            }
        }
        return (
            // TODO: 直接更改標籤顏色
            <ul className="sidebar-menu tag">
                <li className="header">
                    <button className="btn btn-default active">
                        <i className="fa fa-tag"></i>
                    </button>
                    {/* TODO: favorite tag in the menu.*/}
                    <button className="btn btn-default">
                        <i className="fa fa-star"></i>
                    </button>
                </li>
                <li>
                    <i className="fa"></i>
                    <span>
                        <Link to={'/main/client?id=none'} style={{color:'#999'}}>(無標籤)</Link>
                    </span>
                    <small className="label pull-right" style={{background:'#ccc'}}>{noneTagNum}</small>
                </li>
                {data.map(function(value, key){
                    var style = s('#' + value.color);
                    var query = {id:value.id};
                    return (
                        <li className={value.child.length ? 'treeview' : ''} key={key}>
                            <i className={'fa fa-tag' + (value.child.length ? 's' : '')} style={style.color}></i>
                            <span>
                                <Link to={'/main/client'} query={query}>{value.name}</Link>
                            </span>
                            <small className="label pull-right" style={style.background}>{value.client.length}</small>
                            <ul className="treeview-menu">
                                {value.child.map(function(v, k){
                                    var style = s('#' + v.color);
                                    var query = {id:v.id};
                                    return (
                                        <li key={k}>
                                            <i className="fa"></i>
                                            <i className="fa fa-tag" style={style.color}></i>
                                            <span>
                                            <Link to={'/main/client'} query={query}>{v.name}</Link>
                                            </span>
                                            <small className="label pull-right" style={style.background}>{v.client.length}</small>
                                        </li>
                                    );
                                })}
                            </ul>
                        </li>
                    );
                })}
            </ul>
        );
    },
    handleChange: function(e) {
        this.setState({
            data: TagStore.getData('all')
        });
    }
});
