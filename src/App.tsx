import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Home, Podcast, Episode } from './components/pages';
import './App.css';
import { HomeTitle } from './components/atoms';

function App() {
  return (
    <>
      <Router>
        <HomeTitle />
        <div className="app">
          <nav className="nav">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/podcast" className="nav-link">Podcast</Link>
            <Link to="/episodes" className="nav-link">Episode</Link>
          </nav>

          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/podcast" element={<Podcast />} />
              <Route path="/episodes" element={<Episode />} />
            </Routes>
          </main>
        </div>
      </Router>
    </>
  );
}

export default App
