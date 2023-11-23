import React from 'react';
// import './CardList.css';

const CardList = ({ items, onItemClick }) => {
  return (
    <div className="card-list">
      {items.map((item) => (
        <div key={item.id} className="card" onClick={() => onItemClick(item)}>
          <div>
            <h3>{item.name}</h3>
            <p>{item.bodyPart}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CardList;