import React, { PropTypes, Component } from 'react';
import DeckGL, { ScatterplotLayer } from 'deck.gl';
import MapGL from 'react-map-gl';
import config from '../config';

const TOKEN = config.mapbox.token;

class WorldMap extends Component {
  render() {
    if (__SERVER__) {
      return (<div />);
    }

    const types = this.props.types;
    const dayOfYear = this.props.dayOfYear;
    const layers = [
      new ScatterplotLayer({
        id: 'event',
        data: this.props.events.map((event) => {
          if (Number(event.day) === dayOfYear) {
            return {
              ...event,
              color: types[event.type].color,
              radius: event.strength,
              position: event.latlng.split(',').map(item => Number(item)).reverse().concat([0])
            };
          }
          return undefined;
        }).filter(item => item),
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
        onChangeViewport={this.props.onChangeViewport}
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
  types: PropTypes.object.isRequired,
  events: PropTypes.array.isRequired,
  place: PropTypes.object.isRequired,
  dayOfYear: PropTypes.number,
  eventInitialized: PropTypes.func.isRequired,
  onLayerClick: PropTypes.func.isRequired,
  onChangeViewport: PropTypes.func.isRequired
};

WorldMap.defaultProps = {
  width: undefined,
  height: undefined,
};

export default WorldMap;
