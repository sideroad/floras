import React, { Component } from 'react';
import { connect } from 'react-redux';
import Slider from 'rc-slider';
import moment from 'moment';
import { stringify } from '../helpers/url';
import Router from 'next/router';
import { Context } from '../helpers/context';
import hash from 'object-hash';
import autoBind from 'react-autobind';
import ClickNHold from 'react-click-n-hold';
import debounce from 'debounce';

// import update from 'immutability-helper';
import Loading from '../components/Loading';
import FindPlace from '../components/FindPlace';
import HeatMapButton from '../components/HeatMapButton';
import SideBar from '../components/SideBar';
import Trend from '../components/Trend';
import WorldMap from '../components/WorldMap';
import ModalCalendar from '../components/ModalCalendar';
import { update as updateMap, idle as idleMap } from '../reducers/map';
import { initialized as eventInitialized, setDate as setEventDate } from '../reducers/event';
import { start as transactionStart } from '../reducers/transaction';

import uris from '../uris';

const styles = require('../css/home.less');

// eslint-disable-next-line
class Index extends Component {
  static async getInitialProps({ fetcher, req }) {
    try {
      await fetcher.event.types()
    } catch(e) {
      console.log(e);
    };
    return {};
  }
  static contextType = Context;
  constructor(props) {
    super(props);
    this.state = {
      dayOfYear: props.dayOfYear,
      opened: false,
      graphType: 'point',
    };
    this.hasTapEvent = typeof window !== 'undefined' && 'ontouchstart' in window;
    autoBind(this);
    this.fetchTrend = debounce(this.fetchTrend, 500);
  }

  fetchTrend(context, bounds) {
    context.fetcher.trend.gets({
      // eslint-disable-next-line no-underscore-dangle
      ne: `${bounds._ne.lat},${bounds._ne.lng}`,
      // eslint-disable-next-line no-underscore-dangle
      sw: `${bounds._sw.lat},${bounds._sw.lng}`,
    }).catch(e => {
      console.log(e);
    });
  }

  onStartPressDay(delta) {
    if (this.keepPressId) {
      clearInterval(this.keepPressId);
    }
    this.keepPressId = setInterval(() => {
      this.onPressDay(delta);
    }, 300);
  }

  onEndPressDay() {
    if (this.keepPressId) {
      clearInterval(this.keepPressId);
    }
    this.keepPressId = undefined;
  }

  onStartPressPrevDay(e) {
    if (this.hasTapEvent && e.type === 'mousedown') {
      return;
    }
    this.onPressDay(-1);
    this.onStartPressDay(-1);
  }

  onStartPressNextDay(e) {
    if (this.hasTapEvent && e.type === 'mousedown') {
      return;
    }
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
      graphType: this.state.graphType === 'point' ? 'hexagon' : 'point',
    });
  }
  onChangePlace(input) {
    this.context.fetcher.place.gets({
      input,
    });
  }
  onSelectPlace(item) {
    this.context.fetcher.place
      .get({
        placeid: item.id,
      })
      .then(res => {
        const location = res.body.result.geometry.location;
        this.props.updateMap({
          ...this.props.mapViewState,
          latitude: location.lat,
          longitude: location.lng,
          zoom: 13,
        });
        setTimeout(() => {
          this.fetchTrend(this.context, this.map.getBounds());
        }, 500);
      });
  }

  onViewportChange(state) {
    const viewState = state.viewState;
    this.props.updateMap({
      ...viewState,
      pitch: viewState.pitch > 60 ? 60 : viewState.pitch,
    });
    this.fetchTrend(this.context, this.map.getBounds());
  }

  onLayerClick(info) {
    if (info && info.object) {
      this.props.transactionStart();
      Router.push(
        `${uris.pages.place}?type=${info.object.t}`,
        `${stringify(uris.pages.place, {
          place: info.object.p,
          lang: this.context.i18n.lang,
        })}?type=${info.object.t}`
      );
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
        <SideBar push={Router.push} lang={this.context.i18n.lang} />
        <WorldMap
          mapViewState={this.props.mapViewState}
          pixels={this.props.filtered}
          place={this.props.place}
          onViewportChange={this.onViewportChange}
          graphType={this.state.graphType}
          onLayerClick={this.onLayerClick}
          eventInitialized={this.props.eventInitialized}
          mapInitialized={map => {
            this.context.fetcher.event.gets().then((res) => console.log(res));
            const bounds = map.getBounds();
            this.context.fetcher.trend.gets({
              // eslint-disable-next-line no-underscore-dangle
              ne: `${bounds._ne.lat},${bounds._ne.lng}`,
              // eslint-disable-next-line no-underscore-dangle
              sw: `${bounds._sw.lat},${bounds._sw.lng}`,
            }).catch((...args) => console.log(...args));
            this.map = map;
          }}
          onRender={this.onRenderWorldMap}
        />
        <button className={styles.date} onClick={this.handleOpen}>
          {moment()
            .dayOfYear(this.state.dayOfYear)
            .format('MMM D')}
        </button>
        <ModalCalendar
          date={moment()
            .dayOfYear(this.state.dayOfYear)
            .format('YYYY-MM-DD')}
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
        <ClickNHold time={60} onStart={this.onStartPressPrevDay} onEnd={this.onEndPressDay}>
          <button className={styles.prevDay}>
            <i className="fa fa-angle-left" />
          </button>
        </ClickNHold>
        <Slider
          step={1}
          min={1}
          max={moment()
            .endOf('year')
            .dayOfYear()}
          value={this.state.dayOfYear}
          className={`${styles.slider} ${this.props.trendLoading ? styles.hide : styles.show}`}
          onChange={this.onChangeSlider}
        />
        <ClickNHold time={60} onStart={this.onStartPressNextDay} onEnd={this.onEndPressDay}>
          <button className={styles.nextDay}>
            <i className="fa fa-angle-right" />
          </button>
        </ClickNHold>
        {this.props.children ? this.props.children : ''}
        {this.props.loading ? <Loading /> : null}
      </div>
    );
  }
}

const connected = connect(
  state => ({
    events: state.event.items,
    trends: state.trend.items,
    trendLoading: state.trend.loading,
    places: state.place.items,
    place: state.place.item,
    mapViewState: state.map.mapViewState || {},
    idle: state.map.idle,
    dayOfYear: state.event.dayOfYear,
    types: state.event.types,
    filtered: state.event.filtered,
    loading:
      state.place.loading ||
      state.event.loading ||
      state.photo.loading ||
      state.transaction.loading,
  }),
  { eventInitialized, updateMap, idleMap, setEventDate, transactionStart }
)(Index);

export default connected;
