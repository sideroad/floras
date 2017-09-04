import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import Slider from 'rc-slider';
import moment from 'moment';
import { stringify } from 'koiki';
import { push } from 'react-router-redux';
import { asyncConnect } from 'redux-connect';
import hash from 'object-hash';
import autoBind from 'react-autobind';
// import update from 'immutability-helper';
import FindPlace from '../components/FindPlace';
import HeatMapButton from '../components/HeatMapButton';
import SideBar from '../components/SideBar';
import Trend from '../components/Trend';
import WorldMap from '../components/WorldMap';
import ModalCalendar from '../components/ModalCalendar';
import { update as updateMap, idle as idleMap } from '../reducers/map';
import { initialized as eventInitialized, setDate as setEventDate } from '../reducers/event';
import { set as setDate } from '../reducers/date';
import uris from '../uris';

require('../css/rc-slider.css');
const styles = require('../css/home.less');
const fa = require('../css/koiki-ui/fa/less/font-awesome.less');

// eslint-disable-next-line
class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      width: 1,
      height: 1,
      dayOfYear: props.dayOfYear,
      opened: false,
      graphType: 'point',
    };
    this.idle = true;
    autoBind(this);
  }

  componentWillMount() {
    this.onResize();
  }

  componentDidMount() {
    this.context.fetcher.event.gets();
    window.addEventListener('resize', () => this.onResize());
    const bounds = this.worldMap.mapgl.getMap().getBounds();
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
    if (nextProps.idle && !this.props.idle && this.worldMap) {
      //eslint-disable-next-line no-underscore-dangle
      const bounds = this.worldMap.mapgl.getMap().getBounds();
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
    const dayOfYear = this.state.dayOfYear + delta;
    this.setState({ dayOfYear });
    this.props.setEventDate({ dayOfYear, types: this.props.types });
  }
  onClickFilter() {
    this.setState({
      graphType: this.state.graphType === 'point' ? 'hexagon' : 'point'
    });
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

  onViewportChange(mapViewState) {
    this.props.updateMap({
      ...mapViewState,
      pitch: mapViewState.pitch > 60 ? 60 : mapViewState.pitch
    });
  }

  onLayerClick(info) {
    if (info) {
      this.props.push({
        pathname: stringify(uris.pages.place, {
          place: info.object.place,
          lang: this.context.lang
        }),
        query: {
          type: info.object.type
        }
      });
    }
  }

  onSelectCalendar(date) {
    const dayOfYear = moment(date, 'YYYY-MM-DD').dayOfYear();
    this.setState({
      dayOfYear,
      opened: false,
    });
    this.props.setEventDate({ dayOfYear, types: this.props.types });
  }

  onChangeSlider(dayOfYear) {
    this.setState({ dayOfYear });
    this.props.setEventDate({ dayOfYear, types: this.props.types });
  }

  onAfterChangeSlider(value) {
    this.props.setDate(value);
  }

  onSelectTrend(dayOfYear) {
    this.setState({ dayOfYear });
    this.props.setEventDate({ dayOfYear, types: this.props.types });
  }

  handleOpen() {
    this.setState({ opened: true });
  }

  handleClose() {
    this.setState({ opened: false });
  }

  render() {

    return (
      <div className={styles.container}>
        <FindPlace
          places={this.props.places}
          onChange={this.onChangePlace}
          onSelect={this.onSelectPlace}
        />
        <HeatMapButton
          filtered={this.state.graphType === 'hexagon'}
          onClickFilter={this.onClickFilter}
        />
        <SideBar
          push={this.props.push}
          lang={this.context.lang}
        />
        <WorldMap
          ref={(elem) => { this.worldMap = elem; }}
          mapViewState={this.props.mapViewState}
          width={this.state.width}
          height={this.state.height}
          pixels={this.props.filtered}
          place={this.props.place}
          onViewportChange={this.onViewportChange}
          graphType={this.state.graphType}
          onLayerClick={this.onLayerClick}
          eventInitialized={this.props.eventInitialized}
          onRender={this.onRenderWorldMap}
        />
        <button
          className={styles.date}
          onClick={this.handleOpen}
        >
          {moment().dayOfYear(this.state.dayOfYear).format('MMM D')}
        </button>
        <ModalCalendar
          date={moment().dayOfYear(this.state.dayOfYear).format('YYYY-MM-DD')}
          opened={this.state.opened}
          items={this.props.trends}
          types={this.props.types}
          onClose={this.handleClose}
          onSelect={this.onSelectCalendar}
        />
        <div className={styles.trend}>
          <Trend
            items={this.props.trends}
            loading={this.props.trendLoading}
            onSelect={this.onSelectTrend}
            types={this.props.types}
          />
        </div>
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
  // events: PropTypes.array.isRequired,
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
  types: PropTypes.object.isRequired,
  setEventDate: PropTypes.func.isRequired,
  filtered: PropTypes.array.isRequired,
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
    types: state.type.items,
    filtered: state.event.filtered,
  }),
  { eventInitialized, updateMap, idleMap, setDate, setEventDate, push }
)(Home);

const asynced = asyncConnect([{
  promise: ({ helpers: { fetcher } }) => {
    const promises = [];
    promises.push(
      fetcher.type.gets()
    );
    return Promise.all(promises);
  }
}])(connected);

export default asynced;
