import React, { PropTypes } from 'react';
import _ from 'lodash';
import CloseButton from './CloseButton';

const styles = require('../css/photo-viewer.less');

const PhotoViewer = props =>
  <div
    className={styles.photoViewer}
  >
    <div
      className={styles.photo}
      style={{
        backgroundImage: `url(${_.find(props.items, { id: props.id }).image})`,
      }}
    />
    <CloseButton
      className={styles.closeButton}
      icon="fa-times"
      onClick={
        () => props.onClose()
      }
    />
    <CloseButton
      className={styles.prevButton}
      icon="fa-angle-left"
      onClick={
        () => {
          const index = _.findIndex(props.items, { id: props.id });
          props.onPrevNext(props.items[index > 0 ? index - 1 : props.items.length - 1].id);
        }
      }
    />
    <CloseButton
      className={styles.nextButton}
      icon="fa-angle-right"
      onClick={
        () => {
          const index = _.findIndex(props.items, { id: props.id });
          props.onPrevNext(props.items[index < props.items.length - 1 ? index + 1 : 0].id);
        }
      }
    />
  </div>;

PhotoViewer.propTypes = {
  id: PropTypes.number.isRequired,
  items: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  onPrevNext: PropTypes.func.isRequired,
};

export default PhotoViewer;
