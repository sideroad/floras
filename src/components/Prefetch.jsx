import React, { PropTypes } from 'react';

const styles = require('../css/prefetch.less');

const Prefetch = props =>
  <div
    className={styles.prefetch}
  >
    {
      props.items.map(
        item => <img key={item} src={item} alt="prefetch" />
      )
    }
  </div>;

Prefetch.propTypes = {
  items: PropTypes.array.isRequired
};

export default Prefetch;
