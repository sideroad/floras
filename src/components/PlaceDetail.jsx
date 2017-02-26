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
      : ''
    }
  </div>;

PlaceDetail.propTypes = {
  user: PropTypes.object.isRequired,
  onClickLogin: PropTypes.func.isRequired,
};

export default PlaceDetail;
