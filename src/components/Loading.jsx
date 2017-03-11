import React from 'react';

const styles = require('../css/loading.less');

const Loading = () =>
  <div className={styles.container}>
    <div className={styles.loading}>
      <div className={`${styles.circle} ${styles.top}`} />
      <div className={`${styles.circle} ${styles.left}`} />
      <div className={`${styles.circle} ${styles.bottom}`} />
      <div className={`${styles.circle} ${styles.right}`} />
      <div className={`${styles.circle} ${styles.scale} ${styles.top}`} />
      <div className={`${styles.circle} ${styles.scale} ${styles.left}`} />
      <div className={`${styles.circle} ${styles.scale} ${styles.bottom}`} />
      <div className={`${styles.circle} ${styles.scale} ${styles.right}`} />
      <div className={styles.icon} />
    </div>
  </div>;

export default Loading;
