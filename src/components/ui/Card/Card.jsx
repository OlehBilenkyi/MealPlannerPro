import React from 'react';
import './Card.css';

export const Card = ({ children, className = '' }) => (
  <div className={`ui-card ${className}`}>
    {children}
  </div>
);