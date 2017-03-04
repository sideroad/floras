import React, { PropTypes, Component } from 'react';
import _ from 'lodash';
import Swipeable from 'react-swipeable';
import { next, prev } from 'loop-array-calc';
import CloseButton from './CloseButton';
import Prefetch from './Prefetch';

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
      swiping: false
    };
  }

  componentWillReceiveProps() {
    this.setState({
      className: this.state.className === 'leftOut' ? 'rightIn' :
                 this.state.className === 'rightOut' ? 'leftIn' :
                 this.state.className || '',
      swiping: false
    });
  }

  prev() {
    if (!this.state.swiping) {
      this.setState({
        className: 'leftOut',
        swiping: true,
      });
      setTimeout(() => {
        this.props.onPrevNext(getPrevImage(this.props.items, this.props.id));
        // this.setState({
        //   swiping: false
        // });
      }, 150);
    }
  }

  next() {
    if (!this.state.swiping) {
      this.setState({
        className: 'rightOut',
        swiping: true,
      });
      setTimeout(() => {
        this.props.onPrevNext(getNextImage(this.props.items, this.props.id));
        // this.setState({
        //   swiping: false
        // });
      }, 150);
    }
  }

  render() {
    return (
      <div
        className={`${styles.photoViewer} ${this.props.isOpen ? styles.open : styles.close}`}
      >
        <Swipeable
          key={this.props.id}
          onSwipedLeft={
            () => {
              this.prev();
            }
          }
          onSwipedRight={
            () => {
              this.next();
            }
          }
          onSwipedUp={
            () => this.props.onClose()
          }
          onSwipedDown={
            () => this.props.onClose()
          }
          className={`${styles.photo} ${styles[this.state.className]}`}
          style={{
            backgroundImage: `url(${(_.find(this.props.items, { id: this.props.id }) || {}).image})`,
          }}
        />
        <CloseButton
          className={styles.closeButton}
          icon="fa-times"
          onClick={
            () => this.props.onClose()
          }
        />
        <CloseButton
          className={styles.prevButton}
          icon="fa-angle-left"
          onClick={
            () => {
              this.prev();
            }
          }
        />
        <CloseButton
          className={styles.nextButton}
          icon="fa-angle-right"
          onClick={
            () => {
              this.next();
            }
          }
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
      </div>
    );
  }
}

PhotoViewer.propTypes = {
  id: PropTypes.string,
  isOpen: PropTypes.bool.isRequired,
  items: PropTypes.array.isRequired,
  onClose: PropTypes.func.isRequired,
  onPrevNext: PropTypes.func.isRequired,
};

PhotoViewer.defaultProps = {
  id: '',
};

export default PhotoViewer;
