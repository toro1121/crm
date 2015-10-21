var React = require('react');
var Link = require('react-router').Link;
//jsx
var MenuTag = require('./MenuTag');

module.exports = React.createClass({
    // TODO: jquery => react
    componentDidMount: function() {
        $(function() {
            $('.content-wrapper, .right-side').css('min-height', $(window).height() - $('.main-footer').outerHeight());
            $('.sidebar').slimscroll({
                height: $(window).height() - $('.main-header').height() - 50,
                color: 'rgba(0,0,0,0.2)',
                size: 5
            });
            //menu tree
            $('ul.sidebar-menu:not(".tag") li a, ul.sidebar-menu.tag li i.fa-tags').unbind('click').bind('click', function(e) {
                var checkElement = $(this)[0].tagName == 'A' ? $(this).next() : $(this).nextAll('.treeview-menu');
                if ((checkElement.is('.treeview-menu')) && (checkElement.is(':visible'))) {
                    checkElement.slideUp(500, function() {
                        checkElement.removeClass('menu-open');
                    });
                    checkElement.parent('li').removeClass('active');
                } else if ((checkElement.is('.treeview-menu')) && (!checkElement.is(':visible'))) {
                    var parent = $(this).parents('ul').first();
                    var ul = parent.find('ul:visible').slideUp(500);
                    ul.removeClass('menu-open');
                    var parent_li = $(this).parent('li');
                    checkElement.slideDown(500, function() {
                        checkElement.addClass('menu-open');
                        parent.find('li.active').removeClass('active');
                        parent_li.addClass('active');
                    });
                }
                if (checkElement.is('.treeview-menu')) {
                    e.preventDefault();
                }
            });
        });

        $(window).unbind('resize').bind('resize', function() {
            $('.content-wrapper, .right-side').css('min-height', $(window).height() - $('.main-footer').outerHeight());
            $('.sidebar').slimScroll({
                destroy: true
            }).height('auto');
            $('.sidebar').slimscroll({
                height: $(window).height() - $('.main-header').height(),
                color: 'rgba(0,0,0,0.2)',
                size: 5
            });
        });
    },
    componentWillUpdate: function() {
        $(function() {
            //menu tree
            $('ul.sidebar-menu:not(".tag") li a, ul.sidebar-menu.tag li i.fa-tags').unbind('click').bind('click', function(e) {
                var checkElement = $(this)[0].tagName == 'A' ? $(this).next() : $(this).nextAll('.treeview-menu');
                if ((checkElement.is('.treeview-menu')) && (checkElement.is(':visible'))) {
                    checkElement.slideUp(500, function() {
                        checkElement.removeClass('menu-open');
                    });
                    checkElement.parent('li').removeClass('active');
                } else if ((checkElement.is('.treeview-menu')) && (!checkElement.is(':visible'))) {
                    var parent = $(this).parents('ul').first();
                    var ul = parent.find('ul:visible').slideUp(500);
                    ul.removeClass('menu-open');
                    var parent_li = $(this).parent('li');
                    checkElement.slideDown(500, function() {
                        checkElement.addClass('menu-open');
                        parent.find('li.active').removeClass('active');
                        parent_li.addClass('active');
                    });
                }
                if (checkElement.is('.treeview-menu')) {
                    e.preventDefault();
                }
            });
        });
    },
    componentWillUnmount: function() {
        $('.sidebar').slimScroll({
            destroy: true
        }).height('auto');
    },
    render: function() {
        return (
            <aside className='main-sidebar'>
                <section className='sidebar'>
                    <ul className='sidebar-menu'>
                        <li className='header'></li>
                        <li>
                            <Link to={'/main/client'}>
                                <i className='fa fa-user'></i>
                                <span>客戶管理</span>
                            </Link>
                        </li>
                        <li>
                            <Link to={'/main/company'}>
                                <i className='fa fa-hospital-o'></i>
                                <span>公司管理</span>
                            </Link>
                        </li>
                        <li className="treeview">
                            <a href="javascript:void(0)">
                                <i className='fa fa-tags'></i>
                                <span>標籤管理</span>
                                <i className="fa fa-angle-left pull-right"></i>
                            </a>
                            <ul className="treeview-menu">
                                <li>
                                    <Link to={'/main/tag'}>
                                        <i className='fa'></i>
                                        <span>標籤</span>
                                    </Link>
                                </li>
                                <li>
                                    <Link to={'/main/industry/1'}>
                                        <i className='fa'></i>
                                        <span>產業</span>
                                    </Link>
                                </li>
                                <li>
                                    <Link to={'/main/career/2'}>
                                        <i className='fa'></i>
                                        <span>職業</span>
                                    </Link>
                                </li>
                            </ul>
                        </li>
                    </ul>
                    <hr />
                    <MenuTag />
                </section>
            </aside>
        );
    }
});
