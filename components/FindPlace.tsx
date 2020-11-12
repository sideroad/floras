import React, { Component, useRef, useState } from 'react';
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
interface Props {
  places: any[];
  onChange: (selected: string) => void;
  onSelect: (item: any) => void;
}

const FindPlace = (props: Props) => {
  const [focused, toggle] = useState(false);
  const ref = useRef(null);
  return (
    <div className={`${styles.chips} ${focused ? styles.focused : ''}`}>
    <Chips
      innerRef={ref}
      styles={ui}
      suggests={props.places}
      onFocus={() => toggle(true)}
      onBlur={() => toggle(false)}
      onChange={evt => props.onChange(evt.target.value)}
      onSelect={(item) => {
        ref.current.blur();
        props.onSelect(item);
      }}
    />
    </div>
  );
}

export default FindPlace;
