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
          <Route path='/podcast/:podcastId' element={<Podcast />} />
          <Route path='/podcast/:podcastId/episode/:episodeId' element={<Episode />} />
        </Routes>
      </Layout>
    </Router>
  );
};
