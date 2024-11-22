import React from 'react';

const GameInfo = () => {
  const cards = [
    { id: 1, title: 'PLAY LUMITERRA', icon: 'https://res.cloudinary.com/dm94dpmzy/image/upload/v1731298419/Lumi_logo_mfvtrg.png', link: 'https://lumiterra.net' },
    { id: 2, title: 'DISCORD LUMITERRA', icon: 'https://i.imgur.com/3OJmSwj.png', link: 'https://discord.com/invite/q3P5hjqsuE' },
    { id: 3, title: 'TWITTER LUMITERRA', icon: 'https://i.imgur.com/KB3nJJA.png', link: 'https://x.com/LumiterraGame' },
  ];

  return (
    <div className="game-info-container">
      {cards.map(card => (
        <a key={card.id} href={card.link} target="_blank" rel="noopener noreferrer" className="game-info-card">
          <img src={card.icon} alt={card.title} className="game-info-icon" />
          <div className="game-info-title">{card.title}</div>
        </a>
      ))}
      <style jsx>{`
        .game-info-container {
          display: flex;
          flex-direction: row;
          margin-top: 20px;
          gap: 10px; /* Espacio entre las tarjetas */
        }
        .game-info-card {
          position: relative;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: flex-start;
          background-color: rgba(9, 33, 67, 0.7);
          padding: 10px;
          border-radius: 10px;
          width: 350px;
          height: 50px;
          cursor: pointer;
          text-decoration: none; /* Elimina subrayado del enlace */
          box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2); /* Sombra ligera por defecto */
          transition: box-shadow 0.3s ease, transform 0.3s ease; /* Transiciones suaves */
        }
        .game-info-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(to right, rgba(242, 152, 255, 0.7), rgba(242, 152, 255, 0.3));
          transition: left 0.5s ease;
          z-index: 0;
        }
        .game-info-card:hover::before {
          left: 0;
        }
        .game-info-title {
          position: relative;
          color: white;
          font-size: 22px;
          margin-left: 10px;
          flex: 1;
          transition: color 0.3s;
          z-index: 1;
          font-weight: bold;
        }
        .game-info-card:hover .game-info-title {
          color: black;
        }
        .game-info-icon {
          width: 100px;
          height: 100px;
          position: relative;
          left: -20px;
          z-index: 1;
        }

        /* Efecto hover para la tarjeta */
        .game-info-card:hover {
          box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.4); /* Sombra más prominente al hacer hover */
          transform: translateY(-5px); /* Desplazar ligeramente hacia arriba */
        }

        /* Media queries para ajustar tamaños */
        @media (max-width: 1130px) {
          .game-info-card {
            width: 300px;
            height: 45px;
          }
          .game-info-title {
            font-size: 20px;
          }
          .game-info-icon {
            width: 45px;
            height: 45px;
          }
        }

        @media (max-width: 900px) {
          .game-info-card {
            width: 250px;
            height: 40px;
          }
          .game-info-title {
            font-size: 18px;
          }
          .game-info-icon {
            width: 40px;
            height: 40px;
          }
        }

        @media (max-width: 730px) {
          .game-info-container {
            flex-direction: column; /* Cambiar la dirección a columna */
            align-items: center; /* Centrar los elementos */
          }
          .game-info-card {
            width: 90%; /* Ancho completo */
            height: 50px; /* Puedes ajustar la altura según necesites */
            margin-bottom: 10px; /* Espacio entre tarjetas */
          }
          .game-info-title {
            font-size: 16px;
          }
          .game-info-icon {
            width: 35px;
            height: 35px;
          }
        }
      `}</style>
    </div>
  );
};

export default GameInfo;



