import * as React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import Camera from './pages/Camera';
import Dashboard from './pages/Dashboard';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/camera/:cameraId" element={<Camera />} />
        <Route path="/dashboard/:dashboardId" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;