import React from 'react';
import styles from './Cards.module.css';

/**
 * Cards Component
 * A grid of card components
 * @param {Object} props
 * @param {string} props.className - Additional CSS class name
 * @param {Array} props.cards - Array of card data
 * @param {Function} props.onCardClick - Card click handler
 */
const Cards = ({
  className,
  cards = [],
  onCardClick
}) => {
  return (
    <div className={`${styles.cardsGrid} ${className || ''}`}>
      {cards.map((card, index) => (
        <div 
          key={index}
          className={styles.card}
          onClick={() => onCardClick?.(card)}
        >
          {card.icon && (
            <img 
              src={card.icon} 
              alt={card.title} 
              className={styles.cardIcon}
            />
          )}
          <div className={styles.cardContent}>
            <h3 className={styles.cardTitle}>{card.title}</h3>
            {card.description && (
              <p className={styles.cardDescription}>{card.description}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Cards; 