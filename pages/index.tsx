import React, { ReactNode, useContext, useState } from 'react';
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
const hasTapEvent = typeof window !== 'undefined' && 'ontouchstart' in window;

const fetchTrend = debounce((fetcher, bounds) => {
  fetcher.trend.gets({
    // eslint-disable-next-line no-underscore-dangle
    ne: `${bounds._ne.lat},${bounds._ne.lng}`,
    // eslint-disable-next-line no-underscore-dangle
    sw: `${bounds._sw.lat},${bounds._sw.lng}`,
  }).catch(e => {
    console.log(e);
  });
}, 500);

let keepPressId;
let map;

interface Props {
  dayOfYear: number;
  places: any[];
  types: any;
  setEventDate: ({dayOfYear, types }: {dayOfYear: number; types: any}) => void;
  mapViewState: any;
  updateMap: (...args: any) => void;
  transactionStart: (...args: any) => void;
  filtered: any[];
  place: any;
  eventInitialized: (...args: any) => void;
  trends: any[];
  trendLoading: boolean;
  children: ReactNode;
  loading: boolean;
}

const Index = (props: Props) => {
    const { fetcher, i18n } = useContext(Context);
    const [state, set] = useState({
      dayOfYear: props.dayOfYear,
      opened: false,
      graphType: 'point'
    });

    const onStartPressDay = (delta) => {
      if (keepPressId) {
        clearInterval(keepPressId);
      }
      keepPressId = setInterval(() => {
        onPressDay(delta);
      }, 300);
    }
  
    const onEndPressDay = () => {
      if (keepPressId) {
        clearInterval(keepPressId);
      }
      keepPressId = undefined;
    }
  
    const onStartPressPrevDay = (e) => {
      if (hasTapEvent && e.type === 'mousedown') {
        return;
      }
      onPressDay(-1);
      onStartPressDay(-1);
    }
  
    const onStartPressNextDay = (e) =>  {
      if (hasTapEvent && e.type === 'mousedown') {
        return;
      }
      onPressDay(1);
      onStartPressDay(1);
    }
  
    const onPressDay = (delta) => {
      const dayOfYear = state.dayOfYear + delta;
      set({ ...state, dayOfYear });
      props.setEventDate({ dayOfYear, types: props.types });
    }
    const onClickFilter = () => {
      set({
        ...state,
        graphType: state.graphType === 'point' ? 'hexagon' : 'point',
      });
    }
    const onChangePlace = (input) => {
      fetcher.place.gets({
        input,
      });
    }
    const onSelectPlace = (item) => {
      fetcher.place
        .get({
          placeid: item.id,
        })
        .then(res => {
          const location = res.body.result.geometry.location;
          props.updateMap({
            ...props.mapViewState,
            latitude: location.lat,
            longitude: location.lng,
            zoom: 13,
          });
          setTimeout(() => {
            fetchTrend(fetcher, map.getBounds());
          }, 500);
        });
    }
  
    const onViewportChange = (state) => {
      const viewState = state.viewState;
      props.updateMap({
        ...viewState,
        pitch: viewState.pitch > 60 ? 60 : viewState.pitch,
      });
      fetchTrend(fetcher, map.getBounds());
    }
  
    const onLayerClick = (info) => {
      if (info && info.object) {
        props.transactionStart();
        Router.push(
          `${stringify(uris.pages.place, {
            place: info.object.p,
            lang: i18n.lang,
          })}?type=${info.object.t}`
        );
      }
    }
  
    const onSelectCalendar = (date) => {
      const dayOfYear = moment(date, 'YYYY-MM-DD').dayOfYear();
      set({
        ...state,
        dayOfYear,
        opened: false,
      });
      props.setEventDate({ dayOfYear, types: props.types });
    }
  
    const onChangeSlider = (dayOfYear) => {
      set({ ...state, dayOfYear });
      props.setEventDate({ dayOfYear, types: props.types });
    }
    const onSelectTrend = (dayOfYear) => {
      set({ ...state, dayOfYear });
      props.setEventDate({ dayOfYear, types: props.types });
    }

    const handleOpen = () => {
      set({ ...state, opened: true });
    }
    const handleClose = () => {
      set({ ...state, opened: false });
    }

    return (
      <div className={styles.container}>
        <FindPlace
          places={props.places}
          onChange={onChangePlace}
          onSelect={onSelectPlace}
        />
        <HeatMapButton
          filtered={state.graphType === 'hexagon'}
          onClickFilter={onClickFilter}
        />
        <SideBar push={Router.push} lang={i18n.lang} />
        <WorldMap
          mapViewState={props.mapViewState}
          pixels={props.filtered}
          place={props.place}
          onViewportChange={onViewportChange}
          graphType={state.graphType}
          onLayerClick={onLayerClick}
          eventInitialized={props.eventInitialized}
          mapInitialized={_map => {
            fetcher.event.gets().then((res) => console.log(res));
            const bounds = _map.getBounds();
            fetcher.trend.gets({
              // eslint-disable-next-line no-underscore-dangle
              ne: `${bounds._ne.lat},${bounds._ne.lng}`,
              // eslint-disable-next-line no-underscore-dangle
              sw: `${bounds._sw.lat},${bounds._sw.lng}`,
            }).catch((...args) => console.log(...args));
            map = _map;
          }}
        />
        <button className={styles.date} onClick={handleOpen}>
          {moment()
            .dayOfYear(state.dayOfYear)
            .format('MMM D')}
        </button>
        <ModalCalendar
          date={moment()
            .dayOfYear(state.dayOfYear)
            .format('YYYY-MM-DD')}
          opened={state.opened}
          items={props.trends}
          types={props.types}
          onClose={handleClose}
          onSelect={onSelectCalendar}
        />
        <div className={styles.trend}>
          <Trend
            items={props.trends}
            loading={props.trendLoading}
            onSelect={onSelectTrend}
            types={props.types}
          />
        </div>
        <ClickNHold time={60} onStart={onStartPressPrevDay} onEnd={onEndPressDay}>
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
          value={state.dayOfYear}
          className={`${styles.slider} ${props.trendLoading ? styles.hide : styles.show}`}
          onChange={onChangeSlider}
        />
        <ClickNHold time={60} onStart={onStartPressNextDay} onEnd={onEndPressDay}>
          <button className={styles.nextDay}>
            <i className="fa fa-angle-right" />
          </button>
        </ClickNHold>
        {props.children ? props.children : ''}
        {props.loading ? <Loading /> : null}
      </div>
    );
}

Index.getInitialProps = async ({ fetcher, req }) => {
  try {
    await fetcher.event.types()
  } catch(e) {
    console.log(e);
  };
  return {};
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
