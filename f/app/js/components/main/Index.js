import React from 'react';
import {
    Link
}
from 'react-router';
import RCJ, {
    Line as LineChart
}
from 'react-chartjs';

class Dashboard1 extends React.Component {
    render() {
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
			                <p>本周新增客戶</p>
			            </div>
			            <div className="icon">
			                <i className="fa fa-user"></i>
			            </div>
			            <Link to={'/main/client'} className="small-box-footer">
			            	查看更多
			            	&nbsp;
		            		<i className="fa fa-arrow-circle-right"></i>
		            	</Link>
			        </div>
			    </div>
			    <div className="col-lg-3 col-xs-6">
			        <div className="small-box bg-green">
			            <div className="inner">
			                <h3>{companyNum}</h3>
			                <p>本周新增公司</p>
			            </div>
			            <div className="icon">
			                <i className="fa fa-hospital-o"></i>
			            </div>
			            <Link to={'/main/company'} className="small-box-footer">
			            	查看更多
			            	&nbsp;
			            	<i className="fa fa-arrow-circle-right"></i>
		            	</Link>
			        </div>
			    </div>
			</div>
        );
    }
}

class Dashboard2 extends React.Component {
    render() {
        var data = {
            labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
            datasets: [{
                label: "test",
                fillColor: "rgba(220,220,220,0.2)",
                strokeColor: "rgba(220,220,220,1)",
                pointColor: "rgba(220,220,220,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(220,220,220,1)",
                data: [3, 5, 6, 1, 2, 4, 9]
            }]
        };

        return (
            <div className="row">
        		<div className="col-xs-12">
			        <div className="box">
			            <div className="box-header with-border">
			                <i className="fa fa-bar-chart-o"></i>
			                <h3 className="box-title">登入記錄</h3>
			                <div className="box-tools pull-right">
		                        <button className="btn btn-box-tool" data-widget="collapse"><i className="fa fa-minus"></i></button>
		                        <button className="btn btn-box-tool" data-widget="remove"><i className="fa fa-times"></i></button>
			                </div>
			            </div>
			            <div className="box-body" style={{width:'100%',height:'200px'}}>
			                <LineChart data={data} options={{}} style={{width:'100%',height:'100%'}} />
			            </div>
			        </div>
			    </div>
        	</div>
        );
    }
}

export default class extends React.Component {
    render() {
        return (
            <section>
				<Dashboard1 />
				<Dashboard2 />
			</section>
        );
    }
};
