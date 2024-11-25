import React, { useEffect, useState } from 'react';

// Definir los colores para las rarezas
const rarityColors = [
  '#ffffff', // BASIC
  '#009045', // ENHANCED
  '#009bdb', // ADVANCED
  '#87599a', // SUPER
  '#dc9600'  // ULTIMATE
];

// Rarezas definidas (en mayúsculas)
const rarityNames = [
  'BASIC',
  'ENHANCED',
  'ADVANCED',
  'SUPER',
  'ULTIMATE'
];

const OptionsCard = ({ selectedCard, selectedRecipe }) => {
  const [rarityName, setRarityName] = useState('BASIC'); // Establecer "BASIC" como rareza predeterminada
  const [selectedRarityColor, setSelectedRarityColor] = useState('#ffffff'); // Color inicial para rareza BASIC

  useEffect(() => {
    if (selectedRecipe && selectedCard !== null) {
      // Cuando selectedCard o selectedRecipe cambian, revisar la rareza
      const selectedRarity = selectedRecipe.rarity[selectedCard];

      // Comparamos la rareza recibida en minúsculas y la convertimos a mayúsculas
      const matchingRarity = rarityNames.find(rarity => rarity.toLowerCase() === selectedRarity?.toLowerCase());

      // Si se encuentra la rareza, la establecemos
      if (matchingRarity) {
        setRarityName(matchingRarity);
        setSelectedRarityColor(rarityColors[rarityNames.indexOf(matchingRarity)]); // Establecer color correspondiente
      } else {
        setRarityName('BASIC'); // Si no se encuentra una coincidencia válida, se establece "BASIC"
        setSelectedRarityColor(rarityColors[0]); // Establecer color de BASIC
      }
    } else {
      setRarityName('BASIC'); // Si no hay receta o carta seleccionada, establecer "BASIC"
      setSelectedRarityColor(rarityColors[0]); // Establecer color de BASIC
    }
  }, [selectedCard, selectedRecipe]); // El hook se ejecuta cada vez que cambian selectedCard o selectedRecipe

  // Función para manejar el clic en la rareza
  const handleRarityClick = (index) => {
    setRarityName(rarityNames[index]);
    setSelectedRarityColor(rarityColors[index]);
  };

  // Si no hay receta o carta seleccionada, no renderizar el componente
  if (!selectedRecipe || selectedCard === null) return null;

  const options = selectedRecipe.options || [];

  // Obtener las opciones y atributos basados en la rareza seleccionada
  const getProcessedOptionsAndAttributes = () => {
    const processedOptions = [];
    const processedAttributes = [];

    if (options.length > 0) {
      // Iteramos sobre todas las opciones
      options.forEach(optionObject => {
        // Filtramos las opciones y atributos de acuerdo a la rareza
        if (optionObject.rarity.toLowerCase() === rarityName.toLowerCase()) {
          // Procesar atributos (de string a array)
          const attributeArray = optionObject.attribute ? optionObject.attribute.split(',') : [];
          
          // Filtrar atributos para que no incluya "none"
          const filteredAttributes = attributeArray.filter(attr => attr.toLowerCase() !== 'none');
          processedAttributes.push(...filteredAttributes);

          // Procesar opciones (de string a array)
          const optionsArray = optionObject.options ? optionObject.options.split(',') : [];
          processedOptions.push(...optionsArray);
        }
      });
    }

    return { processedOptions, processedAttributes };
  };

  const { processedOptions, processedAttributes } = getProcessedOptionsAndAttributes();

  // Si no hay opciones ni atributos, mostrar mensaje de mantenimiento
  if (processedOptions.length === 0 && processedAttributes.length === 0) {
    return (
      <div style={styles.optionsCard}>
        <h4 style={{ marginTop: '0px' }}>Options for {selectedRecipe.result}:</h4>
        <div style={{ ...styles.rarityBox, backgroundColor: '#d4a21a', color: 'white' }}>
          <span style={styles.rarityText}>OPTIONS FOR THIS ITEM ARE UNDER MAINTENANCE</span>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.optionsCard}>
      <h4 style={{ marginTop: '0px' }}>Options for {selectedRecipe.result}:</h4>
      <div 
        style={{ ...styles.rarityBox, backgroundColor: selectedRarityColor }} 
        onClick={() => handleRarityClick(rarityNames.indexOf(rarityName))}
      >
        <span style={styles.rarityText}>{rarityName ? rarityName.trim().toUpperCase() : 'UNKNOWN'}</span>
      </div>
      <ul style={styles.optionList}>
        {processedAttributes.length > 0 && (
          <li>
            <strong>Attribute:</strong>
            <ul style={styles.optionSubList}>
              {processedAttributes.map((attr, index) => (
                <li key={index}>{attr.trim()}</li>
              ))}
            </ul>
          </li>
        )}
        {processedOptions.length > 0 && (
          <li>
            <strong>Options:</strong>
            <ul style={styles.optionSubList}>
              {processedOptions.map((opt, index) => (
                <li key={index}>{opt.trim()}</li>
              ))}
            </ul>
          </li>
        )}
      </ul>
    </div>
  );
};

// Estilos para el componente
const styles = {
  optionsCard: {
    padding: '20px',
    backgroundColor: '#1f3c73',
    borderRadius: '8px',
    marginTop: '20px',
  },
  rarityBox: {
    padding: '10px',
    borderRadius: '5px',
    marginBottom: '10px',
    cursor: 'pointer', // Indicar que es interactivo
  },
  rarityText: {
    color: 'black',
    fontSize: '16px',
    fontWeight: 'bold',
    textAlign: 'center', // Centrar el texto en la caja de rareza
  },
  optionList: {
    listStyleType: 'none',
    padding: '0',
  },
  optionSubList: {
    listStyleType: 'none',
    padding: '0',
    fontSize: '14px',
    color: 'white',
  },
  // Estilo específico para el cartel de mantenimiento
  maintenanceMessage: {
    padding: '10px',
    backgroundColor: '#f7b731',
    color: '#333',
    borderRadius: '5px',
    textAlign: 'center',
  },
};

export default OptionsCard;
