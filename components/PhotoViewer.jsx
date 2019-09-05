import React, { Component } from 'react';
import _ from 'lodash';
import { Swipeable } from 'react-swipeable';
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

// eslint-disable-next-line
class PhotoViewer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      className: '',
      swiping: false,
      info: false,
    };
  }

  componentWillReceiveProps() {
    this.setState({
      className:
        this.state.className === 'leftOut'
          ? 'rightIn'
          : this.state.className === 'rightOut'
          ? 'leftIn'
          : this.state.className || '',
      swiping: false,
      info: false,
    });
  }

  prev() {
    if (!this.state.swiping) {
      this.setState({
        className: 'rightOut',
        swiping: true,
      });
      setTimeout(() => {
        this.props.onPrevNext(getPrevImage(this.props.items, this.props.id));
      }, DURATION);
    }
  }

  next() {
    if (!this.state.swiping) {
      this.setState({
        className: 'leftOut',
        swiping: true,
      });
      setTimeout(() => {
        this.props.onPrevNext(getNextImage(this.props.items, this.props.id));
      }, DURATION);
    }
  }

  render() {
    const item = _.find(this.props.items, { id: this.props.id }) || { license: {} };
    return (
      <div className={`${styles.photoViewer} ${this.props.isOpen ? styles.open : styles.close}`}>
        <Swipeable
          key={this.props.id}
          onClick={() => this.setState({ info: false })}
          onSwipedLeft={() => {
            this.next();
          }}
          onSwipedRight={() => {
            this.prev();
          }}
          onSwipedDown={() => this.props.onClose()}
          className={`${styles.photo} ${styles.animate} ${styles[this.state.className]}`}
          style={{
            backgroundImage: item.image ? `url(${item.image})` : 'none',
            animationDuration: `${DURATION / 1000}s`,
          }}
        />
        <CloseButton className={styles.closeButton} onClick={() => this.props.onClose()} />
        <PrevNextButton
          className={styles.prevButton}
          icon="fa-angle-left"
          onClick={() => {
            this.prev();
          }}
        />
        <PrevNextButton
          className={styles.nextButton}
          icon="fa-angle-right"
          onClick={() => {
            this.next();
          }}
        />
        <Prefetch
          items={[
            getPrevImage(this.props.items, this.props.id, 1).image,
            getNextImage(this.props.items, this.props.id, 1).image,
            getPrevImage(this.props.items, this.props.id, 2).image,
            getNextImage(this.props.items, this.props.id, 2).image,
            getPrevImage(this.props.items, this.props.id, 3).image,
            getNextImage(this.props.items, this.props.id, 3).image,
            getPrevImage(this.props.items, this.props.id, 4).image,
            getNextImage(this.props.items, this.props.id, 4).image,
            getPrevImage(this.props.items, this.props.id, 5).image,
            getNextImage(this.props.items, this.props.id, 5).image,
          ]}
        />
        <button
          className={`${styles.infotip} needsclick`}
          onClick={() => this.setState({ info: true })}
        >
          <i className="fa fa-info-circle" />
        </button>
        <div className={`${styles.info} ${this.state.info ? styles.display : ''}`}>
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
}

PhotoViewer.defaultProps = {
  id: '',
};

export default PhotoViewer;
