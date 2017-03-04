import React, { PropTypes } from 'react';
import _ from 'lodash';
import Swipeable from 'react-swipeable';
import CloseButton from './CloseButton';

const styles = require('../css/photo-viewer.less');

const getNextImage = (items, id) => {
  const index = _.findIndex(items, { id });
  return items[index < items.length - 1 ? index + 1 : 0];
};

const getPrevImage = (items, id) => {
  const index = _.findIndex(items, { id });
  return items[index > 0 ? index - 1 : items.length - 1];
};

const PhotoViewer = props =>
  <div
    className={styles.photoViewer}
  >
    <Swipeable
      key={props.id}
      onSwipedLeft={
        () => props.onPrevNext(getPrevImage(props.items, props.id))
      }
      onSwipedRight={
        () => props.onPrevNext(getNextImage(props.items, props.id))
      }
      onSwipedUp={
        () => props.onClose()
      }
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
        () => props.onPrevNext(getPrevImage(props.items, props.id))
      }
    />
    <CloseButton
      className={styles.nextButton}
      icon="fa-angle-right"
      onClick={
        () => props.onPrevNext(getNextImage(props.items, props.id))
      }
    />
    <img
      className={styles.prefecth}
      src={getPrevImage(props.items, props.id).image}
      alt="prefecth"
    />
    <img
      className={styles.prefecth}
      src={getNextImage(props.items, props.id).image}
      alt="prefecth"
    />
  </div>;

PhotoViewer.propTypes = {
  id: PropTypes.number.isRequired,
  items: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  onPrevNext: PropTypes.func.isRequired,
};

export default PhotoViewer;
