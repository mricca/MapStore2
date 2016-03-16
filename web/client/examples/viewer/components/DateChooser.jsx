/**
 * Copyright 2016, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
const React = require('react');
const moment = require('moment');
const momentLocalizer = require('react-widgets/lib/localizers/moment');
// const {Glyphicon, Panel, ButtonGroup, Button} = require('react-bootstrap');
const {Glyphicon, Panel} = require('react-bootstrap');
const Draggable = require('react-draggable');

momentLocalizer(moment);

const {DateTimePicker} = require('react-widgets');
// const {Row, Col, Modal, Button} = require('react-bootstrap');
const I18N = require('../../../components/I18N/I18N');

require('react-widgets/lib/less/react-widgets.less');
require('./datachooser.css');

const DateChooser = React.createClass({
    propTypes: {
        className: React.PropTypes.string,
        timeEnabled: React.PropTypes.bool,
        dateFormat: React.PropTypes.string,
        layers: React.PropTypes.array,
        checkDate: React.PropTypes.object,
        propertiesChangeHandler: React.PropTypes.func,
        style: React.PropTypes.object,
        open: React.PropTypes.oneOfType([
            React.PropTypes.string,
            React.PropTypes.bool
        ])
    },
    getInitialState() {
        return {
            open: 'calendar'
        };
    },
    getDefaultProps() {
        return {
            className: "DateChooserBar",
            timeEnabled: false,
            dateFormat: "L",
            layers: [],
            open: false,
            style: {
                position: "absolute",
                maxWidth: "500px",
                width: "262px",
                top: "56px",
                left: "45px",
                zIndex: 1010,
                boxShadow: "2px 2px 4px #A7A7A7"
            },
            propertiesChangeHandler: () => {}
        };
    },
    componentDidMount: function() {
        this.refs.dateRadioCalendar.checked = "checked";
    },
    renderHeader() {
        return (
            <span>
                <Glyphicon glyph="calendar" />&nbsp;<I18N.Message msgId="DateChooserTitle" />
            </span>
        );
    },
    render() {
        const open = this.state.open === "calendar" ? this.state.open : false;
        const toggle = e => this.radioToggle(e);
        return (
            <Draggable>
                <div>
                    <Panel defaultExpanded={true} collapsible={false} id="mapstore-datechooser" header={this.renderHeader()} style={this.props.style}>
                        <label>
                          <input onChange={toggle} ref="dateRadioFalse" type="radio" value="false" name="r"/>
                          Closed
                        </label>
                        <label>
                          <input onChange={toggle} ref="dateRadioCalendar" type="radio" value="calendar" name="r"/>
                          Calendar
                        </label>
                        <DateTimePicker
                            defaultValue={moment(this.props.checkDate.end, "YYYY-MM-DD").toDate()}
                            min={moment(this.props.checkDate.start, "YYYY-MM-DD").toDate()}
                            max={moment(this.props.checkDate.end, "YYYY-MM-DD").toDate()}
                            onToggle={a => this.checkToggle(a)}
                            open={open}
                            time={this.props.timeEnabled}
                            format={"YYYY-MM-DD"}
                            onChange={(date) => this.updateValueState({startDate: date, endDate: date, layers: this.props.layers})}/>
                    </Panel>
                </div>
            </Draggable>
        );
    },
    radioToggle(e) {
        this.setState({
            open: e.target.value
        });
    },
    checkToggle(a) {
        if (this.refs.dateRadioFalse.checked) {
            this.setState({open: a});
        }else {
            this.setState({open: 'calendar'});
        }
    },
    updateValueState(value) {
        const newData = value.startDate;
        const formatData = moment(newData).format('YYYY-MM-DD');
        const newUrl = `http://159.213.57.103/cgi-bin/mapserv?map=/san1/www/datimeteo_wms/datimeteo_wms_${formatData}.map&`;
        value.layers.map((layer) => {
            if (layer.group === 'Aree Allerta') {
                const filter = {
                    params: {
                        LAYERS: [layer.name.substr(0, layer.name.length - 10) + formatData]
                    },
                    url: newUrl,
                    name: layer.name.substr(0, layer.name.length - 10) + formatData,
                    title: layer.title.substr(0, layer.title.length - 10) + formatData
                };
                this.props.propertiesChangeHandler(layer.id, filter);
            }
            if (layer.group === 'Spazializzazioni') {
                const filter = {
                    params: {
                        LAYERS: [layer.name.substr(0, layer.name.length - 10) + formatData]
                    },
                    url: newUrl,
                    name: layer.name.substr(0, layer.name.length - 10) + formatData,
                    title: layer.title.substr(0, layer.title.length - 10) + formatData
                };
                this.props.propertiesChangeHandler(layer.id, filter);
            }
            if (layer.group === 'Stazioni') {
                const filter = {
                    params: {
                        LAYERS: [layer.name.substr(0, layer.name.length - 10) + formatData]
                    },
                    url: newUrl,
                    name: layer.name.substr(0, layer.name.length - 10) + formatData,
                    title: layer.title.substr(0, layer.title.length - 10) + formatData
                };
                this.props.propertiesChangeHandler(layer.id, filter);
            }
        });
    }
});

module.exports = DateChooser;
