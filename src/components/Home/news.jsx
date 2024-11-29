import React, { useEffect, useState } from 'react';
import ResponsiveTitle from './ResponsiveTitle';

const TarjetasNoticias = ({ onCardClick }) => {
    const [detallesTarjetas, setDetallesTarjetas] = useState([]);
    const [tamañoTarjeta, setTamañoTarjeta] = useState('300px');
    const [altoTarjeta, setAltoTarjeta] = useState('350px');
    const [tamañoLetra, setTamañoLetra] = useState('16px');

    // Función para obtener las noticias desde el endpoint
    const obtenerNoticias = async () => {
        try {
            const response = await fetch('https://lumitownserver.somee.com/GetListNews');
            const data = await response.json();
            // Asignar id mayor a 10000
            const tarjetasConId = data.map((tarjeta, index) => ({
                ...tarjeta,
                id: 10000 + index + 1, // Asegurando que los id sean mayores a 10000
            }));
            setDetallesTarjetas(tarjetasConId);
        } catch (error) {
            console.error('Error al obtener las noticias:', error);
        }
    };

    const actualizarTamañoTarjeta = () => {
        if (window.innerWidth <= 1130 && window.innerWidth > 900) {
            setTamañoTarjeta('150px');
            setAltoTarjeta('300px');
            setTamañoLetra('10px');
        } else if (window.innerWidth <= 900 && window.innerWidth > 730) {
            setTamañoTarjeta('130px');
            setAltoTarjeta('250px');
            setTamañoLetra('8px');
        } else if (window.innerWidth <= 730) {
            setTamañoTarjeta('100px');
            setAltoTarjeta('100px');
            setTamañoLetra('10px');
        } else {
            setTamañoTarjeta('300px');
            setAltoTarjeta('350px');
            setTamañoLetra('20px');
        }
    };

    useEffect(() => {
        obtenerNoticias(); // Cargar noticias al montar el componente
        actualizarTamañoTarjeta();
        window.addEventListener('resize', actualizarTamañoTarjeta);
        return () => window.removeEventListener('resize', actualizarTamañoTarjeta);
    }, []);

    return (
        <div>
            <ResponsiveTitle text="LATEST NEWS" />
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                flexWrap: 'wrap',
                marginTop: '20px',
                backgroundColor: 'rgba(9, 33, 67, 0.6)',
                borderRadius: '20px',
                width: '95%',
            }}>
                {detallesTarjetas.map((tarjeta, index) => (
                    <div
                        key={tarjeta.id}
                        onClick={() => onCardClick(tarjeta)}
                        style={{
                            width: tamañoTarjeta,
                            height: 'auto',
                            maxHeight: '200px',
                            margin: '20px',
                            borderRadius: '10px',
                            overflow: 'hidden',
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.5)',
                            cursor: 'pointer',
                            transition: 'transform 0.3s, background-color 0.3s, box-shadow 0.3s',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            animation: 'slideIn 0.5s forwards',
                            animationDelay: `${index * 0.1}s`,
                        }}
                        className="tarjeta-noticias"
                    >
                        <div style={{ position: 'relative', overflow: 'hidden', maxHeight: '200px' }}>
                            <img
                                src={tarjeta.src}
                                alt={tarjeta.title}
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    maskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)',
                                    WebkitMaskImage: 'linear-gradient(to bottom, black 10%, transparent 100%)',
                                }}
                            />
                        </div>
                        <h3 style={{
                            color: 'white',
                            margin: 0,
                            padding: '5px 10px',
                            textAlign: 'center',
                            fontSize: tamañoLetra,
                        }}>
                            {tarjeta.title}
                        </h3>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TarjetasNoticias;

