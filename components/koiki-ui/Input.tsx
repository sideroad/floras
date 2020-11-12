import React, { Component, useState, useEffect, useRef } from 'react';

const Input = (props) => {
  const [clicked, setClicked] = useState(false);
  const [escaped, setEscaped] = useState(false);
  const [value, setValue] = useState(props.value);

  useEffect(() => {
    setValue(props.value !== undefined ? props.value : value);
  }, [props.value]);

  const progress = `progress-${props.progress}-with-middle`;
    return (
      <form
        className={`${props.styles.input.container}
                    ${
                      clicked
                        ? props.styles.input.clicked
                        : escaped
                          ? props.styles.input.escaped
                          : ''
                    }
                    ${props.className}
                    ${props.styles.input[progress]}
        `}
        onSubmit={(evt) => {
          evt.preventDefault();
          props.onSubmit({
            target: {
              value: props.innerRef.current.value,
            },
          });
        }}
      >
        <input
          ref={props.innerRef}
          className={`${props.styles.input.input} ${
            props.styles.input[props.align]
          }`}
          placeholder={props.placeholder}
          aria-label={props.placeholder}
          value={value}
          type={props.type}
          pattern={props.type === 'number' ? '\\d*' : undefined}
          autoFocus={props.focused}
          onChange={(evt) => {
            setValue(evt.target.value);
            props.onChange(evt);
          }}
          onKeyDown={(evt) => {
            switch (evt.key) {
              case 'Escape':
                blur();
                break;
              default:
            }
            props.onKeyDown(evt);
          }}
          onBlur={evt => props.onBlur(evt)}
          onFocus={evt => props.onFocus(evt)}
        />
        <i
          className={`fa
            ${props.icon}
            ${props.styles.input.prefix}
          `}
          onClick={() => {
            props.innerRef.current.focus();
          }}
          aria-hidden="true"
        />
      </form>
    );
}

Input.defaultProps = {
  className: '',
  styles: {
    input: require('./less/input.less'),
  },
  placeholder: '',
  value: '',
  focused: false,
  icon: 'fa-search',
  progress: 'none',
  type: 'text',
  align: 'left',
  onBlur: () => {},
  onChange: () => {},
  onFocus: () => {},
  onKeyDown: () => {},
  onSubmit: () => {},
};

export default Input;
