import React, { Component } from "react";
import moment from "moment";
import DateTimeField from "react-bootstrap-datetimepicker";

require('./DateTimePicker.css');

class ParentComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            date: "2016-01-10",
            format: "YYYY-MM-DD",
            inputFormat: "DD/MM/YYYY",
            mode: "date"
        };
    }

    render() {
        const {date, format, mode, inputFormat} = this.state;
        return (
            <div className="DateTimePickerBar">
				<DateTimeField
                    dateTime={date}
                    format={format}
                    inputFormat={inputFormat}
                    onChange={this.handleChange}
                    viewMode={mode}
					defaultText="Please select a date"
                />
            </div>
        );
    }

    handleChange = (newDate) => {
        console.log("newDate", newDate);
        return this.setState({date: newDate});
    }
}

export default ParentComponent;
