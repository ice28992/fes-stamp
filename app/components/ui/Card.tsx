'use client';
import React from 'react';
import styles from './Card.module.css';

type CardProps = {
  cardColor?: string;
  cardTitle?: string;
  cardText?: string;
  children?: React.ReactNode;
};

const SmallCard: React.FC<CardProps> = ({ cardColor = '#fff', cardTitle, cardText, children }) => {
  return (
    <div className={styles.scard} style={{ backgroundColor: cardColor }}>
      <h3 className={styles.title}>{cardTitle}</h3>
      <p className={styles.text}>{cardText}</p>
      {children && <div className={styles.children}>{children}</div>}
    </div>
  );
};

const LargeCard: React.FC<CardProps> = ({ cardColor = '#fff', cardTitle, cardText, children }) => {
  return (
    <div className={styles.lcard} style={{ backgroundColor: cardColor }}>
      <h3 className={styles.title}>{cardTitle}</h3>
      <p className={styles.text}>{cardText}</p>
      {children && <div className={styles.children}>{children}</div>}
    </div>
  );
};

export { SmallCard, LargeCard };
