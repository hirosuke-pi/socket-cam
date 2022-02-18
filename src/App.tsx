import * as React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react'

import Home from './pages/Home';
import Camera from './pages/Camera';
import Dashboard from './pages/Dashboard';

const App = () => {
  return (
    <ChakraProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/camera/:roomId" element={<Camera />} />
          <Route path="/camera/:roomId/:cameraId" element={<Camera />} />
          <Route path="/dashboard/:roomId" element={<Dashboard />} />
        </Routes>
      </BrowserRouter>
    </ChakraProvider>
  );
};

export default App;