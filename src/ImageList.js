import React, { useState, useEffect } from 'react';

const ImagesList = () => {
  const [images, setImages] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/images')
      .then((response) => response.json())
      .then((data) => setImages(data));
  }, []);

  return (
    <div className="images-list">
      {images.map((image) => (
        <div key={image.id} className="image-card">
          <img src={image.url} alt={image.name} />
          <h3>{image.name}</h3>
          <p>Tags: {image.tags.join(', ')}</p>
        </div>
      ))}
    </div>
  );
};

export default ImagesList;
