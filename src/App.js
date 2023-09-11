import React from 'react';
import './App.css';
import Headers from './components/headers';
import Scans from './components/scans';
import Targets from './components/targets';
import Dashboard from './components/Dashboard';
import Risks from './components/Risks';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
  return (
   
    <div >
      <Router>
        <Headers />
        <Routes>
        <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/target" element={<Targets />} />
          <Route path="/scan" element={<Scans />} />
          <Route path="/risk" element={<Risks />} />
          
        </Routes>
      </Router>
    </div>
   
  );
}

export default App;
