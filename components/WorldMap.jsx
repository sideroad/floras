import React, { Component } from 'react';
import DeckGL, { ScatterplotLayer, HexagonLayer } from 'deck.gl';
import { MapView } from '@deck.gl/core';
import { StaticMap } from 'react-map-gl';
import config from '../config';

const TOKEN = config.mapbox.token;

class WorldMap extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const layers =
      this.props.graphType === 'point'
        ? [
          new ScatterplotLayer({
            id: 'event',
            data: this.props.pixels,
            getPosition: d => d.position,
            getFillColor: d => d.color,
            getRadius: d => d.radius,
            opacity: 0.5,
            getLineWidth: d => 2,
            pickable: true,
            radiusScale: 40,
            radiusMinPixels: 3,
            radiusMaxPixels: 400,
          }),
          new ScatterplotLayer({
            id: 'place',
            data: [this.props.place].filter(item => item.id),
            getPosition: d => d.position,
            getFillColor: d => d.color,
            getRadius: d => d.radius,
            opacity: 0.5,
            getLineWidth: () => 2,
            pickable: true,
            radiusMinPixels: 4,
            radiusMaxPixels: 10,
          }),
        ]
        : [
          new HexagonLayer({
            id: 'hexagon',
            fp64: true,
            colorRange: [
                [255, 255, 252],
                [250, 225, 221],
                [246, 196, 194],
                [243, 167, 167],
                [239, 138, 140],
                [236, 109, 113],
            ],
            lightSettings: {
              lightsPosition: [-0.144528, 49.739968, 8000, -3.807751, 54.104682, 8000],
              ambientRatio: 0.4,
              diffuseRatio: 0.6,
              specularRatio: 0.2,
              lightsStrength: [0.8, 0.0, 0.8, 0.0],
              numberOfLights: 2,
            },
            upperPercentile: 100,
            coverage: 1,
            radius: 5000,
            elevationRange: [0, 4000],
            elevationScale: 25,
            extruded: true,
            getPosition: d => [d.position[0], d.position[1]],
            data: this.props.pixels,
          }),
        ];

    return (
      <DeckGL
        debug
        views={new MapView()}
        viewState={this.props.mapViewState}
        controller
        layers={layers}
        onViewStateChange={(state) => {
          this.props.onViewportChange(state);
        }}
        onClick={this.props.onLayerClick}
      >
        <StaticMap
          mapboxApiAccessToken={TOKEN}
          reuseMaps
          preventStyleDiffing
          mapStyle="mapbox://styles/mapbox/dark-v9"
          onLoad={(evt) => {
            const map = evt.target;
            this.props.mapInitialized(map);
          }}
        />
      </DeckGL>
    );
  }
}

export default WorldMap;
