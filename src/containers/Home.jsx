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
import hash from 'object-hash';
import autoBind from 'react-autobind';
// import update from 'immutability-helper';
import FindPlace from '../components/FindPlace';
import SideBar from '../components/SideBar';
import Trend from '../components/Trend';
import { update as updateMap, idle as idleMap } from '../reducers/map';
import { initialized as eventInitialized } from '../reducers/event';
import { set as setDate } from '../reducers/date';
import config from '../config';
import uris from '../uris';

require('../css/rc-slider.css');
const styles = require('../css/home.less');
const fa = require('../css/koiki-ui/fa/less/font-awesome.less');

const TOKEN = config.mapbox.token;

// eslint-disable-next-line
class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      width: 1,
      height: 1,
      dayOfYear: props.dayOfYear,
      dragging: false
    };
    this.idle = true;
    autoBind(this);
  }

  componentWillMount() {
    this.onResize();
  }

  componentDidMount() {
    window.addEventListener('resize', () => this.onResize());
    this.context.fetcher.event.gets();
    //eslint-disable-next-line no-underscore-dangle
    const bounds = this.mapgl._map.getBounds();
    this.context.fetcher.trend.gets({
      //eslint-disable-next-line no-underscore-dangle
      ne: `${bounds._ne.lat},${bounds._ne.lng}`,
      //eslint-disable-next-line no-underscore-dangle
      sw: `${bounds._sw.lat},${bounds._sw.lng}`,
    });
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.idle) {
      if (this.waitId) {
        clearTimeout(this.waitId);
      }
      this.waitId = setTimeout(() => {
        this.props.idleMap(true);
      }, 500);
    }
    if (nextProps.idle && !this.props.idle) {
      //eslint-disable-next-line no-underscore-dangle
      const bounds = this.mapgl._map.getBounds();
      const hashedBounds = hash(bounds);
      if (this.hashedBounds !== hashedBounds) {
        this.hashedBounds = hashedBounds;
        this.context.fetcher.trend.gets({
          //eslint-disable-next-line no-underscore-dangle
          ne: `${bounds._ne.lat},${bounds._ne.lng}`,
          //eslint-disable-next-line no-underscore-dangle
          sw: `${bounds._sw.lat},${bounds._sw.lng}`,
        }).then(() => {
          this.bounds = true;
        });
      }
    }
  }

  onResize() {
    this.setState({
      width: window.innerWidth,
      height: window.innerHeight
    });
  }

  onStartPressDay(delta) {
    if (this.keepPressId) {
      clearInterval(this.keepPressId);
    }
    this.keepPressId = setInterval(() => this.onPressDay(delta), 200);
  }

  onEndPressDay() {
    clearInterval(this.keepPressId);
    this.keepPressId = undefined;
  }

  onStartPressPrevDay() {
    this.onPressDay(-1);
    this.onStartPressDay(-1);
  }

  onStartPressNextDay() {
    this.onPressDay(1);
    this.onStartPressDay(1);
  }

  onPressDay(delta) {
    this.setState({ dayOfYear: this.state.dayOfYear + delta });
  }

  onChangePlace(input) {
    this.context.fetcher.place.gets({
      input
    });
  }
  onSelectPlace(item) {
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
  }

  onChangeViewport(mapViewState) {
    this.props.updateMap({
      ...mapViewState,
      pitch: mapViewState.pitch > 60 ? 60 : mapViewState.pitch
    });
  }

  onLayerClick(info) {
    if (info) {
      this.props.push({
        pathname: stringify(uris.pages.place, {
          id: info.object.id,
          lang: this.context.lang
        }),
        query: {
          day: this.state.dayOfYear
        }
      });
    }
  }

  onChangeSlider(value) {
    this.setState({ dayOfYear: value, dragging: true });
  }

  onAfterChangeSlider(value) {
    this.props.setDate(value);
    this.setState({ dragging: false });
  }

  onSelectTrend(value) {
    this.setState({ dayOfYear: moment(value, 'YYYY-MM-DD').dayOfYear() });
  }

  render() {
    const layers = [
      new ScatterplotLayer({
        id: 'grid',
        data: this.props.events.map((event) => {
          if (Number(event.day) === this.state.dayOfYear) {
            return {
              ...event,
              radius: event.strength,
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
          onChange={this.onChangePlace}
          onSelect={this.onSelectPlace}
        />
        <SideBar
          push={this.props.push}
          lang={this.context.lang}
        />
        <MapGL
          ref={(elem) => { this.mapgl = elem; }}
          width={this.state.width}
          height={this.state.height}
          {...this.props.mapViewState}
          mapboxApiAccessToken={TOKEN}
          perspectiveEnabled
          mapStyle="mapbox://styles/sideroad/ciz10g2k7000p2rq7hd9jp215"
          onChangeViewport={this.onChangeViewport}
        >
          <DeckGL
            debug
            width={this.state.width}
            height={this.state.height}
            {...this.props.mapViewState}
            layers={layers}
            onLayerClick={this.onLayerClick}
            onWebGLInitialized={() => this.props.eventInitialized()}
          />
        </MapGL>
        <div className={styles.date}>
          {moment().dayOfYear(this.state.dayOfYear).format('MMM D')}
        </div>
        {
          !__SERVER__ ?
            <Trend
              items={this.props.trends}
              loading={this.props.trendLoading}
              onSelect={this.onSelectTrend}
              dragging={this.state.dragging}
            />
          :
            ''
        }
        <button
          className={styles.prevDay}
          onMouseDown={this.onStartPressPrevDay}
          onMouseMove={this.onEndPressDay}
          onMouseUp={this.onEndPressDay}
          onTouchStart={this.onStartPressPrevDay}
          onTouchEnd={this.onEndPressDay}
        >
          <i className={`${fa.fa} ${fa['fa-angle-left']}`} />
        </button>
        <Slider
          step={1}
          min={1}
          max={moment().endOf('year').dayOfYear()}
          value={this.state.dayOfYear}
          className={`${styles.slider} ${this.props.trendLoading ? styles.hide : styles.show}`}
          onChange={this.onChangeSlider}
          onAfterChange={this.onAfterChangeSlider}
        />
        <button
          className={styles.nextDay}
          onMouseDown={this.onStartPressNextDay}
          onMouseMove={this.onEndPressDay}
          onMouseUp={this.onEndPressDay}
          onTouchStart={this.onStartPressNextDay}
          onTouchEnd={this.onEndPressDay}
        >
          <i className={`${fa.fa} ${fa['fa-angle-right']}`} />
        </button>
        {this.props.children ? this.props.children : ''}
      </div>
    );
  }
}

Home.propTypes = {
  events: PropTypes.array.isRequired,
  trends: PropTypes.array.isRequired,
  places: PropTypes.array.isRequired,
  place: PropTypes.object.isRequired,
  mapViewState: PropTypes.object,
  dayOfYear: PropTypes.number.isRequired,
  updateMap: PropTypes.func.isRequired,
  idleMap: PropTypes.func.isRequired,
  idle: PropTypes.bool.isRequired,
  setDate: PropTypes.func.isRequired,
  push: PropTypes.func.isRequired,
  children: PropTypes.element,
  eventInitialized: PropTypes.func.isRequired,
  trendLoading: PropTypes.bool.isRequired,
};

Home.defaultProps = {
  mapViewState: {},
};

Home.contextTypes = {
  lang: PropTypes.string.isRequired,
  fetcher: PropTypes.object.isRequired,
  i18n: PropTypes.object.isRequired,
};

const connected = connect(
  state => ({
    events: state.event.items,
    trends: state.trend.items,
    trendLoading: state.trend.loading,
    places: state.place.items,
    place: state.place.item,
    mapViewState: state.map.mapViewState,
    idle: state.map.idle,
    dayOfYear: state.date.dayOfYear,
  }),
  { eventInitialized, updateMap, idleMap, setDate, push }
)(Home);

const asynced = asyncConnect([{
  promise: () => {
    const promises = [];
    return Promise.all(promises);
  }
}])(connected);

export default asynced;
