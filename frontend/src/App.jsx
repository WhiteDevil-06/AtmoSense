import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import Devices from './pages/Devices';
import MapView from './pages/Map';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) setIsAuthenticated(true);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  return (
    <Router>
      {isAuthenticated ? (
        /* ── Authenticated shell ── */
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--canvas)' }}>
          <Sidebar />
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh', overflow: 'hidden' }}>
            <Header handleLogout={handleLogout} />
            <main style={{ flex: 1, overflowY: 'auto', padding: '2rem 2.5rem' }}>
              <Routes>
                <Route path="/"        element={<Dashboard />} />
                <Route path="/devices" element={<Devices />} />
                <Route path="/map"     element={<MapView />} />
                <Route path="*"        element={<Navigate to="/" />} />
              </Routes>
            </main>
          </div>
        </div>
      ) : (
        /* ── Unauthenticated shell ── */
        <Routes>
          <Route path="/login"    element={<Login setAuth={setIsAuthenticated} />} />
          <Route path="/register" element={<Register />} />
          <Route path="*"         element={<Navigate to="/login" />} />
        </Routes>
      )}
    </Router>
  );
}

export default App;
