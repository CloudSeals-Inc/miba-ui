import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import HowItWorks from './pages/HowItWorks';
import Contact from './pages/Contact';
import Register from './pages/Register';
import Login from './pages/Login';
import Report from './pages/Report';
import Dashboard from './pages/Dashboard';
import CollectorDashboard from './pages/CollectorDashboard';
import AIInsights from './pages/AIInsights';
import { useEffect } from 'react';
import './App.css';

function App() {
  // Initialize mock data on first load
  // No initStorage needed for backend version
  useEffect(() => {
    // any general app setup can go here
  }, []);

  return (
    <Router>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/report" element={<Report />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/collector" element={<CollectorDashboard />} />
          <Route path="/ai-insights" element={<AIInsights />} />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
}

export default App;
