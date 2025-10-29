'use client';
import React from 'react';
import styles from './Card.module.css';

type CardProps = {
  cardColor?: string;
  cardTitle?: string;
  cardText?: string;
};

const Card: React.FC<CardProps> = ({ cardColor='#fff', cardTitle, cardText }) => {
  return (
    <div className={styles.card} style={{ backgroundColor: cardColor }}>
      <h3 className={styles.title}>{cardTitle}</h3>
      <p className={styles.cardText}>{cardText}</p>
    </div>
  );
};

export default Card;
