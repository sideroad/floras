import React, { PropTypes } from 'react';
import CloseButton from '../components/CloseButton';

const styles = require('../css/page.less');

const Page = props =>
  <div
    className={styles.page}
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
  lead: PropTypes.string,
  onClose: PropTypes.func,
  children: PropTypes.element.isRequired
};

Page.defaultProps = {
  lead: '',
  onClose: () => {}
};

export default Page;