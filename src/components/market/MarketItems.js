// src/components/market/MarketItems.js
import React, { useState, useEffect } from 'react';
import { useSignalR } from './SignalRContext'; // Ensure this context is correctly set up

const MarketItems = ({ items }) => {
  const [filter, setFilter] = useState('');
  const [hoveredItem, setHoveredItem] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [notification, setNotification] = useState('');

  const { epValue, tokenPrices } = useSignalR();

  const essenceFilters = {
    slime: 'slime',
    combat: 'combat essence',
    livestock: 'agricultural livestock essence',
    planting: 'agricultural planting essence',
    gathering: 'gather essence',
  };

  // Filter items based on selected filter
  const filteredItems = items.filter((item) => {
    if (filter === '') return true;
    return Object.keys(essenceFilters).some(
      (key) => filter === key && item.name.toLowerCase().includes(essenceFilters[key])
    );
  });

  const baseEnergyCostsSlime = {
    1: 11.1,
    2: 33.3,
    3: 77.7,
    4: 155.1,
    5: 311.1,
    6: 623.1,
    7: 1247.1,
    8: 2495.1,
    9: 4991.1,
  };

  const baseEnergyCostsOthers = {
    1: 15.17,
    2: 45.51,
    3: 106.19,
    4: 227.55,
    5: 470.27,
    6: 955.71,
    7: 1926.59,
    8: 3868.35,
    9: 7745.87,
  };

  const energyCosts = (isSlime) => {
    const baseCosts = isSlime ? baseEnergyCostsSlime : baseEnergyCostsOthers;
    return Object.keys(baseCosts).reduce((acc, level) => {
      acc[level] = (baseCosts[level] * epValue).toFixed(2);
      return acc;
    }, {});
  };

  const luaToken = tokenPrices.find(
    (token) => token.name.trim().toLowerCase() === 'lumi finance token'
  );
  const luaPrice = luaToken ? parseFloat(luaToken.price) : 0;

  // Helper function to extract item level from its name
  const getItemLevel = (itemName) => {
    const levelMatch = itemName.match(/lv\s*(\d+)/i);
    return levelMatch ? parseInt(levelMatch[1], 10) : 0;
  };

  // Handle adding items to the cart
  const handleAddToCart = (item, craftingCostUSD) => {
    const level = getItemLevel(item.name);
    setCartItems((prev) => {
      const existingItemIndex = prev.findIndex(
        (cartItem) => cartItem.name === item.name && cartItem.level === level
      );

      if (existingItemIndex !== -1) {
        // If item already exists in cart, increment the quantity
        const updatedCart = [...prev];
        updatedCart[existingItemIndex].quantity += 1;
        return updatedCart;
      } else {
        // If item doesn't exist, add it to the cart with quantity 1
        return [...prev, { ...item, craftingCostUSD, quantity: 1, level }];
      }
    });

    setNotification(`${item.name} has been added to the cart.`);

    // Hide the notification after 3 seconds
    setTimeout(() => {
      setNotification('');
    }, 3000);
  };

  // Handle removing a specific item from the cart
  const handleRemoveFromCart = (name, level) => {
    setCartItems((prev) => {
      const existingItemIndex = prev.findIndex(
        (cartItem) => cartItem.name === name && cartItem.level === level
      );

      if (existingItemIndex !== -1) {
        const updatedCart = [...prev];
        if (updatedCart[existingItemIndex].quantity > 1) {
          // Decrement the quantity by 1
          updatedCart[existingItemIndex].quantity -= 1;
          return updatedCart;
        } else {
          // Remove the item from the cart
          updatedCart.splice(existingItemIndex, 1);
          return updatedCart;
        }
      }
      return prev;
    });
  };

  // Handle clearing the entire cart
  const handleClearCart = () => {
    setCartItems([]);
  };

  // Calculate totals
  const totalPurchase = cartItems.reduce(
    (total, item) => total + parseFloat(item.price || 0) * item.quantity,
    0
  );
  const totalCrafting = cartItems.reduce(
    (total, item) => total + parseFloat(item.craftingCostUSD || 0) * item.quantity,
    0
  );

  // Sort cart items by quantity in descending order
  const sortedCartItems = [...cartItems].sort((a, b) => b.quantity - a.quantity);

  return (
    <div className="market-items-container">
      {/* Embedded Styles */}
      <style>{`
        .market-items-container {
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

        /* Notification */
        .notification {
          position: fixed;
          top: 20px;
          right: 20px;
          background-color: #4BB543;
          color: #fff;
          padding: 12px 24px;
          border-radius: 8px;
          box-shadow: 0 4px 15px rgba(0,0,0,0.2);
          z-index: 1000;
          animation: fadein 0.5s, fadeout 0.5s 2.5s;
          font-weight: 500;
        }

        @keyframes fadein {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes fadeout {
          from { opacity: 1; transform: translateY(0); }
          to { opacity: 0; transform: translateY(-20px); }
        }

        /* Filters */
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

        /* Content Area */
        .content-area {
          display: flex;
          flex-direction: row;
          gap: 2rem;
          width: 100%;
        }

        /* Items Grid */
        .items-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
          gap: 20px;
          flex: 3;
        }

        /* Item Card */
        .item-card {
          position: relative; /* Ensure absolute children are positioned relative to the card */
          border: none;
          padding: 1rem;
          border-radius: 12px;
          background: #ffffff;
          box-shadow: 0px 6px 18px rgba(0, 0, 0, 0.1);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center; /* Center content vertically */
          height: 180px; /* Reduced height */
          cursor: pointer;
          transition: transform 0.3s, box-shadow 0.3s;
        }

        .item-card:hover {
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
        }

        .item-image {
          width: 60px;
          height: 60px;
          object-fit: cover;
          margin-bottom: 10px;
          display: block;
        }

        .price-container {
          position: absolute;
          bottom: 10px;
          left: 10px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .price-icon {
          width: 20px;
          height: 20px;
        }

        .price-text {
          margin: 0;
          font-size: 14px;
          font-weight: 600;
        }

        /* Tooltip */
        .tooltip {
          visibility: hidden;
          background-color: rgba(58, 58, 58, 0.95);
          color: #fff;
          text-align: left;
          border-radius: 8px;
          padding: 10px;
          position: absolute;
          z-index: 1;
          bottom: 100%;
          left: 50%;
          transform: translateX(-50%);
          width: 250px;
          opacity: 0;
          transition: opacity 0.3s;
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
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

        .item-card:hover .tooltip {
          visibility: visible;
          opacity: 1;
        }

        /* Shopping Cart */
        .cart-container {
          flex: 1;
          padding: 1.5rem;
          background: #ffffff;
          border-radius: 12px;
          box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
          height: fit-content;
          position: sticky;
          top: 20px;
        }

        .cart-header {
          text-align: center;
          margin-bottom: 1.5rem;
          color: #333333;
          font-size: 1.5rem;
          font-weight: 700;
          border-bottom: 2px solid #e0e0e0;
          padding-bottom: 0.5rem;
        }

        .empty-cart {
          text-align: center;
          color: #888888;
          font-size: 1rem;
          font-weight: 500;
          padding: 1rem 0;
        }

        .cart-items {
          display: flex;
          flex-direction: column;
          gap: 1.2rem;
          max-height: 450px;
          overflow-y: auto;
        }

        .cart-item {
          display: flex;
          align-items: center;
          background: #f9fafb;
          padding: 0.8rem;
          border-radius: 10px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
          position: relative;
          transition: background 0.3s, transform 0.2s;
        }

        .cart-item:hover {
          background: #f1f5f9;
          transform: translateY(-2px);
        }

        .cart-item-image {
          width: 50px;
          height: 50px;
          object-fit: cover;
          border-radius: 8px;
          margin-right: 1rem;
          border: 1px solid #e0e0e0;
        }

        .cart-item-details {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
        }

        .cart-item-name {
          margin: 0;
          color: #555555;
          font-size: 14px;
          font-weight: 500;
        }

        .cart-item-quantity {
          margin: 0;
          color: #777777;
          font-size: 13px;
        }

        .remove-button {
          background: #ff4d4f;
          border: none;
          color: white;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          font-size: 1rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.3s, transform 0.2s;
        }

        .remove-button:hover {
          background: #e04343;
          transform: scale(1.1);
        }

        /* Cart Totals */
        .cart-totals {
          margin-top: 2.5rem;
          padding-top: 1.5rem;
          border-top: 1px solid #e0e0e0;
          text-align: center;
        }

        .cart-totals p {
          margin: 0;
          font-size: 1.2rem;
          font-weight: 600;
          color: #333333;
        }

        .clear-button {
          margin-top: 1.2rem;
          padding: 0.6rem 1.5rem;
          background: #ff4d4f;
          color: #ffffff;
          border: none;
          border-radius: 30px;
          cursor: pointer;
          transition: background 0.3s, transform 0.2s;
          font-size: 14px;
          font-weight: 500;
        }

        .clear-button:hover {
          background: #e04343;
          transform: translateY(-2px);
        }

        /* Responsive Design */
        @media (max-width: 1200px) {
          .market-items-container {
            flex-direction: column;
          }

          .content-area {
            flex-direction: column;
          }

          .cart-container {
            width: 100%;
            margin-top: 2rem;
            position: static;
          }
        }
      `}</style>

      {/* Notification */}
      {notification && <div className="notification">{notification}</div>}

      {/* Filters */}
      <div className="filters-container">
        <button
          className={`filter-button ${filter === '' ? 'active' : ''}`}
          onClick={() => setFilter('')}
        >
          All
        </button>
        {Object.keys(essenceFilters).map((key) => (
          <button
            key={key}
            className={`filter-button ${filter === key ? 'active' : ''}`}
            onClick={() => setFilter(key)}
          >
            {key.charAt(0).toUpperCase() + key.slice(1)}
          </button>
        ))}
      </div>

      {/* Content Area: Items and Cart */}
      <div className="content-area">
        {/* Items Grid */}
        <div className="items-grid">
          {filteredItems.map((item, index) => {
            const level = getItemLevel(item.name);
            const levelLabel = `LV${level}`;
            const originalPrice = parseFloat(item.price);
            const isPriceZero = originalPrice === 0;
            const increasedPrice = originalPrice * 1.0425;
            const isSlime = item.name.toLowerCase().includes('slime');
            const craftingCostLUA = energyCosts(isSlime)[level] || '0.00';
            const craftingCostUSD = luaPrice > 0 ? (craftingCostLUA * luaPrice).toFixed(2) : '0.00';

            return (
              <div
                key={`${item.name}-${level}-${index}`}
                className="item-card"
                onClick={() => handleAddToCart(item, craftingCostUSD)}
                onMouseEnter={() => setHoveredItem(item.name)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <div className="level-label">{levelLabel}</div>
                <img src={item.url} alt={item.name} className="item-image" />
                <div className="price-container">
                  <img
                    src="https://cdn.skymavis.com/ronin/2020/erc20/0xd61bbbb8369c46c15868ad9263a2710aced156c4/logo-transparent.png"
                    alt="Price Icon"
                    className="price-icon"
                  />
                  <p
                    className="price-text"
                    style={{
                      color: isPriceZero ? '#ff4d4f' : '#333333',
                      textDecoration: isPriceZero ? 'line-through' : 'none',
                    }}
                  >
                    {isPriceZero ? '0.0000' : increasedPrice.toFixed(4)}
                  </p>
                </div>

                {/* Tooltip */}
                {hoveredItem === item.name && (
                  <div className="tooltip">
                    <div style={{ marginBottom: '8px', fontWeight: '500' }}>
                      <strong>Crafting Cost:</strong> ~${craftingCostLUA} USD
                    </div>
                    <div style={{ fontWeight: '500' }}>
                      <strong>Total:</strong> ~${craftingCostUSD} USD
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Shopping Cart */}
        <div className="cart-container">
          <h2 className="cart-header">Cart</h2>
          {cartItems.length === 0 ? (
            <p className="empty-cart">Your cart is empty.</p>
          ) : (
            <>
              <div className="cart-items">
                {sortedCartItems.map((item, index) => (
                  <div key={`${item.name}-${item.level}-${index}`} className="cart-item">
                    <img
                      src={item.url}
                      alt={`Level ${item.level}`}
                      className="cart-item-image"
                    />
                    <div className="cart-item-details">
                      <p className="cart-item-name">{item.name}</p>
                      <p className="cart-item-quantity">Level: {item.level} | Quantity: {item.quantity}</p>
                    </div>
                    <button
                      className="remove-button"
                      onClick={() => handleRemoveFromCart(item.name, item.level)}
                      aria-label={`Remove ${item.name} Level ${item.level} from cart`}
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
              <div className="cart-totals">
                <p>
                  <strong>Total:</strong> ${totalCrafting.toFixed(2)}
                </p>
                <button className="clear-button" onClick={handleClearCart}>
                  Clear Cart
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MarketItems;
