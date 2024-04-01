import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Gallery from './Gallery';
import ImageViewer from './ImageViewer';
import SearchPage from './SearchPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SearchPage />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/image/:id" element={<ImageViewer />} />
      </Routes>
    </Router>
  );
}

export default App;
