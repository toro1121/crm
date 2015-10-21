var React = require('react');
var Link = require('react-router').Link;

module.exports = React.createClass({
    render: function() {
        var dayLimit = new Date();
        dayLimit.setDate(dayLimit.getDate() + 7);

        //本周新增客戶
        var client = require('../../stores/ClientStore').getData('select');
        var clientNum = 0;
        for (var i in client) {
            if (dayLimit > new Date(client[i].updated_at)) {
                clientNum++;
            }
        }

        //本周新增公司
        var company = require('../../stores/CompanyStore').getData('select');
        var companyNum = 0;
        for (var i in company) {
            if (dayLimit > new Date(company[i].updated_at)) {
                companyNum++;
            }
        }

        return (
            <div className="row">
			    <div className="col-lg-3 col-xs-6">
			        <div className="small-box bg-aqua">
			            <div className="inner">
			                <h3>{clientNum}</h3>
			                <p>
			                	<i className="fa fa-user" />
			                	&nbsp;&nbsp;
			                	本周新增客戶
			                </p>
			            </div>
			            <div className="icon">
			                <i className="ion ion-bag"></i>
			            </div>
			            <Link to={'/main/client'} className="small-box-footer">
			            	查看更多
			            	&nbsp;
		            		<i className="fa fa-arrow-circle-right"></i>
		            	</Link>
			        </div>
			    </div>
			    <div className="col-lg-3 col-xs-6">
			        <div className="small-box bg-red">
			            <div className="inner">
			                <h3>{companyNum}</h3>
			                <p>
			                	<i className="fa fa-hospital-o" />
			                	&nbsp;&nbsp;
			                	本周新增公司
			                </p>
			            </div>
			            <div className="icon">
			                <i className="ion ion-pie-graph"></i>
			            </div>
			            <Link to={'/main/company'} className="small-box-footer">
			            	查看更多
			            	&nbsp;
			            	<i className="fa fa-arrow-circle-right"></i>
		            	</Link>
			        </div>
			    </div>
			    {/*
			    <div className="col-lg-3 col-xs-6">
			        <div className="small-box bg-green">
			            <div className="inner">
			                <h3>
			                	53
			                	<sup>%</sup>
		                	</h3>
			                <p>Bounce Rate</p>
			            </div>
			            <div className="icon">
			                <i className="ion ion-stats-bars"></i>
			            </div>
			            <a href="javascript:void(0)" className="small-box-footer">
			            	查看更多
			            	&nbsp;
			            	<i className="fa fa-arrow-circle-right"></i>
		            	</a>
			        </div>
			    </div>
			    <div className="col-lg-3 col-xs-6">
			        <div className="small-box bg-yellow">
			            <div className="inner">
			                <h3>44</h3>
			                <p>User Registrations</p>
			            </div>
			            <div className="icon">
			                <i className="ion ion-person-add"></i>
			            </div>
			            <a href="javascript:void(0)" className="small-box-footer">
			            	查看更多
			            	&nbsp;
			            	<i className="fa fa-arrow-circle-right"></i>
		            	</a>
			        </div>
			    </div>
			    <div className="col-md-12">
					<div className="box box-primary">
						<div className="box-body no-padding"></div>
					</div>
				</div>
				*/}
			</div>
        );
    }
});
