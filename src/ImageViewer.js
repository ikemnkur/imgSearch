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
    fetch(`https://json-server-db-d8c4c14f5f95.herokuapp.com/images?id=${id}`)
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

      img.onload = () => {
        const aspectRatio = img.width / img.height;
        canvas.width = aspectRatio > 1 ? 512 : 512 * aspectRatio;
        canvas.height = aspectRatio > 1 ? 512 / aspectRatio : 512;
        drawImage();
        setLoaded(true);
      };

      const canvasPos = { x: 0, y: 0, scale: 1 };
      let mouseDown = false;
      const startPos = { x: 0, y: 0 };
      let lastTouchDist = null;

      const drawImage = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.save();
        ctx.translate(canvasPos.x, canvasPos.y);
        ctx.scale(canvasPos.scale, canvasPos.scale);
        const dx = (canvas.width - img.width) / 2;
        const dy = (canvas.height - img.height) / 2;
        ctx.drawImage(img, dx, dy, img.width, img.height);
        ctx.restore();
      };

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
          drawImage();
        }
      };

      const handleWheel = (e) => {
        e.preventDefault();
        const zoom = e.deltaY * -0.002;
        const newScale = canvasPos.scale + zoom;
        if (newScale > 0.1 && newScale < 10) {
          canvasPos.scale = newScale;
          drawImage();
        }
      };

      const handleTouchStart = (e) => {
        if (e.touches.length === 1) {
          mouseDown = true;
          startPos.x = e.touches[0].clientX - canvasPos.x;
          startPos.y = e.touches[0].clientY - canvasPos.y;
        } else if (e.touches.length === 2) {
          mouseDown = false;
          lastTouchDist = getTouchDist(e);
        }
        e.preventDefault(); // Prevent scrolling
      };

      const handleTouchMove = (e) => {
        if (e.touches.length === 1 && mouseDown) {
          canvasPos.x = e.touches[0].clientX - startPos.x;
          canvasPos.y = e.touches[0].clientY - startPos.y;
          drawImage();
        } else if (e.touches.length === 2) {
          const touchDist = getTouchDist(e);
          const zoom = (touchDist - lastTouchDist) * 0.005;
          const newScale = canvasPos.scale + zoom;
          if (newScale > 0.1 && newScale < 10) {
            canvasPos.scale = newScale;
            drawImage();
          }
          lastTouchDist = touchDist;
        }
        e.preventDefault(); // Prevent scrolling
      };

      const handleTouchEnd = () => {
        mouseDown = false;
        lastTouchDist = null;
      };

      const getTouchDist = (e) => {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        return Math.sqrt(dx * dx + dy * dy);
      };

      canvas.addEventListener('mousedown', handleMouseDown);
      window.addEventListener('mouseup', handleMouseUp);
      canvas.addEventListener('mousemove', handleMouseMove);
      canvas.addEventListener('wheel', handleWheel);

      canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
      canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
      canvas.addEventListener('touchend', handleTouchEnd);

      return () => {
        canvas.removeEventListener('mousedown', handleMouseDown);
        window.removeEventListener('mouseup', handleMouseUp);
        canvas.removeEventListener('mousemove', handleMouseMove);
        canvas.removeEventListener('wheel', handleWheel);

        canvas.removeEventListener('touchstart', handleTouchStart);
        canvas.removeEventListener('touchmove', handleTouchMove);
        canvas.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [imageData]);

  const handleDownload = async () => {
    const response = await fetch(`${imageData.url}`);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = imageData.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
            ></canvas>
            <p>Uploaded By: {imageData.nickname}</p>
            <div>
              Tags: {imageData.tags && imageData.tags.map((tag, index) => (
                <React.Fragment key={index}>
                  <a href={`/gallery?search=${tag}`}>{tag}</a>, 
                </React.Fragment>
              ))}
            </div>
            <div style={{ margin: 20, padding: 50 }}> Advertisement Space</div>
            <div className="App">
              <CommentsSection id={id} />
            </div>
            <div>
              <h4>Download HD Image</h4>
              <button
                style={{ marginRight: 20, width: 100, borderRadius: 5, background: 'purple', padding: '10px', color: 'white', textDecoration: 'none' }}
                onClick={handleDownload}
              >
                Download
              </button>
              <button style={{ width: 100 }} onClick={() => window.history.back()}>Back</button>
              <button style={{ marginLeft: 20, width: 100, background: '#FF3333' }} onClick={() => navigate(`/`)}>Main</button>
            </div>
          </>
        ) : (
          <>
            <div style={{ height: 400, margin: "auto", maxWidth: 600, display: "flex", background: "#FFEEEE" }}>
              <p style={{ margin: "auto" }}>No image data available / Image Deleted</p>
            </div>
            <div>
              <h4>Search for New Image?</h4>
              <button style={{ marginRight: 20, width: 100, background: "purple" }} onClick={() => navigate(`/image/${Math.floor(Math.random() * 10)}`)}> Random</button>
              <button style={{ width: 100 }} onClick={() => window.history.back()}>Back</button>
              <button style={{ marginLeft: 20, width: 100, background: '#FF3333' }} onClick={() => navigate(`/`)}>Main</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default ImageViewer;
