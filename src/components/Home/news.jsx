import React, { useEffect, useState } from 'react';
import ResponsiveTitle from './ResponsiveTitle';

const TarjetasNoticias = ({ onCardClick }) => {
    const detallesTarjetas = [
        { id: 10, title: "Beginner's Guide", src: 'https://res.cloudinary.com/dm94dpmzy/image/upload/v1730944869/Tutoriales_Lumitown_je10oc.webp', 
            info: 'These will be your first big steps.', 
            secondarySrc: 'https://res.cloudinary.com/dm94dpmzy/image/upload/v1730944869/Tutoriales_Lumitown_je10oc.webp', 
            video: 'https://www.youtube.com/embed/QOQyp4mFEBo?si=oFGcP9mjamri9CV8',
             text: 'Lumiterra has released an updated guide that summarizes the initial experiences in the game for new adventurers. Starting in the Land of Departure, players will encounter several key NPCs who will guide them step by step through this mysterious land.',
             link: 'https://lumiterra.notion.site/Land-of-Departure-and-Beginner-Tasks-963f054eb3b54e6d8c19a286cc80e94d' },
             
        { id: 11, title: "Comprehensive Enhancement", src: 'https://res.cloudinary.com/dm94dpmzy/image/upload/v1730947031/Encantamientos_nq9smw.webp', info: "Limits? They don't exist.", secondarySrc: 'https://res.cloudinary.com/dm94dpmzy/image/upload/v1730947031/Encantamientos_nq9smw.webp', video: 'https://www.youtube.com/embed/8HcMWkwPEYI?si=5WJoLdwvsI5I7yyA', text: "Lumiterra has introduced an enchanting system that allows players to significantly upgrade their equipment and optimize performance. This system offers a tiered progression, where players can bring their base gear to new levels, bringing it closer to its epic states. By participating in the process, players also take part in a Lottery system, with rewards that make it all worthwhile." ,link: 'https://lumiterra.notion.site/Lumiterra-CBT-2-Features-Update-131211cc5a8880b5ba5ac6b206c7d985' },
        { id: 12, title: 'New Dungeon Feature', src: 'https://res.cloudinary.com/dm94dpmzy/image/upload/v1730947372/https3A2F2Fprod-files-secure_i66mel.webp', info: 'Adventurers, you will always be able to go further.', secondarySrc: 'https://res.cloudinary.com/dm94dpmzy/image/upload/v1730947372/https3A2F2Fprod-files-secure_i66mel.webp', video: 'https://www.youtube.com/embed/kcL55QJEfVQ?si=-89RWI-QoIJI4U5F', text: 'Lumiterra has introduced a new feature in dungeons: difficulty selection. Now, players can choose from different difficulty levels when entering dungeons, allowing them to adjust the experience based on their skills and the level of challenge they wish to face',link: 'https://lumiterra.notion.site/Lumiterra-CBT-2-Features-Update-131211cc5a8880b5ba5ac6b206c7d985' },
        { id: 13, title: 'Generous Dungeon Rewards', src: 'https://res.cloudinary.com/dm94dpmzy/image/upload/v1730947592/image_pnskci.webp', info: 'Unimaginable rewards!', secondarySrc: 'https://res.cloudinary.com/dm94dpmzy/image/upload/v1730947592/image_pnskci.webp', video: 'https://www.youtube.com/embed/B7IrKfRvbvc?si=JaYkx-jmWq5y9zCk', text: 'Dungeon rewards increase with difficulty: the higher the difficulty, the better the prizes, including valuable materials and rare items.' ,link: 'https://lumiterra.notion.site/Lumiterra-CBT-2-Features-Update-131211cc5a8880b5ba5ac6b206c7d985'},
        { id: 14, title: 'Lumiterra CBT#2', src: 'https://res.cloudinary.com/dm94dpmzy/image/upload/v1730950749/asd_s_bddpai.webp', info: "It's very close.", secondarySrc: 'https://res.cloudinary.com/dm94dpmzy/image/upload/v1730950749/asd_s_bddpai.webp', video: '', text: 'The CBT#2 of Lumiterra has been announced, along with exciting updates that will enhance the gaming experience.' ,link: 'https://x.com/LumiterraGame/status/1851157426093113355'},
        { id: 15, title: 'Global Servers ', src: 'https://res.cloudinary.com/dm94dpmzy/image/upload/v1730763305/noticia1_ukpbo7.webp', info: 'Servers are coming!', secondarySrc: 'https://res.cloudinary.com/dm94dpmzy/image/upload/v1730763305/noticia1_ukpbo7.webp', video: '', text: 'One of the most awaited news: Lumi Players will have better connectivity thanks to dedicated servers.' ,link: 'https://x.com/Jihoz_Axie/status/1837321453705867460'},
    ];

    const [tamañoTarjeta, setTamañoTarjeta] = useState('300px');
    const [altoTarjeta, setAltoTarjeta] = useState('350px');
    const [tamañoLetra, setTamañoLetra] = useState('16px');

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
        actualizarTamañoTarjeta();
        window.addEventListener('resize', actualizarTamañoTarjeta);
        return () => window.removeEventListener('resize', actualizarTamañoTarjeta);
    }, []);

    return (
        <div>
            <ResponsiveTitle text="LATEST NEWS" /> {/* Cambia aquí */}
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

