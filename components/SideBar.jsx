import React, { Component } from 'react';
import { stringify } from '../helpers/url';
import uris from '../uris';
import PrevNextButton from '../components/PrevNextButton';

const styles = require('../css/side-bar.less');

class SideBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      opened: false,
    };
  }

  render() {
    return (
      <div className={styles.sideBar}>
        {
          // eslint-disable-next-line jsx-a11y/no-static-element-interactions
        }
        <div
          className={`${styles.overlay} ${this.state.opened ? styles.open : styles.close}`}
          onClick={() => {
            this.setState({
              opened: !this.state.opened,
            });
          }}
        />
        <button
          className={`${styles.logo} ${this.state.opened ? styles.open : styles.close}`}
          onClick={(evt) => {
            evt.preventDefault();
            this.setState({
              opened: true,
            });
          }}
        />
        <PrevNextButton
          className={styles.closeButton}
          opened={this.state.opened}
          onClick={() => {
            this.setState({
              opened: false,
            });
          }}
        />
        <div className={`${styles.container} ${this.state.opened ? styles.open : styles.close}`}>
          <h1 className={styles.title}>
            <img src="/static/images/logo.png" alt="logo" />
            Flora
          </h1>
          {
            <ul className={styles.list}>
              <li className={styles.item}>
                <a
                  href=""
                  className={styles.link}
                  onClick={(evt) => {
                    evt.preventDefault();
                    this.setState({
                      opened: false,
                    });
                    this.props.push(stringify(uris.pages.terms, { lang: this.props.lang }));
                  }}
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

export default SideBar;
