/**
 * Copyright 2016, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');

const Slider = require('react-nouislider');
const ElevationChart = require('./ElevationChart');
require('react-widgets/lib/less/react-widgets.less');
require("./css/elevation.css");

module.exports = React.createClass({
    propTypes: {
        elevationText: React.PropTypes.node,
        element: React.PropTypes.object,
        elevations: React.PropTypes.object,
        onChange: React.PropTypes.func,
        appState: React.PropTypes.object,
        chartStyle: React.PropTypes.object
    },
    getDefaultProps() {
        return {
            onChange: () => {}
        };
    },
    shouldComponentUpdate(nextProps) {
        if (nextProps.appState && nextProps.appState.initialState && nextProps.appState.initialState.params && nextProps.element.params) {
            if (nextProps.appState.initialState.params[nextProps.elevations.name] !==
                    nextProps.element.params[nextProps.elevations.name]) {
                return false;
            }
            return false;
        }
        return true;
    },
    renderElevationsChart(elevations) {
        if (this.props.elevations.showChart) {
            return (
                <ElevationChart
                    onChange={this.props.onChange}
                    elevations={elevations}
                    chartStyle={this.props.chartStyle}/>
            );
        }
    },
    renderElevationsSlider(elevations) {
        const values = elevations.values;
        const min = 0;
        const max = values.length - 1;
        const dif = max - min;
        const firstVal = parseFloat(values[0]);
        const lastVal = parseFloat(values[values.length - 1]);
        const start = this.props.element &&
                        this.props.element.params &&
                        this.props.element.params[this.props.elevations.name][0] || values[0];
        const elevationName = {};
        return (
            <div id="mapstore-elevation">
                <Slider
                    snap= {true}
                    start={[parseFloat((start))] || [0.0]}
                    range= {this.calculateRange(values, min, max, dif, firstVal, lastVal)}
                    behaviour= "tap"
                    pips= {{
                        mode: 'range',
                        stepped: true,
                        density: 10,
                        format: {
                            to: function( value ) {
                                return parseFloat(value).toFixed(1);
                            }
                        }
                    }}
                    tooltips={!this.props.elevations.showChart}
                    onChange={(value) => {
                        elevationName[this.props.elevations.name] = value;
                        this.props.onChange("params", Object.assign({}, elevationName));
                    }}/>
            </div>
        );
    },
    render() {
        const elevations = this.props.elevations;
        return (
            <div>
                <label
                    id="mapstore-elevation-label"
                    key="elevation-label"
                    className="control-label"
                    style={this.props.elevations.showChart ? {marginBottom: "10px"} : {marginBottom: "90px"}}>
                    {this.props.elevationText}: ({this.props.elevations.units})
                </label>
                {this.renderElevationsChart(elevations)}
                <div>
                    <div key="elevation">
                        {this.renderElevationsSlider(elevations)}
                    </div>
                </div>
            </div>
        );
    },
    calculateRange(values, min, max, dif, firstVal, lastVal) {
        let arr = [];
        let percText = "";
        let range = {min: firstVal, max: lastVal};
        values.forEach(function(currentValue, i) {
            arr[i] = ((i - min) / dif) * 100;
            percText = arr[i] + "%";
            range[percText] = parseFloat(currentValue);
        });
        return range;
    }
});
