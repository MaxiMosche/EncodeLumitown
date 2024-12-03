import React from 'react';

const EnergyPrice = ({ energy = [], marketFeePercentage = 425 }) => {
  const cardStyle = {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    border: '1px solid #ccc',
    padding: '1rem',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
    margin: '10px',
    width: '200px',
    height: '100px',
    backgroundColor: '#f9f9f9',
  };

  const imageStyle = {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    marginBottom: '10px',
  };

  const craftingImageStyle = {
    width: '60px',
    height: '60px',
    borderRadius: '4px',
    margin: '0 5px',
  };

  const craftingContainerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '10px',
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

  const iconStyle = {
    width: '16px',
    height: '16px',
    marginRight: '5px',
  };

  const epStyle = (ep, isInvalid) => ({
    color: isInvalid ? 'red' : '#333',
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
    padding: '2px 6px',
  };

  const applyMarketFee = (price) => {
    return price * (1 + marketFeePercentage / 10000);
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
        total + (craft.element !== 'Empty Bottle' ? parseFloat(craft.price || 0) * parseInt(craft.quantity || 0) : 0),
      0
    );
    const isInvalid = crafting.every((craft) => craft.element !== 'Empty Bottle' && parseFloat(craft.price || 0) === 0);
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

  const allCards = energy.flatMap((potion) => {
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
        price: simpleCost.totalCost, // Final price with market fee
      },
    ];

    if (craftingCost) {
      cards.push({
        ...potion,
        type: 'crafting',
        costPerEnergy: craftingCost.costPerEnergy,
        isInvalid: craftingCost.isInvalid,
        price: craftingCost.totalCost, // Final price with market fee
      });
    }

    return cards;
  });

  const sortedEnergy = allCards.sort((a, b) => a.costPerEnergy - b.costPerEnergy);

  return (
    <div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center' }}>
        {sortedEnergy.map((card, index) => {
          const levelMatch = card.name.match(/Lv\s?\d+/i);
          const level = levelMatch ? levelMatch[0].toUpperCase() : null;
          const imageUrl =
            card.type === 'simple'
              ? card.url || 'https://cdn.skymavis.com/mm-cache/7/1/a982febb7e3f7e75d9ff811d644971.png'
              : card.crafting[0]?.url || 'https://cdn.skymavis.com/mm-cache/7/1/a982febb7e3f7e75d9ff811d644971.png';

          return (
            <div key={index} style={cardStyle}>
              {level && <div style={levelStyle}>{level}</div>}
              {card.type === 'simple' ? (
                <img src={imageUrl} alt={card.name} style={imageStyle} />
              ) : (
                <div style={craftingContainerStyle}>
                  {card.crafting.map((item, itemIndex) => (
                    <img
                      key={itemIndex}
                      src={item.url || 'https://cdn.skymavis.com/mm-cache/7/1/a982febb7e3f7e75d9ff811d644971.png'}
                      alt={item.element}
                      style={craftingImageStyle}
                    />
                  ))}
                </div>
              )}
              <div style={footerStyle}>
                <div style={priceStyle}>
                  <img
                    src="https://cdn.skymavis.com/ronin/2020/erc20/0xd61bbbb8369c46c15868ad9263a2710aced156c4/logo-transparent.png"
                    alt="Cost Icon"
                    style={iconStyle}
                  />
                  {card.price.toFixed(4)}
                </div>
                <div style={epStyle(card.costPerEnergy, card.isInvalid)}>
                  E/P: {card.costPerEnergy.toFixed(4)}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default EnergyPrice;
