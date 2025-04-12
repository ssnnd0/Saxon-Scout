import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './components/layout/Navbar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ScoutingForm from './pages/ScoutingForm';
import TeamPerformance from './pages/TeamPerformance';
import ConfigBuilder from './pages/admin/ConfigBuilder';
import UserManagement from './pages/admin/UserManagement';
import DataManagement from './pages/admin/DataManagement';
import NotFound from './pages/NotFound';
import PrivateRoute from './components/layout/PrivateRoute';
import AdminRoute from './components/layout/AdminRoute';
import { AuthProvider } from './context/AuthContext';
import { ScoutingProvider } from './context/ScoutingContext';

function App() {
  useEffect(() => {
    // Register service worker for PWA
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').then(registration => {
          console.log('SW registered: ', registration);
        }).catch(registrationError => {
          console.log('SW registration failed: ', registrationError);
        });
      });
    }
  }, []);

  return (
    <AuthProvider>
      <ScoutingProvider>
        <Router>
          <div className="flex flex-col min-h-screen bg-gray-900">
            <Navbar />
            <main className="flex-grow container mx-auto px-4 py-6">
              <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                <Route path="/scouting" element={<PrivateRoute><ScoutingForm /></PrivateRoute>} />
                <Route path="/team-performance" element={<PrivateRoute><TeamPerformance /></PrivateRoute>} />
                <Route path="/admin/config" element={<AdminRoute><ConfigBuilder /></AdminRoute>} />
                <Route path="/admin/users" element={<AdminRoute><UserManagement /></AdminRoute>} />
                <Route path="/admin/data" element={<AdminRoute><DataManagement /></AdminRoute>} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <footer className="bg-gray-800 text-center py-4">
              <p className="text-gray-400">Team 611 Saxons Scouting System &copy; {new Date().getFullYear()}</p>
            </footer>
          </div>
        </Router>
      </ScoutingProvider>
    </AuthProvider>
  );
}

export default App;