const urlUtil = require('url');
const React = require('react');
const {isArray} = require('lodash');

const SecurityUtils = require('../../../../utils/SecurityUtils');
const ConfigUtils = require('../../../../utils/ConfigUtils');

const assign = require('object-assign');

const Legend = React.createClass({
    propTypes: {
        layer: React.PropTypes.object,
        legendHeigth: React.PropTypes.number,
        legendWidth: React.PropTypes.number,
        legendOptions: React.PropTypes.string
    },
    getDefaultProps() {
        return {
            legendHeigth: 12,
            legendWidth: 12,
            legendOptions: "forceLabels:on;fontSize:10"
        };
    },
   render() {
       if (this.props.layer && this.props.layer.type === "wms" && this.props.layer.url) {
           let layer = this.props.layer;

           let mapServerMapParam = ConfigUtils.filterParameters(layer.url, ["map"]);
           let url;
           if (isArray(layer.url)) {
               url = layer.url[Math.floor(Math.random() * layer.url.length)];
           }else {
               if (mapServerMapParam && mapServerMapParam.hasOwnProperty("map")) {
                   url = `${layer.url.replace(/[?].*$/g, '')}?map=${mapServerMapParam.map}`;
               }else {
                   url = layer.url.replace(/[?].*$/g, '');
               }
           }

           let urlObj = urlUtil.parse(url);
           let query = assign({}, {
               service: "WMS",
               request: "GetLegendGraphic",
               format: "image/png",
               height: this.props.legendHeigth,
               width: this.props.legendWidth,
               layer: layer.name,
               style: layer.style || null,
               version: layer.version || "1.3.0",
               SLD_VERSION: "1.1.0",
               LEGEND_OPTIONS: this.props.legendOptions
               // SCALE TODO
           }, layer.legendParams || {},
           layer.params && layer.params.SLD_BODY ? {SLD_BODY: layer.params.SLD_BODY} : {},
           urlObj && urlObj.query && urlObj.query.indexOf("map") !== -1 ? {map: urlObj.query.split("=")[1]} : {});
           SecurityUtils.addAuthenticationParameter(url, query);

           let legendUrl = urlUtil.format({
               host: urlObj.host,
               protocol: urlObj.protocol,
               pathname: urlObj.pathname,
               query: query
           });
           return <img src={legendUrl} style={{maxWidth: "100%"}}/>;
       }
       return null;
   }
});
module.exports = Legend;
