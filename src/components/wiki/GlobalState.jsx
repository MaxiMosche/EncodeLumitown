// src/components/wiki/GlobalState.js
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';  // Importa useLocation

const GlobalStateContext = createContext();

export const GlobalStateProvider = ({ children }) => {
  const [recipes, setRecipes] = useState([]);
  const [urls, setUrls] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();  // Obtiene la ruta actual

  useEffect(() => {
    // Solo ejecuta si la ruta es exactamente '/wiki'
    if (location.pathname === '/wiki') {
      const fetchData = async () => {
        setIsLoading(true);
        try {
          // Obtener la primera página para saber cuántas páginas hay
          const firstPageResponse = await fetch(`https://www.lumitown.somee.com/GetListRepice/1`);
          const firstPageData = await firstPageResponse.json();

          const totalPages = firstPageData.totalPages;
          const allRecipes = firstPageData.recipes; // Guardar directamente las recetas de la primera página

          // Obtener las recetas de todas las páginas
          for (let page = 2; page <= totalPages; page++) {
            const response = await fetch(`https://www.lumitown.somee.com/GetListRepice/${page}`);
            const data = await response.json();
            allRecipes.push(...data.recipes);
          }

          setRecipes(allRecipes);

          // Obtener las URLs de los elementos
          const urlsResponse = await fetch(`https://www.lumitown.somee.com/GetUrl`);
          const urlsData = await urlsResponse.json();
          setUrls(urlsData);
        } catch (error) {
          console.error("Error fetching data: ", error);
        } finally {
          setIsLoading(false);
        }
      };

      // Verificar si los datos ya están cargados
      if (recipes.length === 0 && urls.length === 0) {
        fetchData();
      } else {
        setIsLoading(false);
      }
    }
    // No ejecutar nada si estamos en una ruta que no es '/wiki'
    else {
      setIsLoading(false);  // Asegurarse de que no quede en estado de carga si no estamos en '/wiki'
    }
  }, [location.pathname, recipes.length, urls.length]);  // Dependencia de location.pathname

  return (
    <GlobalStateContext.Provider value={{ recipes, urls, isLoading }}>
      {children}
    </GlobalStateContext.Provider>
  );
};

export const useGlobalState = () => useContext(GlobalStateContext);
