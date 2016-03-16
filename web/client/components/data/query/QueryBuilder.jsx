/**
 * Copyright 2016, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
const React = require('react');

const GroupField = require('./GroupField');
const SpatialFilter = require('./SpatialFilter');
const QueryToolbar = require('./QueryToolbar');

require('./queryform.css');

const QueryBuilder = React.createClass({
    propTypes: {
        useMapProjection: React.PropTypes.bool,
        attributes: React.PropTypes.array,
        groupLevels: React.PropTypes.number,
        filterFields: React.PropTypes.array,
        groupFields: React.PropTypes.array,
        spatialField: React.PropTypes.object,
        removeButtonIcon: React.PropTypes.string,
        addButtonIcon: React.PropTypes.string,
        attributePanelExpanded: React.PropTypes.bool,
        spatialPanelExpanded: React.PropTypes.bool,
        showDetailsPanel: React.PropTypes.bool,
        toolbarEnabled: React.PropTypes.bool,
        searchUrl: React.PropTypes.string,
        showGeneratedFilter: React.PropTypes.oneOfType([
            React.PropTypes.bool,
            React.PropTypes.string
        ]),
        featureTypeName: React.PropTypes.string,
        attributeFilterActions: React.PropTypes.object,
        spatialFilterActions: React.PropTypes.object,
        queryToolbarActions: React.PropTypes.object
    },
    getDefaultProps() {
        return {
            useMapProjection: true,
            groupLevels: 1,
            groupFields: [],
            filterFields: [],
            attributes: [],
            spatialField: {},
            removeButtonIcon: "glyphicon glyphicon-minus",
            addButtonIcon: "glyphicon glyphicon-plus",
            attributePanelExpanded: true,
            spatialPanelExpanded: true,
            showDetailsPanel: false,
            toolbarEnabled: true,
            searchUrl: "",
            showGeneratedFilter: false,
            featureTypeName: null,
            attributeFilterActions: {
                onAddGroupField: () => {},
                onAddFilterField: () => {},
                onRemoveFilterField: () => {},
                onUpdateFilterField: () => {},
                onUpdateExceptionField: () => {},
                onUpdateLogicCombo: () => {},
                onRemoveGroupField: () => {},
                onChangeCascadingValue: () => {},
                onExpandAttributeFilterPanel: () => {}
            },
            spatialFilterActions: {
                onExpandSpatialFilterPanel: () => {},
                onSelectSpatialMethod: () => {},
                onSelectSpatialOperation: () => {},
                onChangeDrawingStatus: () => {},
                onRemoveSpatialSelection: () => {},
                onShowSpatialSelectionDetails: () => {},
                onEndDrawing: () => {},
                onChangeDwithinValue: () => {}
            },
            queryToolbarActions: {
                onQuery: () => {},
                onReset: () => {},
                onChangeDrawingStatus: () => {}
            }
        };
    },
    render() {
        return (
            <div id="queryFormPanel">
                <div className="querypanel">
                    <GroupField
                        attributes={this.props.attributes}
                        groupLevels={this.props.groupLevels}
                        filterFields={this.props.filterFields}
                        groupFields={this.props.groupFields}
                        removeButtonIcon={this.props.removeButtonIcon}
                        addButtonIcon={this.props.addButtonIcon}
                        attributePanelExpanded={this.props.attributePanelExpanded}
                        actions={this.props.attributeFilterActions}/>
                    <SpatialFilter
                        useMapProjection={this.props.useMapProjection}
                        spatialField={this.props.spatialField}
                        spatialPanelExpanded={this.props.spatialPanelExpanded}
                        showDetailsPanel={this.props.showDetailsPanel}
                        actions={this.props.spatialFilterActions}/>
                </div>
                <QueryToolbar
                    filterFields={this.props.filterFields}
                    groupFields={this.props.groupFields}
                    spatialField={this.props.spatialField}
                    toolbarEnabled={this.props.toolbarEnabled}
                    searchUrl={this.props.searchUrl}
                    showGeneratedFilter={this.props.showGeneratedFilter}
                    featureTypeName={this.props.featureTypeName}
                    actions={this.props.queryToolbarActions}/>
            </div>
        );
    }
});

module.exports = QueryBuilder;
