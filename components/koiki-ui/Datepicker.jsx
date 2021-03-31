import React, { Component, useEffect, useState } from 'react';
import TetherComponent from 'react-tether';
import _ from 'lodash';
import Calendar from './Calendar';
import format from './dates-format';

const Datepicker = (props) => {
  const ref = useRef(null);
  const calendarRef = useRef(null);
  const [opened, setOpened] = useState(false);
  const [selected, setSelected] = useState(props.selected);

  const handleClickOutside = (evt, ref, calendarRef) => {
    if (
      (!ref || !ref.contains(evt.target)) &&
      (!calendarRef || !calendarRef.contains(evt.target))
    ) {
      setOpened(false);
    }
  };
  useEffect(() => {
    const wrappedHandleClickOutside = evt => handleClickOutside(evt, ref, calendarRef);
    document.addEventListener('click', wrappedHandleClickOutside, true);
    return () => document.removeEventListener('click', wrappedHandleClickOutside, true);
  }, []);

  return (
    <div className={props.className}>
      <TetherComponent
        classes={{
          element: props.styles.datepicker.tether,
        }}
        attachment="top left"
        targetAttachment="bottom left"
      >
        <div
          ref={ref}
          className={props.styles.datepicker.container}
        >
          <button
            className={props.styles.datepicker.button}
            onClick={() => {
              setOpened(!opened);
              props.onClick();
            }}
          >
            <i className={`fa ${props.icon}`} aria-hidden="true" />
            <span
              className={
                selected.length
                  ? props.styles.datepicker.date
                  : props.styles.datepicker.placeholder
              }
            >
              {format({
                dates: selected.sort(),
                format: props.format,
                delimiter: props.delimiter,
                range: props.range,
              }) || props.placeholder}
            </span>
          </button>
        </div>
        <Calendar
          styles={props.styles}
          innerRef={calendarRef}
          className={`
            ${props.styles.datepicker.calendar}
            ${
              opened
                ? props.styles.datepicker.opened
                : props.styles.datepicker.closed
            }`}
          selected={selected}
          onSelect={(date) => {
            if (selected.indexOf(date) === -1) {
              setSelected(selected.concat([date]))
            } else {
              setSelected(_.pull(selected, date));
            }
          }}
        />
      </TetherComponent>
    </div>
  );
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
