import React, { PropTypes } from 'react';
import { Button } from 'koiki-ui';

const styles = require('../css/place-detail.less');
const ui = {
  // eslint-disable-next-line global-require
  fa: require('../css/koiki-ui/fa/less/font-awesome.less'),
  // eslint-disable-next-line global-require
  button: require('../css/koiki-ui/button.less'),
};

const PlaceDetail = props =>
  <div
    className={styles.placeDetail}
  >
    {
      !props.user.token ?
        <div className={styles.button}>
          <Button
            styles={ui}
            icon="fa-sign-in"
            text="Login Instagram to show photos"
            onClick={props.onClickLogin}
          />
        </div>
      :
        <ul className={styles.list}>
          {
            props.items.map(
              item =>
                <li
                  className={styles.item}
                  style={{
                    backgroundImage: `url(${item.images.low_resolution.url})`
                  }}
                />
            )
          }
        </ul>
    }
  </div>;

PlaceDetail.propTypes = {
  user: PropTypes.object.isRequired,
  onClickLogin: PropTypes.func.isRequired,
  items: PropTypes.array.isRequired,
};

export default PlaceDetail;
