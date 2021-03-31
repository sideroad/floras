import React, { Component, useRef, useState } from 'react';
import moment from 'moment';
import __ from 'lodash';
import { useSwipeable } from 'react-swipeable';

// eslint-disable-next-line react/prefer-stateless-function
const Calendar = (props) => {
  const [date, setDate] = useState(moment.utc(props.date, 'YYYY-MM-DD'));
  const [className, setClassName] = useState('');
  const [swiping, setSwiping] = useState(false);
  const start = moment
    .utc(date)
    .startOf('month')
    .startOf('week');
  const end = moment
    .utc(date)
    .endOf('month')
    .endOf('week');
  const linesOfWeek = (end.diff(start, 'days') + 1) / 7;
  const isEnablePrevMonth = !props.min ? true : start.isSameOrAfter(props.min);
  const isEnableNextMonth = !props.max ? true : end.isSameOrBefore(props.max);

  const nextMonth = (swiping) => {
    setDate(moment.utc(date).add(1, 'months'));
    setClassName('nextMonth');
    setSwiping(swiping);
    setTimeout(() => {
      setClassName('');
      setSwiping(false);
    }, 300);
  }

  const prevMonth = (swiping) => {
    setDate(moment.utc(date).subtract(1, 'months'));
    setClassName('prevMonth');
    setSwiping(swiping);
    setTimeout(() => {
      setClassName('');
      setSwiping(false);
    }, 300);
  }

  const swiped = () => {
    setSwiping(false);
  }

  const swipingNext = () => {
    if (!swiping) {
      nextMonth(true);
    }
  }

  const swipingPrev = () => {
    if (!swiping) {
      prevMonth(true);
    }
  }

  const select = (evt, _date) => {
    evt.preventDefault();
    evt.target.blur();
    if (_date.isAfter(date, 'month')) {
      nextMonth(evt);
    }
    if (_date.isBefore(date, 'month')) {
      prevMonth(evt);
    }
    props.onSelect(_date.format('YYYY-MM-DD'));
  }

  const handlers = useSwipeable({
    onSwipingRight: swipingPrev,
    onSwipedRight: swiped,
    onSwipingLeft: swipingNext,
    onSwipedLeft: swiped
  });

  return (
    <div
      {...handlers}
      className={`${props.styles.calendar.calendar} ${props.className}`}
      ref={props.innerRef}
    >
      <div className={`${props.styles.calendar.control}`}>
        <div className={props.styles.calendar.prev}>
          {isEnablePrevMonth ? (
            <a
              className={props.styles.calendar.link}
              onClick={(evt) => {
                evt.preventDefault();
                prevMonth();
              }}
              href=""
            >
              <div className={props.styles.calendar.linkcircle} />
              <span>
                <i className="fa fa-chevron-left" aria-hidden="true" />
              </span>
            </a>
          ) : null}
        </div>
        <div
          className={`${props.styles.calendar.month} ${
            props.styles.calendar[className]
          }`}
        >
          {`${date.format('MMMM')} ${date.format('YYYY')}`}
        </div>
        <div className={props.styles.calendar.next}>
          {isEnableNextMonth ? (
            <a
              className={props.styles.calendar.link}
              onClick={(evt) => {
                evt.preventDefault();
                nextMonth();
              }}
              href=""
            >
              <div className={props.styles.calendar.linkcircle} />
              <span>
                <i className="fa fa-chevron-right" aria-hidden="true" />
              </span>
            </a>
          ) : null}
        </div>
      </div>
      <table
        className={`${props.styles.calendar.table} ${
          props.styles.calendar[className]
        }`}
      >
        <thead>
          <tr>
            {__.times(7, index => (
              <th key={index} className={props.styles.calendar.weekday}>
                {moment()
                  .weekday(index)
                  .format('ddd')}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {__.times(linesOfWeek, week => (
            <tr key={week}>
              {__.times(7, (weekday) => {
                const dateOfWeekday = moment.utc(start).add(week * 7 + weekday, 'days');
                const timeOfWeekday = dateOfWeekday.toDate().getTime();
                const dateClassName = [
                  __.some(props.selected, item =>
                    dateOfWeekday.isSame(
                      moment.utc(__.isString(item) ? item : item.date).startOf('date')
                    )
                  )
                    ? props.styles.calendar.selected
                    : '',
                  dateOfWeekday.isSame(
                    moment.utc(props.today, 'YYYY-MM-DD').startOf('date')
                  )
                    ? props.styles.calendar.today
                    : __.some(props.holidays, item =>
                        dateOfWeekday.isSame(moment.utc(item).startOf('date'))
                      )
                    ? props.styles.calendar.holiday
                    : !dateOfWeekday.isSame(date, 'month')
                    ? props.styles.calendar.outside
                    : '',
                  props.styles.calendar[dateOfWeekday.format('ddd').toLowerCase()],
                ].join(' ');
                const selected =
                  __.find(
                    props.selected,
                    item =>
                      !__.isString(item) &&
                      dateOfWeekday.isSame(moment.utc(item.date).startOf('date'))
                  ) || {};
                return (
                  <td key={timeOfWeekday} className={props.styles.calendar.col}>
                    <div className={dateClassName}>
                      <div className={props.styles.calendar.date}>
                        {(props.min &&
                          moment
                            .utc(props.min, 'YYYY-MM-DD')
                            .toDate()
                            .getTime() > timeOfWeekday) ||
                        (props.max &&
                          moment
                            .utc(props.max, 'YYYY-MM-DD')
                            .toDate()
                            .getTime() < timeOfWeekday) ? (
                              <div className={props.styles.calendar.disabled}>
                                <span>{dateOfWeekday.date()}</span>
                              </div>
                        ) : (
                          <a
                            className={props.styles.calendar.link}
                            href=""
                            onClick={evt => select(evt, dateOfWeekday)}
                          >
                            <div
                              className={props.styles.calendar.linkcircle}
                              style={selected.style || {}}
                            />
                            <span>{dateOfWeekday.date()}</span>
                          </a>
                        )}
                      </div>
                    </div>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

Calendar.defaultProps = {
  className: '',
  date: moment
    .utc()
    .startOf('date')
    .format('YYYY-MM-DD'),
  today: moment.utc().format('YYYY-MM-DD'),
  min: undefined,
  max: undefined,
  holidays: [],
  selected: [],
  onSelect: () => {},
  styles: {
    calendar: require('./less/calendar.less'),
  },
};

export default Calendar;
