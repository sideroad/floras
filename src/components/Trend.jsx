import React, { PropTypes } from 'react';
import moment from 'moment';
import constants from '../constants';

const styles = require('../css/trend.less');

const Trend = (props) => {
  //eslint-disable-next-line
  const AmCharts = require('amcharts3-react');
  return (
    <div
      className={styles.trend}
    >
      <div className={`${styles.loading} ${props.loading ? styles.show : styles.hide}`} >
        <div className={`${styles.circle} ${styles.one} ${styles.top}`} />
        <div className={`${styles.circle} ${styles.one} ${styles.left}`} />
        <div className={`${styles.circle} ${styles.one} ${styles.bottom}`} />
        <div className={`${styles.circle} ${styles.one} ${styles.right}`} />
        <div className={`${styles.circle} ${styles.two} ${styles.top}`} />
        <div className={`${styles.circle} ${styles.two} ${styles.left}`} />
        <div className={`${styles.circle} ${styles.two} ${styles.bottom}`} />
        <div className={`${styles.circle} ${styles.two} ${styles.right}`} />
        <div className={`${styles.circle} ${styles.three} ${styles.top}`} />
        <div className={`${styles.circle} ${styles.three} ${styles.left}`} />
        <div className={`${styles.circle} ${styles.three} ${styles.bottom}`} />
        <div className={`${styles.circle} ${styles.three} ${styles.right}`} />
        <div className={`${styles.circle} ${styles.four} ${styles.top}`} />
        <div className={`${styles.circle} ${styles.four} ${styles.left}`} />
        <div className={`${styles.circle} ${styles.four} ${styles.bottom}`} />
        <div className={`${styles.circle} ${styles.four} ${styles.right}`} />
        <div className={`${styles.circle} ${styles.five} ${styles.top}`} />
        <div className={`${styles.circle} ${styles.five} ${styles.left}`} />
        <div className={`${styles.circle} ${styles.five} ${styles.bottom}`} />
        <div className={`${styles.circle} ${styles.five} ${styles.right}`} />
      </div>
      <div className={`${styles.charts} ${props.loading ? styles.hide : styles.show}`}>
        <AmCharts.React
          type="serial"
          addClassNames
          theme="black"
          categoryField="date"
          categoryAxis={{
            parseDates: true,
            axisThickness: 0,
            gridThickness: 0,
            labelsEnabled: false,
          }}
          plotAreaFillAlphas={0.35}
          plotAreaFillColors="#fffffc"
          autoMarginOffset={0}
          autoMargins={false}
          marginBottom={0}
          marginLeft={0}
          marginRight={0}
          marginTop={0}
          chartCursor={{
            categoryBalloonDateFormat: 'YYYY-MM-DD',
            valueBalloonsEnabled: false,
            cursorAlpha: props.dragging ? 0 : 1,
            cursorColor: '#fffffc',
            valueLineAlpha: 0.2,
            zoomable: false,
          }}
          valueAxes={[
            {
              id: 'ValueAxis-1',
              labelsEnabled: false,
              gridThickness: 0,
              ignoreAxisWidth: true,
              axisThickness: 0,
            }
          ]}
          dataDateFormat="YYYY-MM-DD"
          graphs={
            Object.keys(constants).map(type => ({
              id: type,
              fillAlphas: 1,
              fillColors: `rgb(${constants[type].light.join(',')})`,
              lineAlpha: 1,
              lineColor: `rgb(${constants[type].color.join(',')})`,
              lineThickness: 5,
              valueField: type,
            }))
          }
          dataProvider={
            props.items
              .map(item => ({
                date: moment().dayOfYear(item.day).format('YYYY-MM-DD'),
                ...item
              }))
          }
          listeners={[{
            event: 'init',
            method: () => {
              document.querySelector('.amcharts-chart-div').addEventListener('click', () => {
                props.onSelect(document.querySelector('.amcharts-balloon-div-categoryAxis').innerText);
              });
            }
          }]}
        />
      </div>
    </div>
  );
};

Trend.propTypes = {
  items: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
  // eslint-disable-next-line
  onSelect: PropTypes.func.isRequired,
  dragging: PropTypes.bool.isRequired,
};

export default Trend;
