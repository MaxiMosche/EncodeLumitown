import React, { createContext, useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';  
import CryptoJS from 'crypto-js';  

const GlobalStateContext = createContext();

export const GlobalStateProvider = ({ children }) => {
  const [recipes, setRecipes] = useState([]);
  const [urls, setUrls] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();  

  const secretKey = process.env.REACT_APP_AES_SECRET_KEY;
  const iv = process.env.REACT_APP_AES_IV;
  console.log(secretKey)
  console.log(iv)

  const decryptData = (encryptedData) => {
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedData, CryptoJS.enc.Utf8.parse(secretKey), {
        iv: CryptoJS.enc.Utf8.parse(iv),
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      });

      const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
      const parsedData = JSON.parse(decryptedData); // Parseamos el JSON desencriptado

      // Función para convertir las claves a minúsculas de manera recursiva
      const convertKeysToLowerCase = (obj) => {
        if (Array.isArray(obj)) {
          return obj.map(convertKeysToLowerCase);  // Si es un array, aplicamos recursivamente
        } else if (typeof obj === 'object' && obj !== null) {
          return Object.keys(obj).reduce((acc, key) => {
            const lowerCaseKey = key.toLowerCase();  // Convertimos la clave a minúscula
            acc[lowerCaseKey] = convertKeysToLowerCase(obj[key]);  // Recursivamente convertimos el valor
            return acc;
          }, {});
        }
        return obj;  // Si no es un objeto ni array, devolvemos el valor tal cual
      };

      // Convertir las claves a minúsculas en todo el objeto
      return convertKeysToLowerCase(parsedData);
    } catch (error) {
      console.error("Error al desencriptar los datos:", error);
      return null;
    }
  };

  useEffect(() => {
    // Solo ejecuta si la ruta es exactamente '/wiki'
    if (location.pathname === '/wiki') {
      const fetchData = async () => {
        // Solo carga los datos si `recipes` o `urls` están vacíos
        if (recipes.length === 0 || urls.length === 0) {
          setIsLoading(true);
          try {
            // Obtener la primera página para saber cuántas páginas hay
            const firstPageResponse = await fetch(`https://lumitownserver.somee.com/GetListRepice/1`);
            const firstPageData = await firstPageResponse.json();
            const encryptedData = firstPageData.data;
            const decryptedData = decryptData(encryptedData);
            const totalPages = decryptedData.totalpages;
            const allRecipes = decryptedData.recipes; 

            // Obtener las recetas de todas las páginas
            for (let page = 2; page <= totalPages; page++) {
              const response = await fetch(`https://lumitownserver.somee.com/GetListRepice/${page}`);
              const data = await response.json();
              const encryptedData = data.data;
              const decryptedData = decryptData(encryptedData);
              allRecipes.push(...decryptedData.recipes);
            }

            setRecipes(allRecipes);

            // Obtener las URLs de los elementos
            const urlsResponse = await fetch(`https://lumitownserver.somee.com/GetUrl`);
            const urlsData = await urlsResponse.json();
            const encryptedDataUrl = urlsData.data;
            const decryptedDataUrl = decryptData(encryptedDataUrl);
            console.log(decryptedDataUrl);
            setUrls(decryptedDataUrl);

          } catch (error) {
            console.error("Error fetching data: ", error);
          } finally {
            setIsLoading(false);
          }
        } else {
          // Si los datos ya están cargados, no hacemos nada
          setIsLoading(false);
        }
      };

      fetchData();
    } else {
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
