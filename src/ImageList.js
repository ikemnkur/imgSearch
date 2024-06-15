import React, { useState, useEffect } from 'react';

const ImagesList = () => {
  const [images, setImages] = useState([]);
  const db_url = process.env.JSON_DB_API_BASE_URL || "https://json-server-db-d8c4c14f5f95.herokuapp.com";

  useEffect(() => {
    fetch(`${db_url}/images`)
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
