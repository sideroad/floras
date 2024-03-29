import React, { Component } from 'react';

// eslint-disable-next-line react/prefer-stateless-function
class InputtableButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      clicked: false,
      escaped: false,
      focused: props.focused,
    };
    this.onClick = this.onClick.bind(this);
  }

  componentWillReceiveProps(props) {
    this.setState({
      value: props.value || this.state.value,
    });
  }

  onClick(evt) {
    this.setState({
      clicked: true,
      escaped: false,
    });
    this.setState({
      focused: true,
    });
    this.inputDOM.focus();
    this.props.onClick(evt);
  }

  render() {
    const blur = (evt) => {
      this.props.onBlur(evt);
    };
    const buttonProgress = `progress-${this.props.progress}`;
    const inputProgress = `progress-${this.props.progress}-with-middle`;
    return (
      <div
        className={`${this.props.styles.inputtableButton.container}
                    ${
                      this.state.clicked
                        ? this.props.styles.inputtableButton.clicked
                        : this.state.escaped
                          ? this.props.styles.inputtableButton.escaped
                          : this.state.focused
                            ? this.props.styles.inputtableButton.focused
                            : ''
                    }
                    ${this.props.className}
                    ${
                      this.state.focused
                        ? this.props.styles.inputtableButton[inputProgress]
                        : this.props.styles.inputtableButton[buttonProgress]
                    }
        `}
      >
        <button
          className={this.props.styles.inputtableButton.button}
          onClick={this.onClick}
          onTouchStart={this.onClick}
        >
          <i className={`fa ${this.props.icon}`} aria-hidden="true" />
          {this.props.text}
        </button>
        <input
          ref={(elem) => {
            this.inputDOM = elem;
          }}
          type="text"
          className={this.props.styles.inputtableButton.input}
          placeholder={this.props.placeholder}
          autoFocus={this.props.focused}
          onKeyDown={(evt) => {
            switch (evt.key) {
              case 'Escape':
                blur(evt);
                break;
              case 'Enter':
                this.props.onSubmit(evt);
                break;
              default:
            }
          }}
          aria-label={this.props.placeholder}
          onChange={evt => this.props.onChange(evt)}
          onBlur={evt => blur(evt)}
        />
        <i
          className={`fa
            ${this.props.icon}
            ${this.props.styles.inputtableButton.prefix}
          `}
          aria-hidden="true"
        />
      </div>
    );
  }
}

InputtableButton.defaultProps = {
  className: '',
  icon: 'fa-search',
  placeholder: '',
  onClick: () => {},
  onChange: () => {},
  onBlur: () => {},
  onSubmit: () => {},
  progress: 'none',
  focused: false,
  styles: {
    inputtableButton: require('./less/inputtable-button.less'),
  },
};

export default InputtableButton;
