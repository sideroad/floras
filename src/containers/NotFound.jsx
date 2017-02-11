import React from 'react';

const styles = require('../css/notfound.less');

const NotFound = () =>
  <div className={styles.notfound} >
    <article>
      <h1>Doh! 404!</h1>
      <hr />
      <p>These are <em>not</em> the droids you are looking for!</p>
    </article>
  </div>;

export default NotFound;
