import React, { useEffect, useState } from 'react';

// Definir los colores para las rarezas
const rarityColors = [
  '#ffffff', // Common
  '#009045', // Uncommon
  '#009bdb', // Rare
  '#87599a', // Epic
  '#dc9600'  // Legendary
];

const OptionsCard = ({ selectedCard, selectedRecipe }) => {
  const [rarityName, setRarityName] = useState('Common'); // Definir rareza predeterminada

  useEffect(() => {
    // Cuando selectedCard o selectedRecipe cambian, se debe revisar la rareza
    if (selectedRecipe && selectedCard !== null) {
      // Asegúrate de obtener la rareza de la receta solo si hay una receta y una carta seleccionada
      const selectedRarity = selectedRecipe.rarity[selectedCard];
      if (selectedRarity) {
        setRarityName(selectedRarity); // Establecer la rareza seleccionada
      } else {
        setRarityName('Common'); // Si no hay rareza, usar la predeterminada
      }
    } else {
      setRarityName('Common'); // Si no hay receta o carta seleccionada, usar la predeterminada
    }
  }, [selectedCard, selectedRecipe]); // Este hook se ejecutará cada vez que cambien selectedCard o selectedRecipe

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
        <div style={{ ...styles.rarityBox , backgroundColor: '#d4a21a' , color:'withe'}}>
          <span style={styles.rarityText}>OPTIONS FOR THIS ITEM ARE UNDER MAINTENANCE</span>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.optionsCard}>
      <h4 style={{ marginTop: '0px' }}>Options for {selectedRecipe.result}:</h4>
      <div style={{ ...styles.rarityBox, backgroundColor: rarityColors[selectedCard] }}>
        <span style={styles.rarityText}>{rarityName ? rarityName.trim().toUpperCase() : 'Unknown'}</span>
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
  },
  rarityText: {
    color: 'Black',
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

