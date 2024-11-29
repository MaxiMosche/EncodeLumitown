import React, { useState, useEffect } from 'react';

// Función para convertir de Wei a Ether
const weiToEther = (wei) => {
  return (parseInt(wei) / Math.pow(10, 18)).toFixed(4);
};

const styles = {
  marketInfo: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    width: '100%',
    height: '75%',
    backgroundColor: 'white',
    borderRadius: '20px 20px 0 0',
    overflowY: 'hidden',
    transform: 'translateY(100%)',
    transition: 'transform 0.3s ease-in-out',
    boxShadow: '0px -5px 15px rgba(0, 0, 0, 0.2)',
    display: 'flex',
  },
  open: {
    transform: 'translateY(0)',
  },
  marketInfoHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px',
    backgroundColor: '#f5f5f5',
    borderRadius: '20px 20px 0 0',
  },
  closeButtonContainer: {
    position: 'absolute',
    top: '16px',
    right: '16px',
    zIndex: 10,
  },
  closeButton: {
    background: 'none',
    border: 'none',
    fontSize: '24px',
    cursor: 'pointer',
  },
  marketInfoContent: {
    padding: '16px',
    overflowY: 'auto',
    width: '50%', // La mitad de la pantalla para el ítem principal
    position: 'relative', // Necesario para colocar el botón "Marker Mavis" en la parte inferior derecha
  },
  additionalItems: {
    width: '50%', // La otra mitad para los ítems adicionales
    padding: '16px',
    borderLeft: '1px solid #ddd',
    overflowY: 'auto',
  },
  itemImage: {
    width: '80px',  // Imagen pequeña
    height: '80px',
    objectFit: 'contain',
    borderRadius: '8px',
    marginBottom: '10px',
  },
  itemDetails: {
    marginTop: '16px',
  },
  attributeContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '20px', // Añadido espacio entre las columnas
  },
  attributeColumn: {
    width: '48%', // Para que haya un pequeño margen entre las columnas
  },
  attribute: {
    fontSize: '14px',
    marginBottom: '8px',
  },
  attributeBold: {
    fontWeight: 'bold',
  },
  additionalItemContainer: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: '16px',
    paddingBottom: '16px',
    borderBottom: '1px solid #ddd',
    alignItems: 'center',
    position: 'relative', // Necesario para colocar el botón "Marker Mavis" en la parte inferior derecha
  },
  additionalItemImage: {
    width: '80px',  // Imagen pequeña para los ítems adicionales
    height: '80px',
    objectFit: 'contain',
    borderRadius: '8px',
    marginRight: '10px', // Espacio entre la imagen y los detalles
  },
  additionalItemName: {
    fontWeight: 'bold',
    fontSize: '16px',
    marginBottom: '8px',
  },
  additionalItemPrice: {
    fontSize: '14px',
    color: '#888',
  },
  loading: {
    textAlign: 'center',
    marginTop: '20px',
  },
  error: {
    textAlign: 'center',
    marginTop: '20px',
  },
  minicard: {
    backgroundColor: '#f9f9f9',
    width: '200px',
    padding: '12px',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    marginBottom: '12px',
    transition: 'box-shadow 0.2s ease-in-out',
  },
  minicardHover: {
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
  },
  minicardContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  minicardLabel: {
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#555',
  },
  minicardValue: {
    fontSize: '14px',
    color: '#333',
  },
  buttonMarkerMavis: {
    backgroundColor: '#007BFF',
    color: 'white',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px',
    marginBottom: '16px',  // Añadido margen para separar del filtro
  },
  buttonMarkerMavisAdditional: {
    position: 'absolute',
    bottom: '10px',
    right: '10px',
    backgroundColor: '#007BFF',
    color: 'white',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px',
  },
  filterCard: {
    backgroundColor: '#f9f9f9',
    padding: '16px',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    marginTop: '16px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',      // Alinear a la izquierda
    justifyContent: 'flex-start',  // Alinear al principio
    width: '350px',                // Definir un ancho fijo para la tarjeta
    marginLeft: 'auto',            // Centrar la tarjeta en el contenedor principal
    marginRight: 'auto',           // Centrar la tarjeta en el contenedor principal
  },
  filterTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    marginBottom: '12px',
  },
  filterRow: {
    display: 'flex',
    justifyContent: 'flex-start',   // Alinear los elementos a la izquierda
    width: '100%',                  // Que ocupe todo el ancho disponible
    marginBottom: '12px',
    alignItems: 'center',           // Alinear verticalmente los elementos
  },
  filterLabel: {
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#555',
    marginRight: '10px',            // Espacio entre la etiqueta y el input
    width: '130px',                 // Ancho fijo para las etiquetas
  },
  filterInput: {
    width: '80px',                  // Establecer un ancho fijo para los inputs
    padding: '8px',
    borderRadius: '4px',
    border: '1px solid #ddd',
    textAlign: 'center',            // Centrar el texto dentro del input
  },
  filterButton: {
    backgroundColor: '#28a745',  // Color verde
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
    marginTop: '16px',  // Espacio por encima del botón
    width: '100%',  // Que ocupe todo el ancho de la tarjeta
    textAlign: 'center',
  },
};



const MarketInfo = ({ item, onClose }) => {
  const [itemDetails, setItemDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({});

  useEffect(() => {
    const fetchItemDetails = async () => {
      try {
        const filteredName = item.name.includes('·')
          ? item.name.split('·')[1].trim()  // Recorta todo antes del punto (incluido el punto)
          : item.name;

        const response = await fetch('https://lumitownserver.somee.com/MenuItemsFilter', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: filteredName,
            tokenid: item.tokenId,
            criteria: [],
            rangeCriteria: [],
          }),
        });

        if (!response.ok) {
          throw new Error('Error al obtener los detalles del ítem');
        }

        const data = await response.json();
        setItemDetails(data); // Guardar los datos del endpoint
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.error(error);
      }
    };

    fetchItemDetails();
  }, [item]);

  const handleFilterChange = (name, value) => {
    setFilters({
      ...filters,
      [name]: value,
    });
  };

  if (loading) {
    return <div style={styles.loading}>Loading...</div>;
  }
  
  if (!itemDetails) {
    return <div style={styles.error}>Item details not found</div>;
  }

  return (
    <div style={{ ...styles.marketInfo, ...(itemDetails ? styles.open : {}) }}>
      <div style={styles.marketInfoHeader}>
        <h2>{itemDetails.item.name}</h2>
      </div>
      <div style={styles.closeButtonContainer}>
        <button style={styles.closeButton} onClick={onClose}>X</button>
      </div>
      <div style={styles.marketInfoContent}>
        {/* Información del ítem principal */}
        <div>
          <img src={itemDetails.item.image} alt={itemDetails.item.name} style={styles.itemImage} />
          <h3>{itemDetails.item.name}</h3>
          <div style={styles.itemDetails}>
            <h3>{weiToEther(itemDetails.item.minPrice)} RON</h3>
            <div>
              <div style={styles.attributeContainer}>
                {/* Atributos de opción */}
                <div style={styles.attributeColumn}>
                  {itemDetails.item.optionAttributes.map((attr, index) => (
                    <div key={index} style={styles.minicard}>
                      <div style={styles.minicardContent}>
                        <div style={styles.minicardLabel}>{attr.name}:</div>
                        <div style={styles.minicardValue}>{attr.value} / {attr.maxValue}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Atributos de tipo */}
                <div style={styles.attributeColumn}>
                  {itemDetails.item.typeAttributes.map((attr, index) => (
                    <div key={index} style={styles.minicard}>
                      <div style={styles.minicardContent}>
                        <div style={styles.minicardLabel}>{attr.name}:</div>
                        <div style={styles.minicardValue}>{attr.value}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Botón "Marker Mavis" para la tarjeta principal */}
        <button style={styles.buttonMarkerMavis}>Marker Mavis</button>

        <div style={styles.filterCard}>
  <div style={styles.filterTitle}>Filtros</div>
  {itemDetails.item.optionAttributes.map((attr, index) => (
    <div key={index} style={styles.filterRow}>
      <div style={styles.filterLabel}>{attr.name}</div>
      <div style={styles.filterInputContainer}>
        <input
          style={styles.filterInput}
          type="number"
          min="0"
          max={attr.maxValue}
          value={filters[attr.name] || ''}
          onChange={(e) => handleFilterChange(attr.name, e.target.value)}
        />
        <span style={styles.maxValue}>{` / ${attr.maxValue}`}</span>
      </div>
    </div>
  ))}
  <button style={styles.filterButton} onClick={() => alert('Filtros aplicados!')}>
    Filtrar
  </button>
</div>
      </div>

      {/* Ítems adicionales */}
      <div style={styles.additionalItems}>
        {itemDetails.additionalItems.map((additionalItem, index) => (
          <div key={index} style={styles.additionalItemContainer}>
            <img
              src={additionalItem.image}
              alt={additionalItem.name}
              style={styles.additionalItemImage}
            />
            <div>
              <div style={styles.additionalItemName}>{additionalItem.name}</div>
              <div style={styles.additionalItemPrice}>
                {weiToEther(additionalItem.minPrice)} RON
              </div>
              <div>
                <div style={styles.attributeContainer}>
                  {/* Atributos de opción para los ítems adicionales */}
                  <div style={styles.attributeColumn}>
                    {additionalItem.optionAttributes.map((attr, index) => (
                      <div key={index} style={styles.minicard}>
                        <div style={styles.minicardContent}>
                          <div style={styles.minicardLabel}>{attr.name}:</div>
                          <div style={styles.minicardValue}>{attr.value} / {attr.maxValue}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Atributos de tipo para los ítems adicionales */}
                  <div style={styles.attributeColumn}>
                    {additionalItem.typeAttributes.map((attr, index) => (
                      <div key={index} style={styles.minicard}>
                        <div style={styles.minicardContent}>
                          <div style={styles.minicardLabel}>{attr.name}:</div>
                          <div style={styles.minicardValue}>{attr.value}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Botón "Marker Mavis" para los ítems adicionales */}
            <button style={styles.buttonMarkerMavisAdditional}>Marker Mavis</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MarketInfo;

