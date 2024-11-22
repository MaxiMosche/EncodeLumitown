import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Wikiconsumable = () => {
  const [recipes, setRecipes] = useState([]);
  const [images, setImages] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);  // Estado para almacenar el ítem seleccionado
  const navigate = useNavigate();  // Hook de navegación para ir a /homewiki

  useEffect(() => {
    fetch('https://www.lumitown.somee.com/GetListRepiceConsumable')
      .then((response) => response.json())
      .then((data) => setRecipes(data));

    fetch('https://www.lumitown.somee.com/GetUrlConsumable')
      .then((response) => response.json())
      .then((data) => setImages(data));

    document.body.style.backgroundColor = '#09132c'; 
    document.body.style.backgroundImage = 'url("https://res.cloudinary.com/dm94dpmzy/image/upload/v1731964105/wiki_home_sbsqrw.webp")';
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundPosition = 'center';
    document.body.style.backgroundAttachment = 'fixed';
    document.body.style.backgroundRepeat = 'no-repeat';
  }, []);

  const getImageUrl = (elementName) => {
    const image = images.find((img) => img.name.toLowerCase() === elementName.toLowerCase());
    return image ? image.url : 'https://via.placeholder.com/40';
  };

  const handleItemClick = (item) => {
    setSelectedItem(item);  // Actualiza el estado con el ítem seleccionado
  };

  const ItemCard = ({ item }) => {
    return (
      <div className="item-card" onClick={() => handleItemClick(item)}>
        <img
          src={getImageUrl(item.element)}
          alt={item.element}
          className="item-image"
        />
        <span className="item-quantity">{item.quantity}</span>
      </div>
    );
  };

  const CraftingCard = ({ sectionTitle, items, mainImageUrl, mainTitle }) => {
    return (
      <div className="crafting-card">
        <div className="main-image">
          <img
            src={mainImageUrl}
            alt={mainTitle}
            className="main-item-image"
          />
        </div>
        <div className="card-list">
          {items.map((item, index) => (
            <ItemCard key={index} item={item} />
          ))}
        </div>
      </div>
    );
  };

  const RecipeCard = ({ recipe }) => {
    const craftingSections = [
      { title: 'Gathering', items: recipe.gathering },
      { title: 'Combat', items: recipe.combat },
      { title: 'Farming Livestock', items: recipe.farmingLivestock },
      { title: 'Farming Planting', items: recipe.farmingPlanting },
      { title: 'Craft Default', items: recipe.craftDefault }
    ];

    const mainImageUrl = getImageUrl(recipe.result);
    const mainTitle = recipe.result;

    return (
      <div className="recipe-cards">
        <div className="recipe-row">
          {craftingSections.map((section, index) => {
            if (section.items.length === 0) return null;

            return (
              <CraftingCard
                key={index}
                sectionTitle={section.title}
                items={section.items}
                mainImageUrl={mainImageUrl}
                mainTitle={mainTitle}
              />
            );
          })}
        </div>
      </div>
    );
  };

  const groupedByTier = recipes.reduce((acc, recipe) => {
    const tier = recipe.tier || 1;
    if (!acc[tier]) {
      acc[tier] = [];
    }
    acc[tier].push(recipe);
    return acc;
  }, {});

  const sortedTiers = Object.keys(groupedByTier).sort((a, b) => a - b);

  const handleGoBack = () => {
    navigate('/homewiki');
  };

  // Función para cerrar el info-panel
  const handleCloseInfoPanel = () => {
    setSelectedItem(null); // Restablecer el ítem seleccionado
  };

  return (
    <div className="wikiconsumable-container">
      <button className="back-button" onClick={handleGoBack}>
        &lt;
      </button>
      <div className="recipes-list">
        {sortedTiers.map((tier) => (
          <div key={tier} className="tier-group">
            <div className="tier-card">
              <h2>Tier {tier}</h2>
            </div>
            <div className="recipes">
              {groupedByTier[tier].map((recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Pestaña de información con botón de cierre */}
      {selectedItem && (
        <div className="info-panel">
  <button className="close-button" onClick={handleCloseInfoPanel}>X</button>
  <h3>{selectedItem.element.trim().replace(/\s+/g, ' ').replace(/^\w/, (match) => match.toUpperCase())}</h3>
  <img
    src={getImageUrl(selectedItem.element)}
    alt={selectedItem.element}
    className="info-image"
  />
</div>
      )}

      {/* Estilos CSS dentro del componente */}
      <style jsx>{`
        .wikiconsumable-container {
          padding: 20px;
          width: 97%;
          display: flex;
        }

         .back-button {
           background-color: rgba(255, 255, 255, 0.6);
           color: white;
           width: 50px;
           height: 40px;
           border: none;
           font-size: 40px;
           cursor: pointer;
           border-radius: 50%;
           display: flex; /* Usar flexbox para el centrado */
           justify-content: center; /* Centra el contenido horizontalmente */
           align-items: center; /* Centra el contenido verticalmente */
           transition: background-color 0.3s ease, transform 0.3s ease;
           box-shadow: 0 4px 8px rgba(0, 0, 0, 0.6);
         }

        .back-button:hover {
          transform: scale(1.1);
        }

        .back-button:focus {
          outline: none;
        }

        .recipes-list {
          margin-top : 70px;
          display: flex;
          flex-wrap: wrap;
          gap: 20px;
          justify-content: flex-start;
        }

        .tier-group {
          display: flex;
          width: 100%;
          gap: 20px;
          justify-content: flex-start;
        }

        .tier-card {
          background-color: rgba(255, 255, 255, 0.7);
          border: 1px solid #ccc;
          border-radius: 8px;
          padding: 20px;
          fontFamily: Comic Sans MS, sans-serif;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          margin-left: auto;
          width: 200px;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .tier-card h2 {
          font-size: 45px;
          font-Family: Comic Sans MS;
          text-align: center;
          color: #333;
          margin: 0;
        }

        .recipes {
          display: flex;
          flex-wrap: wrap;
          gap: 20px;
          justify-content: flex-start;
          flex-grow: 1;
        }

        .info-panel h3 {
       text-transform: capitalize;
        }

        .recipe-cards {
          display: flex;
          flex-wrap: wrap;
          gap: 20px;
        }

        .recipe-row {
          display: flex;
          flex-wrap: wrap;
          gap: 20px;
          justify-content: center;
        }

        .crafting-card {
          border: 1px solid #ccc;
          background-color: rgba(255, 255, 255, 0.4);
          border-radius: 8px;
          padding: 20px;
          width: 200px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .crafting-card:hover {
          transform: scale(1.05);
          box-shadow: 0 8px 16px rgba(255, 255, 255, 0.6);
        }

        .main-image {
          display: flex;
          justify-content: center;
          margin-bottom: 10px;
        }

        .main-item-image {
          width: 100px;
          height: 100px;
          object-fit: cover;
          border-radius: 5px;
          transition: transform 0.3s ease;
        }

        .main-item-image:hover {
          transform: scale(1.1);
        }

        .card-list {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          justify-content: center;
        }

        .item-card {
          width: 55px;
          height: 55px;
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: rgba(255, 255, 255, 0.3);
          border-radius: 5px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          position: relative;
          cursor: pointer;
          transition: transform 0.3s ease;
        }

        .item-card:hover {
          transform: scale(1.1);
        }

        .item-card img {
          width: 40px;
          height: 40px;
          object-fit: cover;
          border-radius: 5px;
          transition: transform 0.3s ease;
        }

        .item-quantity {
          position: absolute;
          bottom: 0;
          right: 0;
          font-size: 12px;
          color: #333;
          background-color: rgba(0, 0, 0, 0.5);
          color: white;
          padding: 2px 5px;
          border-radius: 3px;
        }

        .info-panel {
          position: fixed;
          top: 250px;
          right: 0;
          transform: translateY(-50%);
          width: 250px;
          background-color: rgba(0, 0, 0, 0.8);
          color: white;
          padding: 20px;
          border-radius: 10px;
          box-shadow: -4px 0 10px rgba(0, 0, 0, 0.5);
          z-index: 1000;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }

        .close-button {
          background: transparent;
          color: white;
          border: none;
          font-size: 20px;
          cursor: pointer;
          margin-bottom: 10px;
            position: absolute; /* Esto permite moverlo de manera absoluta */
  top: 10px; /* Ajusta la distancia desde la parte superior */
  right: 10px; /* Ajusta la distancia desde el lado derecho */
        }

        .close-button:hover {
          color: red;
        }

        .info-image {
          width: 100%;
          height: auto;
          object-fit: cover;
          border-radius: 5px;
          margin-bottom: 10px;
        }
      `}</style>
    </div>
  );
};

export default Wikiconsumable;
