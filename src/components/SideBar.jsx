import React, { Component, PropTypes } from 'react';
import { stringify } from 'koiki';
import { Link } from 'react-router';
import uris from '../uris';

const styles = require('../css/side-bar.less');

class SideBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      opened: false
    };
  }

  render() {
    return (
      <div
        className={styles.sideBar}
      >
        {// eslint-disable-next-line jsx-a11y/no-static-element-interactions
        }<div
          className={`${styles.overlay} ${this.state.opened ? styles.open : styles.close}`}
          onClick={() => {
            this.setState({
              opened: !this.state.opened
            });
          }}
        />
        <button
          className={styles.logo}
          onClick={(evt) => {
            evt.preventDefault();
            this.setState({
              opened: !this.state.opened
            });
          }}
        />
        <div
          className={`${styles.list} ${this.state.opened ? styles.open : styles.close}`}
        >
          <h1 className={styles.title}>Flora</h1>
          <ul>
            <li>
              <Link to={stringify(uris.pages.privacy, { lang: this.props.lang })}>
                Privacy Policy
              </Link>
            </li>
          </ul>
        </div>
      </div>
    );
  }
}

SideBar.propTypes = {
  lang: PropTypes.string.isRequired,
};

export default SideBar;
