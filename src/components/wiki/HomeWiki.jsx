import { color } from 'chart.js/helpers';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Asegúrate de instalar react-router-dom

// Estilos en CSS-in-JS (para las tarjetas con imagen a la izquierda)
const styles = {
  container: {
    fontFamily: 'Comic Sans MS',
    textAlign: 'center',
    margin: 0,
    padding: 0,
    display: 'flex',
    flexDirection: 'column',
    color: 'white',
    minHeight: '100vh',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  mainContent: {
    padding: '50px 10px',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'rgba(9, 33, 67, 0.6)',
    alignItems: 'center',
    gap: '30px',
    width: '90%',
    borderRadius: '10px',
  },
  title: {
    fontSize: '3em',
    marginBottom: '30px',
    color: '#6b94b2',
  },
  cardContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '20px',
    width: '100%',
  },
  card: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: '0px',
    height:'200px',
    color:'white',
    border: '1px solid white',
    backgroundColor: 'rgba(16, 83, 138, 0.5)',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    transition: 'transform 0.3s ease',
    textAlign: 'left',
    cursor: 'pointer',
    width: '100%',
    maxWidth: '900px',
    boxSizing: 'border-box',
    overflow: 'hidden', 
  },
  cardImage: {
    width: '40%',        /* Se ajusta al 100% del ancho del contenedor */
    height: '100%',
    objectFit: 'cover',
    marginRight: '20px',
    maskImage: 'linear-gradient(to right, black 10%, transparent 100%)',
    WebkitMaskImage: 'linear-gradient(to right, black 10%, transparent 100%)'
  },
  cardText: {
    flex: 1,
    padding: '10px'
  },
  cardTitle: {
    fontSize: '1.8em',
    color: '#6b94b2',
    marginBottom: '10px',
  },
  cardDescription: {
    fontSize: '1.1em',
    color: 'white',
    lineHeight: '1.5',
  },
  cardHover: {
    transform: 'translateY(-5px)',
  },
};

// JSON con las tarjetas y las rutas de redirección
const cardData = {
  "cards": [
    {
      "id": 1,
      "image": "https://res.cloudinary.com/dm94dpmzy/image/upload/v1732079937/Armor_craft_gtshug.webp",
      "title": "Armor Crafting",
      "description": "Learn how to craft the strongest armors to protect yourself in the world of Lumiterra.",
      "redirect": "/wiki"
    },
    {
      "id": 2,
      "image": "https://res.cloudinary.com/dm94dpmzy/image/upload/v1732078838/Enrgy_craft_ykfuwx.webp",
      "title": "Energy Crafting",
      "description": "Discover the secrets of energy crafting and how to power your machines and tools.",
      "redirect": "/consumable"
    },
    {
      "id": 3,
      "image": "https://res.cloudinary.com/dm94dpmzy/image/upload/v1731986945/image_xvqpi5.png",
      "title": "Crafting Essence",
      "description": "Dive deep into the essence of crafting and learn how to combine magical elements to create powerful items.",
      "redirect": "/essence"
    },
    {
      "id": 4,
      "image": "https://res.cloudinary.com/dm94dpmzy/image/upload/v1730948391/GbdwJV0bIAAUf_s_e0xuin.webp",
      "title": "Guides",
      "description": "Explore comprehensive guides to help you master every aspect of Lumiterra crafting.",
      "redirect": "/homewiki"
    }
  ]
};

// Componente HomeWiki
const HomeWiki = () => {
  // Estado para almacenar las tarjetas
  const [cards, setCards] = useState([]);

  // Cargar datos del JSON al inicializar el componente
  useEffect(() => {

    // Cambiar el fondo e imagen de fondo del body
     // Cambia el color de fondo a blanco
     document.body.style.backgroundImage = 'url("https://res.cloudinary.com/dm94dpmzy/image/upload/v1730763154/fondohome_o4ofow.webp")'; // Establece la imagen de fondo
     document.body.style.backgroundSize = 'cover'; // Asegúrate de que la imagen cubra toda la pantalla
     document.body.style.backgroundAttachment = 'fixed'; // La imagen se quedará fija al hacer scroll
     document.body.style.backgroundPosition = 'center'; // Centra la imagen
// Crea un pseudo-elemento para aplicar el filtro oscuro
const style = document.createElement('style');
document.head.appendChild(style);

style.innerHTML = `
  body::after {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.4); /* Fondo oscuro con 40% de opacidad */
    z-index: -1; /* Asegura que esté por debajo del contenido */
  }
`;
    setCards(cardData.cards); // Guardamos las tarjetas en el estado
  }, []);

  return (
    
    <div style={styles.container}>
      <h2 style={styles.title}>LUMITERRA WIKI</h2>
      <main style={styles.mainContent}>
        {/* Card Container */}
        <div style={styles.cardContainer}>
          {cards.map((card) => (
            <Link to={card.redirect} key={card.id} style={{ textDecoration: 'none' }}>
              <div
                style={styles.card}
                onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <img
                  src={card.image}
                  alt={card.title}
                  style={styles.cardImage}
                />
                <div style={styles.cardText}>
                  <h3 style={styles.cardTitle}>{card.title}</h3>
                  <p style={styles.cardDescription}>{card.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
};

export default HomeWiki;
