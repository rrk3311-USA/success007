'use client'
import React, { useState, useEffect } from 'react';

function MealFinder({ location, deals, selectedDeal, onDealSelect }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredDeals, setFilteredDeals] = useState(deals);

  useEffect(() => {
    if (searchQuery) {
      const filtered = deals.filter(deal =>
        deal.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        deal.restaurant.toLowerCase().includes(searchQuery.toLowerCase()) ||
        deal.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredDeals(filtered);
    } else {
      setFilteredDeals(deals);
    }
  }, [searchQuery, deals]);

  const handleSearch = (e) => {
    e.preventDefault();
    // Search is handled by useEffect
  };

  return (
    <div className="meal-finder">
      <div className="finder-header">
        <div className="finder-title">MEAL FINDER</div>
      </div>

      <form onSubmit={handleSearch} className="search-box">
        <input
          type="text"
          className="search-input"
          placeholder="SEARCH DEALS, RESTAURANTS, CATEGORIES..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button type="submit" className="search-btn">SCAN</button>
      </form>

      {selectedDeal ? (
        <div className="deal-detail" style={{ flex: 1, minHeight: 0, overflowY: 'auto' }}>
          <div className="deal-header">
            <div>
              <div className="deal-name">{selectedDeal.name}</div>
              <div className="deal-restaurant">{selectedDeal.restaurant}</div>
            </div>
            <div className="deal-price">
              <div className="price-current">
                ${selectedDeal.price}
                <span className="price-original">${selectedDeal.originalPrice}</span>
              </div>
              <div className="deal-discount">-{selectedDeal.discount}%</div>
            </div>
          </div>

          <div style={{
            fontSize: '4rem',
            textAlign: 'center',
            margin: '20px 0',
            animation: 'dealSlideIn 0.5s ease-out'
          }}>
            {selectedDeal.image}
          </div>

          <div className="deal-info">
            <div className="info-item">
              <div className="info-label">DISTANCE</div>
              <div className="info-value">{selectedDeal.distance} KM</div>
            </div>
            <div className="info-item">
              <div className="info-label">ETA</div>
              <div className="info-value">{selectedDeal.time}</div>
            </div>
            <div className="info-item">
              <div className="info-label">RATING</div>
              <div className="info-value">⭐ {selectedDeal.rating}</div>
            </div>
          </div>

          <button
            style={{
              width: '100%',
              marginTop: '20px',
              padding: '12px',
              background: 'linear-gradient(135deg, var(--clay-grey), var(--clay-grey-dark))',
              border: '1px solid var(--border-clay)',
              borderRadius: '6px',
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-display)',
              fontSize: '12px',
              fontWeight: '700',
              cursor: 'pointer',
              textTransform: 'uppercase',
              letterSpacing: '2px',
              transition: 'all 0.3s',
              textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
              boxShadow: '0 4px 12px rgba(139, 125, 107, 0.2)'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'linear-gradient(135deg, var(--clay-grey-light), var(--clay-grey))';
              e.target.style.borderColor = 'var(--clay-grey)';
              e.target.style.boxShadow = '0 6px 16px rgba(139, 125, 107, 0.3)';
              e.target.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'linear-gradient(135deg, var(--clay-grey), var(--clay-grey-dark))';
              e.target.style.borderColor = 'var(--border-clay)';
              e.target.style.boxShadow = '0 4px 12px rgba(139, 125, 107, 0.2)';
              e.target.style.transform = 'translateY(0)';
            }}
          >
            LOCK ON & ORDER
          </button>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '15px',
          marginTop: '20px'
        }}>
          {filteredDeals.map((deal) => (
            <div
              key={deal.id}
              className="deal-card"
              onClick={() => onDealSelect(deal)}
              style={{
                animation: 'dealSlideIn 0.5s ease-out',
                animationDelay: `${deal.id * 0.1}s`
              }}
            >
              <div className="deal-card-icon">{deal.image}</div>
              <div className="deal-card-name">{deal.name}</div>
              <div className="deal-card-restaurant">{deal.restaurant}</div>
              <div className="deal-card-price">
                <span className="deal-card-price-value">${deal.price}</span>
                <span className="deal-card-distance">{deal.distance} KM</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MealFinder;
