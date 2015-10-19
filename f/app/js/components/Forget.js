var React = require('react');
var ReactRouter = require('react-router');
var Link = ReactRouter.Link;
//actions
var UserActionCreators = require('../actions/UserActionCreators');
//stores
var UserStore = require('../stores/UserStore');
//custom
var _COMMON = require('../common');
//jsx
var Logo = require('./other/Logo');
var Message = require('./other/Message');

module.exports = React.createClass({
    mixins: [ReactRouter.History],
    getInitialState: function() {
        return UserStore.getData(false, true);
    },
    componentWillMount: function() {
        UserStore.addChangeListener(this.handleChange);
    },
    componentWillUnmount: function() {
        UserStore.removeChangeListener(this.handleChange);
    },
    render: function() {
        return (
            <div className="register-box">
                <Logo />
                <div className="register-box-body">
                    <Message message={this.state.message} />
                    <form onSubmit={this.handleSubmit}>
                        <div className="form-group has-feedback">
                            <input type="text" className="form-control" placeholder="姓名" ref="name" />
                            <span className="glyphicon glyphicon-user form-control-feedback"></span>
                        </div>
                        <div className="form-group has-feedback">
                            <input type="email" className="form-control" placeholder="帳號" ref="username" />
                            <span className="glyphicon glyphicon-envelope form-control-feedback"></span>
                        </div>
                        <div className="row">
                            <div className="col-xs-4 col-xs-offset-8">
                                <button type="submit" className="btn btn-primary btn-block btn-flat">
                                    送出
                                </button>
                            </div>
                        </div>
                    </form>
                    <Link to={'/login'} className="text-center">回登入頁</Link>
                </div>
            </div>
        );
    },
    handleChange: function(e) {
        this.setState(UserStore.getData());
        if (this.state.bool) {
            this.history.pushState(null, '/login');
        }
    },
    handleSubmit: function(e) {
        e.preventDefault();

        var o = this.state;
        var data = _COMMON.getInputData(this.refs);

        var bool = true;
        var i = 0;
        for (var key in data) {
            if (!data[key]) {
                bool = false;
                break;
            }
            i++;
        }
        if (bool) {
            UserActionCreators.userForget(data);
        } else {
            o.message = '欄位填寫不完整!';
            $('input:eq(' + i + ')').focus();
        }

        this.setState(o);
    }
});
