import React from 'react';

const Tooltip = ({ visible, name, x, y }) => {
  if (!visible) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: y,
        left: x,
        backgroundColor: '#333',
        color: '#fff',
        padding: '5px 10px',
        borderRadius: '5px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
        fontSize: '18px',
        fontWeight: 'bold',
      }}
    >
      {name}
    </div>
  );
};

export default Tooltip;