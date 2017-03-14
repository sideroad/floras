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
      <AmCharts.React
        type="serial"
        theme="black"
        categoryField="date"
        categoryAxis={{
          parseDates: true,
          axisThickness: 0,
          gridThickness: 0,
          labelsEnabled: false,
        }}
        autoMarginOffset={0}
        autoMargins={false}
        marginBottom={0}
        marginLeft={0}
        marginRight={0}
        marginTop={0}
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
        colors={
          Object.keys(constants).map(type => `rgb(${constants[type].color.join(',')})`)
        }
        graphs={
          Object.keys(constants).map(type => ({
            id: type,
            fillAlphas: 0.9,
            lineAlpha: 0,
            lineThickness: 2,
            valueField: type
          }))
        }
        dataProvider={
          props.items
            .map(item => ({
              date: moment().dayOfYear(item.day).format('YYYY-MM-DD'),
              ...item
            }))
        }
      />
    </div>
  );
};

Trend.propTypes = {
  items: PropTypes.array.isRequired
};

export default Trend;
