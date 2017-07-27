import React, { PropTypes } from 'react';
import { Calendar } from 'koiki-ui';
import Modal from 'react-modal';
import _ from 'lodash';

const styles = require('../css/modal-calendar.less');
const ui = {
  // eslint-disable-next-line global-require
  fa: require('../css/koiki-ui/fa/less/font-awesome.less'),
  // eslint-disable-next-line global-require
  calendar: require('../css/koiki-ui/calendar.less'),
};

const ModalCalendar = (props) => {
  const best = _.maxBy(props.items, 'strength') || {};
  const max = best.strength;

  return (
    <Modal
      isOpen={props.opened}
      contentLabel="BestDate"
      onRequestClose={props.onClose}
      className={styles.modal}
      overlayClassName={styles.overlay}
    >
      <Calendar
        min={(_.first(props.items) || {}).date}
        max={(_.last(props.items) || {}).date}
        date={props.date || best.date}
        selected={props.items.map(item => ({
          date: item.date,
          style: {
            opacity: item.strength ? item.strength / max : 0,
            transform: item.strength ? `scale(${(item.strength / max) * 0.7})` : '',
            backgroundColor: item.type ? `rgb(${props.types[item.type].color.join(',')})` : 'inherit'
          }
        }))}
        onSelect={props.onSelect}
        styles={ui}
      />
    </Modal>
  );
};

ModalCalendar.propTypes = {
  date: PropTypes.string,
  opened: PropTypes.bool.isRequired,
  items: PropTypes.array.isRequired,
  onClose: PropTypes.func.isRequired,
  onSelect: PropTypes.func,
  types: PropTypes.object.isRequired,
};

ModalCalendar.defaultProps = {
  date: '',
  onSelect: () => {},
};

export default ModalCalendar;
