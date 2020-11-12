import React, { Component, useState, useEffect, useRef } from 'react';
import Input from './Input';
import IconButton from './IconButton';

const Chips = (props) => {
  const [query, setQuery] = useState('');
  const [display, setDisplay] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(0);
  const suggestsDOM = useRef(null);

  const handleClickOutside = (evt, input, suggestsDOM) => {
    if (
      !(input && input.current && input.current.contains(evt.target))
      && !(suggestsDOM && suggestsDOM.current && suggestsDOM.current.contains(evt.target))
    ) {
      setDisplay(false);
    }
  };
  useEffect(() => {
    const wrappedHandleClickOutside = evt => handleClickOutside(evt, props.innerRef, suggestsDOM);
    document.addEventListener('click', wrappedHandleClickOutside, true)
    return () => document.removeEventListener('click', wrappedHandleClickOutside, true);;
  }, []);

  const select = (suggest) => {
    props.onSelect(suggest);
    setQuery('');
    setDisplay(false);
    setFocusedIndex(0);
  };

  return (
    <div className={props.className}>
      <Input
        styles={props.styles}
        className={`
          ${props.styles.chips.input}
          ${props.suggests.length ? props.styles.chips.hasSuggest : ''}
        `}
        innerRef={props.innerRef}
        icon={props.icon}
        placeholder={props.placeholder}
        value={query}
        focused={props.focused}
        onSubmit={() => {
          const suggest = props.suggests[focusedIndex];
          if (suggest) {
            select(suggest);
          }
        }}
        onKeyDown={(evt) => {
          switch (evt.key) {
            case 'ArrowDown':
              if (props.suggests.length - 1 > focusedIndex) {
                setFocusedIndex(focusedIndex + 1);
              }
              break;
            case 'ArrowUp':
              if (focusedIndex > 0) {
                setFocusedIndex(focusedIndex - 1);
              }
              break;
            default:
          }
        }}
        onChange={(evt) => {
          setQuery(evt.target.value);
          setDisplay(true);
          props.onChange(evt);
        }}
        onFocus={(evt) => {
          setDisplay(true);
          props.onFocus(evt);
        }}
        onBlur={props.onBlur}
      />
      <div className={props.styles.chips.container}>
        <ul
          ref={suggestsDOM}
          className={props.styles.chips.suggests}
        >
          {display && query
            ? props.suggests.map((suggest, index) => (
              <li key={suggest.id}>
                <a
                  className={`
                      ${props.styles.chips.suggest}
                      ${index === focusedIndex ? props.styles.chips.focused : ''}
                    `}
                  href=""
                  onClick={(evt) => {
                    evt.preventDefault();
                    select(suggest);
                  }}
                >
                  {suggest.image ? (
                    <img
                      className={props.styles.chips.icon}
                      src={suggest.image}
                      alt={suggest.name}
                    />
                  ) : null}
                  <div className={props.styles.chips.text}>{suggest.name}</div>
                </a>
              </li>
            ))
            : ''}
        </ul>
      </div>
      <ul className={props.styles.chips.chips}>
        {props.chips.map(tag => (
          <li key={tag.id}>
            <IconButton
              styles={props.styles}
              item={tag}
              onClick={tag => props.onDelete(tag)}
              type="delete"
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

Chips.defaultProps = {
  className: '',
  icon: 'fa-search',
  onSelect: () => {},
  onDelete: () => {},
  onChange: () => {},
  onFocus: () => {},
  onBlur: () => {},
  suggests: [],
  chips: [],
  focused: false,
  placeholder: '',
  styles: {
    chips: require('./less/chips.less'),
    input: require('./less/input.less'),
    iconButton: require('./less/icon-button.less'),
  },
};

export default Chips;
