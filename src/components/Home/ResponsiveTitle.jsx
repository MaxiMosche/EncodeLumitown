import React, { useState, useEffect } from 'react';

const ResponsiveTitle = ({ text }) => {
  const [fontSize, setFontSize] = useState('32px'); 

  useEffect(() => {
    const updateFontSize = () => {
      const width = window.innerWidth;
      if (width > 1130) {
        setFontSize('42px');
      } else if (width <= 1130 && width > 900) {
        setFontSize('20px');
      } else if (width <= 900 && width > 730) {
        setFontSize('24px');
      } else {
        setFontSize('20px');
      }
    };

    updateFontSize();
    window.addEventListener('resize', updateFontSize);
    return () => window.removeEventListener('resize', updateFontSize);
  }, []);

  return (
    <h1 style={{
      textAlign: 'left', 
      color: 'white', 
      paddingLeft: '20px', 
      marginBottom: '20px', 
      marginTop: '10px', 
      fontSize, 
      fontWeight: 'bold' // Aquí se agrega el estilo en negrita
    }}>
      {text}
    </h1>
  );
};

export default ResponsiveTitle;