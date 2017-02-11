import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import MapGL from 'react-map-gl';
import DeckGL from 'deck.gl/react';
import Slider from 'rc-slider';
import moment from 'moment';
import { ScatterplotLayer } from 'deck.gl';
// import update from 'immutability-helper';
import { update as updateMap } from '../reducers/map';
import { set as setDate } from '../reducers/date';
// import WorldMap from '../components/WorldMap';

require('rc-slider/assets/index.css');
const styles = require('../css/four-seasons.less');

const TOKEN = 'pk.eyJ1Ijoic2lkZXJvYWQiLCJhIjoiY2l5ems4dHB0MDQyczJxcDh3Nmhjc2h3eCJ9.4vItskqhevUMLJv2ogNdlA';

// eslint-disable-next-line
class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      width: 1,
      height: 1,
      dayOfYear: props.dayOfYear
    };
    this.onResize = this.onResize.bind(this);
  }

  componentWillMount() {
    console.log('will mount');
    this.onResize();
  }

  componentDidMount() {
    console.log('did mount');
    window.addEventListener('resize', () => this.onResize());
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      dayOfYear: nextProps.dayOfYear
    });
  }

  onResize() {
    this.setState({
      width: window.innerWidth,
      height: window.innerHeight
    });
  }

  render() {
    const layers = [new ScatterplotLayer({
      id: 'grid',
      data: [
        {
          color: [255, 135, 175],
          position: [135.8647839, 34.3603986, 0],
          radius: 5
        },
        {
          color: [255, 135, 175],
          position: [138.0613931, 35.8335566, 0],
          radius: 5
        },
        {
          color: [255, 135, 175],
          position: [138.9225609, 34.7469469, 0],
          radius: 5
        },
        {
          color: [255, 135, 175],
          position: [135.819585, 34.951465, 0],
          radius: 5
        }
      ],
      opacity: 0.5,
      strokeWidth: 2,
      pickable: true,
      radiusMinPixels: 5,
      radiusMaxPixels: 150,
    })];
    return (
      <div>
        <MapGL
          width={this.state.width}
          height={this.state.height}
          {...this.props.mapViewState}
          mapboxApiAccessToken={TOKEN}
          perspectiveEnabled
          mapStyle="mapbox://styles/mapbox/dark-v9"
          onChangeViewport={
            (mapViewState) => {
              this.props.updateMap({
                ...mapViewState,
                pitch: mapViewState.pitch > 60 ? 60 : mapViewState.pitch
              });
            }
          }
        >
          <DeckGL
            debug
            width={this.state.width}
            height={this.state.height}
            {...this.props.mapViewState}
            layers={layers}
          />
        </MapGL>
        <div className={styles.date}>
          {moment().dayOfYear(this.state.dayOfYear).format('MMM D')}
        </div>
        <Slider
          step={1}
          min={1}
          max={moment().endOf('year').dayOfYear()}
          defaultValue={this.state.dayOfYear}
          className={styles.slider}
          onChange={
            value => this.setState({ dayOfYear: value })
          }
          onAfterChange={
            value => this.props.setDate(value)
          }
        />
      </div>
    );
  }
}

Home.propTypes = {
  mapViewState: PropTypes.object,
  dayOfYear: PropTypes.number.isRequired,
  updateMap: PropTypes.func.isRequired,
  setDate: PropTypes.func.isRequired,
};

Home.defaultProps = {
  mapViewState: {}
};

Home.contextTypes = {
  lang: PropTypes.string.isRequired,
  fetcher: PropTypes.object.isRequired,
  i18n: PropTypes.object.isRequired
};

const connected = connect(
  state => ({
    mapViewState: state.map.mapViewState,
    dayOfYear: state.date.dayOfYear
  }),
  { updateMap, setDate }
)(Home);

export default connected;
