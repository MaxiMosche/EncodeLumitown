import React, { useState, useEffect } from 'react';
import { useSignalR } from './SignalRContext';

const EnergyPrice = ({ marketFeePercentage = 425 }) => {
  const { marketData, tokenPrices, isConnected } = useSignalR();
  const [hoveredCard, setHoveredCard] = useState(null);

  // State for the calculator
  const [energyAmount, setEnergyAmount] = useState(1);
  const [estimatedCostLUA, setEstimatedCostLUA] = useState(0);
  const [estimatedCostUSD, setEstimatedCostUSD] = useState(0);

  useEffect(() => {}, [tokenPrices]);

  // Styles
  const calculatorContainerStyle = {
    marginBottom: '2rem',
    textAlign: 'center',
    padding: '1rem',
    backgroundColor: '#f8f9fa',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    maxWidth: '400px',
    margin: '2rem auto',
  };

  const calculatorTitleStyle = {
    marginBottom: '1rem',
    fontSize: '1.5rem',
    color: '#333',
  };

  const calculatorInputContainerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '1rem',
  };

  const calculatorLabelStyle = {
    marginRight: '0.5rem',
    fontSize: '1rem',
    color: '#333',
  };

  const calculatorInputStyle = {
    width: '80px',
    padding: '0.5rem',
    fontSize: '1rem',
    borderRadius: '8px',
    border: '1px solid #ced4da',
    textAlign: 'center',
  };

  const calculatorResultStyle = {
    fontSize: '1.1rem',
    color: '#007bff',
  };

  const cardStyle = {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid #ccc',
    padding: '1rem',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    margin: '10px',
    width: '200px',
    height: '220px',
    backgroundColor: '#fff',
    cursor: 'pointer',
    transition: 'transform 0.2s',
  };

  const cardHoverStyle = {
    transform: 'scale(1.05)',
    boxShadow: '0 6px 18px rgba(0, 0, 0, 0.2)',
  };

  const imageStyle = {
    width: '80px',
    height: '80px',
    borderRadius: '12px',
    objectFit: 'cover',
    marginBottom: '0.5rem',
  };

  const footerStyle = {
    position: 'absolute',
    bottom: '10px',
    left: '0',
    right: '0',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#333',
    padding: '0 10px',
  };

  const priceStyle = {
    display: 'flex',
    alignItems: 'center',
  };

  const priceTextStyle = (isInvalid) => ({
    textDecoration: isInvalid ? 'line-through' : 'none',
    color: isInvalid ? '#d9534f' : '#333',
  });

  const epStyle = (isInvalid) => ({
    color: isInvalid ? '#d9534f' : '#333',
    fontWeight: isInvalid ? 'bold' : 'normal',
    textDecoration: isInvalid ? 'line-through' : 'none',
  });

  const levelStyle = {
    position: 'absolute',
    top: '5px',
    right: '5px',
    backgroundColor: '#007bff',
    color: 'white',
    fontSize: '10px',
    fontWeight: 'bold',
    borderRadius: '4px',
    padding: '4px 6px',
  };

  const craftingLabelStyle = {
    position: 'absolute',
    top: '5px',
    left: '5px',
    backgroundColor: '#28a745',
    color: 'white',
    fontSize: '10px',
    fontWeight: 'bold',
    borderRadius: '4px',
    padding: '4px 6px',
  };

  const iconStyle = {
    width: '16px',
    height: '16px',
    marginRight: '5px',
  };

  const tooltipStyle = {
    visibility: 'visible',
    backgroundColor: 'rgba(58, 58, 58, 0.95)',
    color: '#fff',
    textAlign: 'center',
    borderRadius: '8px',
    padding: '12px',
    position: 'absolute',
    zIndex: 1,
    bottom: '100%',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '240px',
    opacity: 1,
    transition: 'opacity 0.3s',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
  };

  const tooltipArrowStyle = {
    position: 'absolute',
    top: '100%',
    left: '50%',
    marginLeft: '-6px',
    borderWidth: '6px',
    borderStyle: 'solid',
    borderColor: 'rgba(58, 58, 58, 0.95) transparent transparent transparent',
  };

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
        type: 'simple',
        costPerEnergy: simpleCost.costPerEnergy,
        isInvalid: simpleCost.isInvalid,
        price: simpleCost.totalCost,
      },
    ];

    if (craftingCost) {
      cards.push({
        ...potion,
        type: 'crafting',
        costPerEnergy: craftingCost.costPerEnergy,
        isInvalid: craftingCost.isInvalid,
        price: craftingCost.totalCost,
      });
    }

    return cards;
  });

  const sortedEnergy = allCards.sort((a, b) => a.costPerEnergy - b.costPerEnergy);

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
    <div>
      {/* Energy Calculator */}
      <div style={calculatorContainerStyle}>
        <h3 style={calculatorTitleStyle}>Energy Calculator</h3>
        <div style={calculatorInputContainerStyle}>
          <label htmlFor="energyAmount" style={calculatorLabelStyle}>
            Amount of Energy:
          </label>
          <input
            type="number"
            id="energyAmount"
            value={energyAmount}
            min="1"
            onChange={(e) => setEnergyAmount(parseInt(e.target.value) || 1)}
            style={calculatorInputStyle}
          />
        </div>
        {estimatedCostLUA > 0 && (
          <div style={calculatorResultStyle}>
            Estimated Cost: {estimatedCostLUA} LUA (~${estimatedCostUSD} USD)
          </div>
        )}
      </div>

      {/* List of Cards */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '1rem',
          justifyContent: 'center',
        }}
      >
        {sortedEnergy.map((card, index) => {
          const levelMatch = card.name.match(/Lv\s?\d+/i);
          const level = levelMatch ? levelMatch[0].toUpperCase() : null;

          let imageUrl = '';
          if (card.type === 'simple') {
            imageUrl =
              card.url ||
              'https://cdn.skymavis.com/mm-cache/7/1/a982febb7e3f7e75d9ff811d644971.png';
          } else if (card.type === 'crafting') {
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
              style={{
                ...cardStyle,
                ...(hoveredCard === index ? cardHoverStyle : {}),
              }}
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              {level && <div style={levelStyle}>{level}</div>}

              {card.type === 'crafting' && (
                <div style={craftingLabelStyle}>Crafting</div>
              )}

              <img src={imageUrl} alt={card.name} style={imageStyle} />

              <div style={footerStyle}>
                <div style={priceStyle}>
                  <img
                    src="https://cdn.skymavis.com/ronin/2020/erc20/0xd61bbbb8369c46c15868ad9263a2710aced156c4/logo-transparent.png"
                    alt="Cost Icon"
                    style={iconStyle}
                  />
                  <span style={priceTextStyle(card.isInvalid)}>
                    {parseFloat(card.price).toFixed(4)}
                  </span>
                </div>
                <div style={epStyle(card.isInvalid)}>
                  {`E/$: ${card.costPerEnergy.toFixed(4)}`}
                </div>
              </div>

              {hoveredCard === index && (
                <div style={tooltipStyle}>
                  <div style={{ marginBottom: '8px' }}>
                    <strong>Total:</strong> (~$
                    {applyMarketFee(convertToUSD(card.price)).toFixed(4)} USD)
                  </div>
                  <div>
                    <strong>E/$:</strong> (~$
                    {applyMarketFee(convertToUSD(card.costPerEnergy)).toFixed(4)} USD)
                  </div>
                  <div style={tooltipArrowStyle}></div>
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


