var React = require('react');
var ReactRouter = require('react-router');
var Link = ReactRouter.Link;

module.exports = React.createClass({
    render: function() {
        var data = this.props.location.pathname.split(/\//).splice(1);
        var tmp = [];
        var title = '';
        if (!this.isNotFound()) {
            data.map(function(value, key) {
                if (!value.match(/^\d+$/)) {
                    tmp[key] = {
                        path: this.generatePath(data, key),
                        pathname: this.generatePathname(data, key),
                        params: null,
                        link: true
                    };
                    switch (value) {
                        case 'main':
                            tmp[key].name = '首頁';
                            break;
                        case 'profile':
                            tmp[key].name = '帳號';
                            break;
                        case 'company':
                            tmp[key].name = '公司';
                            if (data.length > 2 && data[key + 1].match(/page/)) {
                                data.splice(key + 1, 1, 'companyPage');
                            }
                            break;
                        case 'companyPage':
                            tmp[key].name = require('../../stores/CompanyStore').getDataById(data[key + 1])[0].name;
                            break;
                        case 'client':
                            tmp[key].name = '客戶';
                            if (data.length > 2 && data[key + 1].match(/page/)) {
                                data.splice(key + 1, 1, 'clientPage');
                            }
                            break;
                        case 'clientPage':
                            tmp[key].name = require('../../stores/ClientStore').getDataById(data[key + 1])[0].name;
                            break;
                        case 'tag':
                            tmp[key].name = '標籤';
                            if (data.length > 2) {
                                tmp[key].pathname = 'tagGroup';
                                if (!data[key + 1].match(/add|edit/)) {
                                    data.splice(key + 1, 1, 'tagItem_' + data[key + 1]);
                                }
                            }
                            break;
                        case 'industry':
                            tmp[key].name = '產業';
                            tmp[key].params = 1;
                            break;
                        case 'career':
                            tmp[key].name = '職業';
                            tmp[key].params = 2;
                            break;
                        case 'add':
                            tmp[key].name = '新增';
                            break;
                        case 'edit':
                            tmp[key].name = '編輯';
                            break;
                    }
                    if (value.match(/tagItem\_\d*/)) {
                        var v = value.split(/\_/);
                        tmp[key].pathname = v[0];
                        tmp[key].params = v[1];
                        tmp[key].name = '子標籤';
                    }
                    if (key == 1) {
                        tmp[key].name += '管理';
                        title = tmp[key].name;
                    }
                }
            }.bind(this));
        }

        var i = 0;
        var sitemap = tmp.map(function(value, key) {
            i++;
            if (i == tmp.length) {
                return (
                    <li key={key}>
                        {value.pathname == 'main' ? <i className="glyphicon glyphicon-home"></i> : ''}
                        {value.name}
                    </li>
                );
            } else {
                if (value.link) {
                    return (
                        <li key={key}>
                            <Link to={value.path + (value.params ? '/' + value.params : '')}>
                                {value.pathname == 'main' ? <i className="glyphicon glyphicon-home"></i> : ''}
                                {value.name}
                            </Link>
                        </li>
                    );
                } else {
                    return (
                        <li key={key}>
                            {value.pathname == 'main' ? <i className="glyphicon glyphicon-home"></i> : ''}
                            {value.name}
                        </li>
                    );
                }
            }
        });

        return (
            <section className="content-header">
                <h1>
                    {title}
                    &nbsp;
                </h1>
                <ol className="breadcrumb">
                    {sitemap}
                </ol>
            </section>
        );
    },
    //判斷是否為404頁面
    isNotFound: function() {
        var isNotFound = false;
        this.props.routes.map(function(value, key) {
            if (value.isNotFound) {
                isNotFound = true;
                return;
            }
        });
        return isNotFound;
    },
    generatePath: function(data, num) {
        var path = '';
        for (var i in data) {
            if (!data[i].match('tagItem')) {
                path = path + '/' + data[i];
            }
            if (i == num) {
                break;
            }
        }
        return path;
    },
    generatePathname: function(data, num) {
        var pathname = '';
        if (num > 1) {
            data.map(function(value, key) {
                if (key > 0 && key <= num) {
                    var tmp = value;
                    if (key > 1) {
                        tmp = tmp.replace(/(?=\b)\w/g, function(t) {
                            return t.toUpperCase();
                        });
                    }
                    pathname += tmp;
                }
            });
        } else {
            pathname = data[num];
        }
        return pathname;
    }
});
