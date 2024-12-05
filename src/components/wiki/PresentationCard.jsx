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
    const image = images.find(
      (img) => img.name.toLowerCase() === potionName.toLowerCase()
    );
    return image ? image.url : 'https://via.placeholder.com/80';
  };

  const getEmptyBottleImageUrl = () => {
    const emptyBottleImage = images.find(
      (img) => img.name.toLowerCase() === 'empty bottle'
    );
    return emptyBottleImage ? emptyBottleImage.url : 'https://via.placeholder.com/20';
  };

  // Función para alternar la visibilidad del contenido
  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div style={styles.container}>
      {/* Encabezado con botón toggle */}
      <div style={styles.header} onClick={toggleOpen}>
        <img
          src="https://res.cloudinary.com/dm94dpmzy/image/upload/v1732928973/Pngtreeblue_game_energy_lightning_material_4380766_vinfht.png"
          alt="Energy Icon"
          style={styles.headerIcon}
        />
        <h2 style={styles.headerTitle}>Energy Potions</h2>
        <img
          src={
            isOpen
              ? 'https://img.icons8.com/ios-filled/24/ffffff/collapse-arrow.png'
              : 'https://img.icons8.com/ios-filled/24/ffffff/expand-arrow.png'
          }
          alt="Toggle Icon"
          style={styles.chevronIcon}
        />
      </div>

      {/* Contenido de las pociones */}
      <div
        style={{
          ...styles.cardsContainer,
          maxHeight: isOpen ? '1000px' : '0',
          opacity: isOpen ? '1' : '0',
          padding: isOpen ? '20px' : '0 20px',
        }}
      >
        {potions.map((potion, index) => (
          <div key={index} style={styles.potionCard}>
            {/* Tarjeta para el título principal y la imagen */}
            <div style={styles.titleCard}>
              <img
                src={getPotionImageUrl(potion.nameitem)}
                alt={potion.nameitem}
                style={styles.mainPotionImage}
              />
              <h3 style={styles.potionName}>{potion.nameitem}</h3>
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
                  <img
                    src="https://res.cloudinary.com/dm94dpmzy/image/upload/v1732928973/Pngtreeblue_game_energy_lightning_material_4380766_vinfht.png"
                    alt="Energy Icon"
                    style={styles.energyIcon}
                  />
                  <span style={styles.energyText}>{potion.energyPerBottele}</span>
                  {activeEnergyTooltip === index && (
                    <div style={styles.tooltip}>Energy Per Bottle</div>
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
                    style={styles.quantityIcon}
                  />
                  <span style={styles.quantityText}>{potion.rangueCount}</span>
                  {activeQuantityTooltip === index && (
                    <div style={styles.tooltip}>Number Of Potion Bottles</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Estilos del componente */}
      <style jsx>{`
        @keyframes pulse {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.05);
            opacity: 0.8;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
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
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    color: '#fff',
    textAlign: 'center',
    borderRadius: '15px',
    boxShadow: '0px 8px 25px rgba(0, 0, 0, 0.3)',
    backdropFilter: 'blur(15px)',
    transition: 'all 0.3s ease',
    fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '15px 20px',
    cursor: 'pointer',
    userSelect: 'none',
    background: 'linear-gradient(135deg, #1e90ff, #00bfff)',
    borderTopLeftRadius: '15px',
    borderTopRightRadius: '15px',
    transition: 'background 0.3s ease',
  },
  headerIcon: {
    width: '30px',
    height: '30px',
    animation: 'pulse 2s infinite',
  },
  headerTitle: {
    fontSize: '1.5rem',
    margin: '0 10px',
    flexGrow: 1,
    textAlign: 'center',
    fontWeight: 'bold',
    textShadow: '1px 1px 3px rgba(0,0,0,0.5)',
  },
  chevronIcon: {
    width: '20px',
    height: '20px',
  },
  cardsContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
    gap: '15px',
    padding: '0 20px',
    overflow: 'hidden',
    transition: 'max-height 0.5s ease, opacity 0.5s ease, padding 0.5s ease',
  },
  potionCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    padding: '15px',
    borderRadius: '12px',
    boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.2)',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    textAlign: 'center',
    position: 'relative',
  },
  potionCardHover: {
    transform: 'scale(1.05)',
    boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.3)',
  },
  titleCard: {
    marginBottom: '10px',
  },
  potionName: {
    fontSize: '0.9rem',
    fontWeight: 'bold',
    marginTop: '8px',
    color: '#fff',
    textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
  },
  mainPotionImage: {
    width: '80px',
    height: '80px',
    objectFit: 'cover',
    borderRadius: '10px',
    transition: 'transform 0.3s ease',
  },
  potionDetails: {
    fontSize: '0.8rem',
    marginTop: '8px',
    color: '#d1d1d1',
  },
  flexContainer: {
    display: 'flex',
    justifyContent: 'space-around',
    marginTop: '8px',
  },
  energyCard: {
    backgroundColor: 'rgba(30, 144, 255, 0.9)',
    padding: '8px 12px',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    position: 'relative',
    transition: 'background-color 0.3s ease, transform 0.3s ease',
    boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.2)',
  },
  quantityCard: {
    backgroundColor: 'rgba(34, 139, 34, 0.9)',
    padding: '8px 12px',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    position: 'relative',
    transition: 'background-color 0.3s ease, transform 0.3s ease',
    boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.2)',
  },
  energyIcon: {
    width: '18px',
    height: '18px',
    marginRight: '6px',
  },
  quantityIcon: {
    width: '18px',
    height: '18px',
    marginRight: '6px',
  },
  energyText: {
    fontSize: '0.9rem',
    color: '#fff',
    fontWeight: 'bold',
  },
  quantityText: {
    fontSize: '0.9rem',
    color: '#fff',
    fontWeight: 'bold',
  },
  tooltip: {
    position: 'absolute',
    top: '-35px',
    left: '50%',
    transform: 'translateX(-50%)',
    backgroundColor: 'rgba(0,0,0,0.8)',
    color: '#fff',
    padding: '6px 10px',
    borderRadius: '8px',
    fontSize: '0.75rem',
    whiteSpace: 'nowrap',
    zIndex: 10,
    opacity: '0',
    animation: 'fadeIn 0.3s forwards',
  },
};

export default PresentationCard;
