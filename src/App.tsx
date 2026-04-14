import { useState, useEffect } from 'react';
import Hero from './components/Hero';
import About from './components/About';
import Demo from './components/Demo';
import Features from './components/Features';
import MapVisualization from './components/MapVisualization';
import Footer from './components/Footer';

export type PotholeMarker = {
  id: number;
  lat: number;
  lng: number;
  severity: 'high' | 'medium' | 'low';
  confidence: number;
  timestamp: string;           // ← ADDED
};

const API_BASE = "https://road-pothole-ai-production.up.railway.app";

function App() {
  const [markers, setMarkers] = useState<PotholeMarker[]>([]);

  // Load all saved markers from backend on mount
  useEffect(() => {
    fetch(`${API_BASE}/markers`)
      .then(res => res.json())
      .then((data: PotholeMarker[]) => setMarkers(data))
      .catch(err => console.error('Failed to load markers:', err));
  }, []);

  const addMarker = async (confidence: number, lat: number, lng: number) => {
    const severity = confidence >= 80 ? 'high' : confidence >= 50 ? 'medium' : 'low';
    const newMarker = {
      lat,
      lng,
      severity,
      confidence,
      timestamp: new Date().toISOString(),   // ← ADDED
    };

    try {
      // Save to backend — backend assigns the id and persists it
      const res = await fetch(`${API_BASE}/markers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMarker),
      });
      const saved: PotholeMarker = await res.json();
      setMarkers(prev => [...prev, saved]);
    } catch (err) {
      console.error('Failed to save marker:', err);
      // Fallback: still show it locally even if save fails
      setMarkers(prev => [...prev, { id: prev.length + 1, ...newMarker }]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 overflow-x-hidden">
      <Hero />
      <About />
      <Demo onPotholeDetected={addMarker} />
      <Features />
      <MapVisualization markers={markers} />
      <Footer />
    </div>
  );
}

export default App;
