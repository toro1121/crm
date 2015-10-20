var React = require('react');
//action
var CompanyActionCreators = require('../../actions/CompanyActionCreators');
var TagActionCreators = require('../../actions/TagActionCreators');
//store
var CompanyStore = require('../../stores/CompanyStore');
var TagStore = require('../../stores/TagStore');

module.exports = React.createClass({
    getInitialState: function() {
        var data = this.getData(this.props.type);
        if (!data.length) {
            switch (this.props.type) {
                case 'company_id':
                    CompanyActionCreators.data();
                    break;
                case 'group':
                case 'industry':
                case 'career':
                    TagActionCreators({
                        type: this.props.type
                    }).data(this.props.type);
                    break;
            }
        }

        return {
            id: this.props.type == 'group' ? 'parent_id' : this.props.type,
            data: data
        };
    },
    componentWillMount: function() {
        if (this.props.type == 'company_id') {
            CompanyStore.addChangeListener(this.handleChange);
        } else {
            TagStore.addChangeListener(this.handleChange);
        }
    },
    componentWillUnmount: function() {
        if (this.props.type == 'company_id') {
            CompanyStore.removeChangeListener(this.handleChange);
        } else {
            TagStore.removeChangeListener(this.handleChange);
        }
    },
    render: function() {
        return (
            <select className="form-control" id={this.state.id} value={this.props.value} onChange={this.props.handleChange}>
                <option value="0">- 請選擇 -</option>
                {this.state.data.map(function(value, key) {
                    return(
                        <option value={value.id} key={key}>
                            {value.name}
                        </option>
                    );
                })}
            </select>
        );
    },
    handleChange: function(e) {
        this.setState({
            data: this.getData(this.props.type)
        });
    },
    getData: function(type) {
        var data = [];
        switch (type) {
            case 'company_id':
                data = CompanyStore.getData('select');
                break;
            case 'group':
            case 'industry':
            case 'career':
                data = TagStore.getData(type, 'select');
                break;
        }
        return data;
    }
});
