import React, { useState, useEffect } from 'react';
import OptionsCard from './OptionsCard'; // Import the new OptionsCard component

const rarityColors = [
  '#ffffff', // Common
  '#009045', // Uncommon
  '#009bdb', // Rare
  '#87599a', // Epic
  '#dc9600'  // Legendary
];

const RecipeDetails = ({ selectedRecipe, closeDetails, urls, imageCSS, hoverColorCSS }) => {
  const [activeTab, setActiveTab] = useState('craftings');
  const [selectedCard, setSelectedCard] = useState(null);
  const [tooltip, setTooltip] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  const normalizeName = (name) => name?.trim().toLowerCase().replace(/\s+/g, '') || '';
  const capitalizeWords = (text) => text.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

  const findImageForElement = (elementName, tier) => {
    if (!elementName) return null;
    const normalizedElementName = normalizeName(elementName);
    return tier 
      ? urls.find(urlItem => normalizeName(urlItem.name) === normalizedElementName && urlItem.tier === tier)?.url 
      : urls.find(urlItem => normalizeName(urlItem.name) === normalizedElementName)?.url;
  };

  const handleCardClick = (index) => {
    setSelectedCard(index);
  };

  const renderCards = (itemImage) => {
    const rarityNames = selectedRecipe.rarity; // The rarity names directly from selectedRecipe
    return (
      <div style={styles.cardsContainer}>
        {rarityNames.map((rarity, index) => (
          <div 
            key={index} 
            style={{ ...styles.card, backgroundColor: `${rarityColors[index]}50` }} 
            onClick={() => handleCardClick(index)}
          >
            <img src={itemImage} alt={selectedRecipe.result} style={styles.cardImage} />
          </div>
        ))}
      </div>
    );
  };

  const renderCraftings = (craftings) => {
    const filteredCraftings = craftings.filter(craft => {
      return true; // Example condition; adjust as needed
    });

    return (
      <div style={styles.craftingContainer}>
        {filteredCraftings.length > 0 ? (
          filteredCraftings.map((craft, index) => (
            <div 
              key={index} 
              style={styles.craftingItem}
              onMouseEnter={() => setTooltip(craft.element)}
              onMouseLeave={() => setTooltip('')}
            >
              <img 
                src={findImageForElement(craft.element)} 
                alt={craft.element} 
                style={styles.elementImage} 
              />
              <span>x{craft.quantity}</span>
              {tooltip === craft.element && (
                <div style={styles.tooltip}>
                  <strong>{capitalizeWords(tooltip)}</strong>
                  <hr style={styles.tooltipDivider} />
                  <div style={styles.tooltipTitle}>Crafting</div>
                  <div style={styles.tooltipSubtitle}>Coming Soon</div>
                </div>
              )}
            </div>
          ))
        ) : (
          <p>Coming Soon</p>
        )}
      </div>
    );
  };

  const renderContent = () => {
    const craftings = activeTab === 'craftings' ? selectedRecipe.craftings :
                      activeTab === 'recraftings' ? selectedRecipe.recraftings :
                      selectedRecipe.craftingFragments;

    return (
      <div style={styles.itemsCard}>
        <h4 style={styles.resultTitle}>You Will Obtain:</h4>
        {renderCards(findImageForElement(selectedRecipe.result, selectedRecipe.tier))}
        {/* Pass selectedCard and selectedRecipe to OptionsCard */}
        <OptionsCard selectedCard={selectedCard} selectedRecipe={selectedRecipe} />
      </div>
    );
  };

  useEffect(() => {
    setIsVisible(true);

    const style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = `
      .detailsPanel {
        overflow-y: scroll;
        scrollbar-width: none;
      }
      .detailsPanel::-webkit-scrollbar {
        display: none;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div
      style={{
        ...styles.detailsPanel,
        transform: isVisible ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.5s ease-out',
      }}
      className="detailsPanel"
    >
      <div style={styles.headerImageContainer}>
        <div style={styles.headerImage(imageCSS, hoverColorCSS)} />
        <button style={styles.closeButton} onClick={closeDetails}>✖</button>
        <h2 style={styles.title}>{capitalizeWords(selectedRecipe.result)}</h2>
      </div>
      <div style={styles.tierCard(imageCSS, hoverColorCSS)}>
        <span style={styles.tierText}>{capitalizeWords(`Tier: ${selectedRecipe.tier}`)}</span>
      </div>

      <div style={styles.buttonCard}>
        <div style={styles.tabs}>
          {[{ key: 'craftings', label: 'Craftings' },
            { key: 'recraftings', label: 'Recraftings' },
            { key: 'craftingfragments', label: 'Fragments' }].map(tab => (
            <button
              key={tab.key}
              style={activeTab === tab.key ? styles.activeTab(imageCSS, hoverColorCSS) : styles.tab(imageCSS, hoverColorCSS)}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div style={styles.craftingList}>
          {renderCraftings(selectedRecipe[activeTab])}
        </div>
      </div>

      <div>
        {renderContent()}
      </div>
    </div>
  );
};

const styles = {
  detailsPanel: {
    position: 'fixed',
    top: '10%',
    right: '5px',
    width: '400px',
    backgroundColor: '#092143',
    borderRadius: '8px',
    padding: '20px',
    boxShadow: '0 10px 20px rgba(0, 0, 0, 0.5)',
    zIndex: 1000,
    maxHeight: '80vh',
    textAlign: 'center',
    fontFamily: 'Comic Sans MS',
  },
  headerImageContainer: {
    position: 'relative',
    width: '100%',
    height: '200px',
  },
  headerImage: (imageCSS, hoverColorCSS) => ({
    position: 'absolute',
    top: -20,
    left: -20,
    right: -20,
    height: '110%',
    backgroundImage: `linear-gradient(to bottom, transparent 70%, #092143 100%), url(${imageCSS})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    zIndex: 0,
  }),
  tierCard: (imageCSS, hoverColorCSS) => ({
    display: 'inline-block',
    padding: '10px',
    borderRadius: '5px',
    backgroundColor: `${hoverColorCSS}`,
    margin: '10px 0',
  }),
  closeButton: {
    position: 'absolute',
    top: '-10px',
    right: '-10px',
    background: 'none',
    border: 'none',
    fontSize: '25px',
    fontWeight: 'bold',
    cursor: 'pointer',
    color: '#d63031',
    zIndex: 1,
  },
  title: {
    position: 'absolute',
    bottom: '10px',
    fontWeight: 'bold',
    margin: '0',
    color: 'white',
    zIndex: 1,
  },
  tierText: {
    fontWeight: 'bold',
    color: 'white',
  },
  buttonCard: {
    padding: '20px',
    borderRadius: '5px',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginBottom: '10px',
    color: 'black',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
  },
  tabs: {
    display: 'flex',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: '10px',
  },
  tab: (imageCSS, hoverColorCSS) => ({
    backgroundColor: `${hoverColorCSS}`,
    padding: '10px 10px',
    cursor: 'pointer',
    border: 'none',
    borderRadius: '5px',
    transition: 'background-color 0.3s',
    fontWeight: 'bold',
    fontSize: '18px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
  }),
  activeTab: (imageCSS, hoverColorCSS) => ({
    backgroundColor: `${hoverColorCSS}`,
    padding: '10px 10px',
    cursor: 'pointer',
    fontWeight: 'bold',
    color: 'white',
    borderRadius: '5px',
    border: 'none',
    fontSize: '18px',
    boxShadow: `0 4px 20px ${hoverColorCSS}`,
  }),
  craftingContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: '10px',
    marginBottom: '10px',
  },
  craftingItem: {
    display: 'flex',
    color: 'white',
    fontSize: '24px',
    flexDirection: 'column',
    alignItems: 'center',
    position: 'relative',
    maxWidth: '100px',
  },
  elementImage: {
    width: '70px',
    height: '70px',
    objectFit: 'cover',
    marginBottom: '5px',
  },
  cardsContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: '10px',
  },
  card: {
    width: '80px',
    height: '80px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '5px',
    border: '1px solid white',
    margin: '5px',
    cursor: 'pointer',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
    transition: 'transform 0.3s',
  },
  cardImage: {
    maxWidth: '70%',
    maxHeight: '70%',
    zIndex: 2,
    opacity: 1,
    mixBlendMode: 'normal'
  },
  optionsCard: {
    width: '90%',
    marginTop: '10px',
    color: 'white',
    backgroundColor: 'rgba(0, 0, 22, 0.7)',
    padding: '10px',
    borderRadius: '5px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  rarityBox: {
    padding: '5px',
    borderRadius: '5px',
    color: 'black',
    marginBottom: '5px',
    textAlign: 'center',
    fontSize: '17px',
  },
  rarityText: {
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
  },
  optionList: {
    listStyleType: 'none',
    padding: '0',
    margin: '0',
  },
  tooltip: {
    position: 'absolute',
    bottom: '110%',
    left: '50%',
    transform: 'translateX(-50%)',
    backgroundColor: '#333',
    color: '#fff',
    padding: '10px',
    borderRadius: '5px',
    whiteSpace: 'nowrap',
    zIndex: 100,
    fontSize: '14px',
    textAlign: 'center',
  },
  tooltipTitle: {
    fontWeight: 'bold',
    marginBottom: '5px',
  },
  tooltipSubtitle: {
    fontSize: '12px',
  },
  tooltipDivider: {
    border: 'none',
    height: '1px',
    backgroundColor: '#fff',
    margin: '5px 0',
  },
  resultTitle: {
    fontWeight: 'bold',
    color: 'white',
    margin: '10px 0',
  },
   optionList: {
    listStyleType: 'none',
    padding: '0',
    margin: '0',
    textAlign: 'left', // Align the text to the left
  },
  optionSubList: {
    listStyleType: 'none',
    paddingLeft: '20px', // Add indentation for sub-lists
    margin: '0',
  },
  itemsCard: {
    position: 'relative',
    padding: '20px',
    borderRadius: '5px',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'black',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)', 
  },
};

export default RecipeDetails;

