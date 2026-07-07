import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProcessSection from './components/ProcessSection';
import AutomationSection from './components/AutomationSection';
import BISection from './components/BISection';
import ProjectsSection from './components/ProjectsSection';
import RequestForm from './components/RequestForm';
import Footer from './components/Footer';
import ContinuousTrack from './components/ContinuousTrack';
import NeuralBackground from './components/NeuralBackground';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <NeuralBackground />
        {/* Scroll-linked page track */}
        <ContinuousTrack />

        {/* Subtle noise layer */}
        <div className="noise-layer" aria-hidden="true" />

        {/* Navigation */}
        <Navbar />

        {/* Page content */}
        <main className="main-content">
          <Routes>
            <Route path="/" element={
              <>
                <Hero />
                <ProcessSection />
                <AutomationSection />
                <BISection />
              </>
            } />
            <Route path="/projects" element={<ProjectsSection />} />
            <Route path="/request" element={<RequestForm />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
