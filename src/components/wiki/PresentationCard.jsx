import React, { useState } from 'react';

const potions = [
  {
    "nameitem": "Lv 1 energy restoration potion 2.0",
    "energyPerBottele": 4,
    "rangueCount": "3-4"
  },
  {
    "nameitem": "Lv 2 energy restoration potion 2.0",
    "energyPerBottele": 10,
    "rangueCount": "3"
  },
  {
    "nameitem": "Lv 3 energy restoration potion 2.0",
    "energyPerBottele": 17,
    "rangueCount": "3"
  },
  {
    "nameitem": "Lv 4 energy restoration potion 2.0",
    "energyPerBottele": 25,
    "rangueCount": "3"
  },
  {
    "nameitem": "Lv 5 energy restoration potion 2.0",
    "energyPerBottele": 34,
    "rangueCount": "3"
  },
  {
    "nameitem": "Lv 6 energy restoration potion 2.0",
    "energyPerBottele": 44,
    "rangueCount": "3"
  },
  {
    "nameitem": "Lv 7 energy restoration potion 2.0",
    "energyPerBottele": 55,
    "rangueCount": "3"
  },
  {
    "nameitem": "Lv 8 energy restoration potion 2.0",
    "energyPerBottele": 67,
    "rangueCount": "3"
  },
  {
    "nameitem": "Lv 9 energy restoration potion 2.0",
    "energyPerBottele": 80,
    "rangueCount": "3"
  }
];

const PresentationCard = ({ images }) => {
  // Estados para manejar los tooltips de energía y cantidad por poción
  const [activeEnergyTooltip, setActiveEnergyTooltip] = useState(null);  // Almacena el índice de la poción con el tooltip activo para energía
  const [activeQuantityTooltip, setActiveQuantityTooltip] = useState(null);  // Almacena el índice de la poción con el tooltip activo para cantidad

  // Función para obtener la URL de la imagen que corresponde al nombre de la poción
  const getPotionImageUrl = (potionName) => {
    const image = images.find((img) => img.name.toLowerCase() === potionName.toLowerCase());
    return image ? image.url : '';  // Si no hay imagen, retorna una cadena vacía
  };

  // Función para obtener la URL de la imagen "empty bottle"
  const getEmptyBottleImageUrl = () => {
    const emptyBottleImage = images.find((img) => img.name.toLowerCase() === "empty bottle");
    return emptyBottleImage ? emptyBottleImage.url : '';  // Si no hay imagen de botella vacía, retorna una cadena vacía
  };

  return (
    <div style={styles.container}>
      <div style={styles.cardsContainer}>
        {potions.map((potion, index) => (
          <div
            key={index}
            style={{ ...styles.potionCard, ':hover': styles.potionCardHover }}
          >
            {/* Tarjeta para el título principal y la imagen */}
            <div style={styles.titleCard}>
              <h3 style={styles.potionName}>{potion.nameitem}</h3>
              <img
                src={getPotionImageUrl(potion.nameitem)}  // Imagen de la poción
                alt={potion.nameitem}
                style={styles.mainPotionImage}  // Estilo para la imagen principal
              />
            </div>

            <div style={styles.potionDetails}>
              {/* Contenedor flex para las tarjetas de energía y cantidad */}
              <div style={styles.flexContainer}>
                {/* Card con el valor de energía */}
                <div
                  style={styles.energyCard}
                  onMouseEnter={() => setActiveEnergyTooltip(index)}  // Muestra el tooltip para esta poción
                  onMouseLeave={() => setActiveEnergyTooltip(null)}  // Oculta el tooltip
                >
                  <span style={styles.energyText}>{potion.energyPerBottele}</span>
                  <img
                    src="https://res.cloudinary.com/dm94dpmzy/image/upload/v1732928973/Pngtreeblue_game_energy_lightning_material_4380766_vinfht.png"
                    alt="Energy Icon"
                    style={styles.energyIcon}
                  />
                  {activeEnergyTooltip === index && (
                    <div style={styles.tooltip}>Energy per bottle</div>
                  )}
                </div>

                {/* Card con la cantidad */}
                <div
                  style={styles.quantityCard}
                  onMouseEnter={() => setActiveQuantityTooltip(index)}  // Muestra el tooltip para esta poción
                  onMouseLeave={() => setActiveQuantityTooltip(null)}  // Oculta el tooltip
                >
                  <img
                    src={getEmptyBottleImageUrl()}  // Imagen de la botella vacía
                    alt="Empty Bottle"
                    style={{ width: '30px', height: '30px', marginRight: '1px' }}  // Hicimos la botella más pequeña
                  />
                  <span style={styles.quantityText}>{potion.rangueCount}</span>
                  {activeQuantityTooltip === index && (
                    <div style={styles.tooltip}>Number of potions per crafting</div>
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

const styles = {
  container: {
    width: '85%',
    marginTop: '15px',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    color: '#fff',
    textAlign: 'center',
    padding: '20px 10px',
    borderRadius: '10px',
    margin: '0 auto',
    boxShadow: '0px 5px 10px rgba(0, 0, 0, 0.15)',
  },
  cardsContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
    gap: '12px',
    justifyItems: 'center',
  },
  potionCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: '10px',
    borderRadius: '8px',
    boxShadow: '0px 5px 10px rgba(0, 0, 0, 0.1)',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    textAlign: 'center',
    position: 'relative',
    maxWidth: '180px',
    margin: '0 auto',
  },
  potionCardHover: {
    transform: 'translateY(-5px)',
    boxShadow: '0px 8px 15px rgba(0, 0, 0, 0.1)',
  },
  titleCard: {
    width: '80%',
    margin: '0 auto',
    textAlign: 'center',
  },
  potionName: {
    fontSize: '1rem',
    fontWeight: 'bold',
    marginBottom: '4px',
    fontFamily: 'Comic Sans MS, sans-serif',
    color: '#333'
  },
  mainPotionImage: {
    width: '100%',
    height: 'auto',
    marginTop: '6px',
  },
  potionDetails: {
    fontSize: '0.75rem',
    margin: '4px 0',
    fontFamily: "'Arial', sans-serif",
    color: '#d1d1d1',
  },
  flexContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '6px',
  },
  energyCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    padding: '8px',
    borderRadius: '6px',
    display: 'inline-flex',
    alignItems: 'center',
    cursor: 'pointer',
    justifyContent: 'center',
    width: '60px',
    height: '25px',
    position: 'relative',
  },
  energyText: {
    fontSize: '1.1rem',
    color: '#333',
    marginRight: '1px',
  },
  energyIcon: {
    width: '30px',
    height: '30px',
  },
  quantityCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    padding: '8px',
    borderRadius: '6px',
    display: 'inline-flex',
    cursor: 'pointer',
    alignItems: 'center',
    justifyContent: 'center',
    width: '60px',
    height: '25px',
    position: 'relative',
  },
  quantityText: {
    fontSize: '1.2rem',
    color: '#333',
    marginRight: '1px',
  },
  tooltip: {
    position: 'absolute',
    top: '-25px',
    left: '50%',
    transform: 'translateX(-50%)',
    backgroundColor: '#333',
    color: '#fff',
    padding: '5px 10px',
    borderRadius: '4px',
    fontSize: '0.75rem',
    whiteSpace: 'nowrap',
  },
};

export default PresentationCard;
