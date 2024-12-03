// MarketLive.jsx
import React, { useState } from 'react';
import { useSignalR } from './SignalRContext';
import MarketItems from './MarketItems';
import EnergyPrice from './EnergyPrice';

const MarketLive = () => {
  const { marketData, isConnected } = useSignalR();
  const { items, energy } = marketData;

  const [activeTab, setActiveTab] = useState('items');

  // Estilos en línea usando objetos JavaScript
  const styles = {
    container: {
      fontFamily: `'Segoe UI', Tahoma, Geneva, Verdana, sans-serif`,
      minHeight: '100vh',
      backgroundColor: '#f5f7fa',
      padding: '40px 20px',
      boxSizing: 'border-box',
      position: 'relative', // Para posicionar elementos absolutos dentro
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    header: {
      textAlign: 'center',
      color: '#2d3748',
      marginBottom: '40px',
      fontSize: '3em',
      fontWeight: '700',
      background: 'linear-gradient(90deg, #1e3a8a, #3b82f6)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
    },
    tabContainer: {
      display: 'flex',
      justifyContent: 'center',
      marginBottom: '30px',
      backgroundColor: '#ffffff',
      borderRadius: '30px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      overflow: 'hidden',
      position: 'relative',
      width: 'fit-content',
    },
    tabButton: {
      flex: 1,
      backgroundColor: 'transparent',
      border: 'none',
      padding: '15px 20px',
      cursor: 'pointer',
      fontSize: '1.2em',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'background-color 0.3s ease, color 0.3s ease',
      color: '#4a5568',
      position: 'relative',
    },
    activeTabButton: {
      color: '#1e3a8a',
    },
    activeIndicator: {
      position: 'absolute',
      bottom: '0',
      left: '0',
      width: '50%',
      height: '4px',
      backgroundColor: '#1e3a8a',
      transition: 'transform 0.3s ease',
      transform: activeTab === 'items' ? 'translateX(0%)' : 'translateX(100%)',
    },
    content: {
      padding: '30px',
      backgroundColor: '#ffffff',
      borderRadius: '15px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      width: '95%',
      minHeight: '300px',
    },
    loadingOverlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: '#1e3a8a',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column',
      zIndex: 1000,
      color: '#ffffff',
    },
    spinner: {
      border: '8px solid rgba(255, 255, 255, 0.3)',
      borderTop: '8px solid #ffffff',
      borderRadius: '50%',
      width: '80px',
      height: '80px',
      animation: 'spin 1s linear infinite',
      marginBottom: '20px',
    },
    connectionStatusCard: {
      position: 'absolute',
      top: '20px',
      right: '20px',
      backgroundColor: '#ffffff',
      padding: '10px 20px',
      borderRadius: '10px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      display: 'flex',
      alignItems: 'center',
      zIndex: 500,
    },
    statusDot: {
      width: '15px',
      height: '15px',
      borderRadius: '50%',
      marginRight: '10px',
      animation: 'blink 1s infinite',
    },
    statusText: {
      fontSize: '1em',
      color: '#333333',
    },
    disconnectedStatusDot: {
      backgroundColor: '#ff4d4f', // Rojo
      animation: 'none',
    },
    connectedStatusDot: {
      backgroundColor: '#52c41a', // Verde
    },
    connectingStatusDot: {
      backgroundColor: '#faad14', // Amarillo / Gris
    },
    icon: {
      width: '20px',
      height: '20px',
      marginRight: '8px',
      fill: '#4a5568',
    },
    iconActive: {
      fill: '#1e3a8a',
    },
    '@keyframes spin': {
      to: {
        transform: 'rotate(360deg)',
      },
    },
    '@keyframes blink': {
      '0%, 50%, 100%': {
        opacity: 1,
      },
      '25%, 75%': {
        opacity: 0.5,
      },
    },
  };

  // Determinar el estado de la conexión para la tarjeta
  let connectionState = 'connecting';
  if (isConnected === true) {
    connectionState = 'connected';
  } else if (isConnected === false) {
    connectionState = 'disconnected';
  }

  // SVG Icons
  const ItemIcon = ({ active }) => (
    <svg
      style={{
        ...styles.icon,
        ...(active ? styles.iconActive : {}),
      }}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
    >
      <path d="M3 3h18v2H3V3zm2 4h14v14H5V7zm2 2v10h10V9H7z" />
    </svg>
  );

  const EnergyIcon = ({ active }) => (
    <svg
      style={{
        ...styles.icon,
        ...(active ? styles.iconActive : {}),
      }}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
    >
      <path d="M13 2L3 14h9v8l10-12h-9V2z" />
    </svg>
  );

  return (
    <div style={styles.container}>
      {/* Tarjeta de estado de conexión */}
      <div style={styles.connectionStatusCard}>
        <div
          style={{
            ...styles.statusDot,
            ...(connectionState === 'connected'
              ? styles.connectedStatusDot
              : connectionState === 'disconnected'
              ? styles.disconnectedStatusDot
              : styles.connectingStatusDot),
          }}
        ></div>
        <span style={styles.statusText}>
          {connectionState === 'connected'
            ? 'Live'
            : connectionState === 'disconnected'
            ? 'Disconnected'
            : 'Connecting'}
        </span>
      </div>

      <h1 style={styles.header}>Market Live</h1>
      {isConnected ? (
        <>
          <div style={styles.tabContainer}>
            <button
              onClick={() => setActiveTab('items')}
              style={{
                ...styles.tabButton,
                ...(activeTab === 'items' ? styles.activeTabButton : {}),
              }}
            >
              <ItemIcon active={activeTab === 'items'} />
              Items
            </button>
            <button
              onClick={() => setActiveTab('energy')}
              style={{
                ...styles.tabButton,
                ...(activeTab === 'energy' ? styles.activeTabButton : {}),
              }}
            >
              <EnergyIcon active={activeTab === 'energy'} />
              Energy
            </button>
            <div style={styles.activeIndicator}></div>
          </div>
          <div style={styles.content}>
            {activeTab === 'items' ? (
              <MarketItems items={items} />
            ) : (
              <EnergyPrice energy={energy} />
            )}
          </div>
        </>
      ) : (
        <div style={styles.loadingOverlay}>
          <div style={styles.spinner}></div>
          <h2 style={{ fontSize: '1.5em' }}>Connecting to Mavis Market</h2>
        </div>
      )}

      {/* Estilos globales para animaciones */}
      <style>
        {`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
          @keyframes blink {
            0%, 50%, 100% { opacity: 1; }
            25%, 75% { opacity: 0.5; }
          }
        `}
      </style>
    </div>
  );
};

export default MarketLive;

