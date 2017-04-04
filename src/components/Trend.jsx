import React, { PropTypes } from 'react';
import { AreaChart, Area, ResponsiveContainer, Tooltip } from 'recharts';
import constants from '../constants';

const styles = require('../css/trend.less');

const Trend = props =>
  <div
    className={styles.trend}
  >
    <div className={`${styles.charts} ${props.loading ? styles.hide : styles.show}`}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={props.items}
          margin={{
            top: 0,
            right: 0,
            left: 0,
            bottom: 0
          }}
          onClick={(item) => {
            props.onSelect(item.activeLabel + 1);
          }}
        >
          <Tooltip content={props.tooltip} />
          {
            Object.keys(constants).map(type =>
              <Area
                key={type}
                type="monotone"
                dataKey={type}
                wrapperStyle={{}}
                stroke={`rgb(${constants[type].color.join(',')})`}
                fill={`rgb(${constants[type].light.join(',')})`}
                fillOpacity={1}
                isAnimationActive={false}
              />
            )
          }
        </AreaChart>
      </ResponsiveContainer>
    </div>
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
  </div>;

Trend.propTypes = {
  items: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
  onSelect: PropTypes.func,
  tooltip: PropTypes.func,
};

Trend.defaultProps = {
  tooltip: () => <div />,
  onSelect: () => {},
};

export default Trend;
