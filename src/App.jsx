import { Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import MobileNav from './components/MobileNav';
import HomePage from './pages/HomePage';
import TeamsPage from './pages/TeamsPage';
import TeamDetailPage from './pages/TeamDetailPage';
import Team611 from './pages/Team611';
import EventsPage from './pages/EventsPage';
import MatchesPage from './pages/MatchesPage';
import ScoutingPage from './pages/ScoutingPage';
import ScoutingForm from './pages/ScoutingForm';
import AnalyticsPage from './pages/AnalyticsPage';
import TeamPerformance from './pages/TeamPerformance';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import IconsPage from './pages/IconsPage';
import NotFound from './pages/NotFound';

function App() {
  return (
    <div className="flex h-screen bg-background">
      <Navbar />
      <div className="flex-1 overflow-auto">
        <main className="p-4 md:p-6">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/teams" element={<TeamsPage />} />
            <Route path="/teams/:teamNumber" element={<TeamDetailPage />} />
            <Route path="/team-611" element={<Team611 />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/matches" element={<MatchesPage />} />
            <Route path="/scouting" element={<ScoutingPage />} />
            <Route path="/scouting-form" element={<ScoutingForm />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/team-performance" element={<TeamPerformance />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/icons" element={<IconsPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
      <MobileNav />
    </div>
  );
}

export default App;