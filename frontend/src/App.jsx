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
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <div className="flex min-h-screen bg-[#030712] font-sans text-slate-50 selection:bg-blue-500/30 overflow-hidden">
        {isAuthenticated && <Sidebar />}
        
        <div className="flex-1 flex flex-col min-h-screen overflow-hidden relative">
          
          {isAuthenticated && <Header handleLogout={handleLogout} />}
          
          <main className={`flex-1 overflow-y-auto w-full z-10 ${isAuthenticated ? 'p-8 lg:p-10' : ''}`}>
            <Routes>
              <Route 
                path="/login" 
                element={isAuthenticated ? <Navigate to="/" /> : <Login setAuth={setIsAuthenticated} />} 
              />
              <Route 
                path="/register" 
                element={isAuthenticated ? <Navigate to="/" /> : <Register />} 
              />
              <Route 
                path="/" 
                element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} 
              />
              <Route 
                path="/devices" 
                element={isAuthenticated ? <Devices /> : <Navigate to="/login" />} 
              />
              <Route 
                path="/map" 
                element={isAuthenticated ? <MapView /> : <Navigate to="/login" />} 
              />
              <Route 
                 path="*" 
                 element={<Navigate to={isAuthenticated ? "/" : "/login"} />} 
              />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
