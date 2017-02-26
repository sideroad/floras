import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import MapGL from 'react-map-gl';
import DeckGL from 'deck.gl/react';
import Slider from 'rc-slider';
import moment from 'moment';
import { stringify } from 'koiki';
import { push } from 'react-router-redux';
import { ScatterplotLayer } from 'deck.gl';
import { asyncConnect } from 'redux-connect';
// import update from 'immutability-helper';
import FindPlace from '../components/FindPlace';
import SideBar from '../components/SideBar';
import { update as updateMap } from '../reducers/map';
import { set as setDate } from '../reducers/date';
import config from '../config';
import uris from '../uris';

require('../css/rc-slider.css');
const styles = require('../css/home.less');

const TOKEN = config.mapbox.token;

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
    const layers = [
      new ScatterplotLayer({
        id: 'grid',
        data: this.props.events.map((event) => {
          if (Number(event.day) === this.state.dayOfYear) {
            return {
              ...event,
              color: [255, 135, 175],
              radius: event.strength * 1.5,
              position: event.latlng.split(',').map(item => Number(item)).reverse().concat([0])
            };
          }
          return undefined;
        }).filter(item => item),
        opacity: 0.5,
        strokeWidth: 2,
        pickable: true,
        radiusMinPixels: 3,
        radiusMaxPixels: 20,
      }),
      new ScatterplotLayer({
        id: 'grid',
        data: [this.props.place].filter(item => item.id),
        opacity: 0.5,
        strokeWidth: 2,
        pickable: true,
        radiusMinPixels: 4,
        radiusMaxPixels: 10,
      })
    ];
    return (
      <div className={styles.container}>
        <FindPlace
          places={this.props.places}
          onChange={input =>
            this.context.fetcher.place.gets({
              input
            })
          }
          onSelect={item =>
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
            )
          }
        />
        <SideBar
          push={this.props.push}
          lang={this.context.lang}
        />
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
                  this.props.push(stringify(uris.pages.place, {
                    id: info.object.id,
                    lang: this.context.lang
                  }));
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
        {this.props.children ? this.props.children : ''}
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
  push: PropTypes.func.isRequired,
  children: PropTypes.element,
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
    dayOfYear: state.date.dayOfYear,
  }),
  { updateMap, setDate, push }
)(Home);

const asynced = asyncConnect([{
  promise: ({ helpers: { fetcher } }) => {
    const promises = [];
    promises.push(
      fetcher.event
        .gets()
    );
    return Promise.all(promises);
  }
}])(connected);

export default asynced;
