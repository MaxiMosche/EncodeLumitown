import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import Topbar from './components/Topbar';
import Carrusel from './components/Carousel';
import { GlobalStateProvider } from './components/wiki/GlobalState';
import Wiki from './components/wiki/wiki';
import LumitowInfo from './components/Otros/limitowninfo';
import HomeWiki from './components/wiki/HomeWiki';
import WikiEssence from './components/wiki/WikiEssence';
import Wikiconsumable from './components/wiki/wikiconsumable';
import { Analytics } from '@vercel/analytics/react';
import Drops from './components/wiki/drops';
import MarketLive from './components/market/MarketLive';

// Importar SignalRProvider
import { SignalRProvider } from './components/market/SignalRContext';

function App() {
  return (
    <SignalRProvider>
    <GlobalStateProvider>
        <Topbar>
          <Analytics />
          <Routes>
            <Route path="/" element={<Carrusel />} />
            <Route path="/home" element={<Navigate to="/" />} />
            <Route path="/wiki" element={<Wiki />} />
            {/* Usamos GlobalMarket aquí */}
            <Route path="/drops" element={<Drops />} />
            <Route path="/homewiki" element={<HomeWiki />} />
            <Route path="/essence" element={<WikiEssence />} />
            <Route path="/marketlive" element={<MarketLive />} /> {/* Aquí va el componente MarketLive */}
            <Route path="/consumable" element={<Wikiconsumable />} />
            <Route path="/lumitow-info" element={<LumitowInfo />} /> {/* Nueva ruta para LumitowInfo */}
          </Routes>
        </Topbar>
    </GlobalStateProvider>
    </SignalRProvider>
  );
}

export default App;
