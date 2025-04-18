import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import { ApiProvider } from './context/ApiContext';
import { ScoutingProvider } from './context/ScoutingContext';

function App() {
  return (
    <ApiProvider>
      <ScoutingProvider>
        <Router>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow bg-gray-50">
              <Routes>
                <Route path="/" element={<HomePage />} />
                {/* Add routes for other pages once converted */}
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </ScoutingProvider>
    </ApiProvider>
  );
}

export default App;