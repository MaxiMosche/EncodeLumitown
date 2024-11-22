import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import Topbar from './components/Topbar';
import Carrusel from './components/Carousel';
import { GlobalStateProvider } from './components/wiki/GlobalState';
import Wiki from './components/wiki/wiki';
import LumitowInfo from './components/Otros/limitowninfo';
import MarketCard from './components/market/MarketCard';
import HomeWiki from './components/wiki/HomeWiki'
import WikiEssence from './components/wiki/WikiEssence';
import Wikiconsumable from './components/wiki/wikiconsumable';
import { Analytics } from '@vercel/analytics/react';


function App() {
  return (
    <GlobalStateProvider>
      <Topbar>
       <Analytics />
        <Routes>
          <Route path="/" element={<Carrusel />} />
          <Route path="/home" element={<Navigate to="/" />} />
          <Route path="/wiki" element={<Wiki />} />
          <Route path="/market" element={<MarketCard />} /> {/* Usamos GlobalMarket aquí */}
          <Route path="/homewiki" element={<HomeWiki />} />
          <Route path="/essence" element={<WikiEssence />} />
          <Route path="/consumable" element={<Wikiconsumable />} />
          {/* <Route path="/map" element={<MapComponent />} /> */}
          <Route path="/lumitow-info" element={<LumitowInfo />} /> {/* Nueva ruta para LumitowInfo */}
        </Routes>
      </Topbar>
    </GlobalStateProvider>
  );
}

export default App;

