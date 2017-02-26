import React, { PropTypes } from 'react';
import CloseButton from '../components/CloseButton';

const styles = require('../css/page.less');

const Page = props =>
  <div
    className={`${styles.page} ${props.className}`}
  >
    <CloseButton
      icon="fa-angle-left"
      className={styles.closeButton}
      onClick={props.onClose}
    />
    <h1 className={styles.lead}>
      {props.lead}
    </h1>
    <div>
      {props.children}
    </div>
  </div>;

Page.propTypes = {
  className: PropTypes.string,
  lead: PropTypes.string,
  onClose: PropTypes.func,
  children: PropTypes.element.isRequired
};

Page.propTypes = {
  className: '',
  lead: '',
  onClose: () => {}
};

export default Page;
