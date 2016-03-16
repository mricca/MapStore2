/**
 * Copyright 2015, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

var axios = require('../libs/ajax');

const MAP_CONFIG_LOADED = 'MAP_CONFIG_LOADED';
const MAP_CONFIG_LOAD_ERROR = 'MAP_CONFIG_LOAD_ERROR';

function configureMap(conf, confDate, legacy) {
    return {
        type: MAP_CONFIG_LOADED,
        config: conf,
        checkDate: confDate,
        legacy: legacy || false
    };
}

function configureError(e) {
    return {
        type: MAP_CONFIG_LOAD_ERROR,
        error: e
    };
}

function getDateConfiguration() {
    return axios.get('http://159.213.57.103/spazializzazioni/meteo_js/date.json');
}

function configMap(configName, legacy) {
    return axios.get(configName, legacy);
}

function loadMapConfig(configName, legacy) {
    return (dispatch) => {
        return axios.all([configMap(configName, legacy), getDateConfiguration()]).then((response) => {
            const url = `http://159.213.57.103/cgi-bin/mapserv?map=/san1/www/datimeteo_wms/datimeteo_wms_${response[1].data.date.end}.map&`;
            response[0].data.map.layers.map(layer => {
                if (layer.group === 'Aree Allerta') {
                    layer.name = layer.name.substr(0, layer.name.length - 10) + response[1].data.date.end;
                    layer.title = layer.title.substr(0, layer.title.length - 10) + response[1].data.date.end;
                    layer.url = url;
                }
                if (layer.group === 'Spazializzazioni') {
                    layer.name = layer.name.substr(0, layer.name.length - 10) + response[1].data.date.end;
                    layer.title = layer.title.substr(0, layer.title.length - 10) + response[1].data.date.end;
                    layer.url = url;
                }
                if (layer.group === 'Stazioni') {
                    layer.name = layer.name.substr(0, layer.name.length - 10) + response[1].data.date.end;
                    layer.title = layer.title.substr(0, layer.title.length - 10) + response[1].data.date.end;
                    layer.url = url;
                }
            }, this);
            if (typeof response[0].data === 'object') {
                dispatch(configureMap(response[0].data, response[1].data, legacy));
            } else {
                try {
                    JSON.parse(response[0].data);
                } catch(e) {
                    dispatch(configureError('Configuration file broken (' + configName + '): ' + e.message));
                }

            }

        }).catch((e) => {
            dispatch(configureError(e));
        });
    };
}

module.exports = {MAP_CONFIG_LOADED, MAP_CONFIG_LOAD_ERROR, loadMapConfig, configureMap};
