import React, { PropTypes } from 'react';
import _ from 'lodash';

const styles = require('../css/prefetch.less');

const Prefetch = props =>
  <div
    className={styles.prefetch}
  >
    {
      _.uniq(props.items)
       .filter(item => item)
       .map(
         item => <img key={item} src={item} alt="prefetch" />
       )
    }
  </div>;

Prefetch.propTypes = {
  items: PropTypes.array.isRequired
};

export default Prefetch;
