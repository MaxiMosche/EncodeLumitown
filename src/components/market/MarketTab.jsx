import React, { useState, useEffect, useCallback } from 'react';
import MarketInfo from './MarketInfo'; // Importa el componente MarketInfo
import { BorderTopOutlined } from '@mui/icons-material';

// Función para convertir de Wei a Ether
const weiToEther = (wei) => {
  return (parseInt(wei) / Math.pow(10, 18)).toFixed(4);
};

// Componente principal `MarketTab`
const MarketTab = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [itemCount, setItemCount] = useState(20);
  const [filters, setFilters] = useState({
    quality: [],
    requiresLevel: [],
    type: [],
    className: '',
  });
  const [canNext, setCanNext] = useState(true);
  const [fetchError, setFetchError] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null); // Estado para el ítem seleccionado
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado para la visibilidad del modal

  const fetchItems = useCallback(() => {
    setLoading(true);
    setFetchError(false);

    const selectedCriteria = [
      { name: "quality", values: filters.quality },
      { name: "requires level", values: filters.requiresLevel },
      { name: "type", values: filters.type }
    ];

    const filteredCriteria = selectedCriteria.filter((filter) => filter.values.length > 0);

    fetch('https://www.lumitown.somee.com/FilterMarket', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: '',
        from: (page - 1) * itemCount,
        size: itemCount,
        className: filters.className,
        criteria: filteredCriteria,
        rangeCriteria: [],
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error en la respuesta del servidor');
        }
        return response.json();
      })
      .then((data) => {
        setItems(data);
        setLoading(false);
        setFetchError(false);
        setCanNext(true);
      })
      .catch(() => {
        setLoading(false);
        setFetchError(true);
        setCanNext(false);
      });
  }, [filters, page, itemCount]);

  useEffect(() => {
    fetchItems();
  }, [filters, page, fetchItems]);

  const handleFilterToggle = (filterName, value) => {
    setFilters((prevFilters) => {
      const updatedValues = prevFilters[filterName].includes(value)
        ? prevFilters[filterName].filter((v) => v !== value)
        : [...prevFilters[filterName], value];

      return { ...prevFilters, [filterName]: updatedValues };
    });
  };

  const handleClassChange = (value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      className: prevFilters.className === value ? '' : value,
    }));
  };

  const resetFilters = () => {
    setFilters({
      quality: [],
      requiresLevel: [],
      type: [],
      className: '', // Resetear clase
    });
    setPage(1); // Resetear la página a la primera
  };

  const goToNextPage = () => {
    if (canNext) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const goToPreviousPage = () => {
    setPage((prevPage) => (prevPage > 1 ? prevPage - 1 : prevPage));
  };

  // Función para abrir el modal con el ítem seleccionado
  const handleItemClick = (item) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  // Función para cerrar el modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  // Controlador de la visibilidad del acordeón
  const [activeAccordion, setActiveAccordion] = useState(null);

  const toggleAccordion = (accordionIndex) => {
    setActiveAccordion(activeAccordion === accordionIndex ? null : accordionIndex);
  };

  return (
    <div style={styles.marketContent}>
      {/* Filters: Native Accordion */}
      <div style={styles.filtersContainer}>
        <h3 style={styles.filterTitle}>Filters</h3>
  
        {/* Quality Filter */}
        <div style={styles.accordionItem}>
          <button style={styles.accordionHeader} onClick={() => toggleAccordion(0)}>
            Quality
          </button>
          {activeAccordion === 0 && (
            <div style={styles.accordionContent}>
              <div style={styles.filterButtonGroup}>
                {["super", "advanced", "enhanced", "ultimate", "basic"].map((value) => (
                  <button
                    key={value}
                    onClick={() => handleFilterToggle('quality', value)}
                    style={{
                      ...styles.filterButton,
                      backgroundColor: filters.quality.includes(value) ? '#007bff' : '#f4f4f4',
                      color: filters.quality.includes(value) ? '#fff' : '#333',
                    }}
                  >
                    {value}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
  
        {/* Required Level Filter */}
        <div style={styles.accordionItem}>
          <button style={styles.accordionHeader} onClick={() => toggleAccordion(1)}>
            Required Level
          </button>
          {activeAccordion === 1 && (
            <div style={styles.accordionContent}>
              <div style={styles.filterButtonGroup}>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((level) => (
                  <button
                    key={level}
                    onClick={() => handleFilterToggle('requiresLevel', level.toString())}
                    style={{
                      ...styles.filterButton,
                      backgroundColor: filters.requiresLevel.includes(level.toString()) ? '#007bff' : '#f4f4f4',
                      color: filters.requiresLevel.includes(level.toString()) ? '#fff' : '#333',
                    }}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
  
        {/* Type Filter */}
        <div style={styles.accordionItem}>
          <button style={styles.accordionHeader} onClick={() => toggleAccordion(2)}>
            Type
          </button>
          {activeAccordion === 2 && (
            <div style={styles.accordionContent}>
              <div style={styles.filterButtonGroup}>
                {["head armor", "hands armor", "legs armor", "feet armor", "taskticket", "chest armor", "sword", "material", "petegg", "consumable"].map((type) => (
                  <button
                    key={type}
                    onClick={() => handleFilterToggle('type', type)}
                    style={{
                      ...styles.filterButton,
                      backgroundColor: filters.type.includes(type) ? '#007bff' : '#f4f4f4',
                      color: filters.type.includes(type) ? '#fff' : '#333',
                    }}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
  
        {/* Class Filter */}
        <div style={styles.accordionItem}>
          <button style={styles.accordionHeader} onClick={() => toggleAccordion(3)}>
            Class
          </button>
          {activeAccordion === 3 && (
            <div style={styles.accordionContent}>
              <div style={styles.filterButtonGroup}>
                {['farming', 'combat', 'gathering'].map((value) => (
                  <button
                    key={value}
                    onClick={() => handleClassChange(value)}
                    style={{
                      ...styles.filterButton,
                      backgroundColor: filters.className === value ? '#007bff' : '#f4f4f4',
                      color: filters.className === value ? '#fff' : '#333',
                    }}
                  >
                    {value}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
  
        {/* Reset Filters Button */}
        <div style={{ textAlign: 'center' }}>
          <button onClick={resetFilters} style={styles.clearButton}>
            Reset Filters
          </button>
        </div>
      </div>
  
      {/* Display items in square cards */}
      <div style={styles.itemsGrid}>
        {loading ? (
          <div style={styles.loading}>Loading...</div>
        ) : (
          items.map((item) => {
            return (
              <div key={item.tokenId} style={styles.itemCard} onClick={() => handleItemClick(item)}>
                <img src={item.image} alt={item.name} style={styles.itemImage} />
                <h4 style={styles.itemName}>{item.name}</h4>
                <p style={styles.itemPrice}>{weiToEther(item.minPrice)} RON</p>
                <p style={styles.itemTotal}>Total: {item.total}</p>
              </div>
            );
          })
        )}
      </div>
  
      {/* Pagination: Previous and Next Buttons */}
      <div style={styles.paginationContainer}>
        <button
          onClick={goToPreviousPage}
          disabled={page === 1}
          style={styles.paginationButton}
        >
          Previous
        </button>
        <button
          onClick={goToNextPage}
          disabled={!canNext}
          style={styles.paginationButton}
        >
          Next
        </button>
      </div>
  
      {/* Show modal if an item is selected */}
      {isModalOpen && selectedItem && (
        <MarketInfo item={selectedItem} onClose={closeModal} />
      )}
    </div>
  );  
};

// Estilos para los elementos
const styles = {
  marketContent: {
    padding: '20px',
  },
  filtersContainer: {
    marginBottom: '30px',
    backgroundColor: 'rgba(16, 83, 138, 0.5)',
    paddingBottom: '20px',
    textAlign: 'center',
  },
  filterTitle: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    marginTop:'10px',
    marginBottom: '10px',
    color: '#333',
  },
  accordionItem: {
    marginBottom: '15px',
  },
  accordionHeader: {
    width: '90%',
    padding: '10px',
    borderTopLeftRadius: '10px', // Bordes redondeados solo en la esquina superior izquierda
    borderTopRightRadius: '10px',
    backgroundColor: 'white',
    color: 'black',
    border: 'none',
    cursor: 'pointer',
    textAlign: 'center',
    fontSize: '1.2rem',
    
  },
  accordionContent: {
    padding: '10px',
    width: '88%',
    backgroundColor: '#f4f4f4',
    margin: '0 auto', // Centra el contenido horizontalmente
    display: 'flex', // Utilizamos flexbox para el centrado
    justifyContent: 'center', // Centra el contenido horizontalmente
    alignItems: 'flex-end', // Alinea el contenido en la parte inferior
    borderBottomLeftRadius: '10px', // Redondea la esquina inferior izquierda
    borderBottomRightRadius: '10px', // Redondea la esquina inferior derecha
  },
  filterButtonGroup: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px',
    justifyContent: 'center',
  },
  filterButton: {
    padding: '8px 15px',
    borderRadius: '5px',
    border: '1px solid #ddd',
    backgroundColor: '#f4f4f4',
    cursor: 'pointer',
    fontSize: '0.9rem',
    transition: 'background-color 0.3s, color 0.3s',
  },
  itemsGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: '20px',
    marginTop: '20px',
  },
  itemCard: {
    width: '20%',
    textAlign: 'center',
    padding: '15px',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    backgroundColor: '#fff',
    cursor: 'pointer',
  },
  itemImage: {
    width: '80px',
    height: '80px',
    objectFit: 'contain',
    marginBottom: '10px',
  },
  itemName: {
    fontWeight: 'bold',
    fontSize: '1.1rem',
    marginBottom: '10px',
    color: '#333',
  },
  itemPrice: {
    color: '#007bff',
    fontWeight: 'bold',
    marginBottom: '5px',
  },
  itemTotal: {
    fontSize: '0.9rem',
    color: '#666',
  },
  paginationContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '20px',
  },
  paginationButton: {
    padding: '10px 20px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '1rem',
    margin: '0 10px',
  },
  loading: {
    fontSize: '1.2rem',
    color: '#007bff',
    textAlign: 'center',
    padding: '20px',
  },
  clearButton: {
    padding: '10px 20px',
    backgroundColor: '#ff4d4d',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '1rem',
    transition: 'background-color 0.3s',
  },
};

export default MarketTab;
