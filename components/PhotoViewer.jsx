import React, { useEffect, useState } from 'react';
import _ from 'lodash';
import { useSwipeable } from 'react-swipeable';
import { next, prev } from 'loop-array-calc';
import CloseButton from './CloseButton';
import PrevNextButton from './PrevNextButton';
import Prefetch from './Prefetch';

const DURATION = 150;
const styles = require('../css/photo-viewer.less');

const getNextImage = (items, id, delta = 1) => {
  const index = _.findIndex(items, { id });
  return next(items, index, delta) || {};
};

const getPrevImage = (items, id, delta = 1) => {
  const index = _.findIndex(items, { id });
  return prev(items, index, delta) || {};
};

const PhotoViewer = (props) => {
  const [className, setClassName] = useState('');
  const [swiping, setSwiping] = useState(false);
  const [info, setInfo] = useState(false);

  useEffect(() => {
    setClassName(
      className === 'leftOut'
        ? 'rightIn'
        : className === 'rightOut'
        ? 'leftIn'
        : className || '');
    setSwiping(false);
    setInfo(false);
  }, [JSON.stringify(props)]);

  const prev = () => {
    if (!swiping) {
      setClassName('rightOut');
      setSwiping(true);
      setTimeout(() => {
        props.onPrevNext(getPrevImage(props.items, props.id));
      }, DURATION);
    }
  }

  const next = () => {
    if (!swiping) {

      setClassName('leftOut');
      setSwiping(true);
      setTimeout(() => {
        props.onPrevNext(getNextImage(props.items, props.id));
      }, DURATION);
    }
  }
  const item = _.find(props.items, { id: props.id }) || { license: {} };

  const handlers = useSwipeable({
    key: props.id,
    onClick: () => setInfo(false),
    onSwipedLeft: next,
    onSwipedRight: prev,
    onSwipedDown: () => props.onClose()
  });

  return (
    <div className={`${styles.photoViewer} ${props.isOpen ? styles.open : styles.close}`}>
      <div
        {...handlers} 
        className={`${styles.photo} ${styles.animate} ${styles[className]}`}
        style={{
          backgroundImage: item.image ? `url(${item.image})` : 'none',
          animationDuration: `${DURATION / 1000}s`,
        }}
      />
      <CloseButton className={styles.closeButton} onClick={() => props.onClose()} />
      <PrevNextButton
        className={styles.prevButton}
        icon="fa-angle-left"
        onClick={prev}
      />
      <PrevNextButton
        className={styles.nextButton}
        icon="fa-angle-right"
        onClick={next}
      />
      <Prefetch
        items={[
          getPrevImage(props.items, props.id, 1).image,
          getNextImage(props.items, props.id, 1).image,
          getPrevImage(props.items, props.id, 2).image,
          getNextImage(props.items, props.id, 2).image,
          getPrevImage(props.items, props.id, 3).image,
          getNextImage(props.items, props.id, 3).image,
          getPrevImage(props.items, props.id, 4).image,
          getNextImage(props.items, props.id, 4).image,
          getPrevImage(props.items, props.id, 5).image,
          getNextImage(props.items, props.id, 5).image,
        ]}
      />
      <button
        className={`${styles.infotip} needsclick`}
        onClick={() => setInfo(true)}
      >
        <i className="fa fa-info-circle" />
      </button>
      <div className={`${styles.info} ${info ? styles.display : ''}`}>
        <p>
          <a className={styles.link} href={item.url} target="_blank" rel="noopener noreferrer">
            <span>
              {item.title} by {item.owner}
            </span>
          </a>
        </p>
        <p className={styles.license}>
          {item.license.url ? (
            <a
              className={styles.link}
              href={item.license.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              {item.license.name}
            </a>
          ) : (
            <span>{item.license.name}</span>
          )}
        </p>
      </div>
    </div>
  );
}

PhotoViewer.defaultProps = {
  id: '',
};

export default PhotoViewer;
