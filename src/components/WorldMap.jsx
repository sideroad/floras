import React, { PropTypes, Component } from 'react';
import DeckGL from 'deck.gl';
import MapGL from 'react-map-gl';
import config from '../config';

const TOKEN = config.mapbox.token;

class WorldMap extends Component {
  render() {
    if (__SERVER__) {
      return (<div />);
    }

    // XXX: The reason to require dynamically is to prevent server side rendering.
    //      MapGL is not compatible with server side rendering.
    // eslint-disable-next-line global-require
    // const MapGL = require('react-map-gl');

    return (
      <MapGL
        ref={(elem) => { this.mapgl = elem; }}
        width={this.props.width}
        height={this.props.height}
        {...this.props.mapViewState}
        mapboxApiAccessToken={TOKEN}
        perspectiveEnabled
        mapStyle="mapbox://styles/sideroad/ciz10g2k7000p2rq7hd9jp215"
        onChangeViewport={this.props.onChangeViewport}
      >
        <DeckGL
          debug
          width={this.props.width}
          height={this.props.height}
          {...this.props.mapViewState}
          layers={this.props.layers}
          onLayerClick={this.props.onLayerClick}
          onWebGLInitialized={this.props.eventInitialized}
        />
      </MapGL>
    );
  }
}

WorldMap.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  mapViewState: PropTypes.object.isRequired,
  layers: PropTypes.array.isRequired,
  eventInitialized: PropTypes.func.isRequired,
  onLayerClick: PropTypes.func.isRequired,
  onChangeViewport: PropTypes.func.isRequired
};

export default WorldMap;
