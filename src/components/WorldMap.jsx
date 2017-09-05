import React, { PropTypes, Component } from 'react';
import DeckGL, { ScatterplotLayer, HexagonLayer } from 'deck.gl';
import MapGL from 'react-map-gl';
import config from '../config';

const TOKEN = config.mapbox.token;

class WorldMap extends Component {
  render() {
    if (__SERVER__) {
      return (<div />);
    }

    const layers = this.props.graphType === 'point' ? [
      new ScatterplotLayer({
        id: 'event',
        data: this.props.pixels,
        opacity: 0.5,
        strokeWidth: 2,
        pickable: true,
        radiusScale: 40,
        radiusMinPixels: 3,
        radiusMaxPixels: 400,
      }),
      new ScatterplotLayer({
        id: 'place',
        data: [this.props.place].filter(item => item.id),
        opacity: 0.5,
        strokeWidth: 2,
        pickable: true,
        radiusMinPixels: 4,
        radiusMaxPixels: 10,
      })
    ] : [
      new HexagonLayer({
        id: 'hexagon',
        fp64: true,
        colorRange: [
          [255, 255, 252],
          [250, 225, 221],
          [246, 196, 194],
          [243, 167, 167],
          [239, 138, 140],
          [236, 109, 113]
        ],
        lightSettings: {
          lightsPosition: [-0.144528, 49.739968, 8000, -3.807751, 54.104682, 8000],
          ambientRatio: 0.4,
          diffuseRatio: 0.6,
          specularRatio: 0.2,
          lightsStrength: [0.8, 0.0, 0.8, 0.0],
          numberOfLights: 2
        },
        upperPercentile: 100,
        coverage: 1,
        radius: 5000,
        elevationRange: [0, 4000],
        elevationScale: 25,
        extruded: true,
        getPosition: d => [d.position[0], d.position[1]],
        data: this.props.pixels,
      })
    ];

    return (
      <MapGL
        ref={(elem) => { this.mapgl = elem; }}
        width={this.props.width}
        height={this.props.height}
        {...this.props.mapViewState}
        mapboxApiAccessToken={TOKEN}
        perspectiveEnabled
        mapStyle="mapbox://styles/sideroad/ciz10g2k7000p2rq7hd9jp215"
        onViewportChange={this.props.onViewportChange}
      >
        <DeckGL
          debug
          width={this.props.width}
          height={this.props.height}
          {...this.props.mapViewState}
          layers={layers}
          onLayerClick={this.props.onLayerClick}
          onWebGLInitialized={this.props.eventInitialized}
        />
      </MapGL>
    );
  }
}

WorldMap.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  mapViewState: PropTypes.object.isRequired,
  pixels: PropTypes.array.isRequired,
  place: PropTypes.object.isRequired,
  eventInitialized: PropTypes.func.isRequired,
  onLayerClick: PropTypes.func.isRequired,
  onViewportChange: PropTypes.func.isRequired,
  graphType: PropTypes.oneOf(['point', 'hexagon']),
};

WorldMap.defaultProps = {
  width: undefined,
  height: undefined,
};

export default WorldMap;
