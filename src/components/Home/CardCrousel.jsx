import React, { useEffect, useState, useRef } from 'react';
import Slider from 'react-slick';

const Carousel = ({ cards, handleCarouselClick, settings }) => {
    const [dimensions, setDimensions] = useState({
        width: '270px',
        height: '287px',
        marginTop: '95px',
        marginLeft: '65px',
        widthZero: '306px',
        heightZero: '325px',
        marginTopZero: '71px',
        marginLeftZero: '20px',
    });

    // Crear una referencia para el slider
    const carouselRef = useRef(null);

    useEffect(() => {
        const updateDimensions = () => {
            const width = window.innerWidth;
            if (width > 1130) {
                setDimensions({
                    width: '270px',
                    height: '287px',
                    marginTop: '95px',
                    marginLeft: '65px',
                    widthZero: '306px',
                    heightZero: '325px',
                    marginTopZero: '71px',
                    marginLeftZero: '20px',
                });
            } else if (width <= 1130 && width > 900) {
                setDimensions({
                    width: '170px',
                    height: '175px',
                    marginTop: '85px',
                    marginLeft: '1px',
                    widthZero: '196px',
                    heightZero: '195px',
                    marginTopZero: '71px',
                    marginLeftZero: '1px',
                });
            } else if (width <= 900 && width > 730) {
                setDimensions({
                    width: '150px',
                    height: '160px',
                    marginTop: '80px',
                    marginLeft: '0px',
                    widthZero: '166px',
                    heightZero: '176px',
                    marginTopZero: '71px',
                    marginLeftZero: '0px',
                });
            } else {
                setDimensions({
                    width: '95px',
                    height: '100px',
                    marginTop: '8px',
                    marginLeft: '18px',
                    widthZero: '106px',
                    heightZero: '111px',
                    marginTopZero: '0px',
                    marginLeftZero: '8px',
                });
            }
        };

        updateDimensions();
        window.addEventListener('resize', updateDimensions);
        return () => window.removeEventListener('resize', updateDimensions);
    }, []);

    const handleClick = (card) => {
        handleCarouselClick(card);
        if (carouselRef.current) {
            setTimeout(() => {
                carouselRef.current.slickGoTo(0);
            }, 0);
        }
    };

    return (
        <div>
            <Slider ref={carouselRef} {...settings} style={{ overflow: 'hidden', maxHeight: '500px', marginBottom: '20px' }}>
                {cards.map((card, index) => (
                    <div key={card.id} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <div
                            style={{
                                cursor: 'pointer',
                                width: index === 0 ? dimensions.widthZero : dimensions.width,
                                height: index === 0 ? dimensions.heightZero : dimensions.height,
                                marginTop: index === 0 ? dimensions.marginTopZero : dimensions.marginTop,
                                marginLeft: index === 0 ? dimensions.marginLeftZero : dimensions.marginLeft,
                                borderRadius: '10px',
                                overflow: 'hidden',
                                position: 'relative'
                            }}
                            onClick={() => handleClick(card)}
                        >
                            <div
                                style={{
                                    backgroundImage: `url(${card.src})`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    width: '100%',
                                    height: '100%',
                                    borderRadius: '10px',
                                }}
                            />
                        </div>
                    </div>
                ))}
            </Slider>
        </div>
    );
};

export default Carousel;


