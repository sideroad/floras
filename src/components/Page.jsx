import React, { PropTypes } from 'react';

const styles = require('../css/page.less');

const Page = props =>
  <div
    className={styles.page}
  >
    {props.children}
  </div>;

Page.propTypes = {
  children: PropTypes.element.isRequired
};

export default Page;
