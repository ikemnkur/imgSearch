import React, { useEffect, useRef, useState } from 'react';
import CommentsSection from './CommentsSection';
import { useParams, useNavigate } from 'react-router-dom';

function ImageViewer() {
  const navigate = useNavigate();
  const { id } = useParams();
  const canvasRef = useRef(null);
  const [imageData, setImageData] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    fetch(`http://localhost:5000/images?id=${id}`)
      .then(response => response.json())
      .then(data => {
        if (data.length > 0) {
          setImageData(data[0]);
        } else {
          setImageData(null);
        }
      });
  }, [id]);

  useEffect(() => {
    if (imageData) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.src = imageData.url;
      imgRef.current = img;

      const draw = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      };

      img.onload = () => {
        draw();
        setLoaded(true);
      };

      let canvasPos = { x: 0, y: 0, scale: 1 };
      let mouseDown = false;
      let startPos = { x: 0, y: 0 };

      const handleMouseDown = (e) => {
        mouseDown = true;
        startPos.x = e.clientX - canvasPos.x;
        startPos.y = e.clientY - canvasPos.y;
      };

      const handleMouseUp = () => {
        mouseDown = false;
      };

      const handleMouseMove = (e) => {
        if (mouseDown) {
          canvasPos.x = e.clientX - startPos.x;
          canvasPos.y = e.clientY - startPos.y;
          draw();
          ctx.save();
          ctx.translate(canvasPos.x, canvasPos.y);
          ctx.scale(canvasPos.scale, canvasPos.scale);
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          ctx.restore();
        }
      };

      const handleWheel = (e) => {
        e.preventDefault();
        const zoom = e.deltaY * -0.002;
        const newScale = canvasPos.scale + zoom;
        if (newScale > 0.1 && newScale < 10) {
          canvasPos.scale = newScale;
          draw();
          ctx.save();
          ctx.translate(canvasPos.x, canvasPos.y);
          ctx.scale(canvasPos.scale, canvasPos.scale);
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          ctx.restore();
        }
      };

      canvas.addEventListener('mousedown', handleMouseDown);
      window.addEventListener('mouseup', handleMouseUp);
      canvas.addEventListener('mousemove', handleMouseMove);
      canvas.addEventListener('wheel', handleWheel);

      return () => {
        canvas.removeEventListener('mousedown', handleMouseDown);
        window.removeEventListener('mouseup', handleMouseUp);
        canvas.removeEventListener('mousemove', handleMouseMove);
        canvas.removeEventListener('wheel', handleWheel);
      };
    }
  }, [imageData]);

  return (
    <div>
      <div style={{ textAlign: 'center', margin: 'auto' }}>
        <div>
          <h1>Image Viewer:</h1>
          {imageData && loaded && <strong>Title: {imageData.name}</strong>}
        </div>
        {imageData ? (
          <>
            <canvas
              style={{ border: '3px solid', borderRadius: 10, borderColor: 'black' }}
              ref={canvasRef}
              width={512}
              height={512}
            ></canvas>
            <p>Uploaded By: {imageData.nickname}</p>
            <div>
              Search Tags: {imageData.tags && imageData.tags.map((tag, index) => <text key={index}>{tag}, </text>)}
            </div>
            <div style={{ margin: 20, padding: 50 }}> Advertisement Space</div>
            <div className="App">
              <CommentsSection id={id} />
            </div>
            <div>
              <h4>Download HD Image</h4>
              <button
                style={{ marginRight: 50, background: 'purple', padding: '10px', color: 'white', textDecoration: 'none' }}
                href={'http://localhost:3000' + imageData.url}
                download
              >
                Download
              </button>
              <button onClick={() => window.history.back()}>Back</button>
              <button style={{ marginRight:50,}} onClick={() => navigate(`/`)}>Main</button>
            </div>
          </>
        ) : (
          <>
            <p>No image data available / Image Deleted</p>
            <div>
              <h4>Search for New Image?</h4>
              <button
                style={{ marginRight:50, background: 'purple' }}
                onClick={() => navigate(`/image/${Math.floor(Math.random() * 10)}`)}
              >
                Random
              </button>
              <button style={{ marginRight:50, background: 'blue' }} onClick={() => window.history.back()}>Back</button>
              <button style={{ marginRight:50,}} onClick={() => navigate(`/`)}>Main</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default ImageViewer;
