import React, { useState, useEffect } from 'react';

const ResponsiveTitle = ({ text }) => {
  const [fontSize, setFontSize] = useState('32px'); 
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const updateFontSize = () => {
      const width = window.innerWidth;
      if (width > 1130) {
        setFontSize('42px');
      } else if (width <= 1130 && width > 900) {
        setFontSize('32px');
      } else if (width <= 900 && width > 730) {
        setFontSize('28px');
      } else {
        setFontSize('24px');
      }
    };

    updateFontSize();
    window.addEventListener('resize', updateFontSize);
    
    // Animación de aparición
    setVisible(true);

    return () => window.removeEventListener('resize', updateFontSize);
  }, []);

  return (
    <h1 style={{
      textAlign: 'left',
      color: '#FFFFFF',
      paddingLeft: '20px',
      paddingRight: '20px',
      marginBottom: '20px',
      marginTop: '10px',
      fontSize,
      fontWeight: '700',
      fontFamily: "'Comic Sans MS', cursive, sans-serif", // Cambiado a fuente cómic
      textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
      transition: 'font-size 0.3s ease-in-out, color 0.3s ease-in-out, opacity 1s ease-in-out',
      background: 'linear-gradient(90deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))',
      borderRadius: '8px',
      padding: '10px 20px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      opacity: visible ? 1 : 0,
    }}>
      {text}
    </h1>
  );
};

export default ResponsiveTitle;
