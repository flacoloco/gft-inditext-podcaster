import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Home, Podcast, Episode } from './components/pages';
import './App.css';
import { Header } from './components/atoms';
import type { FC } from 'react';

export const App: FC = () => {
  return (
    <>
      <Router>
        <Header />
        <div className='app'>
          <main className='main-content'>
            <Routes>
              <Route path='/' element={<Home />} />
              <Route path='/podcast/:id' element={<Podcast />} />
              <Route path='/episode/:id' element={<Episode />} />
            </Routes>
          </main>
        </div>
      </Router>
    </>
  );
};

export default App;
