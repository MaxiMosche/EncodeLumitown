// src/components/Layout.js

import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Box, Typography } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import { Global, css } from '@emotion/react';
import { useSignalR } from './market/SignalRContext'; // Importamos useSignalR

const Layout = ({ children }) => {
  const location = useLocation(); // Obtener la ubicación actual

  // Verificar si estamos en la ruta '/market'
  const isMarketPage = location.pathname !== '/';

  // Estado para controlar si la pantalla es pequeña
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  // Obtener tokenPrices y epValue del contexto
  const { tokenPrices, epValue } = useSignalR();

  // Efecto para detectar el tamaño de la ventana
  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 1100); // Cambiar estado si el ancho es menor a 1100px
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Llamar una vez al cargar la página para inicializar el estado

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      {/* Condición para mostrar el mensaje en pantallas pequeñas */}
      {/* Esta sección puede ser eliminada más tarde */}
      {isSmallScreen && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%', // Cubrir toda la pantalla
            backgroundColor: 'rgba(244, 244, 244, 1)', // Fondo rojo
            color: 'black',
            textAlign: 'center',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 9999, // Asegura que esté encima de todo
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            This service is not available for devices with a resolution lower than 1100px.
          </Typography>
        </Box>
      )}

      <Global
        styles={css`
          body {
            margin: 0;
            overflow: auto;
            position: relative;
          }
        `}
      />
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <AppBar position="static" sx={{ backgroundColor: '#09132c' }}>
          <Toolbar>
            <Link to="/" style={{ textDecoration: 'none' }}>
              <img
                src="https://res.cloudinary.com/dm94dpmzy/image/upload/v1732162879/WEB_image_cwiu8i.webp"
                alt="Lumitown"
                style={{ height: '40px' }}
              />
            </Link>

            <Box sx={{ flexGrow: 1 }} />

            {/* Aquí añadimos el contenido de Topbar */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {tokenPrices &&
                tokenPrices.map((token, index) => (
                  <Box key={index} sx={{ display: 'flex', alignItems: 'center', color: '#fff' }}>
                    <img
                      src={token.tokenLogo}
                      alt={token.name}
                      style={{ height: '30px', marginRight: '8px' }}
                    />
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                      <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#fff' }}>
                      {token.name === 'Lumi Finance Token' ? 'Lua' : token.name}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#fff' }}>
                        ${parseFloat(token.price).toFixed(4)}
                      </Typography>
                    </Box>
                  </Box>
                ))}

              {epValue && (
                <Box sx={{ display: 'flex', alignItems: 'center', color: '#fff' }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                    <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#fff' }}>
                     E/$ Minimum
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#fff' }}>
                      {epValue} USD
                    </Typography>
                  </Box>
                </Box>
              )}
            </Box>
          </Toolbar>
        </AppBar>
        <Box
          sx={
            isMarketPage
              ? { flexGrow: 1 }
              : {
                  flexGrow: 1,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '100%',
                  maxWidth: '1200px',
                  margin: '20px auto',
                  padding: '20px',
                }
          }
        >
          {children}
        </Box>

        <Box sx={{ backgroundColor: '#09132c', padding: '10px', textAlign: 'center' }}>
          <Typography variant="body2" sx={{ color: '#ffffff' }}>
            © 2024 Lumitown. All rights reserved.
          </Typography>
        </Box>
      </Box>
    </>
  );
};

export default Layout;
