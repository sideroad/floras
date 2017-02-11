import React, { PropTypes } from 'react';
import MapGL from 'react-map-gl';
import DeckGL from 'deck.gl/react';

const WorldMap = props =>
  <div>
    <MapGL
      {...props.viewport}
      {...props.mapViewState}
      mapboxApiAccessToken={props.token}
      onChangeViewport={
        mapViewState => props.onChangeViewport(mapViewState)
      }
    >
      <DeckGL
        {...props.viewport}
        {...props.mapViewState}
        layers={[props.layer]}
      />
    </MapGL>
  </div>;

WorldMap.propTypes = {
  token: PropTypes.string.isRequired,
  viewport: PropTypes.object.isRequired,
  layer: PropTypes.object.isRequired,
  mapViewState: PropTypes.object.isRequired,
  onChangeViewport: PropTypes.func.isRequired
};

export default WorldMap;
