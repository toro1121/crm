var React = require('react');
var Link = require('react-router').Link;
//actions
var UserActionCreators = require('../../actions/UserActionCreators');
//store
var UserStore = require('../../stores/UserStore');
//custom
var _CONFIG = require('../../config');
var _COMMON = require('../../common');

module.exports = React.createClass({
    componentDidMount: function() {
        // TODO: jquery => react
        $(function() {
            $('[data-toggle=offcanvas]').unbind('click').bind('click', function(e) {
                if ($(window).width() > (768 - 1)) {
                    $("body").toggleClass('sidebar-collapse');
                } else {
                    if ($("body").hasClass('sidebar-open')) {
                        $("body").removeClass('sidebar-open');
                        $("body").removeClass('sidebar-collapse')
                    } else {
                        $("body").addClass('sidebar-open');
                    }
                }
            });
            $(".content-wrapper").click(function() {
                if ($(window).width() <= (768 - 1) && $("body").hasClass("sidebar-open")) {
                    $("body").removeClass('sidebar-open');
                }
            });
            if ($('body').hasClass('fixed') && $('body').hasClass('sidebar-mini')) {
                $('.main-sidebar').hover(function() {
                    if ($('body').hasClass('sidebar-mini') && $("body").hasClass('sidebar-collapse') && $(window).width() > 768 - 1) {
                        $("body").removeClass('sidebar-collapse').addClass('sidebar-expanded-on-hover');
                    }
                }, function() {
                    if ($('body').hasClass('sidebar-mini') && $('body').hasClass('sidebar-expanded-on-hover') && $(window).width() > 768 - 1) {
                        if ($('body').hasClass('sidebar-expanded-on-hover')) {
                            $('body').removeClass('sidebar-expanded-on-hover').addClass('sidebar-collapse');
                        }
                    }
                });
            }
        });
    },
    render: function() {
        if (this.props.state.data) {
            var photo = _CONFIG.apiUrl + '/user/file/' + this.props.state.data.id + '?' + this.props.state.data.file;
            var date = this.props.state.data.created_at ? _COMMON.dateFormat(this.props.state.data.created_at, 'yyyy/MM/dd') : null;
            return (
                <header className="main-header">
                    <Link to={'/main'} className="logo">
                        <span className="logo-mini">
                            <b>{_CONFIG.website.name2}</b>
                            CRM
                        </span>
                        <span className="logo-lg">
                            <b>{_CONFIG.website.name1}</b>
                            CRM
                        </span>
                    </Link>
                    <nav className="navbar navbar-static-top" role="navigation">
                        <a href="javascript:void(0)" className="sidebar-toggle" data-toggle="offcanvas" role="button">
                            <span className="sr-only">Toggle navigation</span>
                        </a>
                        <div className="navbar-custom-menu">
                            <ul className="nav navbar-nav">
                                <li className="dropdown user user-menu">
                                    <a href="javascript:void(0)" className="dropdown-toggle" data-toggle="dropdown">
                                        <img className="user-image" src={photo} />
                                        <span className="hidden-xs">{this.props.state.data.name}</span>
                                    </a>
                                    <ul className="dropdown-menu">
                                        <li className="user-header">
                                            <img className="img-circle" src={photo} />
                                            <p>
                                                {this.props.state.data.name}
                                                <small>註冊日期 {date}</small>
                                            </p>
                                        </li>
                                        <li className="user-footer">
                                            <div className="pull-left">
                                                <Link to={'/main/profile'} className="btn btn-default btn-flat">帳號管理</Link>
                                            </div>
                                            <div className="pull-right">
                                                <a href="javascript:void(0)" className="btn btn-default btn-flat" onClick={this.handleClick}>登出</a>
                                            </div>
                                        </li>
                                    </ul>
                                </li>
                            </ul>
                        </div>
                    </nav>
                </header>
            );
        } else {
            return (<div />);
        }
    },
    handleClick: function(e) {
        UserActionCreators.userLogout();
    }
});
