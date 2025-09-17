import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Home, Podcast, Episode } from './components/pages';
import './App.css';
import { HomeTitle } from './components/atoms';
import type { FC } from 'react';

export const App: FC = () => {
  return (
    <>
      <Router>
        <HomeTitle />
        <div className='app'>
          <main className='main-content'>
            <Routes>
              <Route path='/' element={<Home />} />
              <Route path='/podcast' element={<Podcast />} />
              <Route path='/episodes' element={<Episode />} />
            </Routes>
          </main>
        </div>
      </Router>
    </>
  );
};

export default App;
