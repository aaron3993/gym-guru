import React from 'react';
// import './CardList.css';

const CardList = ({ items, onItemClick }) => {
  return (
    <div className="card-list">
      {items.map((item) => (
        <div key={item.id} className="card" onClick={() => onItemClick(item)}>
          {/* Customize card content based on item data */}
          <h3>{item.name}</h3>
          {/* Add more card details as needed */}
        </div>
      ))}
    </div>
  );
};

export default CardList;