/*
* Copyright 2018, GeoSolutions Sas.
* All rights reserved.
*
* This source code is licensed under the BSD-style license found in the
* LICENSE file in the root directory of this source tree.
*/

import { connect } from 'react-redux';
import { compose, defaultProps, withHandlers } from 'recompose';
import { createSelector } from 'reselect';

import { deleteDashboard, reloadDashboards } from '../../actions/dashboards';
import { invalidateFeaturedMaps, updateAttribute } from '../../actions/maps'; // TODO: externalize
import { success } from '../../actions/notifications';
import resourceGrid from '../../components/resources/enhancers/resourceGrid';
import withShareTool from '../../components/resources/enhancers/withShareTool';
import ResourceGrid from '../../components/resources/ResourceGrid';
import { userSelector } from '../../selectors/security';

const Grid = compose(
    connect(createSelector(userSelector, user => ({ user })), {
        onDelete: deleteDashboard,
        reloadDashboards,
        onShowSuccessNotification: () => success({ title: "success", message: "resources.successSaved" }),
        invalidateFeaturedMaps,
        onUpdateAttribute: updateAttribute
    }),
    withHandlers({
        onSaveSuccess: (props) => () => {
            if (props.reloadDashboards) {
                props.reloadDashboards();
            }
            if (props.invalidateFeaturedMaps) {
                props.invalidateFeaturedMaps();
            }
            if (props.onShowSuccessNotification) {
                props.onShowSuccessNotification();
            }
        }
    }),
    defaultProps({
        category: "DASHBOARD"
    }),
    resourceGrid,
    // add and configure share tool panel
    compose(
        defaultProps({ shareOptions: { embedPanel: false } }),
        withShareTool
    )

)(ResourceGrid);

export default Grid;
