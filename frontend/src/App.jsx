import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import Header from './components/Header';
import MetricCards from './components/MetricCards';
import ControlPanel from './components/ControlPanel';
import LogStreamerTerminal from './components/LogStreamerTerminal';
import IncidentList from './components/IncidentList';
import RootCauseDetail from './components/RootCauseDetail';
import GeminiRecommendationModal from './components/GeminiRecommendationModal';

const BACKEND_URL = 'http://127.0.0.1:5000';

export default function App() {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  
  const [logs, setLogs] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [stats, setStats] = useState({
    processedLogsCount: 0,
    anomaliesDetectedCount: 0,
    precision: 95.4,
    recall: 92.1,
    f1Score: 93.7,
    avgLatencyMs: 4.2,
    activeMode: 'NORMAL',
    isStreaming: true
  });

  const [selectedIncident, setSelectedIncident] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const newSocket = io(BACKEND_URL, {
      reconnectionAttempts: 10,
      reconnectionDelay: 1000
    });

    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('[Socket.IO] Connected to backend on port 5000');
      setIsConnected(true);
    });

    newSocket.on('disconnect', () => {
      console.log('[Socket.IO] Disconnected');
      setIsConnected(false);
    });

    newSocket.on('initial-state', (data) => {
      if (data.logs) setLogs(data.logs);
      if (data.incidents) setIncidents(data.incidents);
      if (data.stats) setStats(data.stats);
      if (data.incidents && data.incidents.length > 0) {
        setSelectedIncident(data.incidents[0]);
      }
    });

    newSocket.on('log-stream', (logItem) => {
      setLogs((prev) => [...prev.slice(-300), logItem]);
      setStats((prev) => ({
        ...prev,
        processedLogsCount: prev.processedLogsCount + 1
      }));
    });

    newSocket.on('anomaly-detected', (incident) => {
      setIncidents((prev) => [incident, ...prev]);
      setSelectedIncident(incident);
      setStats((prev) => ({
        ...prev,
        anomaliesDetectedCount: prev.anomaliesDetectedCount + 1
      }));
    });

    newSocket.on('metrics-update', (newStats) => {
      setStats((prev) => ({ ...prev, ...newStats }));
    });

    newSocket.on('simulator-mode-changed', ({ mode }) => {
      setStats((prev) => ({ ...prev, activeMode: mode }));
    });

    newSocket.on('simulator-status', ({ isStreaming }) => {
      setStats((prev) => ({ ...prev, isStreaming }));
    });

    return () => newSocket.close();
  }, []);

  const handleSelectMode = async (mode) => {
    try {
      await fetch(`${BACKEND_URL}/api/simulator/mode`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode })
      });
      setStats((prev) => ({ ...prev, activeMode: mode }));
    } catch (err) {
      console.error('Failed to change mode:', err);
    }
  };

  const handleToggleStream = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/simulator/toggle`, { method: 'POST' });
      const data = await res.json();
      setStats((prev) => ({ ...prev, isStreaming: data.isStreaming }));
    } catch (err) {
      console.error('Failed to toggle stream:', err);
    }
  };

  const handleOpenIncidentReport = (incident) => {
    setSelectedIncident(incident);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col pb-12">
      
      {/* Top Header */}
      <Header isConnected={isConnected} stats={stats} />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex-1 w-full">
        
        {/* Metric Performance Cards */}
        <MetricCards stats={stats} />

        {/* Live Simulator & Failure Injector Control Panel */}
        <ControlPanel
          stats={stats}
          onSelectMode={handleSelectMode}
          onToggleStream={handleToggleStream}
        />

        {/* Primary Operational Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          
          {/* Left: Real-Time Ingested Log Terminal */}
          <LogStreamerTerminal
            logs={logs}
            onClear={() => setLogs([])}
          />

          {/* Right: Incident Feed */}
          <IncidentList
            incidents={incidents}
            selectedIncident={selectedIncident}
            onSelectIncident={handleOpenIncidentReport}
          />

        </div>

        {/* Bottom Section: Root-Cause Localization & Timeline Pinpointer */}
        <RootCauseDetail incident={selectedIncident} />

      </main>

      {/* Gemini AI Diagnostic Modal */}
      {isModalOpen && (
        <GeminiRecommendationModal
          incident={selectedIncident}
          onClose={() => setIsModalOpen(false)}
        />
      )}

    </div>
  );
}
