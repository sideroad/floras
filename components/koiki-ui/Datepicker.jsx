import React, { Component } from 'react';
import TetherComponent from 'react-tether';
import _ from 'lodash';
import Calendar from './Calendar';
import format from './dates-format';

// eslint-disable-next-line react/prefer-stateless-function
class Datepicker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      opened: false,
      selected: props.selected,
    };
  }
  componentDidMount() {
    this.wrappedHandleClickOutside = evt =>
      this.handleClickOutside(evt, this.containerDOM, this.calendar);
    document.addEventListener('click', this.wrappedHandleClickOutside, true);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.wrappedHandleClickOutside, true);
  }

  handleClickOutside(evt, containerDOM, calendar) {
    if (
      (!containerDOM || !containerDOM.contains(evt.target)) &&
      (!calendar || !calendar.calendarDOM || !calendar.calendarDOM.contains(evt.target))
    ) {
      this.setState({
        opened: false,
      });
    }
  }

  render() {
    return (
      <div className={this.props.className}>
        <TetherComponent
          classes={{
            element: this.props.styles.datepicker.tether,
          }}
          attachment="top left"
          targetAttachment="bottom left"
        >
          <div
            ref={(elem) => {
              this.containerDOM = elem;
            }}
            className={this.props.styles.datepicker.container}
          >
            <button
              className={this.props.styles.datepicker.button}
              onClick={() => {
                this.setState({
                  opened: !this.state.opened,
                });
                this.props.onClick();
              }}
            >
              <i className={`fa ${this.props.icon}`} aria-hidden="true" />
              <span
                className={
                  this.state.selected.length
                    ? this.props.styles.datepicker.date
                    : this.props.styles.datepicker.placeholder
                }
              >
                {format({
                  dates: this.state.selected.sort(),
                  format: this.props.format,
                  delimiter: this.props.delimiter,
                  range: this.props.range,
                }) || this.props.placeholder}
              </span>
            </button>
          </div>
          <Calendar
            styles={this.props.styles}
            ref={(elem) => {
              this.calendar = elem;
            }}
            className={`
              ${this.props.styles.datepicker.calendar}
              ${
                this.state.opened
                  ? this.props.styles.datepicker.opened
                  : this.props.styles.datepicker.closed
              }`}
            selected={this.state.selected}
            onSelect={(date) => {
              if (this.state.selected.indexOf(date) === -1) {
                this.setState({
                  selected: this.state.selected.concat([date]),
                });
              } else {
                this.setState({
                  selected: _.pull(this.state.selected, date),
                });
              }
            }}
          />
        </TetherComponent>
      </div>
    );
  }
}

Datepicker.defaultProps = {
  className: '',
  date: '',
  format: 'MMM D',
  delimiter: ', ',
  range: ' - ',
  selected: [],
  placeholder: '',
  styles: {
    datepicker: require('./less/datepicker.less'),
    calendar: require('./less/calendar.less'),
  },
  icon: 'fa-calendar',
  onClick: () => {},
};

export default Datepicker;
