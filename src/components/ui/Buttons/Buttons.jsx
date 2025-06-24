import React from 'react';
import './Buttons.css';

export const PrimaryButton = ({ children, icon, onClick, small = false }) => (
  <button 
    className={`primary-btn ${small ? 'small' : ''}`}
    onClick={onClick}
  >
    {icon && <span className="btn-icon">{icon}</span>}
    {children}
  </button>
);

export const SecondaryButton = ({ children, onClick, small = false }) => (
  <button 
    className={`secondary-btn ${small ? 'small' : ''}`}
    onClick={onClick}
  >
    {children}
  </button>
);