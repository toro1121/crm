var React = require('react');
var ReactRouter = require('react-router');
//action
var AppActionCreators = require('../../actions/AppActionCreators')({});
var ClientActionCreators = require('../../actions/ClientActionCreators');
//stores
var ClientStore = require('../../stores/ClientStore');
var UserStore = require('../../stores/UserStore');
//custom
var _COMMON = require('../../common');
//jsx
var Select = require('../element/Select');
var ReactSelect = require('../element/ReactSelect');
var ReactDropzone = require('../element/ReactDropzone');

module.exports = React.createClass({
    mixins: [ReactRouter.History],
    getInitialState: function() {
        return ClientStore.getData(false, true);
    },
    componentWillMount: function() {
        ClientStore.addChangeListener(this.handleChange);
    },
    componentWillUnmount: function() {
        ClientStore.removeChangeListener(this.handleChange);
    },
    render: function() {
        return (
            <div className="row">
	            <div className="col-xs-12">
					<div className="box">
						<div className="box-header with-border">
							<button type="submit" className="btn btn-default btn-sm" onClick={this.handleClick}>
								回上一頁
							</button>
							<h3 className="box-title"></h3>
						</div>
						<form className="form-horizontal" onSubmit={this.handleSubmit}>
							<div className="box-body">
								<div className="col-sm-3">
									<div className="form-group">
		                                <label htmlFor="company_id" className="col-sm-4 control-label">公司</label>
		                                <div className="col-sm-8">
			                                <Select type="company_id" ref="company_id" />
		                                </div>
		                            </div>
	                            </div>
                            	<div className="col-sm-3">
		                            <div className="form-group">
		                                <label htmlFor="career" className="col-sm-4 control-label">職位</label>
		                                <div className="col-sm-8">
		                                	<Select type="career" ref="career" />
		                                </div>
		                            </div>
	                            </div>
								<div className="col-sm-3">
									<div className="form-group">
										<label htmlFor="name" className="col-sm-4 control-label">
											<span className="require">*</span>
											姓名
										</label>
										<div className="col-sm-8">
											<input type="text" className="form-control" id="name" placeholder="姓名" ref="name" />
										</div>
									</div>
								</div>
								<div className="col-sm-3">
									<div className="form-group">
										<label htmlFor="ename" className="col-sm-4 control-label">英文名</label>
										<div className="col-sm-8">
											<input type="text" className="form-control" id="ename" placeholder="英文名" ref="ename" />
										</div>
									</div>
								</div>
								<div className="col-sm-3">
									<div className="form-group">
										<label htmlFor="phone" className="col-sm-4 control-label">電話</label>
										<div className="col-sm-8">
											<input type="text" className="form-control" id="phone" placeholder="電話" ref="phone" />
										</div>
									</div>
								</div>
								<div className="col-sm-3">
									<div className="form-group">
										<label htmlFor="mobile" className="col-sm-4 control-label">手機</label>
										<div className="col-sm-8">
											<input type="text" className="form-control" id="mobile" placeholder="手機" ref="mobile" />
										</div>
									</div>
								</div>
								<div className="col-sm-6">
									<div className="form-group">
										<label htmlFor="email" className="col-sm-2 control-label">Email</label>
										<div className="col-sm-10">
											<input type="mail" className="form-control" id="email" placeholder="Email" ref="email" />
										</div>
									</div>
								</div>
								<div className="col-sm-12">
                                    <div className="form-group">
                                        <label htmlFor="address" className="col-sm-1 control-label">地址</label>
                                        <div className="col-sm-11">
                                            <input type="text" className="form-control" id="address" placeholder="地址" ref="address" />
                                        </div>
                                    </div>
                                </div>
								<div className="col-sm-12">
									<div className="form-group">
	                                    <label htmlFor="tag" className="col-sm-1 control-label">標籤</label>
	                                    <div className="col-sm-11">
	                                        <ReactSelect ref="tag" />
	                                    </div>
	                                </div>
                                </div>
							</div>
							{/*
							<div className="box-footer">
                                <div className="col-sm-12">
                                    <div className="form-group">
                                        <label htmlFor="remark" className="col-sm-1 control-label">名片</label>
                                        <div className="col-sm-11">
                                            <ReactDropzone options={{
                                                id: this.state.data[0].id,
                                                file: this.state.data[0].file,
                                                multiple: true
                                            }} handleDrop={this.handleDrop} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        	*/}
							<div className="box-footer">
								<div className="col-sm-12">
									<div className="form-group">
										<label htmlFor="remark" className="col-sm-1 control-label">備註</label>
										<div className="col-sm-11">
											<textarea className="form-control" rows="5" placeholder="備註" ref="remark"></textarea>
										</div>
									</div>
								</div>
							</div>
							<div className="box-footer">
								<button type="submit" className="btn btn-info btn-sm pull-right">
									新增
								</button>
							</div>
						</form>
					</div>
				</div>
			</div>
        );
    },
    handleChange: function(e) {
        this.setState(ClientStore.getData());
        if (this.state.bool) {
            setTimeout(function() {
                AppActionCreators.modal({
                    display: true,
                    message: this.state.message,
                    button: [{
                        type: 'ok',
                        fn: function() {
                            this.history.pushState(null, '/main/client');
                            AppActionCreators.modal({
                                display: false
                            });
                        }.bind(this)
                    }]
                });
            }.bind(this), 1);
        }
    },
    handleSubmit: function(e) {
        e.preventDefault();
        var data = _COMMON.getInputData(this.refs);
        if (data.name) {
            data.user_id = UserStore.getData('profile').data.id;
            ClientActionCreators.add(data);
        }
    },
    handleClick: function(e) {
        this.history.pushState(null, '/main/client');
    },
    handleDrop: function(files) {
        ClientActionCreators.file(this.state.data[0].id, files[0]);
    }
});
