import * as React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react'

import Home from './pages/Home';
import Camera from './pages/Camera';
import Dashboard from './pages/Dashboard';
import LinkDashboard from './pages/LinkDashboard';

const App = () => {
  return (
    <ChakraProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/room/:roomId/camera" element={<Camera />} />
          <Route path="/room/:roomId/camera/:cameraId" element={<Camera />} />
          <Route path="/room/:roomId/display" element={<Camera isCamera={false} />} />
          <Route path="/dashboard/:roomId" element={<LinkDashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </BrowserRouter>
    </ChakraProvider>
  );
};

export default App;