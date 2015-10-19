var React = require('react');
var Link = require('react-router').Link;
//actions
var UserActionCreators = require('../actions/UserActionCreators');
//stores
var UserStore = require('../stores/UserStore');
//custom
var _COMMON = require('../common');
//jsx
var Logo = require('./other/Logo');
var Message = require('./other/Message');
var Checkbox = require('./element/Checkbox');

module.exports = React.createClass({
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
            <div className="login-box">
                <Logo />
                <div className="login-box-body">
                    <Message message={this.state.message} />
                    <form onSubmit={this.handleSubmit}>
                        <div className="form-group has-feedback">
                            <input type="email" className="form-control" placeholder="帳號" ref="username" />
                            <span className="glyphicon glyphicon-envelope form-control-feedback"></span>
                        </div>
                        <div className="form-group has-feedback">
                            <input type="password" className="form-control" placeholder="密碼" ref="password" />
                            <span className="glyphicon glyphicon-lock form-control-feedback"></span>
                        </div>
                        <div className="row">
                            <div className="col-xs-8">
                                <div className="checkbox icheck">
                                    <label>
                                        <Checkbox id="cb" ref="remember" handleClick={this.handleClick} />
                                        &nbsp;&nbsp;記住我
                                    </label>
                                </div>
                            </div>
                            <div className="col-xs-4">
                                <button type="submit" className="btn btn-primary btn-block btn-flat">
                                    登入
                                </button>
                            </div>
                        </div>
                    </form>

                    <Link to={'/forget'} className="text-center">忘記密碼</Link>
                    <br />
                    <Link to={'/register'} className="text-center">註冊</Link>
                </div>
            </div>
        );
    },
    handleChange: function(e) {
        this.setState(UserStore.getData());
    },
    handleSubmit: function(e) {
        e.preventDefault();

        var o = this.state;
        var data = _COMMON.getInputData(this.refs);

        var bool = true;
        var i = 0;
        for (var key in data) {
            if (!data[key] && key != 'remember') {
                bool = false;
                break;
            }
            i++;
        }
        if (bool) {
            UserActionCreators.userLogin(data);
        } else {
            o.message = '欄位填寫不完整!';
            $('input:eq(' + i + ')').focus();
        }

        this.setState(o);
    }
});
