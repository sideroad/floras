import React, { PropTypes } from 'react';
import moment from 'moment';
import autoBind from 'react-autobind';
import ModalCalendar from '../components/ModalCalendar';

const styles = require('../css/best-date.less');

class BestDate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      opened: false
    };
    autoBind(this);
  }

  handleOpen() {
    this.setState({ opened: true });
  }

  handleClose() {
    this.setState({ opened: false });
  }

  render() {
    return (
      <div
        className={styles.bestDate}
      >
        <img
          alt="type"
          className={styles.bg}
          src={`/images/${this.props.name}.png`}
        />
        <p className={styles.lead}>
          Best time to visit
        </p>
        <p className={styles.date}>
          <button
            className={styles.button}
            onClick={this.handleOpen}
          >
            {moment(this.props.item.date, 'YYYY-MM-DD').format('MMM D')}
          </button>
        </p>
        <ModalCalendar
          opened={this.state.opened}
          type={this.props.type}
          types={this.props.types}
          items={this.props.items}
          onClose={this.handleClose}
        />
      </div>
    );
  }
}

BestDate.propTypes = {
  item: PropTypes.object.isRequired,
  items: PropTypes.array.isRequired,
  type: PropTypes.string.isRequired,
  types: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,
};

export default BestDate;
