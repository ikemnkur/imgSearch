import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Gallery from './Gallery';
import ImageViewer from './ImageViewer';
import SearchPage from './SearchPage';
import UploadImage from './UploadImage';
import './UploadImage.css';
// import TagManager from 'react-gtm-module'
// import ReactGA from 'react-ga';
// ReactGA.initialize('G-92GX2GE84L');

// const tagManagerArgs = {
//   gtmId: 'G-92GX2GE84L '
// }
// TagManager.initialize(tagManagerArgs)

function App() {
  // const location = useLocation();
  // useEffect(() => {
  //   ReactGA.pageview(location.pathname + location.search);
  // }, [location]);

  const [images, setImages] = useState([]);

  useEffect(() => {

    if (images.length > 0) {
      localStorage.setItem('imagesLength', images.length);
      return;
    } else{
       localStorage.setItem('imagesLength', 0);
    }

    fetch('https://json-server-db-d8c4c14f5f95.herokuapp.com/thumbnails')
      .then((response) => response.json())
      .then((data) => setImages(data));
    // localStorage.setItem('imagesLength', images.length);
  });

  return (
    <Router>
      <Routes>
        <Route path="/" element={<SearchPage />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/image/:id" element={<ImageViewer />} />
        <Route path="/upload" element={<UploadImage />} />
      </Routes>
    </Router>
  );
}

export default App;
