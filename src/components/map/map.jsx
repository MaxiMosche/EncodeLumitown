import React, { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useNavigate } from 'react-router-dom'; // Importa useNavigate

// Datos de ubicación (simulados)
const locations = [
    {
        coords: [295, 882],
        title: "Terrance",
        description: "Información sobre Terrance.",
        icon: "https://i.imgur.com/RDxBeiE.png",
        crafting: "Crafting",
        typeValue: "Farming",
        images: ["https://icons.lumiterra.net/item-icon-80.png", 
                 "https://icons.lumiterra.net/item-icon-104.png", 
                 "https://icons.lumiterra.net/item-icon-101.png"]
    },
    {
        coords: [312, 876],
        title: "Nash",
        description: "Información sobre Nash.",
        icon: "https://i.imgur.com/yVmEaXB.png",
        crafting: "Crafting",
        typeValue: "Combat",
        images: ["https://icons.lumiterra.net/item-icon-40.png",
                 "https://icons.lumiterra.net/item-icon-49.png",
                 "https://icons.lumiterra.net/item-icon-46.png"]
    },
    {
        coords: [315, 890],
        title: "Silas",
        description: "Información sobre Silas.",
        icon: "https://i.imgur.com/tYMDkz2.png",
        crafting: "Crafting",
        typeValue: "Gathering",
        images: [
            "https://icons.lumiterra.net/item-icon-88.png",
            "https://icons.lumiterra.net/item-icon-122.png",
            "https://icons.lumiterra.net/item-icon-119.png"
        ]
    }
];

const Map = () => {
    const navigate = useNavigate(); // Inicializa useNavigate

    useEffect(() => {
        // Inicializa el mapa
        const map = L.map('map', {
            crs: L.CRS.Simple,
            maxBoundsViscosity: 1.0,
            minZoom: -1,
            maxZoom: 5,
        });

        const southWest = L.latLng(0, 0);
        const northEast = L.latLng(1000, 1000);
        const bounds = L.latLngBounds(southWest, northEast);
;

        L.imageOverlay('https://res.cloudinary.com/dm94dpmzy/image/upload/v1732257677/MAPA_CBT2_sin_agua_xjf0of.webp', bounds).addTo(map);
        map.fitBounds(bounds);
        map.setMaxBounds(bounds);

        locations.forEach(location => {
            const icon = L.icon({
                iconUrl: location.icon,
                iconSize: [64, 64],
                iconAnchor: [32, 64],
            });

            const marker = L.marker(location.coords, { icon }).addTo(map);

            // Crea el contenido del popup
            const popupContent = `
                <div style="text-align: center; width: 300px;">
                    <div style="border: 1px solid #ccc; border-radius: 10px; padding: 10px; margin-bottom: 10px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);">
                        <div style="display: flex; align-items: center;">
                            <img src="${location.icon}" style="width: 64px; height: 64px; margin-right: 10px;" />
                            <div>
                                <strong style="font-size: 20px;">${location.title}</strong>
                                <div style="font-weight: bold;">${location.crafting}</div>
                            </div>
                        </div>
                    </div>
                    <div style="border: 1px solid #007bff; border-radius: 10px; padding: 10px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); background-color: #e7f1ff;">
                        <div style="font-weight: bold; margin: 5px 0;">${location.typeValue}</div>
                        <div style="display: flex; justify-content: center; flex-wrap: wrap; margin: 10px 0;">
                            ${location.images.map(img => `<img src="${img}" style="width: 80px; height: 80px; margin: 5px; border-radius: 5px;" />`).join('')}
                        </div>
                        <button style="margin-top: 15px; padding: 10px 15px; border: none; border-radius: 5px; background-color: #007bff; color: white; cursor: pointer;">View More</button>
                    </div>
                </div>
            `;

            // Asocia el popup al marcador con la clase personalizada
            const popup = L.popup()
                .setLatLng(location.coords)
                .setContent(popupContent);

                marker.bindPopup(popup);

            // Maneja el evento click en el marker
            marker.on('popupopen', () => {
                const button = document.querySelector('.leaflet-popup button'); // Selecciona el botón dentro del popup
                if (button) {
                    button.onclick = (e) => {
                        e.stopPropagation(); // Evita que el popup se cierre
                        navigate(`/wiki?filter=${location.typeValue.toLowerCase()}`); // Redirige con el filtro
                    };
                }
            });
        });

        return () => {
            map.remove();
        };
    }, [navigate]);

    return (
        <div id="map" style={{ height: '100vh', width: '100vw' }}>
            <style>
                {`
                .leaflet-popup-content-wrapper {
                    background-color: black; /* Cambia el color de fondo a negro */
                }
                .leaflet-popup-tip{
                    background-color: black; /* Cambia el color de fondo a negro */
                }
                #map{
                background-color: #01335d; /*Cambia fondo del mapa*/
                }
                `}
            </style>
        </div>
    );
};

export default Map;
