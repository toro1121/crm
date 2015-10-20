var React = require('react');
var ReactRouter = require('react-router');
var Router = ReactRouter.Router;
var Route = ReactRouter.Route;
var Redirect = ReactRouter.Redirect;
var IndexRoute = ReactRouter.IndexRoute;
//action
var UserActionCreators = require('./actions/UserActionCreators');
//stores
var UserStore = require('./stores/UserStore');
//jsx
var Modal = require('./components/element/Modal');
//vendor
require('bootstrap.css');
require('font-awesome.css');
require('AdminLTE.css');
require('../assets/css/fix');

var App = React.createClass({
    mixins: [ReactRouter.History],
    getInitialState: function() {
        return UserStore.getData('profile');
    },
    componentWillMount: function() {
        UserStore.addChangeListener(this.handleChange, 'status');
        UserActionCreators.userStatus();
        return this.RedirectByUserStatus();
    },
    componentDidUpdate: function() {
        return this.RedirectByUserStatus();
    },
    componentWillUnmount: function() {
        UserStore.removeChangeListener(this.handleChange, 'status');
    },
    render: function() {
        return (
            <div>
                <Modal />
                {this.props.children}
            </div>
        );
    },
    handleChange: function() {
        this.setState(UserStore.getData('profile'));
        if (typeof this.state.status == 'boolean') {
            $('body').fadeIn();
        }
    },
    RedirectByUserStatus: function() {
        var page = this.props.location.pathname.split(/\//)[1] ? this.props.location.pathname.split(/\//)[1] : 'login';

        if (typeof this.state.status == 'boolean') {
            if (page != 'main' && this.state.status) {
                this.history.pushState(null, '/main');
            } else if (page == 'main' && !this.state.status) {
                this.history.pushState(null, '/');
            }
        }

        //change website title
        var title = 'Toro | CRM';
        switch (page) {
            case 'login':
                title += ' - 登入';
                break;
            case 'register':
                title += ' - 註冊';
                break;
        }
        $(document).find('title:first').text(title);

        //cahnge body style
        if (page == 'main') {
            $('body').attr('class', 'sidebar-mini fixed skin-black-light');
        } else {
            $('body').attr('class', 'login-page');
        }
    }

});

var Login = require('./components/Login');
var Register = require('./components/Register');
var Forget = require('./components/Forget');
var Main = require('./components/Main');
var MainNotFound = require('./components/main/NotFound');
var MainIndex = require('./components/main/Index');

var UserEdit = require('./components/user/edit');

var Client = require('./components/client/list');
var ClientAdd = require('./components/client/add');
var ClientEdit = require('./components/client/edit');
var Company = require('./components/company/list');
var CompanyPage = require('./components/company/page');
var CompanyAdd = require('./components/company/add');
var CompanyEdit = require('./components/company/edit');
var TagGroup = require('./components/tag/group/list');
var TagGroupAdd = require('./components/tag/group/add');
var TagGroupEdit = require('./components/tag/group/edit');
var TagItem = require('./components/tag/item/list');
var TagItemAdd = require('./components/tag/item/add');
var TagItemEdit = require('./components/tag/item/edit');
React.render((
    <Router>
        <Route path="/" component={App}>
            <IndexRoute component={Login} />

            <Route path="login" component={Login}></Route>
            <Route path="register" component={Register}></Route>
            <Route path="forget" component={Forget}></Route>

            <Route path="main" component={Main}>
                <IndexRoute component={MainIndex} />

                <Route path="user/edit/:id" component={UserEdit} />
                <Route path="profile" component={UserEdit} />

                <Route path="client" component={Client} />
                <Route path="client/add" component={ClientAdd} />
                <Route path="client/edit/:id" component={ClientEdit} />

                <Route path="company" component={Company} />
                <Route path="company/:id" component={CompanyPage} />
                <Route path="company/add" component={CompanyAdd} />
                <Route path="company/edit/:id" component={CompanyEdit} />

                <Route path="tag" component={TagGroup} />
                <Route path="tag/add" component={TagGroupAdd} />
                <Route path="tag/edit/:id" component={TagGroupEdit} />

                <Route path="tag/:parent_id" component={TagItem} />
                <Route path="tag/:parent_id/add" component={TagItemAdd} />
                <Route path="tag/:parent_id/edit/:id" component={TagItemEdit} />
                <Route path="industry/:parent_id" component={TagItem} />
                <Route path="industry/:parent_id/add" component={TagItemAdd} />
                <Route path="industry/:parent_id/edit/:id" component={TagItemEdit} />
                <Route path="career/:parent_id" component={TagItem} />
                <Route path="career/:parent_id/add" component={TagItemAdd} />
                <Route path="career/:parent_id/edit/:id" component={TagItemEdit} />

                <Route path="*" component={MainNotFound} />
            </Route>
            <Route path="*" component={Login} />
        </Route>
    </Router>
), $('body')[0]);
