import React from 'react';
import styles from './PromoBox.module.css';

const PromoBox = ({ text, img, rightColumnImg, className, divClassName, rightColumnImgClassName, rightColumnImgClassNameOverride, style, mobile }) => {
  return (
    <div className={`${styles.promoBox} ${className}`}>
      <div className={styles.leftColumn}>
        <div className={styles.textWrapper}>{text}</div>
      </div>
      <div className={`${styles.rightColumn} ${rightColumnImgClassName}`}>
        <img className={`${styles.promoImg} ${rightColumnImgClassNameOverride}`} alt="Promo" src={rightColumnImg} />
      </div>
    </div>
  );
};

export default PromoBox; 