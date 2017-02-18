import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import MapGL from 'react-map-gl';
import DeckGL from 'deck.gl/react';
import Slider from 'rc-slider';
import moment from 'moment';
import { Chips } from 'koiki-ui';
import { ScatterplotLayer } from 'deck.gl';
// import update from 'immutability-helper';
import { update as updateMap } from '../reducers/map';
import { set as setDate } from '../reducers/date';
import config from '../config';

require('rc-slider/assets/index.css');
const styles = require('../css/four-seasons.less');

const ui = {
  // eslint-disable-next-line global-require
  fa: require('../css/koiki-ui/fa/less/font-awesome.less'),
  // eslint-disable-next-line global-require
  chips: require('../css/koiki-ui/chips.less'),
  // eslint-disable-next-line global-require
  input: require('../css/koiki-ui/input.less'),
  // eslint-disable-next-line global-require
  iconButton: require('../css/koiki-ui/icon-button.less'),
};

const TOKEN = config.mapbox.token;

// eslint-disable-next-line
class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      width: 1,
      height: 1,
      dayOfYear: props.dayOfYear,
      focused: false
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
    const layers = [
      new ScatterplotLayer({
        id: 'grid',
        data: this.props.events.map((event) => {
          if (Number(event.day) === this.state.dayOfYear) {
            return {
              ...event,
              color: [255, 135, 175],
              radius: event.strength * 5,
              position: event.latlng.split(',').map(item => Number(item)).reverse().concat([0])
            };
          }
          return undefined;
        }).filter(item => item),
        opacity: 0.5,
        strokeWidth: 2,
        pickable: true,
        radiusMinPixels: 4,
        radiusMaxPixels: 300,
      }),
      new ScatterplotLayer({
        id: 'grid',
        data: [this.props.place].filter(item => item.id),
        opacity: 0.5,
        strokeWidth: 2,
        pickable: true,
        radiusMinPixels: 4,
        radiusMaxPixels: 300,
      })
    ];
    return (
      <div className={styles.container}>
        <div className={`${styles.chips} ${this.state.focused ? styles.focused : ''}`}>
          <Chips
            ref={(elem) => { this.chips = elem; }}
            styles={ui}
            suggests={this.props.places}
            onFocus={() => this.setState({ focused: true })}
            onBlur={() => this.setState({ focused: false })}
            onChange={evt =>
              this.context.fetcher.place.gets({
                input: evt.target.value
              })
            }
            onSelect={(item) => {
              this.chips.input.inputDOM.blur();
              this.context.fetcher.place.get({
                placeid: item.id
              }).then(
                (res) => {
                  const location = res.body.result.geometry.location;
                  this.props.updateMap({
                    ...this.props.mapViewState,
                    latitude: location.lat,
                    longitude: location.lng,
                    zoom: 13,
                  });
                }
              );
            }}
          />
        </div>
        <MapGL
          width={this.state.width}
          height={this.state.height}
          {...this.props.mapViewState}
          mapboxApiAccessToken={TOKEN}
          perspectiveEnabled
          mapStyle="mapbox://styles/sideroad/ciz10g2k7000p2rq7hd9jp215"
          onChangeViewport={
            (mapViewState) => {
              console.log(mapViewState);
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
            onLayerClick={
              (info) => {
                if (info) {
                  console.log(info.object);
                }
              }
            }
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
  events: PropTypes.array.isRequired,
  places: PropTypes.array.isRequired,
  place: PropTypes.object.isRequired,
  mapViewState: PropTypes.object,
  dayOfYear: PropTypes.number.isRequired,
  updateMap: PropTypes.func.isRequired,
  setDate: PropTypes.func.isRequired,
};

Home.defaultProps = {
  mapViewState: {},
};

Home.contextTypes = {
  lang: PropTypes.string.isRequired,
  fetcher: PropTypes.object.isRequired,
  i18n: PropTypes.object.isRequired
};

const connected = connect(
  state => ({
    events: state.event.items,
    places: state.place.items,
    place: state.place.item,
    mapViewState: state.map.mapViewState,
    dayOfYear: state.date.dayOfYear
  }),
  { updateMap, setDate }
)(Home);

export default connected;
