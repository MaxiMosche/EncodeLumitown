// PresentationCard.jsx
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const potions = [
  {
    nameitem: 'Lv 1 energy restoration potion 2.0',
    energyPerBottele: 4,
    rangueCount: '3-4',
  },
  {
    nameitem: 'Lv 2 energy restoration potion 2.0',
    energyPerBottele: 10,
    rangueCount: '3',
  },
  {
    nameitem: 'Lv 3 energy restoration potion 2.0',
    energyPerBottele: 17,
    rangueCount: '3',
  },
  {
    nameitem: 'Lv 4 energy restoration potion 2.0',
    energyPerBottele: 25,
    rangueCount: '3',
  },
  {
    nameitem: 'Lv 5 energy restoration potion 2.0',
    energyPerBottele: 34,
    rangueCount: '3',
  },
  {
    nameitem: 'Lv 6 energy restoration potion 2.0',
    energyPerBottele: 44,
    rangueCount: '3',
  },
  {
    nameitem: 'Lv 7 energy restoration potion 2.0',
    energyPerBottele: 55,
    rangueCount: '3',
  },
  {
    nameitem: 'Lv 8 energy restoration potion 2.0',
    energyPerBottele: 67,
    rangueCount: '3',
  },
  {
    nameitem: 'Lv 9 energy restoration potion 2.0',
    energyPerBottele: 80,
    rangueCount: '3',
  },
];

const PresentationCard = ({ images }) => {
  const [activeEnergyTooltip, setActiveEnergyTooltip] = useState(null);
  const [activeQuantityTooltip, setActiveQuantityTooltip] = useState(null);
  const [isOpen, setIsOpen] = useState(false); // Estado para alternar la visibilidad

  // Funciones para obtener URLs de imágenes
  const getPotionImageUrl = (potionName) => {
    if (!images || !Array.isArray(images)) {
      console.warn('La prop "images" no está definida o no es un arreglo.');
      return '';
    }
    const image = images.find(
      (img) => img.name.toLowerCase() === potionName.toLowerCase()
    );
    return image ? image.url : '';
  };

  const getEmptyBottleImageUrl = () => {
    if (!images || !Array.isArray(images)) {
      console.warn('La prop "images" no está definida o no es un arreglo.');
      return '';
    }
    const emptyBottleImage = images.find(
      (img) => img.name.toLowerCase() === 'empty bottle'
    );
    return emptyBottleImage ? emptyBottleImage.url : '';
  };

  // Función para alternar la visibilidad del contenido
  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  // Inserción de la animación 'pulse' una sola vez
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const styleSheet = document.styleSheets[0];
      const pulseAnimation = `
        @keyframes pulse {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.8;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
      `;
      // Verificar si la animación ya existe
      const pulseExists = Array.from(styleSheet.cssRules).some(
        (rule) => rule.type === CSSRule.KEYFRAMES_RULE && rule.name === 'pulse'
      );
      if (!pulseExists) {
        styleSheet.insertRule(pulseAnimation, styleSheet.cssRules.length);
      }
    }
  }, []);

  return (
    <div style={styles.container}>
      {/* Botón para alternar la visibilidad con diseño mejorado */}
      {isOpen && (
        <button
          style={{
            ...styles.toggleButton,
            backgroundColor: isOpen ? 'rgba(30, 144, 255, 0.9)' : '#333',
            transform: isOpen ? 'scale(1.05)' : 'scale(1)',
          }}
          onClick={toggleOpen}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = isOpen ? 'rgba(30, 144, 255, 1)' : '#555';
            e.currentTarget.style.transform = 'scale(1.07)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = isOpen ? 'rgba(30, 144, 255, 0.9)' : '#333';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          {/* Contenido Condicional */}
          {isOpen ? (
            <div style={styles.toggleContainer}>
              <span style={styles.toggleIcon}>🔼</span>
              <span>Hide Potions</span>
            </div>
          ) : null}
        </button>
      )}
      {/* Encabezado cuando la tarjeta está cerrada */}
      {!isOpen && (
        <div style={styles.closedHeader} onClick={toggleOpen}>
          <img
            src="https://res.cloudinary.com/dm94dpmzy/image/upload/v1732928973/Pngtreeblue_game_energy_lightning_material_4380766_vinfht.png"
            alt="Energy Icon"
            style={styles.headerIcon}
          />
          <h2 style={styles.headerTitle}>Energy Potions</h2>
        </div>
      )}

      {/* Contenido de las pociones con animaciones */}
      <div
        style={{
          ...styles.cardsContainer,
          maxHeight: isOpen ? '1000px' : '0', // Aumentado para acomodar tarjetas más grandes
          opacity: isOpen ? '1' : '0',
          transition: 'max-height 0.5s ease, opacity 0.5s ease',
        }}
      >
        {potions.map((potion, index) => (
          <div key={index} style={styles.potionCard}>
            {/* Tarjeta para el título principal y la imagen */}
            <div style={styles.titleCard}>
              <h3 style={styles.potionName}>{potion.nameitem}</h3>
              <img
                src={getPotionImageUrl(potion.nameitem)}
                alt={potion.nameitem}
                style={styles.mainPotionImage}
              />
            </div>

            <div style={styles.potionDetails}>
              {/* Contenedor flex para las tarjetas de energía y cantidad */}
              <div style={styles.flexContainer}>
                {/* Card con el valor de energía */}
                <div
                  style={styles.energyCard}
                  onMouseEnter={() => setActiveEnergyTooltip(index)}
                  onMouseLeave={() => setActiveEnergyTooltip(null)}
                >
                  <span style={styles.energyText}>
                    {potion.energyPerBottele}
                  </span>
                  <img
                    src="https://res.cloudinary.com/dm94dpmzy/image/upload/v1732928973/Pngtreeblue_game_energy_lightning_material_4380766_vinfht.png"
                    alt="Energy Icon"
                    style={styles.energyIcon}
                  />
                  {activeEnergyTooltip === index && (
                    <div style={styles.tooltip}>Amount of energy per bottle</div>
                  )}
                </div>

                {/* Card con la cantidad */}
                <div
                  style={styles.quantityCard}
                  onMouseEnter={() => setActiveQuantityTooltip(index)}
                  onMouseLeave={() => setActiveQuantityTooltip(null)}
                >
                  <img
                    src={getEmptyBottleImageUrl()}
                    alt="Empty Bottle"
                    style={styles.emptyBottleIcon}
                  />
                  <span style={styles.quantityText}>{potion.rangueCount}</span>
                  {activeQuantityTooltip === index && (
                    <div style={styles.tooltip}>Number of potion bottles</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Definición de PropTypes
PresentationCard.propTypes = {
  images: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
    })
  ),
};

// Valores predeterminados para props
PresentationCard.defaultProps = {
  images: [], // Establece un arreglo vacío si no se pasa 'images'
};

// Estilos del componente
const styles = {
  container: {
    width: '90%',
    margin: '20px auto',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    color: '#fff',
    textAlign: 'center',
    padding: '25px 15px',
    borderRadius: '20px',
    boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.3)',
    position: 'relative',
    fontFamily: 'Arial, sans-serif',
    backdropFilter: 'blur(10px)',
  },
  toggleButton: {
    backgroundColor: '#333',
    color: '#fff',
    border: 'none',
    padding: '12px 25px',
    borderRadius: '25px',
    cursor: 'pointer',
    fontSize: '1.1rem',
    marginBottom: '25px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background-color 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease',
    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
  },
  toggleIcon: {
    marginRight: '10px',
    fontSize: '1.4rem',
  },
  closedHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '25px',
    padding: '15px 25px',
    background: 'linear-gradient(135deg, #1e90ff, #00bfff)',
    borderRadius: '35px',
    boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.2)',
    transition: 'transform 0.3s ease',
    cursor: 'pointer',
  },
  headerIcon: {
    width: '50px',
    height: '50px',
    marginRight: '15px',
    animation: 'pulse 2s infinite',
  },
  headerTitle: {
    fontSize: '1.8rem',
    color: '#fff',
    fontFamily: '"Comic Sans MS", cursive, sans-serif',
    textShadow: '1px 1px 2px rgba(0, 0, 0, 0.3)',
  },
  cardsContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '25px',
    justifyItems: 'center',
    overflow: 'hidden',
  },
  potionCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: '15px',
    borderRadius: '20px',
    boxShadow: '0px 6px 20px rgba(0, 0, 0, 0.2)',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    textAlign: 'center',
    position: 'relative',
    maxWidth: '220px',
    width: '100%',
  },
  titleCard: {
    width: '100%',
    margin: '0 auto',
    textAlign: 'center',
  },
  potionName: {
    fontSize: '0.8rem',
    fontWeight: 'bold',
    marginBottom: '8px',
    fontFamily: '"Comic Sans MS", cursive, sans-serif',
    color: '#fff',
    textShadow: '1px 1px 2px rgba(0, 0, 0, 0.3)',
  },
  mainPotionImage: {
    width: '100%',
    height: 'auto',
    marginTop: '8px',
    borderRadius: '12px',
    transition: 'transform 0.3s ease',
  },
  potionDetails: {
    fontSize: '0.8rem',
    margin: '8px 0',
    color: '#d1d1d1',
  },
  flexContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '8px',
  },
  energyCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: '6px 10px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    position: 'relative',
    transition: 'background-color 0.3s ease, transform 0.3s ease',
    boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)',
  },
  quantityCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: '6px 10px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    position: 'relative',
    transition: 'background-color 0.3s ease, transform 0.3s ease',
    boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)',
  },
  energyText: {
    fontSize: '1rem',
    color: '#1e90ff',
    marginRight: '6px',
    fontWeight: 'bold',
  },
  quantityText: {
    fontSize: '1rem',
    color: '#1e90ff',
    marginLeft: '6px',
    fontWeight: 'bold',
  },
  energyIcon: {
    width: '20px',
    height: '20px',
  },
  emptyBottleIcon: {
    width: '20px',
    height: '20px',
  },
  tooltip: {
    position: 'absolute',
    top: '-35px',
    left: '50%',
    transform: 'translateX(-50%)',
    backgroundColor: '#333',
    color: '#fff',
    padding: '6px 12px',
    borderRadius: '8px',
    fontSize: '0.8rem',
    whiteSpace: 'nowrap',
    zIndex: 10,
    opacity: '1',
    transition: 'opacity 0.3s ease',
    pointerEvents: 'none',
  },
};

export default PresentationCard;
