const PropTypes = require('prop-types');
/*
 * Copyright 2017, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
const React = require('react');
const Select = require('react-select');
require('react-select/dist/react-select.css');
const {Checkbox} = require('react-bootstrap');
const {get, head} = require('lodash');
const Message = require('../../I18N/Message');

/**
 * Download Options Form. Shows a selector of the options to perform a WFS download
 * @memberof components.data.download
 * @name DownloadOptions
 * @class
 * @prop {object} downloadOptions the options to set. e.g. `{singlePage: true|false, selectedFormat: "csv"}`
 * @prop {array} formats the selectable format options.
 * @prop {function} onChange the function to trigger when some option changes
 */
module.exports = class extends React.Component {
    static propTypes = {
            downloadOptions: PropTypes.object,
            formatOptionsFetch: PropTypes.func,
            formats: PropTypes.array,
            srsList: PropTypes.array,
            onChange: PropTypes.func,
            defaultSrs: PropTypes.string,
            layer: PropTypes.object,
            formatsLoading: PropTypes.bool
    };

    static defaultProps = {
        downloadOptions: {},
        formatsLoading: false,
        formats: [],
        srsList: []
    };

    getSelectedFormat = () => {
        return get(this.props, "downloadOptions.selectedFormat");
    };
    getSelectedSRS = () => {
        return get(this.props, "downloadOptions.selectedSrs") || this.props.defaultSrs || get(head(this.props.srsList), "name");
    };
    render() {
        return (<form>
            <label><Message msgId="wfsdownload.format" /></label>
            <Select
                clearable={false}
                isLoading={this.props.formatsLoading}
                onOpen={() => this.props.formatOptionsFetch(this.props.layer)}
                value={this.getSelectedFormat()}
                noResultsText={<Message msgId="wfsdownload.format" />}
                onChange={(sel) => this.props.onChange("selectedFormat", sel.value)}
                options={this.props.formats.map(f => ({value: f.name, label: f.label || f.name}))} />
            <label><Message msgId="wfsdownload.srs" /></label>
            <Select
                clearable={false}
                value={this.getSelectedSRS()}
                onChange={(sel) => this.props.onChange("selectedSrs", sel.value)}
                options={this.props.srsList.map(f => ({value: f.name, label: f.label || f.name}))} />
            <Checkbox checked={this.props.downloadOptions.singlePage} onChange={() => this.props.onChange("singlePage", !this.props.downloadOptions.singlePage ) }>
                <Message msgId="wfsdownload.downloadonlycurrentpage" />
            </Checkbox>
        </form>);
    }
};
