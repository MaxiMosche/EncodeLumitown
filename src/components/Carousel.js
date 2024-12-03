import React, { useState, useRef, useEffect } from 'react';
import ResponsiveTitle from './Home/ResponsiveTitle';
import CardInfo from './Home/CardInfo';
import TarjetasNoticias from './Home/news';
import Carousel from './Home/CardCrousel';
import GameInfo from './Home/GameInfo';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const SeparatedCarousel = () => {
  const [carouselCards, setCarouselCards] = useState([
    { id: 1, src: 'https://res.cloudinary.com/dm94dpmzy/image/upload/v1731853288/who_is_pgey4u.webp', alt: 'Image 1', info: 'introduction', secondarySrc: 'https://res.cloudinary.com/dm94dpmzy/image/upload/v1730764523/whatisimage_wdqaa9.webp', video: 'https://www.youtube.com/embed/DM4lQXccTxM?si=8QNHgpUToqUA_r6V',
      text: 'Discover Lumiterra, a fantastic multiplayer survival and crafting game set in a vast open world. Face challenges, gather resources, farm, and fight alongside your friends, or team up with mysterious creatures you can capture in this incredible universe.',
      redirect: '/lumitow-info' },
    { id: 2, src: 'https://res.cloudinary.com/dm94dpmzy/image/upload/v1731853315/wikii_dhmf7s.webp', alt: 'Image 1', info: 'introduction', secondarySrc: 'https://res.cloudinary.com/dm94dpmzy/image/upload/v1730764556/wikiimage_dtjwxw.webp', video: 'https://www.youtube.com/embed/DM4lQXccTxM?si=8QNHgpUToqUA_r6V',
      text: 'No one asked for it, but we all needed it: a special Wiki packed with recipes for Lumiterras complex crafting. Here you\'ll find all the collectible and droppable items in the game, along with a compendium of monsters, bosses, and gatherable resources with their respective drop lists. An essential tool for brave adventurers.',
      redirect: '/homewiki' },
      { id: 3, src: 'https://res.cloudinary.com/dm94dpmzy/image/upload/v1731853348/Market_ozdgay.webp', alt: 'Image 4', info: 'introduction', secondarySrc: 'https://res.cloudinary.com/dm94dpmzy/image/upload/v1730764891/marketimage_ob7dkd.webp', video: 'https://www.youtube.com/embed/DM4lQXccTxM?si=8QNHgpUToqUA_r6V',  
        text: 'In this tool, you can create your ideal set! If you want to know the skill level you would gain by equipping any set from the different professions, here’s the perfect solution. This calculator will allow you to estimate your stats and the essences needed to craft the items.',
        redirect: '/marketlive' },
    { id: 4, src: 'https://res.cloudinary.com/dm94dpmzy/image/upload/v1731853264/map_bdhkup.webp', alt: 'Image 3', info: 'introduction', secondarySrc: 'https://res.cloudinary.com/dm94dpmzy/image/upload/v1730764713/mapimage_vbbzd7.webp', video: 'https://www.youtube.com/embed/DM4lQXccTxM?si=8QNHgpUToqUA_r6V', 
      text: 'We bring you an interactive map where you can discover the locations of the various NPCs, monsters, and bosses scattered throughout the Lumiterra universe.',
      redirect: '/map' }, 
      { id: 5, src: 'https://res.cloudinary.com/dm94dpmzy/image/upload/v1731853366/Diary_wnhngt.webp', alt: '', info: 'Coming Soon!!', secondarySrc: 'https://res.cloudinary.com/dm94dpmzy/image/upload/v1732247295/monster_home_xrkhk3.webp', video: '',  
        text: '',
        redirect: '/' }, 
  ]);

  const [selectedInfo, setSelectedInfo] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [selectedSecondaryImage, setSelectedSecondaryImage] = useState(null);
  const [selectedText, setSelectedText] = useState(null);
  const [selectedRedirect, setSelectedRedirect] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false); // Nuevo estado para manejar el arrastre
  const sliderRef = useRef(null);

  const [carouselContainerStyle, setCarouselContainerStyle] = useState({
    marginTop: '-50px',
  });

  // Función para manejar cuando el usuario comienza a arrastrar el carrusel
  const handleDragStart = () => {
    setIsDragging(true);
  };

  // Función para manejar cuando el usuario termina de arrastrar el carrusel
  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const handleCarouselClick = (card) => {
    if (!isDragging) { // Solo abrir el info si no se está arrastrando
      setCarouselCards(prev => {
        const newCards = prev.filter(c => c.id !== card.id);
        return [card, ...newCards];
      });
      setSelectedInfo(card.info);
      setSelectedVideo(card.video);
      setSelectedImage(card.src);
      setSelectedSecondaryImage(card.secondarySrc);
      setSelectedText(card.text);
      setSelectedRedirect(card.redirect); // Guardar redirección
      if (!isSidebarOpen) {
        setIsSidebarOpen(true);
      }

      if (sliderRef.current) {
        setTimeout(() => sliderRef.current.slickGoTo(0), 0);
      }
    }
  };

  const handleCardClick = (card) => {
    if (!isDragging) { // Solo abrir el info si no se está arrastrando
      setSelectedInfo(card.info);
      setSelectedVideo(card.video);
      setSelectedImage(card.src);
      setSelectedSecondaryImage(card.secondarySrc);
      setSelectedText(card.text);
      setSelectedRedirect(card.redirect); // Guardar redirección
      setSelectedRedirect(card.link);
      if (!isSidebarOpen) {
        setIsSidebarOpen(true);
      }
    }
  };

  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: false,
    draggable: true, // Permitir arrastre
    beforeChange: handleDragStart,
    afterChange: handleDragEnd
  };

  useEffect(() => {
    const updateCarouselContainerStyle = () => {
      const width = window.innerWidth;
      if (width > 1130) {
        setCarouselContainerStyle({ marginTop: '-50px' });
      } else if (width <= 1130 && width > 900) {
        setCarouselContainerStyle({ marginTop: '-40px' });
      } else if (width <= 900 && width > 730) {
        setCarouselContainerStyle({ marginTop: '-30px' });
      } else {
        setCarouselContainerStyle({ marginTop: '-20px' });
      }
    };

    updateCarouselContainerStyle(); 
    window.addEventListener('resize', updateCarouselContainerStyle);
    return () => window.removeEventListener('resize', updateCarouselContainerStyle);
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', fontFamily: 'Comic Sans MS' }}>
      <ResponsiveTitle text="EXPLORE TOOLS" />
      <div id="carousel-container" style={{width: '90%', marginTop: carouselContainerStyle.marginTop }}>
        <Carousel 
          cards={carouselCards}
          handleCarouselClick={handleCarouselClick}
          settings={settings}
        />
      </div>
      {isSidebarOpen && (
        <CardInfo
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          selectedSecondaryImage={selectedSecondaryImage}
          selectedInfo={selectedInfo}
          selectedText={selectedText}
          selectedVideo={selectedVideo}
          selectedRedirect={selectedRedirect}
        />
      )}
      <TarjetasNoticias onCardClick={handleCardClick} />
      <GameInfo />
      <style jsx>{`
        body::before, body::after {
          width: 100vw;
          height: 110vh;
        }
        body::before {
          content: '';
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-image: url('https://res.cloudinary.com/dm94dpmzy/image/upload/v1730763154/fondohome_o4ofow.webp');
          filter: blur(0px);
          z-index: -2;
        }
        body::after {
          content: '';
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.4);
          z-index: -1;
        }
        .info-card {
          position: fixed;
          top: 0;
          right: 0;
          width: 400px;
          height: 95vh;
          padding: 20px;
          box-shadow: -10px 0 20px rgba(0, 0, 0, 0.5);
          z-index: 10;
          background-color: #092143;
          color: white;
          border-radius: 20px 0 0 20px;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          transform: translateX(100%);
          transition: transform 1s ease;
        }
        .info-card.slide-in {
          transform: translateX(0);
        }
        .info-card::-webkit-scrollbar {
          width: 0;
          background: transparent;
        }
        .slick-dots li button:before {
          color: white;
        }
        .slick-dots li.slick-active button:before {
          color: #f298ff;
        }
        .tarjeta-noticias {
          transition: transform 0.3s, background-color 0.3s, box-shadow 0.3s;
        }
        .tarjeta-noticias:hover {
          transform: scale(1.05);
          background: linear-gradient(to bottom, #10538a 0%, rgba(242, 152, 255, 1) 100%) !important;
        }
        .tarjeta-noticias:hover h3 {
          color: black !important;
        }
      `}</style>
    </div>
  );
};

export default SeparatedCarousel;
