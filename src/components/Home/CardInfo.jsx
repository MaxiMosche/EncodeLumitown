import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button as MuiButton } from '@mui/material';
import { PlayArrow, Favorite, Share } from '@mui/icons-material';

const CardInfo = ({
  isSidebarOpen,
  setIsSidebarOpen,
  selectedSecondaryImage,
  selectedInfo,
  selectedText,
  selectedVideo,
  selectedRedirect, // Añadir redirección
}) => {
  const [animate, setAnimate] = useState(false);
  const [buttonVisible, setButtonVisible] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const navigate = useNavigate();

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const videoId = selectedVideo.split('/').pop().split('?')[0];
  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        setIsPlaying(false);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    setIsPlaying(false);
  }, [thumbnailUrl, videoId]);

  useEffect(() => {
    if (isSidebarOpen) {
      setAnimate(true);
      setButtonVisible(false);

      const timer = setTimeout(() => {
        setAnimate(false);
        setButtonVisible(true);
      }, 500);

      return () => clearTimeout(timer);
    } else {
      setButtonVisible(false);
    }
  }, [isSidebarOpen, selectedSecondaryImage]);

  if (!isSidebarOpen) return null;

  const handleGoClick = () => {
    if (selectedRedirect) {
      // Verificar si la URL es externa (comienza con http o https)
      if (selectedRedirect.startsWith('http://') || selectedRedirect.startsWith('https://')) {
        // Abre en una nueva pestaña
        window.open(selectedRedirect, '_blank');
      } else if (selectedRedirect.startsWith('/')) {
        // Navega dentro de la aplicación si es una URL relativa
        navigate(selectedRedirect);
      }
    }
  };


  const Button = ({ onClick, icon, label }) => (
    <button
      onClick={onClick}
      style={{
        margin: '10px',
        padding: '20px',
        border: '1px solid #f298ff',
        borderRadius: '50%',
        backgroundColor: 'transparent',
        color: '#f298ff',
        fontSize: '20px',
        fontWeight: 'bold',
        cursor: 'pointer',
        opacity: buttonVisible ? 1 : 0,
        transition: 'opacity 0.5s ease-in-out, transform 0.2s',
        visibility: buttonVisible ? 'visible' : 'hidden',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.05)';
        e.currentTarget.style.opacity = '0.8';
        e.currentTarget.style.borderColor = 'white';
        e.currentTarget.style.color = 'white';
        e.currentTarget.style.backgroundColor = '#f298ff';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
        e.currentTarget.style.opacity = '1';
        e.currentTarget.style.borderColor = '#f298ff';
        e.currentTarget.style.color = '#f298ff';
        e.currentTarget.style.backgroundColor = 'transparent';
      }}
    >
      {icon}
      <span style={{ marginLeft: '5px' }}>{label}</span>
    </button>
  );

  return (
    <div
      className="info-card slide-in"
      style={{
        width: window.innerWidth <= 730 ? '90%' : '400px',
        height: window.innerWidth <= 730 ? '95vh' : '91vh',
        position: 'fixed',
        top: window.innerWidth <= 730 ? '1%' : '30px',
        right: window.innerWidth <= 730 ? '1%' : undefined,
        overflowY: 'auto',
        backgroundColor: '#092143',
        borderRadius: '10px',
        zIndex: 10,
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.8)',
        animation: 'slideIn 0.5s ease-out',
        padding: 0,
      }}
    >
      {/* Cerrar botón */}
      <div style={{
  display: 'flex',
  justifyContent: 'flex-start',
  padding: '10px',
  position: 'absolute',
  top: '0px',
  right: '10px',
  zIndex: 20,
}}>
  <div
    onClick={() => setIsSidebarOpen(false)}
    style={{
      cursor: 'pointer',
      backgroundColor: 'white',
      borderRadius: '50%',
      border: '2px solid #f298ff',  // Borde del mismo color que la cruz
      width: '20px',
      height: '20px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative',  // Esto es importante para posicionar la "X"
      animation: 'fadeIn 0.5s ease-out',
    }}
    aria-label="Cerrar"
  >
    {/* Cruz (X) superpuesta */}
    <svg 
      width="20" 
      height="20" 
      fill="none" 
      stroke="#f298ff"  // Color de la cruz (igual al borde)
      strokeWidth="2" 
      viewBox="0 0 24 24"
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',  // Centrado de la cruz
      }}
    >
      <path d="M18.36 6.64L17 5.28 12 10.28 7 5.28 5.64 6.64 10.64 11.64 5.64 16.64 7 18 12 13 17 18l1.36-1.36-5-5z" />
    </svg>
  </div>
</div>

      {/* Contenido principal */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
          <img
            src={selectedSecondaryImage}
            alt={selectedInfo}
            style={{
              width: '100%',
              height: '100%',
              borderRadius: '10px 10px 0 0',
              animation: animate ? 'slideInDown 0.5s ease-out' : 'none',
              objectFit: 'cover',
              margin: 0,
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(to top, rgba(9, 33, 67, 1), rgba(9, 33, 67, 0))',
              borderRadius: '10px 10px 0 0',
            }}
          />
        </div>
        <p style={{
          color: '#6b94b2',
          textAlign: 'center',
          margin: '0 10px',
          lineHeight: '1.5',
          animation: animate ? 'slideInRight 0.7s ease-out' : 'none'
        }}>
          <strong style={{ color: 'white' }}>{capitalizeFirstLetter(selectedInfo)}</strong>
          <br /><br />
          {selectedText}
        </p>

        {/* Botones de acción */}
        <div style={{ animation: animate ? 'fadeIn 0.7s ease-out' : 'none', display: 'flex', width:'80%', justifyContent: 'center', marginTop: '20px', marginBottom: '20px' }}>
          <MuiButton
            onClick={handleGoClick}
            variant="outlined"
            style={{
              color: '#f298ff',
              width:'100%',
              borderColor: '#f298ff',
              transition: 'transform 0.2s, background-color 0.3s, color 0.3s, border-color 0.3s',
              marginRight: '10px',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f298ff';
              e.currentTarget.style.color = 'white';
              e.currentTarget.style.borderColor = 'white';
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = '#f298ff';
              e.currentTarget.style.borderColor = '#f298ff';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            More Info
          </MuiButton>
        </div>
      </div>

      {/* Video Thumbnail */}
      {videoId && thumbnailUrl && (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          marginTop: '0px',
          paddingBottom: '0px',
          position: 'relative',
          cursor: 'pointer',
          animation: animate ? 'slideInUp 0.7s ease-out' : 'none'
        }} onClick={() => setIsPlaying(true)}>
          <img
            src={thumbnailUrl}
            alt="Video Thumbnail"
            style={{
              width: '100%',
              height: '100%',
              borderRadius: '10px',
              objectFit: 'cover',
              padding: '0px',
              transition: 'transform 0.5s ease',
              transform: isPlaying ? 'scale(1.1)' : 'scale(1)',
            }}
          />
          {isPlaying ? (
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{ borderRadius: '10px', position: 'absolute', top: 0, left: 0 }}
            />
          ) : (
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              fontSize: '50px',
              color: 'white',
              pointerEvents: 'none'
            }}>
              <img src="https://img.icons8.com/color/48/000000/play-button-circled.png" alt="Play" />
            </div>
          )}
        </div>
      )}
      {/* Espaciado adicional para pantallas pequeñas */}
      {window.innerWidth <= 730 && (
        <div style={{ padding: '20px 0' }}>
          <br />
          <br />
        </div>
      )}
      <style jsx>{`
        div::-webkit-scrollbar {
          width: 8px;
          background: transparent;
        }
        div::-webkit-scrollbar-track {
          background: transparent;
        }
        div::-webkit-scrollbar-thumb {
          background-color: transparent;
          border-radius: 10px;
        }
        div::-webkit-scrollbar-thumb:hover {
          background-color: rgba(255, 255, 255, 0.3);
        }
        @keyframes slideIn {
          0% {
            transform: translateX(100%);
            opacity: 0;
          }
          100% {
            transform: translateX(0);
            opacity: 1;
          }
        }
        @keyframes slideInDown {
          0% {
            transform: translateY(-50%);
            opacity: 0;
          }
          100% {
            transform: translateY(0);
            opacity: 1;
          }
        }
        @keyframes slideInUp {
          0% {
            transform: translateY(50%);
            opacity: 0;
          }
          100% {
            transform: translateY(0);
            opacity: 1;
          }
        }
        @keyframes slideInRight {
          0% {
            transform: translateX(100%);
            opacity: 0;
          }
          100% {
            transform: translateX(0);
            opacity: 1;
          }
        }
        @keyframes fadeIn {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default CardInfo;
