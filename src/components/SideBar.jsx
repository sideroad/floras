import React, { Component, PropTypes } from 'react';
import { stringify } from 'koiki';
import uris from '../uris';
import CloseButton from '../components/CloseButton';

const styles = require('../css/side-bar.less');
const img = require('../images/logo.png');

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
          className={`${styles.logo} ${this.state.opened ? styles.open : styles.close}`}
          onClick={(evt) => {
            evt.preventDefault();
            this.setState({
              opened: true
            });
          }}
        />
        <CloseButton
          className={styles.closeButton}
          opened={this.state.opened}
          onClick={() => {
            this.setState({
              opened: false
            });
          }}
        />
        <div
          className={`${styles.container} ${this.state.opened ? styles.open : styles.close}`}
        >
          <h1 className={styles.title}>
            <img src={img} alt="logo" />
            Flora
          </h1>
          {
            <ul className={styles.list}>
              <li className={styles.item}>
                <a
                  href=""
                  className={styles.link}
                  onClick={
                    (evt) => {
                      evt.preventDefault();
                      this.setState({
                        opened: false
                      });
                      this.props.push(stringify(uris.pages.terms, { lang: this.props.lang }));
                    }
                  }
                >
                  Terms
                </a>
              </li>
            </ul>
          }
        </div>
      </div>
    );
  }
}

SideBar.propTypes = {
  lang: PropTypes.string.isRequired,
  push: PropTypes.func.isRequired,
};

export default SideBar;
