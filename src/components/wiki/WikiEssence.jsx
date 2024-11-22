import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Tooltip from './Tooltip'; // Importar el componente Tooltip

const ItemCard = ({ item, onMouseEnter, onMouseLeave, onClick }) => {
  return (
    <div
      style={{
        position: 'relative',
        width: '60px',
        height: '60px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        borderRadius: '5px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        transition: 'transform 0.3s ease',
        margin: '10px',
        cursor: 'pointer',
      }}
      onMouseEnter={(e) => onMouseEnter(item, e)}
      onMouseLeave={(e) => onMouseLeave(e)}
      onClick={() => onClick(item)} // Maneja el clic en el ítem
    >
      <img
        src={item.imageUrl}
        alt={item.name}
        style={{
          width: '40px',
          height: '40px',
          objectFit: 'cover',
          borderRadius: '5px',
        }}
      />
      <span
        style={{
          position: 'absolute',
          bottom: '0',
          right: '0',
          fontSize: '13px',
          color: '#fff',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          padding: '2px 5px',
          borderRadius: '3px',
        }}
      >
        {item.quantity}
      </span>
    </div>
  );
};

const WikiEssence = () => {
  const [getList, setGetList] = useState([]);
  const [urlList, setUrlList] = useState([]);
  const [tooltip, setTooltip] = useState({ visible: false, name: '', x: 0, y: 0 });
  const [hoveredItem, setHoveredItem] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null); // Nuevo estado para el ítem seleccionado

  useEffect(() => {
    const originalBodyStyle = document.body.style.cssText;

    document.body.style.backgroundColor = '#09132c'; 
    document.body.style.backgroundImage = 'url("https://res.cloudinary.com/dm94dpmzy/image/upload/v1731964105/wiki_home_sbsqrw.webp")';
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundPosition = 'center';
    document.body.style.backgroundAttachment = 'fixed';
    document.body.style.backgroundRepeat = 'no-repeat';

    const fetchGetList = async () => {
      try {
        const response = await fetch('https://www.lumitown.somee.com/GetListRepiceEssence');
        const data = await response.json();
        setGetList(data);
      } catch (error) {
        console.error('Error fetching GetList:', error);
      }
    };

    const fetchUrlList = async () => {
      try {
        const response = await fetch('https://www.lumitown.somee.com/GetUrlEssence');
        const data = await response.json();
        setUrlList(data);
      } catch (error) {
        console.error('Error fetching GetUrlEssence:', error);
      }
    };

    fetchGetList();
    fetchUrlList();

    return () => {
      document.body.style.cssText = originalBodyStyle;
    };
  }, []);

  const getImageUrl = (name) => {
    const urlObj = urlList.find(item => item.name === name);
    return urlObj ? urlObj.url : '';
  };

  const groupAndSortItems = () => {
    const sortedList = getList.sort((a, b) => a.tier - b.tier || a.type.localeCompare(b.type));

    const grouped = {};
    sortedList.forEach(item => {
      if (!grouped[item.type]) {
        grouped[item.type] = [];
      }
      grouped[item.type].push(item);
    });

    return grouped;
  };

  const groupedItems = groupAndSortItems();

  const handleMouseEnter = (item, e) => {
    const { clientX, clientY } = e;
    const formattedName = item.name
      .trim()
      .replace(/\b\w/g, (char) => char.toUpperCase());
    setTooltip({
      visible: true,
      name: formattedName,
      x: clientX + 10,
      y: clientY + 10,
    });
    setHoveredItem(item);
  };

  const handleMouseLeave = () => {
    setTooltip({
      visible: false,
      name: '',
      x: 0,
      y: 0,
    });
    setHoveredItem(null);
  };

  const handleItemClick = (item) => {
    setSelectedItem(item); // Cambiar el ítem seleccionado al hacer clic
  };

  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate('/homewiki');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px' }}>
      <button
        onClick={handleGoBack}
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.4)',
          color: 'white',
          width: '60px',
          height: '60px',
          border: 'none',
          padding: '0px',
          fontSize: '40px',
          cursor: 'pointer',
          borderRadius: '50%',
          display: 'inline-block',
          position: 'absolute',
          top: '80px',
          left: '20px',
          transition: 'background-color 0.3s ease, transform 0.3s ease, color 0.3s ease',
        }}
        onMouseOver={(e) => {
          e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.6)';
          e.target.style.color = 'white';
          e.target.style.transform = 'scale(1.1)';
        }}
        onMouseOut={(e) => {
          e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.4)';
          e.target.style.color = 'white';
          e.target.style.transform = 'scale(1)';
        }}
      >
        &lt;
      </button>

      {Object.keys(groupedItems).map((type) => (
        <div key={type} style={{ marginBottom: '40px', width: '100%' }}>
          <h2
            style={{
              fontSize: '2.5em',
              marginBottom: '20px',
              color: 'white',
              fontFamily: 'Comic Sans MS',
              textAlign: 'center',
            }}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
            {groupedItems[type].map((item) => (
              <div
                key={item.id}
                style={{
                  position: 'relative',
                  width: '230px',
                  maxHeight: '300px',
                  margin: '20px',
                  textAlign: 'center',
                  border: '1px solid #ccc',
                  borderRadius: '8px',
                  padding: '20px',
                  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
                  backgroundColor: 'rgba(255, 255, 255, 0.3)',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05)';
                  e.currentTarget.style.boxShadow = '0 0 30px rgba(255, 255, 255, 0.7)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.1)';
                }}
              >
                <img
                  src="https://res.cloudinary.com/dm94dpmzy/image/upload/v1731988957/Linea_yakc2q.png"
                  alt={item.result}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '99%',
                    height: '99%',
                    objectFit: 'cover',
                    borderRadius: '8px',
                    zIndex: -1,
                  }}
                />
                <img
                  src={getImageUrl(item.result)}
                  alt={item.result}
                  style={{
                    width: '100px',
                    height: '100px',
                    objectFit: 'contain',
                    marginBottom: '20px',
                    zIndex: 1,
                  }}
                />
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-around',
                    flexWrap: 'wrap',
                    paddingTop: '30px',
                  }}
                >
                  {item.crafting.map((craftItem, index) => {
                    const imageUrl = getImageUrl(craftItem.element);
                    return (
                      <ItemCard
                        key={index}
                        item={{
                          imageUrl: imageUrl,
                          name: craftItem.element,
                          quantity: craftItem.quantity,
                        }}
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                        onClick={handleItemClick} // Agregar evento de clic
                      />
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Mostrar la pestaña lateral con el ítem seleccionado */}
      {selectedItem && (
  <div
    style={{
      position: 'fixed',
      top: '250px',
      right: '0',
      transform: 'translateY(-50%)',
      width: '250px',
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      color: 'white',
      padding: '20px',
      borderRadius: '8px 0 0 8px',
      boxShadow: '0 4px 10px rgba(0, 0, 0, 0.5)',
      zIndex: 1000, // Asegúrate de que esté encima de otros elementos
    }}
  >
    <button
      onClick={() => setSelectedItem(null)} // Cerrar la pestaña
      style={{
        position: 'absolute',
        top: '10px',
        right: '10px',
        background: 'transparent',
        border: 'none',
        color: 'white',
        fontSize: '20px',
        cursor: 'pointer',
      }}
    >
      ×
    </button>

    <h3>
      {selectedItem.name
        .trim()
        .replace(/\b\w/g, (char) => char.toUpperCase())}
    </h3>
    <img
      src={getImageUrl(selectedItem.name)}
      alt={selectedItem.name}
      style={{
        width: '100%',
        height: 'auto',
        objectFit: 'contain',
        borderRadius: '5px',
      }}
    />
  </div>
)}
      {/* Mostrar tooltip */}
      <Tooltip visible={tooltip.visible} name={tooltip.name} x={tooltip.x} y={tooltip.y} />
    </div>
  );
};

export default WikiEssence;
