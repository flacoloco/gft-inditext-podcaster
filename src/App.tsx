import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Home, Podcast, Episode } from './components/pages';
import { Layout } from './components/templates';
import './App.css';
import type { FC } from 'react';

export const App: FC = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/podcast/:id' element={<Podcast />} />
          <Route path='/episode/:id' element={<Episode />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
