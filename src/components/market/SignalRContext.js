import React, { createContext, useContext, useState, useEffect } from 'react';
import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';

const SignalRContext = createContext();

// Hook para usar el contexto SignalR
export const useSignalR = () => {
  const context = useContext(SignalRContext);
  if (!context) {
    throw new Error("useSignalR debe usarse dentro de un SignalRProvider");
  }
  return context;
};

// Convertir Wei a Ether
const convertWeiToEther = (weiPrice) => {
  const weiValue = BigInt(weiPrice);
  const etherValue = weiValue / BigInt(10 ** 18);
  const decimals = weiValue % BigInt(10 ** 18);

  const decimalString = decimals.toString().padStart(18, '0');
  let formattedPrice = `${etherValue}.${decimalString}`;
  if (formattedPrice.includes('.')) {
    formattedPrice = formattedPrice.split('.')[0] + '.' + formattedPrice.split('.')[1].slice(0, 2);
  }
  return formattedPrice;
};

export const SignalRProvider = ({ children }) => {
  const [marketData, setMarketData] = useState({ items: [], energy: [] });
  const [isConnected, setIsConnected] = useState(false);
  const [connection, setConnection] = useState(null);

  useEffect(() => {
    const newConnection = new HubConnectionBuilder()
      .withUrl("https://lumitownserver.somee.com/townlabshub")
      .configureLogging(LogLevel.Information)
      .withAutomaticReconnect([0, 2000, 10000, 30000]) // Reconexión con incrementos
      .build();

    setConnection(newConnection);
  }, []);

  useEffect(() => {
    if (connection) {
      const startConnection = async () => {
        try {
          await connection.start();
          setIsConnected(true);
          console.log("SignalR conectado");
        } catch (error) {
          console.error("Error al conectar SignalR:", error);
          setIsConnected(false);
        }
      };

      const handleReconnecting = () => {
        console.log("Intentando reconectar...");
        setIsConnected(false);
      };

      const handleReconnected = () => {
        console.log("Reconexión exitosa.");
        setIsConnected(true);
      };

      const handleDisconnected = async () => {
        console.warn("Desconectado. Intentando reconectar...");
        setIsConnected(false);

        // Intentar reconectar manualmente después de un tiempo
        setTimeout(() => {
          if (connection.state === "Disconnected") {
            startConnection();
          }
        }, 5000);
      };

      connection.onreconnecting(handleReconnecting);
      connection.onreconnected(handleReconnected);
      connection.onclose(handleDisconnected);

      startConnection();

      return () => {
        connection.off("reconnecting", handleReconnecting);
        connection.off("reconnected", handleReconnected);
        connection.off("close", handleDisconnected);
        connection.stop();
      };
    }
  }, [connection]);

  useEffect(() => {
    if (connection && isConnected) {
      connection.on("Prices", (tokens) => {
        const updatedItems = marketData.items.map((item) => {
          const token = tokens.find(t => t.name.trim().toLowerCase() === item.name.trim().toLowerCase());
          return { ...item, price: convertWeiToEther(token ? token.minPrice : '0') };
        });

        const updatedEnergy = marketData.energy.map((potion) => {
          const potionToken = tokens.find(t => t.name.trim().toLowerCase() === potion.name.trim().toLowerCase());
          const updatedCrafting = potion.crafting.map((craft) => {
            const craftToken = tokens.find(t => t.name.trim().toLowerCase() === craft.element.trim().toLowerCase());
            const relatedItem = updatedItems.find(i => i.name.trim().toLowerCase() === craft.element.trim().toLowerCase());
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

        setMarketData({ items: updatedItems, energy: updatedEnergy });
      });

      return () => {
        connection.off("Prices");
      };
    }
  }, [connection, isConnected, marketData]);

  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        const response = await fetch("https://www.lumitownserver.somee.com/GetMarketLive");
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
        console.error("Error al obtener datos del mercado:", error);
      }
    };

    fetchMarketData();
  }, []);

  return (
    <SignalRContext.Provider value={{ marketData, isConnected }}>
      {children}
    </SignalRContext.Provider>
  );
};
