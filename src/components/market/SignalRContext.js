// src/components/market/SignalRContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import config from '../config';

const SignalRContext = createContext();

export const useSignalR = () => {
  const context = useContext(SignalRContext);
  if (!context) {
    throw new Error('useSignalR debe usarse dentro de un SignalRProvider');
  }
  return context;
};

// Función para convertir Wei a Ether con decimales
const convertWeiToEther = (weiPrice) => {
  try {
    const weiValue = BigInt(weiPrice);
    const etherValue = Number(weiValue) / 1e18;
    return etherValue;
  } catch (error) {
    console.error('Error al convertir Wei a Ether:', error);
    return 0;
  }
};

// Funciones auxiliares
const applyMarketFee = (price, marketFeePercentage) => {
  return price * (1 + marketFeePercentage / 10000);
};

const calculateSimpleCost = (price, energyObtain, marketFeePercentage) => {
  const validPrice = parseFloat(price) || 0;
  const validEnergy = parseFloat(energyObtain) || 1;
  const finalPrice = applyMarketFee(validPrice, marketFeePercentage);
  const isInvalid = validPrice === 0;
  return {
    totalCost: finalPrice,
    costPerEnergy: isInvalid ? Infinity : finalPrice / validEnergy,
    isInvalid,
  };
};

const calculateCraftingCost = (crafting, fee, energyObtain, name, marketFeePercentage) => {
  const craftingTotal = crafting.reduce(
    (total, craft) =>
      total +
      (craft.element !== 'Empty Bottle'
        ? parseFloat(craft.price || 0) * parseInt(craft.quantity || 0)
        : 0),
    0
  );
  const isInvalid = crafting.some(
    (craft) =>
      craft.element !== 'Empty Bottle' &&
      (craft.price === undefined || parseFloat(craft.price) === 0)
  );
  const validFee = parseFloat(fee) || 0;
  const validEnergy = parseFloat(energyObtain) || 1;

  const multiplier = name && name.toLowerCase().includes('lv 1') ? 3.5 : 4;
  const energyAdjusted = validEnergy * multiplier;

  const finalPrice = applyMarketFee(craftingTotal + validFee, marketFeePercentage);
  return {
    totalCost: finalPrice,
    costPerEnergy: isInvalid ? Infinity : finalPrice / energyAdjusted,
    isInvalid,
  };
};

export const SignalRProvider = ({ children }) => {
  const [marketData, setMarketData] = useState({ items: [], energy: [] });
  const [tokenPrices, setTokenPrices] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [connection, setConnection] = useState(null);
  const [epValue, setEpValue] = useState(null);

  const marketFeePercentage = 425; // Ajusta este valor si es necesario

  // Establecer la conexión SignalR
  useEffect(() => {
    const newConnection = new HubConnectionBuilder()
      .withUrl(`${config.API_BASE_URL}/townlabshub`)
      .configureLogging(LogLevel.Information)
      .withAutomaticReconnect([0, 2000, 10000, 30000]) // Reconexión con incrementos
      .build();

    setConnection(newConnection);
  }, []);

  // Manejar la conexión SignalR
  useEffect(() => {
    if (connection) {
      const startConnection = async () => {
        try {
          await connection.start();
          setIsConnected(true);
          console.log('SignalR conectado');
        } catch (error) {
          console.error('Error al conectar SignalR:', error);
          setIsConnected(false);
        }
      };

      const handleReconnecting = () => {
        console.log('Intentando reconectar...');
        setIsConnected(false);
      };

      const handleReconnected = () => {
        console.log('Reconexión exitosa.');
        setIsConnected(true);
      };

      const handleDisconnected = async () => {
        console.warn('Desconectado. Intentando reconectar...');
        setIsConnected(false);

        // Intentar reconectar manualmente después de un tiempo
        setTimeout(() => {
          if (connection.state === 'Disconnected') {
            startConnection();
          }
        }, 5000);
      };

      connection.onreconnecting(handleReconnecting);
      connection.onreconnected(handleReconnected);
      connection.onclose(handleDisconnected);

      startConnection();

      return () => {
        connection.off('reconnecting', handleReconnecting);
        connection.off('reconnected', handleReconnected);
        connection.off('close', handleDisconnected);
        connection.stop();
      };
    }
  }, [connection]);

  // Manejar tokenPrices
  const handleTokenPrices = (tokensData) => {
    const tokensArray = tokensData.tokens; // Accedemos al array de tokens

    if (Array.isArray(tokensArray) && tokensArray.length > 0) {
      const updatedTokenPrices = tokensArray.map((token) => ({
        ...token,
        price: parseFloat(token.price).toFixed(4),
        tokenLogo: token.tokenLogo || '',
      }));
      setTokenPrices(updatedTokenPrices);
    } else {
      console.log('No se recibieron tokens en handleTokenPrices o el array está vacío.');
    }
  };

  // Manejar los mensajes de "Prices" y "tokenPrices" de SignalR
  useEffect(() => {
    if (connection && isConnected) {
      // Manejador para "Prices"
      const handlePrices = (tokens) => {
        setMarketData((prevData) => {
          const updatedItems = prevData.items.map((item) => {
            const token = tokens.find(
              (t) => t.name.trim().toLowerCase() === item.name.trim().toLowerCase()
            );
            return { ...item, price: convertWeiToEther(token ? token.minPrice : '0') };
          });

          const updatedEnergy = prevData.energy.map((potion) => {
            const potionToken = tokens.find(
              (t) => t.name.trim().toLowerCase() === potion.name.trim().toLowerCase()
            );
            const updatedCrafting = potion.crafting.map((craft) => {
              const craftToken = tokens.find(
                (t) => t.name.trim().toLowerCase() === craft.element.trim().toLowerCase()
              );
              const relatedItem = updatedItems.find(
                (i) => i.name.trim().toLowerCase() === craft.element.trim().toLowerCase()
              );
              return {
                ...craft,
                price: convertWeiToEther(craftToken ? craftToken.minPrice : '0'),
                url: relatedItem ? relatedItem.url : null,
              };
            });
            return {
              ...potion,
              price: convertWeiToEther(potionToken ? potionToken.minPrice : '0'),
              crafting: updatedCrafting,
            };
          });

          return { items: updatedItems, energy: updatedEnergy };
        });
      };

      // Registrar los manejadores de eventos con el nombre correcto
      connection.on('Prices', handlePrices); // Asegúrate de que el nombre del evento coincide
      connection.on('tokenprices', handleTokenPrices);

      return () => {
        connection.off('Prices', handlePrices);
        connection.off('tokenprices', handleTokenPrices);
      };
    }
  }, [connection, isConnected]);

  // Obtener datos iniciales del mercado vía HTTPS
  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        const response = await fetch(`${config.API_BASE_URL}/GetMarketLive`);
        const data = await response.json();

        const items = data.items.map((item) => ({
          ...item,
          price: '0',
        }));

        const energy = data.potions.map((potion) => ({
          ...potion,
          price: '0',
          crafting: potion.crafting.map((craft) => ({
            ...craft,
            price: '0',
            url: null,
          })),
        }));

        setMarketData({ items, energy });
      } catch (error) {
        console.error('Error al obtener datos del mercado:', error);
      }
    };

    fetchMarketData();
  }, []);

  // Nuevo useEffect para calcular E/P cuando tokenPrices o marketData cambien
  useEffect(() => {
    if (tokenPrices.length > 0 && marketData.energy.length > 0) {
      calculateEPValue(marketData.energy);
    }
  }, [tokenPrices, marketData]);

  // Función para calcular el valor mínimo de E/P
  const calculateEPValue = (energyData) => {
    if (energyData && energyData.length > 0) {
      const allCards = energyData.flatMap((potion) => {
        const simpleCost = calculateSimpleCost(
          potion.price || 0,
          potion.energyObtain,
          marketFeePercentage
        );

        const craftingCost = potion.crafting
          ? calculateCraftingCost(
              potion.crafting,
              potion.fee || 0,
              potion.energyObtain,
              potion.name,
              marketFeePercentage
            )
          : null;

        const cards = [
          {
            ...potion,
            type: 'simple',
            costPerEnergy: simpleCost.costPerEnergy,
            isInvalid: simpleCost.isInvalid,
            price: simpleCost.totalCost,
          },
        ];

        if (craftingCost) {
          cards.push({
            ...potion,
            type: 'crafting',
            costPerEnergy: craftingCost.costPerEnergy,
            isInvalid: craftingCost.isInvalid,
            price: craftingCost.totalCost,
          });
        }

        return cards;
      });

      // Filtrar cards con precios válidos
      const validCards = allCards.filter(
        (card) => !card.isInvalid && card.costPerEnergy !== Infinity && !isNaN(card.costPerEnergy)
      );

      // Ordenar las cards por costo por energía
      const sortedCards = validCards.sort((a, b) => a.costPerEnergy - b.costPerEnergy);
      
      // Tomar el E/P más bajo
      if (sortedCards.length > 0) {
        const lowestEP = sortedCards[0];
        // Obtener el precio del token Lumi
        const lumiToken = tokenPrices.find(
          (t) => t.name.trim().toLowerCase() === 'lumi finance token'
        );
        const lumiPrice = lumiToken ? parseFloat(lumiToken.price) : 1;

        // Función para convertir a USD usando el precio de Lumi
        const convertToUSD = (price) => {
          return (price * lumiPrice).toFixed(4);
        };
        console.log('price lua' , lumiPrice)
        // Convertir el costo por energía a USD
        const epValueUSD = convertToUSD(lowestEP.costPerEnergy);
        setEpValue(epValueUSD);
      } else {
        // Si no hay cards válidas, establecer epValue en null
        setEpValue(null);
      }
    }
  };

  return (
    <SignalRContext.Provider value={{ marketData, tokenPrices, isConnected, epValue }}>
      {children}
    </SignalRContext.Provider>
  );
};
