import React from 'react';
import { stringify } from '../helpers/url';
import Link from 'next/link';
import BestDate from '../components/BestDate';
import uris from '../uris';

const styles = require('../css/place-detail.less');

const PlaceDetail = props => (
  <div className={styles.placeDetail}>
    <ul className={styles.list}>
      <li className={styles.best}>
        <BestDate
          item={props.best.item}
          items={props.best.items}
          type={props.type}
          types={props.types}
          name={props.types[props.best.item.type].name}
        />
      </li>
      {props.photos.map(item => (
        <li key={item.id} className={styles.item}>
          <button className={styles.link} onClick={() => props.onClick(item)}>
            <div
              className={styles.photo}
              style={{
                backgroundImage: `url(${item.thumbnail})`,
              }}
            />
          </button>
        </li>
      ))}
    </ul>
  </div>
);

export default PlaceDetail;
