/**
 * Copyright 2015, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

var Layers = require('../../../../utils/openlayers/Layers');
var ol = require('openlayers');
var objectAssign = require('object-assign');
var CoordinatesUtils = require('../../../../utils/CoordinatesUtils');
const {isArray} = require('lodash');

function wmsToOpenlayersOptions(options) {
    // NOTE: can we use opacity to manage visibility?
    return objectAssign({
        LAYERS: options.name,
        STYLES: options.style || "",
        FORMAT: options.format || 'image/png',
        TRANSPARENT: options.transparent !== undefined ? options.transparent : true,
        SRS: CoordinatesUtils.normalizeSRS(options.srs),
        CRS: CoordinatesUtils.normalizeSRS(options.srs),
        TILED: options.tiled || false
    }, options.params || {});
}

function getWMSURLs( urls ) {
    // const myUrls = urls.map((url) => url.split("\?")[0]);
    const myUrls = urls.map((url) => url);
    return myUrls;
}

Layers.registerType('wms', {
    create: (options) => {
        if (options.singleTile) {
            return new ol.layer.Image({
                title: options.title,
                opacity: options.opacity !== undefined ? options.opacity : 1,
                visible: options.visibility !== false,
                zIndex: options.zIndex,
                source: new ol.source.ImageWMS({
                  url: getWMSURLs(isArray(options.url) ? options.url : [options.url]),
                  params: wmsToOpenlayersOptions(options),
                  serverType: /** @type {ol.source.wms.ServerType} */ ('mapserver')
                })
            });
        }
        return new ol.layer.Tile({
            opacity: options.opacity !== undefined ? options.opacity : 1,
            visible: options.visibility !== false,
            zIndex: options.zIndex,
            source: new ol.source.TileWMS({
              urls: getWMSURLs(isArray(options.url) ? options.url : [options.url]),
              params: wmsToOpenlayersOptions(options)
            })
        });
    }
});
