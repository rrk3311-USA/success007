'use client'
import React from 'react';

function DealCards({ deals, onDealSelect, selectedDeal }) {
  return (
    <div className="deals-scroll">
      {deals.map((deal, index) => (
        <div
          key={deal.id}
          className={`deal-card ${selectedDeal?.id === deal.id ? 'selected' : ''}`}
          onClick={() => onDealSelect(deal)}
          style={{
            animation: `dealSlideIn 0.5s ease-out ${index * 0.1}s both`
          }}
        >
          <div className="deal-card-icon">{deal.image}</div>
          <div className="deal-card-name">{deal.name}</div>
          <div className="deal-card-restaurant">{deal.restaurant}</div>
          <div style={{
            marginTop: '10px',
            padding: '5px 10px',
            background: 'rgba(255, 71, 87, 0.2)',
            borderRadius: '4px',
            fontSize: '0.8rem',
            color: '#ff4757',
            fontWeight: '600',
            textAlign: 'center'
          }}>
            -{deal.discount}% OFF
          </div>
          <div className="deal-card-price">
            <span className="deal-card-price-value">${deal.price}</span>
            <span className="deal-card-distance">{deal.distance} KM</span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default DealCards;
