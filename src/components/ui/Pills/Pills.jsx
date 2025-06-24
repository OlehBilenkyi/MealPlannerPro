import React from 'react';
import { FiCoffee, FiSun, FiMoon, FiDroplet } from 'react-icons/fi';
import './Pills.css';

export const MealTypePill = ({ type }) => {
  const typeConfig = {
    breakfast: { icon: <FiCoffee />, color: '#FF9F1C', label: 'Breakfast' },
    lunch: { icon: <FiSun />, color: '#2EC4B6', label: 'Lunch' },
    dinner: { icon: <FiMoon />, color: '#E71D36', label: 'Dinner' },
    snack: { icon: <FiDroplet />, color: '#662E9B', label: 'Snack' }
  };

  const config = typeConfig[type.toLowerCase()] || typeConfig.breakfast;

  return (
    <span 
      className="meal-type-pill"
      style={{ backgroundColor: `${config.color}20`, color: config.color }}
    >
      {config.icon}
      <span>{config.label}</span>
    </span>
  );
};

export const FilterPill = ({ label, onRemove }) => (
  <span className="filter-pill">
    {label}
    <button onClick={onRemove}>&times;</button>
  </span>
);