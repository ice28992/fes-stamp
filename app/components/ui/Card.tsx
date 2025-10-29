'use client';
import React from 'react';
import styles from './Card.module.css';

type CardProps = {
  cardColor?: string;
  cardTitle?: string;
  cardText?: string;
};

const SmallCard: React.FC<CardProps> = ({ cardColor = '#fff', cardTitle, cardText }) => {
  return (
    <div className={styles.scard} style={{ backgroundColor: cardColor }}>
      <h3 className={styles.title}>{cardTitle}</h3>
      <p className={styles.text}>{cardText}</p>
    </div>
  );
};

const LargeCard: React.FC<CardProps> = ({ cardColor = '#fff', cardTitle, cardText }) => {
  return (
    <div className={styles.lcard} style={{ backgroundColor: cardColor }}>
      <h3 className={styles.title}>{cardTitle}</h3>
      <p className={styles.text}>{cardText}</p>
    </div>
  );
};

export { SmallCard, LargeCard };
