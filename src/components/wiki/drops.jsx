import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import CryptoJS from 'crypto-js';
import { point } from 'leaflet';
import { BorderClear, BorderColor } from '@mui/icons-material';
import config from '../config'; 

//const secretKey = process.env.REACT_APP_AES_SECRET_KEY;
//const iv = process.env.REACT_APP_AES_IV;

const secretKey = "A9F1A8D0C8A5A6E6B0B9F1C1D6B9E3D1"; 
const iv = "B6D7A9F1C3E9A2F0";

const decryptData = (encryptedData) => {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedData, CryptoJS.enc.Utf8.parse(secretKey), {
      iv: CryptoJS.enc.Utf8.parse(iv),
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });

    const decryptedData = bytes.toString(CryptoJS.enc.Utf8);

    if (!decryptedData || decryptedData.trim() === '') {
      console.error("Datos desencriptados vacíos");
      return null;
    }

    const parsedData = JSON.parse(decryptedData);

    return parsedData;  
  } catch (error) {
    console.error("Error al desencriptar los datos:", error);
    return null;
  }
};

const fetchData = async () => {
  try {
    const firstPageResponse = await fetch(`${config.API_BASE_URL}/GetDrops`);
    const firstPageData = await firstPageResponse.json();

    const encryptedData = firstPageData.data;
    const decryptedData = decryptData(encryptedData);
    
    if (!decryptedData) {
      console.error("No se pudieron desencriptar los datos");
      return;
    }

    return decryptedData;
  } catch (error) {
    console.error("Error al obtener los datos:", error);
  }
};

const DropsCard = ({ drop, isSelected, onClick, cardRef }) => {
  const getTypeColor = (type) => {
    switch (type) {
      case 'livestock':
        return '#2409B3';
      case 'planting':
        return '#08A115';
      case 'combat':
        return '#B3090A';
      case 'gathering':
        return '#0888A1';
      default:
        return '#007BFF';
    }
  };

  const capitalizeWords = (str, maxLength) => {
    const capitalizedStr = str
      .split(' ') 
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) 
      .join(' ');
  
    if (capitalizedStr.length > maxLength) {
      return capitalizedStr.slice(0, maxLength - 3) + '...';
    }
  
    return capitalizedStr;
  };

  return (
    <div 
      ref={cardRef}
      style={{ 
        ...styles.card, 
        boxShadow: isSelected ? '0 0 10px 4px rgba(255, 255, 255, 0.7)' : 'none',
        borderColor: isSelected ? getTypeColor(drop.type) : '#ccc', // Resalta el borde si está seleccionado
      }} 
      onClick={onClick}
    >
      <img src={drop.url} alt={drop.dropName} style={styles.cardImg} />
      <div style={styles.cardBody}>
        <h5 style={styles.cardTitle}>{capitalizeWords(drop.dropName, 20)}</h5>
        <div style={{ ...styles.typeCard, backgroundColor: getTypeColor(drop.type) }}>
          <strong>{drop.type.toUpperCase()}</strong>
        </div>

        <div style={styles.mobGrid}>
          {drop.drops.map((mob, index) => (
            <div key={index} style={styles.mobCard}>
              <div style={styles.mobImageWrapper}>
                <img src={mob.url} alt={mob.nameMob} style={styles.mobImg} />
              </div>
              <h6 style={styles.mobName}>{mob.nameMob}</h6>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const DropsList = () => {
  const [drops, setDrops] = useState([]);
  const [selectedDrop, setSelectedDrop] = useState(null);
  const [filteredType, setFilteredType] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const nameFromUrl = queryParams.get('name');
  
  const cardRefs = useRef([]);

  useEffect(() => {
    fetchData().then((data) => {
      if (data) {
        const finalObject = {};

        data.forEach(drop => {
          if (!finalObject[drop.dropName]) {
            finalObject[drop.dropName] = { ...drop };
          } else {
            finalObject[drop.dropName].drops.push(...drop.drops);
          }
        });

        Object.keys(finalObject).forEach(dropName => {
          const drop = finalObject[dropName];
          drop.drops = drop.drops.filter(mob => mob.typeMob === drop.type);
        });

        const filteredDrops = Object.values(finalObject).filter(drop => drop.drops.length > 0);

        setDrops(filteredDrops); 
      }
    });

    document.body.style.backgroundColor = '#09132c'; 
    document.body.style.backgroundImage = 'url("https://res.cloudinary.com/dm94dpmzy/image/upload/v1731964105/wiki_home_sbsqrw.webp")';
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundPosition = 'center';
    document.body.style.backgroundAttachment = 'fixed';
    document.body.style.backgroundRepeat = 'no-repeat';
  }, []);

  useEffect(() => {
    if (nameFromUrl) {
      const dropToSelect = drops.find(drop => drop.dropName === nameFromUrl);
      if (dropToSelect) {
        setSelectedDrop(dropToSelect.dropName);

        const selectedCardIndex = drops.findIndex(drop => drop.dropName === nameFromUrl);
        if (cardRefs.current[selectedCardIndex]) {
          cardRefs.current[selectedCardIndex].scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    }
  }, [drops, nameFromUrl]);

  const handleCardClick = (dropName) => {
    if (selectedDrop === dropName) {
      setSelectedDrop(null);
    } else {
      setSelectedDrop(dropName);
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'livestock':
        return '#2409B3';
      case 'planting':
        return '#08A115';
      case 'combat':
        return '#B3090A';
      case 'gathering':
        return '#0888A1';
      default:
        return '#007BFF';
    }
  };

  const filteredDrops = drops.filter(drop => {
    const matchesType = filteredType ? drop.type.toLowerCase() === filteredType.toLowerCase() : true;
    const matchesName = drop.dropName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesName;
  });

  return (
    <div style={styles.container}>
      {/* Botón de Back */}
      <button 
        className="back-button" 
        onClick={() => navigate('/homewiki')} 
        style={styles.backButton}
      >
        &lt;
      </button>

      {/* Filtros */}
      <div style={styles.filters}>
        <div style={styles.selectWrapper}>
          <select
            value={filteredType}
            onChange={(e) => setFilteredType(e.target.value)}
            style={{
              ...styles.select,
              borderColor: getTypeColor(filteredType) || '#3498db', // Cambia el borde según el tipo seleccionado
              color: filteredType ? getTypeColor(filteredType) : '#333', // Cambia el color del texto según el tipo
            }}
          >
            <option value="">Filter by type</option>
            <option value="planting">Planting</option>
            <option value="gathering">Gathering</option>
            <option value="livestock">Livestock</option>
            <option value="combat">Combat</option>
          </select>
        </div>

        <input 
          type="text" 
          placeholder="Search by name..." 
          value={searchQuery} 
          onChange={(e) => setSearchQuery(e.target.value)} 
          style={styles.searchInput}
        />
      </div>

      {/* Contenedor de Drops */}
      <div style={styles.dropsContainer}>
        {filteredDrops.map((drop, index) => (
          <DropsCard 
            key={index} 
            drop={drop} 
            isSelected={selectedDrop === drop.dropName} 
            onClick={() => handleCardClick(drop.dropName)} 
            cardRef={(el) => cardRefs.current[index] = el}
          />
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: {
    position: 'relative',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center', // Asegura que los elementos hijos se centren horizontalmente
  },
  dropsContainer: {
    padding: '20px',
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: '20px', // Ajusta según tus necesidades
    margin: '0 auto',   // Centra el contenedor horizontalmente
  },
  card: {
    border: '2px solid #ccc', // Aumenté el grosor del borde para mejor visibilidad
    borderRadius: '8px',
    overflow: 'hidden',
    backgroundColor: 'rgba(51, 51, 51, 0.7)', // Aumenté la opacidad para mejor contraste
    color: 'white',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)', // Sombra más pronunciada
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    maxWidth: '250px',
    flex: '1 1 220px', // Permite que las tarjetas crezcan y se encojan responsivamente
    marginBottom: '20px',
    minWidth: '220px',
    transition: 'box-shadow 0.3s ease, border-color 0.3s ease',
    cursor: 'pointer', // Añadido para indicar que es clickeable
  },
  cardImg: {
    width: '100%',
    height: '150px',
    objectFit: 'contain',
    display: 'block',
    margin: '0 auto', // Fondo blanco para mejor contraste de la imagen
  },
  cardBody: {
    padding: '15px',
  },
  cardTitle: {
    fontSize: '1.25rem',
    marginBottom: '10px',
    fontWeight: 'bold',
    fontFamily: "'Comic Sans MS', cursive, sans-serif", // Fuente Comic Sans
  },
  typeCard: {
    color: 'white',
    padding: '5px 10px',
    borderRadius: '5px',
    marginBottom: '15px',
    textTransform: 'uppercase',
    fontWeight: 'bold',
    fontFamily: "'Comic Sans MS', cursive, sans-serif", // Fuente Comic Sans
  },
  mobGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: '10px',
  },
  mobCard: {
    textAlign: 'center',
    width: '80px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  mobImageWrapper: {
    width: '60px',
    height: '60px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#B3B3B3',
    borderRadius: '50%',
    overflow: 'hidden',
  },
  mobImg: {
    width: '50%',
    height: 'auto',
  },
  mobName: {
    fontSize: '0.9rem',
    marginTop: '5px',
    fontFamily: "'Comic Sans MS', cursive, sans-serif", // Fuente Comic Sans
  },
  backButton: {
    position: 'absolute', // Posicionamiento absoluto
    left: '15px', // 15px desde la izquierda
    top: '20px', // Ajusta según sea necesario
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    color: 'white',
    width: '50px',
    height: '50px',
    border: '1px solid white',
    fontSize: '30px', // Reducido para mejor proporción
    cursor: 'pointer',
    borderRadius: '50%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    transition: 'background-color 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease',
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.8)', // Sombra más pronunciada y difusa
    zIndex: '20', // Asegura que esté por encima de otros elementos
  },
  filtersWrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',  // Hacer que se centren verticalmente en toda la pantalla
    position: 'absolute',
    top: '0',
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: '10',
    width: '100%',
    padding: '20px',
    boxSizing: 'border-box',
  },
  filters: {
    display: 'flex',
    marginTop: '0',
    marginBottom: '20px', // Ajuste para separar del botón de back
    justifyContent: 'center',
    alignItems: 'center',
    gap: '20px',
    padding: '10px 20px',
    backgroundColor: 'rgba(0, 0, 0, 0.6)', 
    borderRadius: '15px',
    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.8)',
    transition: 'all 0.3s ease',
  },
  select: {
    padding: '10px 15px',
    fontSize: '16px',
    width: '200px',
    backgroundColor: 'white',  // Fondo blanco
    color: '#333',  // Texto oscuro
    border: '2px solid #3498db', // Borde azul por defecto
    borderRadius: '5px',
    outline: 'none',  // Remueve el contorno predeterminado
    transition: 'border-color 0.3s ease, background-color 0.3s ease',
    appearance: 'none',  // Elimina la flecha en la mayoría de los navegadores
    WebkitAppearance: 'none', // Para Chrome/Safari
    MozAppearance: 'none',  // Para Firefox
    position: 'relative',  // Necesario para colocar un icono si lo deseas
    cursor: 'pointer',
    textAlign: 'left',
    fontFamily: "'Comic Sans MS', cursive, sans-serif", // Fuente Comic Sans
    backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,<svg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 4 5\'><path fill=\'%23333\' d=\'M2 0L0 2h4L2 0zm0 5L0 3h4L2 5z\'/></svg>")',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 10px center',
    backgroundSize: '8px 10px',
  },
  searchInput: {
    padding: '10px 15px',
    fontSize: '16px',
    width: '200px',
    backgroundColor: 'transparent',
    color: 'white',
    border: '2px solid #fff',
    borderRadius: '5px',
    transition: 'border-color 0.3s ease',
    outline: 'none',
    fontFamily: "'Comic Sans MS', cursive, sans-serif", // Fuente Comic Sans
  },
};

export default DropsList;
