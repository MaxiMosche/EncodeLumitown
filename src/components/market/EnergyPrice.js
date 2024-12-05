// src/components/energy/EnergyPrice.js
import React, { useState, useEffect } from 'react';
import { useSignalR } from './SignalRContext';

const EnergyPrice = ({ marketFeePercentage = 425 }) => {
  const { marketData, tokenPrices, isConnected } = useSignalR();
  const [hoveredCard, setHoveredCard] = useState(null);

  // State for the calculator
  const [energyAmount, setEnergyAmount] = useState(1);
  const [estimatedCostLUA, setEstimatedCostLUA] = useState(0);
  const [estimatedCostUSD, setEstimatedCostUSD] = useState(0);

  // State for the filter
  const [filter, setFilter] = useState('All');

  useEffect(() => {}, [tokenPrices]);

  const applyMarketFee = (price) => {
    return price * 1.0425;
  };

  const calculateSimpleCost = (price, energyObtain) => {
    const validPrice = parseFloat(price) || 0;
    const validEnergy = parseFloat(energyObtain) || 1;
    const finalPrice = applyMarketFee(validPrice);
    const isInvalid = validPrice === 0;
    return {
      totalCost: finalPrice,
      costPerEnergy: isInvalid ? Infinity : finalPrice / validEnergy,
      isInvalid,
    };
  };

  const calculateCraftingCost = (crafting, fee, energyObtain, name) => {
    const craftingTotal = crafting.reduce(
      (total, craft) =>
        total +
        (craft.element !== 'Empty Bottle'
          ? parseFloat(craft.price || 0) * parseInt(craft.quantity || 0)
          : 0),
      0
    );
    const isInvalid = crafting.some(
      (craft) =>
        craft.element !== 'Empty Bottle' &&
        (craft.price === undefined || parseFloat(craft.price) === 0)
    );
    const validFee = parseFloat(fee) || 0;
    const validEnergy = parseFloat(energyObtain) || 1;

    const multiplier = name && name.toLowerCase().includes('lv 1') ? 3.5 : 4;
    const energyAdjusted = validEnergy * multiplier;
    const finalPrice = applyMarketFee(craftingTotal + validFee);
    return {
      totalCost: finalPrice,
      costPerEnergy: isInvalid ? Infinity : finalPrice / energyAdjusted,
      isInvalid,
    };
  };

  const allCards = marketData.energy.flatMap((potion) => {
    const simpleCost = calculateSimpleCost(potion.price || 0, potion.energyObtain);
    const craftingCost = potion.crafting
      ? calculateCraftingCost(potion.crafting, potion.fee || 0, potion.energyObtain, potion.name)
      : null;

    const cards = [
      {
        ...potion,
        type: 'Potion',
        costPerEnergy: simpleCost.costPerEnergy,
        isInvalid: simpleCost.isInvalid,
        price: simpleCost.totalCost,
      },
    ];

    if (craftingCost) {
      cards.push({
        ...potion,
        type: 'Crafting',
        costPerEnergy: craftingCost.costPerEnergy,
        isInvalid: craftingCost.isInvalid,
        price: craftingCost.totalCost,
      });
    }

    return cards;
  });

  // Apply filter
  const filteredEnergy = allCards.filter((card) => {
    if (filter === 'All') return true;
    return card.type === filter;
  });

  const sortedEnergy = filteredEnergy.sort((a, b) => a.costPerEnergy - b.costPerEnergy);

  const getTokenLogo = (tokenName) => {
    const token = tokenPrices.find(
      (t) => t.name.trim().toLowerCase() === tokenName.trim().toLowerCase()
    );
    return token
      ? token.tokenLogo
      : 'https://cdn.skymavis.com/mm-cache/7/1/a982febb7e3f7e75d9ff811d644971.png';
  };

  const convertPrice = (price, tokenName) => {
    const token = tokenPrices.find(
      (t) => t.name.trim().toLowerCase() === tokenName.trim().toLowerCase()
    );
    if (!token) return '0.00';
    const tokenPrice = parseFloat(token.price) || 1;
    return (price / tokenPrice).toFixed(4);
  };

  const lumiToken = tokenPrices.find(
    (t) => t.name.trim().toLowerCase() === 'lumi finance token'
  );
  const lumiPrice = lumiToken ? parseFloat(lumiToken.price) : 1;
  const convertToUSD = (price) => {
    return (price * lumiPrice).toFixed(4);
  };

  // Get the minimum E/P
  const minCostPerEnergy =
    sortedEnergy.length > 0 ? sortedEnergy[0].costPerEnergy : 0;
  
  // Effect to update the estimated cost
  useEffect(() => {
    if (minCostPerEnergy > 0 && energyAmount > 0) {
      const totalCostLUA = energyAmount * minCostPerEnergy;
      const totalCostUSD = totalCostLUA * lumiPrice;
      setEstimatedCostLUA(totalCostLUA.toFixed(4));
      setEstimatedCostUSD(totalCostUSD.toFixed(4));
    } else {
      setEstimatedCostLUA(0);
      setEstimatedCostUSD(0);
    }
  }, [energyAmount, minCostPerEnergy, lumiPrice]);

  return (
    <div className="energy-price-container">
      {/* Embedded Styles */}
      <style>{`
        .energy-price-container {
          display: flex;
          flex-direction: column;
          padding: 2rem;
          box-sizing: border-box;
          position: relative;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          gap: 2rem;
          background: #f5f7fa;
          min-height: 100vh;
        }

        /* Filter Buttons */
        .filters-container {
          padding: 1rem;
          background: #ffffff;
          border-radius: 10px;
          box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          justify-content: center;
          max-width: 700px;
          margin: 0 auto;
        }

        .filter-button {
          padding: 0.6rem 1.8rem;
          border: none;
          border-radius: 30px;
          background: #e0e7ff;
          color: #4f46e5;
          cursor: pointer;
          transition: background 0.3s, color 0.3s, transform 0.2s;
          font-size: 14px;
          font-weight: 500;
        }

        .filter-button:hover {
          background: #d4d9ff;
          transform: translateY(-2px);
        }

        .filter-button.active {
          background: #4f46e5;
          color: white;
          box-shadow: 0 4px 8px rgba(0,0,0,0.2);
        }

        /* Energy Calculator */
        .calculator-container {
          margin-bottom: 2rem;
          text-align: center;
          padding: 1.5rem;
          background-color: #ffffff;
          border-radius: 12px;
          box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
          max-width: 400px;
          margin: 2rem auto;
        }

        .calculator-title {
          margin-bottom: 1rem;
          font-size: 1.5rem;
          color: #333;
          font-weight: 700;
        }

        .calculator-input-container {
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1rem;
        }

        .calculator-label {
          margin-right: 0.5rem;
          font-size: 1rem;
          color: #333;
          font-weight: 500;
        }

        .calculator-input {
          width: 80px;
          padding: 0.5rem;
          font-size: 1rem;
          border-radius: 8px;
          border: 1px solid #ced4da;
          text-align: center;
        }

        .calculator-result {
          font-size: 1.1rem;
          color: #007bff;
          font-weight: 600;
        }

        /* Cards Grid */
        .cards-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          justify-content: center;
        }

        /* Energy Card */
        .energy-card {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center; /* Changed from space-between to center */
          border: none;
          padding: 1.5rem;
          border-radius: 12px;
          background: #ffffff;
          box-shadow: 0px 6px 18px rgba(0, 0, 0, 0.1);
          width: 200px;
          height: 220px;
          cursor: pointer;
          transition: transform 0.3s, box-shadow 0.3s;
        }

        .energy-card:hover {
          transform: translateY(-5px) scale(1.02);
          box-shadow: 0px 8px 22px rgba(0, 0, 0, 0.2);
        }

        .level-label {
          position: absolute;
          top: 10px;
          right: 10px;
          background: #ff7f50;
          color: white;
          padding: 5px 10px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          z-index: 2;
        }

        .crafting-label {
          position: absolute;
          top: 10px;
          left: 10px;
          background: #28a745;
          color: white;
          font-size: 10px;
          font-weight: bold;
          border-radius: 4px;
          padding: 4px 6px;
          z-index: 2;
        }

        /* Image Container */
        .image-container {
          display: flex;
          justify-content: center;
          align-items: center;
          flex-grow: 1; /* Allows the container to take available space */
          margin-bottom: 1rem; /* Adjust as needed */
        }

        .energy-image {
          width: 80px;
          height: 80px;
          border-radius: 12px;
          object-fit: cover;
          display: block;
        }

        .energy-footer {
          position: absolute;
          bottom: 10px;
          left: 10px;
          right: 10px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 14px;
          font-weight: bold;
          color: #333;
          padding: 0 10px;
        }

        .price-section {
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .price-text {
          margin: 0;
          font-size: 14px;
          font-weight: 600;
          color: #333333;
        }

        .price-text.invalid {
          text-decoration: line-through;
          color: #d9534f;
        }

        .ep-section {
          color: #333333;
          font-weight: normal;
          text-decoration: none;
        }

        .ep-section.invalid {
          color: #d9534f;
          font-weight: bold;
          text-decoration: line-through;
        }

        /* Tooltip */
        .tooltip {
          visibility: hidden;
          background-color: rgba(58, 58, 58, 0.95);
          color: #fff;
          text-align: left;
          border-radius: 8px;
          padding: 12px;
          position: absolute;
          z-index: 3;
          bottom: 100%;
          left: 50%;
          transform: translateX(-50%);
          width: 240px;
          opacity: 0;
          transition: opacity 0.3s;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        }

        .tooltip::after {
          content: "";
          position: absolute;
          top: 100%;
          left: 50%;
          margin-left: -6px;
          border-width: 6px;
          border-style: solid;
          border-color: rgba(58, 58, 58, 0.95) transparent transparent transparent;
        }

        .energy-card:hover .tooltip {
          visibility: visible;
          opacity: 1;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .energy-price-container {
            padding: 1rem;
          }

          .calculator-container {
            max-width: 100%;
          }

          .energy-card {
            width: 100%;
            height: auto;
          }

          .cards-grid {
            flex-direction: column;
            align-items: center;
          }
        }
      `}</style>

      {/* Filters */}
      <div className="filters-container">
        <button
          className={`filter-button ${filter === 'All' ? 'active' : ''}`}
          onClick={() => setFilter('All')}
        >
          All
        </button>
        <button
          className={`filter-button ${filter === 'Crafting' ? 'active' : ''}`}
          onClick={() => setFilter('Crafting')}
        >
          Crafting
        </button>
        <button
          className={`filter-button ${filter === 'Potion' ? 'active' : ''}`}
          onClick={() => setFilter('Potion')}
        >
          Potions
        </button>
      </div>

      {/* Energy Calculator */}
      <div className="calculator-container">
        <h3 className="calculator-title">Energy Calculator</h3>
        <div className="calculator-input-container">
          <label htmlFor="energyAmount" className="calculator-label">
            Energy Amount:
          </label>
          <input
            type="number"
            id="energyAmount"
            value={energyAmount}
            min="1"
            onChange={(e) => setEnergyAmount(parseInt(e.target.value) || 1)}
            className="calculator-input"
          />
        </div>
        {estimatedCostLUA > 0 && (
          <div className="calculator-result">
            Estimated Cost: {estimatedCostLUA} LUA (~${estimatedCostUSD} USD)
          </div>
        )}
      </div>

      {/* Cards List */}
      <div className="cards-grid">
        {sortedEnergy.map((card, index) => {
          const levelMatch = card.name.match(/Lv\s?\d+/i);
          const level = levelMatch ? levelMatch[0].toUpperCase() : null;

          let imageUrl = '';
          if (card.type === 'Potion') {
            imageUrl =
              card.url ||
              'https://cdn.skymavis.com/mm-cache/7/1/a982febb7e3f7e75d9ff811d644971.png';
          } else if (card.type === 'Crafting') {
            if (
              card.crafting.some(
                (craft) => craft.element.trim().toLowerCase() === 'empty bottle'
              )
            ) {
              imageUrl =
                'https://cdn.skymavis.com/mm-cache/7/1/a982febb7e3f7e75d9ff811d644971.png';
            } else {
              imageUrl =
                card.crafting[0]?.url ||
                'https://cdn.skymavis.com/mm-cache/7/1/a982febb7e3f7e75d9ff811d644971.png';
            }
          }

          return (
            <div
              key={index}
              className="energy-card"
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              {level && <div className="level-label">{level}</div>}

              {card.type === 'Crafting' && (
                <div className="crafting-label">Crafting</div>
              )}

              {/* Image Container */}
              <div className="image-container">
                <img src={imageUrl} alt={card.name} className="energy-image" />
              </div>

              <div className="energy-footer">
                <div className="price-section">
                  <img
                    src="https://cdn.skymavis.com/ronin/2020/erc20/0xd61bbbb8369c46c15868ad9263a2710aced156c4/logo-transparent.png"
                    alt="Cost Icon"
                    style={{ width: '16px', height: '16px', marginRight: '5px' }}
                  />
                  <span
                    className={`price-text ${
                      card.isInvalid ? 'invalid' : ''
                    }`}
                  >
                    {parseFloat(card.price).toFixed(4)}
                  </span>
                </div>
                <div
                  className={`ep-section ${
                    card.isInvalid ? 'invalid' : ''
                  }`}
                >
                  {`E/$: ${card.costPerEnergy.toFixed(4)}`}
                </div>
              </div>

              {hoveredCard === index && (
                <div className="tooltip">
                  <div style={{ marginBottom: '8px' }}>
                    <strong>Total:</strong> (~$
                    {convertToUSD(card.price)} USD)
                  </div>
                  <div>
                    <strong>E/$:</strong> (~$
                    {convertToUSD(card.costPerEnergy)} USD)
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default EnergyPrice;

