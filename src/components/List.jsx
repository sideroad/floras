import React, { PropTypes } from 'react';

const styles = require('../css/list.less');

const List = props =>
  <ul className={styles.spots} >
    {
      props.items.map(item =>
        <li key={item.name}>{item.name}: {item.age}</li>
      )
    }
  </ul>;

List.propTypes = {
  items: PropTypes.array.isRequired,
};

export default List;
