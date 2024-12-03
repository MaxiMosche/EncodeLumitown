import React, { useState } from 'react';

const MarketItems = ({ items }) => {
  const [filter, setFilter] = useState('');

  const essenceFilters = {
    slime: 'slime',
    combat: 'combat essence',
    livestock: 'agricultural livestock essence',
    planting: 'agricultural planting essence',
    gathering: 'gather essence',
  };

  const filteredItems = items.filter((item) => {
    if (filter === '') return true;
    if (filter === 'slime') {
      return item.name.toLowerCase().includes(essenceFilters.slime);
    }
    return Object.keys(essenceFilters).some((key) =>
      filter === key && item.name.toLowerCase().includes(essenceFilters[key])
    );
  });

  return (
    <>
      {/* Contenedor Principal */}
      <div
        style={{
          width: '95%',
          margin: '0 auto',
          padding: '2rem 1rem',
          boxSizing: 'border-box',
        }}
      >
        {/* Sección de Filtros */}
        <div
          style={{
            marginBottom: '2rem',
            padding: '1rem',
            background: '#f0f4f8',
            borderRadius: '8px',
            boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)',
          }}
        >
          <div
            style={{
              display: 'flex',
              gap: '10px',
              flexWrap: 'wrap',
              justifyContent: 'center',
            }}
          >
            <button
              style={{
                padding: '0.5rem 1.5rem',
                border: '1px solid #ccc',
                borderRadius: '5px',
                background: filter === '' ? '#0066B3' : 'white',
                color: filter === '' ? 'white' : '#0066B3',
                cursor: 'pointer',
                transition: 'background 0.3s, color 0.3s',
              }}
              onClick={() => setFilter('')}
              onMouseEnter={(e) => {
                if (filter !== '') {
                  e.target.style.background = '#e6f0ff';
                }
              }}
              onMouseLeave={(e) => {
                if (filter !== '') {
                  e.target.style.background = 'white';
                }
              }}
            >
              All
            </button>
            {Object.keys(essenceFilters).map((key) => (
              <button
                key={key}
                style={{
                  padding: '0.5rem 1.5rem',
                  border: '1px solid #ccc',
                  borderRadius: '5px',
                  background: filter === key ? '#0066B3' : 'white',
                  color: filter === key ? 'white' : '#0066B3',
                  cursor: 'pointer',
                  transition: 'background 0.3s, color 0.3s',
                }}
                onClick={() => setFilter(key)}
                onMouseEnter={(e) => {
                  if (filter !== key) {
                    e.target.style.background = '#e6f0ff';
                  }
                }}
                onMouseLeave={(e) => {
                  if (filter !== key) {
                    e.target.style.background = 'white';
                  }
                }}
              >
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Mostrar Items Filtrados */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
            gap: '20px',
            justifyContent: 'center',
            paddingBottom: '2rem',
          }}
        >
          {filteredItems.map((item) => {
            const level = item.name.match(/lv\s*\d+/i)?.[0]?.replace(/\s+/g, '').toUpperCase() || 'LV0';
            const originalPrice = parseFloat(item.price);
            const isPriceZero = originalPrice === 0;
            const increasedPrice = originalPrice * 1.0425;

            return (
              <div
                key={item.name}
                style={{
                  border: '1px solid #ccc',
                  padding: '1rem',
                  borderRadius: '8px',
                  background: '#f9f9f9',
                  boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '180px',
                }}
              >
                {/* Nivel en la esquina superior derecha */}
                <div
                  style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    background: '#0066B3',
                    color: 'white',
                    padding: '5px 10px',
                    borderRadius: '5px',
                    fontSize: '12px',
                  }}
                >
                  {level}
                </div>
                {/* Imagen */}
                <img
                  src={item.url}
                  alt={item.name}
                  style={{ width: '60px', height: '60px', objectFit: 'cover', marginBottom: '10px' }}
                />
                {/* Precio con Ícono en la esquina inferior izquierda */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: '10px',
                    left: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                  }}
                >
                  <img
                    src="https://cdn.skymavis.com/ronin/2020/erc20/0xd61bbbb8369c46c15868ad9263a2710aced156c4/logo-transparent.png"
                    alt="Price Icon"
                    style={{ width: '20px', height: '20px' }}
                  />
                  <p
                    style={{
                      margin: '0',
                      fontSize: '14px',
                      color: isPriceZero ? 'red' : '#555',
                      textDecoration: isPriceZero ? 'line-through' : 'none',
                    }}
                  >
                    {isPriceZero ? '0.0000' : increasedPrice.toFixed(4)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default MarketItems;



