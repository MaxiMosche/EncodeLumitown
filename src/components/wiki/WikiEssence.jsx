import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Tooltip from './Tooltip';

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
  const [showButtons, setShowButtons] = useState(false);
  const location = useLocation();
  const itemRefs = useRef({});
  const handleToggleButtons = () => {
    console.log('selectedItem:', selectedItem.name); // Verificar valor de selectedItem
    if (selectedItem && selectedItem.name) {
      
      const itemName = selectedItem.name.toLowerCase();
  
      // Verificar si el nombre del ítem no contiene la palabra "essence"
      if (!itemName.includes("essence")) {
        window.open(`/drops?name=${encodeURIComponent(itemName)}`, '_blank');
      } else {
        console.log(itemName);
      }
    } else {
      console.log('No item selected or the item is missing an element property!');
    }
  
    setShowButtons(prevState => !prevState);
  };
  useEffect(() => {
    const originalBodyStyle = document.body.style.cssText;
    const urlParams = new URLSearchParams(location.search);
    const searchName = urlParams.get('name');
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

  useEffect(() => {
    console.log(location.search);
    if (location.search && getList.length > 0) {
      const searchName = new URLSearchParams(location.search).get('name');
      if (searchName) {
        const item = getList.find(item => item.result.toLowerCase() === searchName.toLowerCase());
        const itemId = item?.id; // Obtenemos el id del ítem encontrado
        console.log('itemId:', itemId); // Verifica el id del ítem
  
        if (itemId) {
          console.log('itemRefs.current:', itemRefs.current); // Verifica si todas las refs están correctamente asignadas
          console.log('itemRefs.current[itemId]:', itemRefs.current[itemId]); // Verifica el ref del ítem
  
          // Asegúrate de que el ref existe
          if (itemRefs.current[itemId]) {
            // Realiza el scroll
            itemRefs.current[itemId].scrollIntoView({
              behavior: 'smooth',
              block: 'center',
            });
  
            // Resalta la tarjeta si quieres
            itemRefs.current[itemId].style.backgroundColor = '#f0f0f0';
          } else {
            console.log('El ref no está asignado para el ítem con id:', itemId);
          }
        }
      }
    }
  }, [getList, location.search]);
  

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
  {groupedItems[type].map((item, index) => (
    <div
      key={item.id}
      ref={(el) => { itemRefs.current[item.id] = el }} 
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
      top: '350px',
      right: '0',
      transform: 'translateY(-50%)',
      width: '280px',
      background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.6))',
      color: 'white',
      padding: '20px',
      borderRadius: '15px', // Bordes más redondeados
      boxShadow: '0 6px 20px rgba(0, 0, 0, 0.8)', // Sombra más difusa y elegante
      zIndex: 1000,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      transition: 'all 0.3s ease', // Transición suave
      backdropFilter: 'blur(10px)', // Efecto de desenfoque en el fondo
    }}
  >
    <button
      onClick={() => setSelectedItem(null)} // Cerrar la pestaña
      style={{
        background: 'transparent',
        color: 'white',
        border: 'none',
        fontSize: '28px',
        cursor: 'pointer',
        position: 'absolute',
        top: '10px',
        right: '10px',
        transition: 'color 0.3s ease, transform 0.3s ease',
      }}
      onMouseOver={(e) => {
        e.target.style.color = '#ff6347';
        e.target.style.transform = 'scale(1.2)';
      }}
      onMouseOut={(e) => {
        e.target.style.color = 'white';
        e.target.style.transform = 'scale(1)';
      }}
    >
      ×
    </button>

    <h3
      style={{
        fontSize: '1.5rem', 
        marginBottom: '15px',
        textTransform: 'capitalize',
        letterSpacing: '1px',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        color: '#f0f0f0',
      }}
    >
      {selectedItem.name
        .trim()
        .replace(/\b\w/g, (char) => char.toUpperCase())}
    </h3>

    <div style={{ position: 'relative', width: '100%', height: 'auto' }}>
      <img
        src={getImageUrl(selectedItem.name)}
        alt={selectedItem.name}
        style={{
          width: '100%',
          height: 'auto',
          objectFit: 'cover',
          borderRadius: '10px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.6)', // Sombra alrededor de la imagen
        }}
      />
      
      {/* Buttons Container */}
      <div className={`buttons-container ${showButtons ? 'show' : ''}`} style={{ marginTop: '15px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <button
          className="find-button"
          onClick={handleToggleButtons}
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            color: 'white',
            border: 'none',
            padding: '10px',
            borderRadius: '8px',
            fontSize: '14px',
            textTransform: 'uppercase',
            cursor: 'pointer',
            transition: 'background-color 0.3s ease',
          }}
        >
          Where to find
        </button>
        <button
          className="find-button"
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            color: 'white',
            border: 'none',
            padding: '10px',
            borderRadius: '8px',
            fontSize: '14px',
            textTransform: 'uppercase',
            cursor: 'pointer',
            transition: 'background-color 0.3s ease',
          }}
        >
          Market (Coming Soon!)
        </button>
        <button
          className="find-button"
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            color: 'white',
            border: 'none',
            padding: '10px',
            borderRadius: '8px',
            fontSize: '14px',
            textTransform: 'uppercase',
            cursor: 'pointer',
            transition: 'background-color 0.3s ease',
          }}
        >
          Map (Coming Soon!)
        </button>
      </div>
    </div>
  </div>
)}
      {/* Mostrar tooltip */}
      <Tooltip visible={tooltip.visible} name={tooltip.name} x={tooltip.x} y={tooltip.y} />
    </div>
  );
};

export default WikiEssence;
