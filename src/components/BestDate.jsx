import React, { PropTypes } from 'react';
import { Calendar } from 'koiki-ui';
import Modal from 'react-modal';
import _ from 'lodash';
import constants from '../constants';

const styles = require('../css/best-date.less');
const ui = {
  // eslint-disable-next-line global-require
  fa: require('../css/koiki-ui/fa/less/font-awesome.less'),
  // eslint-disable-next-line global-require
  calendar: require('../css/koiki-ui/calendar.less'),
};

class BestDate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      opened: false
    };
    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  handleOpen() {
    this.setState({ opened: true });
  }

  handleClose() {
    this.setState({ opened: false });
  }

  render() {
    const max = _.maxBy(this.props.items, this.props.type)[this.props.type];
    return (
      <div
        className={styles.bestDate}
      >
        <img
          alt="type"
          className={styles.bg}
          src={constants[this.props.type].image}
        />
        <p className={styles.lead}>
          Best time to visit
        </p>
        <p className={styles.date}>
          <button
            className={styles.button}
            onClick={() => {
              this.setState({ opened: !this.state.opened });
            }}
          >
            {this.props.item.date}
          </button>
        </p>
        <Modal
          isOpen={this.state.opened}
          contentLabel="BestDate"
          onRequestClose={this.handleClose}
          className={styles.modal}
          overlayClassName={styles.overlay}
        >
          <Calendar
            min={_.first(this.props.items).date}
            max={_.last(this.props.items).date}
            selected={this.props.items.map(item => ({
              date: item.date,
              style: {
                opacity: item[this.props.type] / max
              }
            }))}
            styles={ui}
          />
        </Modal>
      </div>
    );
  }
}

BestDate.propTypes = {
  item: PropTypes.object.isRequired,
  items: PropTypes.array.isRequired,
  type: PropTypes.string.isRequired,
};

export default BestDate;
