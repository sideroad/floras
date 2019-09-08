import React, { Component } from 'react';
import { Chips } from './koiki-ui';

const styles = require('../css/find-place.less');
const ui = {
  // eslint-disable-next-line global-require
  chips: require('../css/koiki-ui/chips.less'),
  // eslint-disable-next-line global-require
  input: require('../css/koiki-ui/input.less'),
  // eslint-disable-next-line global-require
  iconButton: require('../css/koiki-ui/icon-button.less'),
};

class FindPlace extends Component {
  constructor(props) {
    super(props);
    this.state = {
      focused: false,
    };
  }

  render() {
    return (
      <div className={`${styles.chips} ${this.state.focused ? styles.focused : ''}`}>
        <Chips
          ref={(elem) => {
            this.chips = elem;
          }}
          styles={ui}
          suggests={this.props.places}
          onFocus={() => this.setState({ focused: true })}
          onBlur={() => this.setState({ focused: false })}
          onChange={evt => this.props.onChange(evt.target.value)}
          onSelect={(item) => {
            this.chips.input.inputDOM.blur();
            this.props.onSelect(item);
          }}
        />
      </div>
    );
  }
}

export default FindPlace;
