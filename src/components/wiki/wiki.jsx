import React, { useState, useEffect } from 'react';
import { useGlobalState } from './GlobalState';
import RecipeDetails from './RecipeDetails';
import { useLocation, useNavigate } from 'react-router-dom';
import { Maximize } from '@mui/icons-material';

const Wiki = () => {
    const { recipes, urls, isLoading } = useGlobalState();
    const [selectedRecipe, setSelectedRecipe] = useState(null);
    const [groupedRecipes, setGroupedRecipes] = useState({});
    const [filter, setFilter] = useState('gathering');
    const location = useLocation();
    const navigate = useNavigate();
    const [hoveredCards, setHoveredCards] = useState({});

    const filterStyles = {
        gathering: {
            image: 'https://res.cloudinary.com/dm94dpmzy/image/upload/v1730834816/gat_l1wav2.webp',
            hoverColor: 'rgba(52, 152, 219, 0.5)',
            imageCSS: 'https://res.cloudinary.com/dm94dpmzy/image/upload/v1730827436/gatheringinfo_ivwuao.webp',
            hoverColorCSS: '#2B2DA1',
        },
        combat: {
            image: 'https://res.cloudinary.com/dm94dpmzy/image/upload/v1730834815/figth_ing8lm.webp',
            hoverColor: 'rgba(231, 76, 60, 0.5)',
            imageCSS: 'https://res.cloudinary.com/dm94dpmzy/image/upload/v1730827634/combatinfo_gwroth.webp',
            hoverColorCSS: '#F9262A',
        },
        farming: {
            image: 'https://res.cloudinary.com/dm94dpmzy/image/upload/v1730834823/farm_wu8iv9.webp',
            hoverColor: 'rgba(46, 204, 113, 0.5)',
            imageCSS: 'https://res.cloudinary.com/dm94dpmzy/image/upload/v1730827818/farminginfo_hvpkja.webp',
            hoverColorCSS: '#3FA12B',
        },
    };

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const filterParam = params.get('filter');
        if (filterParam && ['gathering', 'combat', 'farming'].includes(filterParam)) {
            setFilter(filterParam);
        } else {
            setFilter('gathering');
        }
    }, [location.search]);

    useEffect(() => {
        if (recipes.length > 0) {
            const grouped = {};
            recipes.forEach(recipe => {
                if (!recipe.type) return;

                const mainType = recipe.type[0];
                const tier = recipe.tier;

                if (!grouped[mainType]) {
                    grouped[mainType] = {};
                }

                if (!grouped[mainType][tier]) {
                    grouped[mainType][tier] = [];
                }

                grouped[mainType][tier].push(recipe);
            });
            setGroupedRecipes(grouped);
        }
    }, [recipes]);

    const handleCardClick = (recipe) => {
        const recipeFilter = recipe.type[0];
        if (['gathering', 'combat', 'farming'].includes(recipeFilter)) {
            setFilter(recipeFilter);
            navigate(`?filter=${recipeFilter}`);
        }
        setSelectedRecipe(recipe);
    };

    const closeDetails = () => {
        setSelectedRecipe(null);
    };

    const normalizeName = (name) => {
        return name ? name.trim().toLowerCase().replace(/\s+/g, '') : '';
    };

    const findImageForElement = (elementName, tier) => {
        if (!elementName) return null;
        const normalizedElementName = normalizeName(elementName);
        const item = tier
            ? urls.find(urlItem => normalizeName(urlItem.name) === normalizedElementName && urlItem.tier === tier)
            : urls.find(urlItem => normalizeName(urlItem.name) === normalizedElementName);
        return item ? item.url : null;
    };

    useEffect(() => {
        const backgroundImage = filterStyles[filter]?.image || '';
        if (location.pathname === '/wiki') {
            document.body.style.backgroundImage = `url(${backgroundImage})`;
            document.body.style.backgroundSize = 'cover';
            document.body.style.backgroundPosition = 'center';
            document.body.style.backgroundAttachment = 'fixed';
            document.body.style.backgroundRepeat = 'no-repeat';
        } else {
            document.body.style.backgroundImage = '';
        }
    }, [location.pathname, filter]);

    if (isLoading) {
        return (
            <div style={styles.loadingContainer}>
                <div style={styles.spinner}></div>
                <p style={styles.loadingText}>Loading recipes...</p>
            </div>
        );
    }

    const filteredTypes = {
        gathering: ['gathering'],
        combat: ['combat'],
        farming: ['farming']
    };

    const currentFilterTypes = filteredTypes[filter] || [];

    const handleFilterChange = (newFilter) => {
        setFilter(newFilter);
        setSelectedRecipe(null);  // Close the recipe details when changing the filter
        navigate(`?filter=${newFilter}`); 
    };

    const handleGoBack = () => {
        navigate("/homewiki"); // Navigate back to the previous page
    };

    return (
        <div style={styles.wikiContainer}>
            <div style={styles.fog}></div>

            {/* Back Button */}
            <button
                onClick={handleGoBack}
                style={{
                    ...styles.goBackButton,
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
                &lt; {/* The less-than sign directly */}
            </button>

            <div style={styles.filterContainer}>
                <img 
                    src="https://res.cloudinary.com/dm94dpmzy/image/upload/v1730827932/gatheringboton_hikjnb.webp" 
                    alt="Gathering" 
                    style={styles.filterImage} 
                    onClick={() => handleFilterChange('gathering')}
                />
                <img 
                    src="https://res.cloudinary.com/dm94dpmzy/image/upload/v1730828062/combatboton_cet8m0.webp" 
                    alt="Combat" 
                    style={styles.filterImage} 
                    onClick={() => handleFilterChange('combat')}
                />
                <img 
                    src="https://res.cloudinary.com/dm94dpmzy/image/upload/v1730828187/farmingboton_rl8lmk.webp" 
                    alt="Farming" 
                    style={styles.filterImage} 
                    onClick={() => handleFilterChange('farming')}
                />
            </div>

            <div style={styles.cardContainer}>
                {currentFilterTypes.map(type => (
                    groupedRecipes[type] && (
                        <div key={type} style={styles.typeContainer}>
                            <div style={styles.motherCard}>
                                {Object.keys(groupedRecipes[type]).sort((a, b) => a - b).map(tier => (
                                    <div key={tier} style={styles.tierContainer}>
                                        <div style={styles.tierCard}>
                                            <h4 style={styles.tierTitle}>Tier {tier}</h4>
                                        </div>
                                        {groupedRecipes[type][tier].map(recipe => {
                                            const isHovered = hoveredCards[recipe.id] || false;
                                            const hoverColor = filterStyles[filter].hoverColor;

                                            return (
                                                <div 
                                                    style={{
                                                        ...styles.card,
                                                        ...(isHovered && styles.cardHovered),
                                                        backgroundColor: isHovered ? hoverColor : 'rgba(255, 255, 255, 0.5)',
                                                    }} 
                                                    key={recipe.id} 
                                                    onClick={() => handleCardClick(recipe)}
                                                    onMouseEnter={() => setHoveredCards(prev => ({ ...prev, [recipe.id]: true }))}
                                                    onMouseLeave={() => setHoveredCards(prev => ({ ...prev, [recipe.id]: false }))}
                                                >
                                                    <img 
                                                        src={findImageForElement(recipe.result, recipe.tier) || filterStyles[filter]?.image} 
                                                        alt={recipe.result} 
                                                        style={styles.cardImage} 
                                                    />
                                                </div>
                                            );
                                        })}
                                    </div>
                                ))} 
                            </div>
                        </div>
                    )
                ))}
            </div>

            {selectedRecipe && (
                <RecipeDetails 
                    selectedRecipe={selectedRecipe} 
                    closeDetails={closeDetails} 
                    urls={urls}
                    imageCSS={filterStyles[filter].imageCSS} 
                    hoverColorCSS={filterStyles[filter].hoverColorCSS} 
                />
            )}
        </div>
    );
};

const styles = {
    wikiContainer: {
      position : 'relative',
      left: '0px', 
    },
    loadingContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh', // Reduced height from 100vh to 80vh
        background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)', // Gradient background
        color: '#fff',
        fontFamily: 'Arial, sans-serif',
        width: '100%',
        zIndex: 9999, // Ensure the loading screen is above other elements
    },
    spinner: {
        width: '50px', // Reduced size from 80px
        height: '50px',
        border: '8px solid rgba(255, 255, 255, 0.3)', // Adjusted border thickness
        borderTop: '8px solid #fff',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
    },
    loadingText: {
        marginTop: '10px', // Reduced margin
        fontSize: '16px', // Reduced font size from 24px
        fontWeight: 'bold',
        textAlign: 'center',
        animation: 'fadeIn 2s ease-in-out',
    },
    '@keyframes spin': {
        '0%': { transform: 'rotate(0deg)' },
        '100%': { transform: 'rotate(360deg)' },
    },
    '@keyframes fadeIn': {
        '0%': { opacity: 0 },
        '100%': { opacity: 1 },
    },
    filterContainer: {
        display: 'flex',
        justifyContent: 'flex-start', // Changed from 'space-around' to 'flex-start'
        marginLeft: '150px',
        marginBottom: '10px',
        zIndex: 2,
        gap: '150px' // Fixed space between buttons
    },
    filterImage: {
        width: '200px',
        height: '59px',
        cursor: 'pointer',
        boxShadow: '0 10px 12px rgba(0, 0, 0, 0.8)',
        borderRadius: '59px',
    },    
    cardContainer: {
        display: 'flex',
        flexDirection: 'column',
        width: '1200px',
        zIndex: 2,
    },
    typeContainer: {
        marginBottom: '20px',
    },
    motherCard: {
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'rgba(255, 255, 255, 0.2)', 
        borderRadius: '8px',
        padding: '10px',
        margin: '25px',
        width: 'auto',
        fontFamily: 'Comic Sans MS'
    },
    tierContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '10px',
    },
    tierCard: {
        width: '100px',
        backgroundColor: 'rgba(255, 255, 255, 0.5)', 
        borderRadius: '8px',
        padding: '10px',
        marginRight: '10px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.8)', 
    },
    tierTitle: {
        fontSize: '18px',
        fontWeight: 'bold',
    },
    card: {
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        borderRadius: '8px',
        margin: '10px',
        padding: '5px',
        cursor: 'pointer',
        transition: 'transform 0.3s ease, background-color 0.3s ease',
        width: '75px',
        height: '75px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxSizing: 'border-box',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.8)',
    },
    cardHovered: {
        transform: 'scale(1.2)',
    },
    cardImage: {
        width: '100%',
        height: '100%',
        objectFit: 'contain',
    },
    goBackButton: {
        position: 'relative', // Ensure the button is fixed on the screen
        top: '5px', // Position 5px from the top
        left: '60px', // Position 60px from the left
        width: '60px',
        height: '60px',
        marginBottom: '15px',
        backgroundColor: 'rgba(255, 255, 255, 0.4)',
        color: 'white',
        fontSize: '40px',
        border: 'none',
        borderRadius: '50%',
        cursor: 'pointer',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.6)',
        transition: 'background-color 0.3s ease, transform 0.3s ease',
    },
    '@keyframes spin': {
        '0%': { transform: 'rotate(0deg)' },
        '100%': { transform: 'rotate(360deg)' },
    },
    '@keyframes fadeIn': {
        '0%': { opacity: 0 },
        '100%': { opacity: 1 },
    },
};

// Add CSS animations to the document
const styleSheet = document.styleSheets[0];
const keyframesSpin = `
@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}`;
const keyframesFadeIn = `
@keyframes fadeIn {
    0% { opacity: 0; }
    100% { opacity: 1; }
}`;
styleSheet.insertRule(keyframesSpin, styleSheet.cssRules.length);
styleSheet.insertRule(keyframesFadeIn, styleSheet.cssRules.length);

export default Wiki;
