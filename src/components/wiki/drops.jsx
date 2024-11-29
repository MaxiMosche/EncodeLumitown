import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import CryptoJS from 'crypto-js';

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
    const firstPageResponse = await fetch('https://lumitownserver.somee.com/GetDrops');
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
  // Función para determinar el color del tipo
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

  // Función para capitalizar la primera letra de cada palabra
  const capitalizeWords = (str, maxLength) => {
    // Capitalizar las palabras
    const capitalizedStr = str
      .split(' ') // Dividir la cadena en palabras
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitalizar la primera letra
      .join(' '); // Volver a unir las palabras
    
    // Truncar la cadena si es necesario
    if (capitalizedStr.length > maxLength) {
      return capitalizedStr.slice(0, maxLength - 3) + '...';
    }
  
    return capitalizedStr;
  };

  return (
    <div 
      ref={cardRef}
      style={{ ...styles.card, boxShadow: isSelected ? '0 0 10px 4px rgba(255, 255, 255, 0.7)' : 'none' }} 
      onClick={onClick}
    >
      <img src={drop.url} alt={drop.dropName} style={styles.cardImg} />
      <div style={styles.cardBody}>
        <h5 style={styles.cardTitle}>{capitalizeWords(drop.dropName, 20)}</h5> {/* Aplicar la función capitalizeWords */}
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

const truncateString = (str, maxLength) => {
  if (str.length > maxLength) {
    return str.slice(0, maxLength - 3) + '...';
  }
  return str;
};

const DropsList = () => {
  const [drops, setDrops] = useState([]);
  const [selectedDrop, setSelectedDrop] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();  // Obtén el objeto location de la URL
  const queryParams = new URLSearchParams(location.search);
  const nameFromUrl = queryParams.get('name');
  
  // Crear una referencia para cada tarjeta
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

    // Cambiar el fondo de la página
    document.body.style.backgroundImage = '';
    document.body.style.backgroundColor = '#404040';
  }, []);

  useEffect(() => {
    if (nameFromUrl) {
      const dropToSelect = drops.find(drop => drop.dropName === nameFromUrl);
      if (dropToSelect) {
        setSelectedDrop(dropToSelect.dropName);  // Establecer la tarjeta seleccionada

        // Desplazar automáticamente hacia la tarjeta seleccionada
        const selectedCardIndex = drops.findIndex(drop => drop.dropName === nameFromUrl);
        if (cardRefs.current[selectedCardIndex]) {
          cardRefs.current[selectedCardIndex].scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    }
  }, [drops, nameFromUrl]);

  const handleCardClick = (dropName) => {
    if (selectedDrop === dropName) {
      setSelectedDrop(null);  // Si ya está seleccionado, lo deseleccionamos
    } else {
      setSelectedDrop(dropName);  // Seleccionar la tarjeta
    }
  };

  return (
    <div style={styles.container}>
      <button 
        className="back-button" 
        onClick={() => navigate('/homewiki')} 
        style={styles.backButton}
      >
        &lt;
      </button>

      <div style={styles.dropsContainer}>
        {drops.map((drop, index) => (
          <DropsCard 
            key={index} 
            drop={drop} 
            isSelected={selectedDrop === drop.dropName} 
            onClick={() => handleCardClick(drop.dropName)} 
            cardRef={(el) => cardRefs.current[index] = el} // Asignar el ref de cada tarjeta
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
  },
  dropsContainer: {
    padding: '20px',
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: '20px',
  },
  card: {
    border: '1px solid #ccc',
    borderRadius: '8px',
    overflow: 'hidden',
    backgroundColor: '#333',
    color: 'white',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    maxWidth: '250px',
    flex: '1 1 calc(33.33% - 20px)',
    marginBottom: '20px',
    minWidth: '220px',
    transition: 'box-shadow 0.3s ease',
  },
  cardImg: {
    width: '100%',
    height: '150px',
    objectFit: 'contain',
    display: 'block',
    margin: '0 auto',
  },
  cardBody: {
    padding: '15px',
  },
  cardTitle: {
    fontSize: '1.25rem',
    marginBottom: '10px',
    fontWeight: 'bold',
  },
  typeCard: {
    color: 'white',
    padding: '5px 10px',
    borderRadius: '5px',
    marginBottom: '15px',
    textTransform: 'uppercase',
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
  },
  backButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    color: 'white',
    marginLeft: '20px',
    marginTop: '20px',
    width: '60px',
    height: '60px',
    border: 'none',
    fontSize: '40px',
    cursor: 'pointer',
    borderRadius: '50%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    transition: 'background-color 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease',
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.8)', // Sombra más pronunciada y difusa
  },
};

export default DropsList;
