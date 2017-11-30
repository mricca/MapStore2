const PropTypes = require('prop-types');
/**
 * Copyright 2016, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');

const Message = require('../../components/I18N/Message');
const LayersUtils = require('../../utils/LayersUtils');
const LocaleUtils = require('../../utils/LocaleUtils');
const FileUtils = require('../../utils/FileUtils');
let StyleUtils;
const {Grid, Row, Col, Button} = require('react-bootstrap');
const {isString} = require('lodash');

const Combobox = require('react-widgets').DropdownList;

const SelectShape = require('./SelectShape');

const {Promise} = require('es6-promise');

class ShapeFileUploadAndStyle extends React.Component {
    static propTypes = {
        bbox: PropTypes.array,
        layers: PropTypes.array,
        selected: PropTypes.object,
        style: PropTypes.object,
        shapeStyle: PropTypes.object,
        readFiles: PropTypes.func,
        onShapeError: PropTypes.func,
        onShapeSuccess: PropTypes.func,
        onShapeChoosen: PropTypes.func,
        addShapeLayer: PropTypes.func,
        shapeLoading: PropTypes.func,
        onSelectLayer: PropTypes.func,
        onLayerAdded: PropTypes.func,
        onZoomSelected: PropTypes.func,
        updateShapeBBox: PropTypes.func,
        error: PropTypes.string,
        success: PropTypes.string,
        mapType: PropTypes.string,
        buttonSize: PropTypes.string,
        uploadMessage: PropTypes.object,
        cancelMessage: PropTypes.object,
        addMessage: PropTypes.object,
        stylers: PropTypes.object,
        uploadOptions: PropTypes.object,
        createId: PropTypes.func
    };

    static contextTypes = {
        messages: PropTypes.object
    };

    static defaultProps = {
        shapeLoading: () => {},
        readFiles: (files) => files.map((file) => {
            const ext = file.name.split('.').slice(-1)[0];
            const type = file.type || FileUtils.MIME_LOOKUPS[ext];
            if (file.type === 'application/vnd.google-earth.kml+xml') {
                return FileUtils.readKml(file).then((xml) => {
                    return FileUtils.kmlToGeoJSON(xml);
                });
            }
            if (type === 'application/gpx+xml') {
                return FileUtils.readKml(file).then((xml) => {
                    return FileUtils.gpxToGeoJSON(xml);
                });
            }
            if (file.type === 'application/vnd.google-earth.kmz') {
                return FileUtils.readKmz(file).then((xml) => {
                    return FileUtils.kmlToGeoJSON(xml);
                });
            }
            return FileUtils.readZip(file).then((buffer) => {
                return FileUtils.shpToGeoJSON(buffer);
            });
        }),
        mapType: "leaflet",
        buttonSize: "small",
        uploadOptions: {},
        createId: () => undefined,
        bbox: null
    };

    state = {
        useDefaultStyle: false,
        zoomOnShapefiles: true
    };

    componentWillMount() {
        StyleUtils = require('../../utils/StyleUtils')(this.props.mapType);
    }

    getGeomType = (layer) => {
        if (layer && layer.features && layer.features[0].geometry) {
            let unique;
            const geometryType = layer.features.filter((element) => {
                if (element.geometry.type === "GeometryCollection") {
                    return element.geometry.geometries;
                }
            });
            if (geometryType.length > 0) {
                let arr = [];
                geometryType.forEach((item) => {
                    item.geometry.geometries.forEach((i) => {
                        arr.push(i.type);
                    });
                });
                unique = arr.filter((v, i, a) => a.indexOf(v) === i);
                return unique && unique.length === 1 ? unique[0] : "GeometryCollection";
            }
            return layer.features[0].geometry.type;
        }
    };

    renderError = () => {
        return (<Row>
                   <div style={{textAlign: "center"}} className="alert alert-danger"><Message msgId={this.props.error}/></div>
                </Row>);
    };

    renderSuccess = () => {
        return (<Row>
                   <div style={{textAlign: "center", overflowWrap: "break-word"}} className="alert alert-success">{this.props.success}</div>
                </Row>);
    };

    renderStyle = () => {
        return this.props.stylers[this.getGeomType(this.props.selected)];
    };

    renderDefaultStyle = () => {
        return this.props.selected ?
            <Row>
                <Col xs={2}>
                    <input aria-label="..." type="checkbox" defaultChecked={this.state.useDefaultStyle} onChange={(e) => {this.setState({useDefaultStyle: e.target.checked}); }}/>
                </Col>
                <Col style={{paddingLeft: 0, paddingTop: 1}} xs={10}>
                    <label><Message msgId="shapefile.defaultStyle"/></label>
                </Col>

                <Col xs={2}>
                    <input aria-label="..." type="checkbox" defaultChecked={this.state.zoomOnShapefiles} onChange={(e) => {this.setState({zoomOnShapefiles: e.target.checked}); }}/>
                </Col>
                <Col style={{paddingLeft: 0, paddingTop: 1}} xs={10}>
                    <label><Message msgId="shapefile.zoom"/></label>
                </Col>
            </Row>
         : null;
    };

    render() {
        return (
            <Grid role="body" style={{width: "300px"}} fluid>
                {this.props.error ? this.renderError() : null}
                {this.props.success ? this.renderSuccess() : null}
            <Row style={{textAlign: "center"}}>
                {
            this.props.selected ?
                <Combobox data={this.props.layers} value={this.props.selected} onSelect={(value)=> this.props.onSelectLayer(value)} valueField={"id"} textField={"name"} /> :
                <SelectShape {...this.props.uploadOptions} errorMessage="shapefile.error.select" text={this.props.uploadMessage} onShapeChoosen={this.addShape} onShapeError={this.props.onShapeError}/>
            }
            </Row>
            <Row style={{marginBottom: 10}}>
                {this.state.useDefaultStyle ? null : this.renderStyle()}
            </Row>
            {this.renderDefaultStyle()}

                {this.props.selected ?
                <Row>
                    <Col xsOffset={6} xs={3}> <Button bsSize={this.props.buttonSize} disabled={!this.props.selected} onClick={() => {this.props.onShapeChoosen(null); }}>{this.props.cancelMessage}</Button></Col>
                    <Col xs={3}> <Button bsStyle="primary" bsSize={this.props.buttonSize} disabled={!this.props.selected} onClick={this.addToMap}>{this.props.addMessage}</Button></Col>
                </Row>
                     : null }
            </Grid>
        );
    }

    addShape = (files) => {
        this.props.shapeLoading(true);
        let queue = this.props.readFiles(files);
        Promise.all(queue).then((geoJsons) => {
            let ls = geoJsons.filter((element) => {if (element[0].features.length !== 0) {return element; }}).reduce((layers, geoJson) => {
                if (geoJson) {
                    return layers.concat(geoJson.map((layer) => {
                        return LayersUtils.geoJSONToLayer(layer, this.props.createId(layer, geoJson));
                    }));
                }
            }, []);
            this.props.onShapeChoosen(ls);
            this.props.shapeLoading(false);
        }).catch(e => {
            this.props.shapeLoading(false);
            const errorName = e && e.name || e || '';
            if (isString(errorName) && errorName === 'SyntaxError') {
                this.props.onShapeError('shapefile.error.shapeFileParsingError');
            } else {
                this.props.onShapeError('shapefile.error.genericLoadError');
            }
        });
    };

    addToMap = () => {
        this.props.shapeLoading(true);
        let styledLayer = this.props.selected;
        if (!this.state.useDefaultStyle) {
            styledLayer = StyleUtils.toVectorStyle(styledLayer, this.props.shapeStyle);
        }
        Promise.resolve(this.props.addShapeLayer( styledLayer )).then(() => {
            this.props.shapeLoading(false);

            // calculates the bbox that contains all shapefiles added
            const bbox = this.props.layers[0].features.reduce((bboxtotal, feature) => {
                if (feature.geometry.bbox && feature.geometry.bbox[0] && feature.geometry.bbox[1] && feature.geometry.bbox[2] && feature.geometry.bbox[3] ) {
                    return [
                        Math.min(bboxtotal[0], feature.geometry.bbox[0]),
                        Math.min(bboxtotal[1], feature.geometry.bbox[1]),
                        Math.max(bboxtotal[2], feature.geometry.bbox[2]),
                        Math.max(bboxtotal[3], feature.geometry.bbox[3])
                    ] || bboxtotal;
                } else if (feature.geometry && feature.geometry.type === "Point" && feature.geometry.coordinates && feature.geometry.coordinates.length >= 2) {
                    return [Math.min(bboxtotal[0], feature.geometry.coordinates[0]),
                        Math.min(bboxtotal[1], feature.geometry.coordinates[1]),
                        Math.max(bboxtotal[2], feature.geometry.coordinates[0]),
                        Math.max(bboxtotal[3], feature.geometry.coordinates[1])
                    ];
                }
                return bboxtotal;
            }, this.props.bbox);
            if (this.state.zoomOnShapefiles) {
                this.props.updateShapeBBox(bbox);
                this.props.onZoomSelected(bbox, "EPSG:4326");
            }
            this.props.onShapeSuccess(this.props.layers[0].name + LocaleUtils.getMessageById(this.context.messages, "shapefile.success"));
            this.props.onLayerAdded(this.props.selected);
        }).catch(() => {
            this.props.shapeLoading(false);
            this.props.onShapeError('shapefile.error.genericLoadError');
        });
    };
}


module.exports = ShapeFileUploadAndStyle;
