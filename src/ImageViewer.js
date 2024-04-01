import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';

const images = [
    { id: 1, url: '/images/landscape.jpeg', name: "Tree", tags: ['nature', 'landscape'] },
    { id: 2, url: '/images/bird.jpg', name: "crow", tags: ['fly', "bird", 'animal'] },
    { id: 3, url: '/images/mine.jpg', name: "Mine", tags: ['war', 'sea', 'mine', "explosion"] },
    { id: 4, url: '/images/CTE.gif', name: "Concussion", tags: ['brain', "head", 'skull'] },
    // Add more images as needed
];



function ImageViewer() {
    const { id } = useParams();
    const canvasRef = useRef(null);
    const [imageData, setImageData] = useState({ id: 4, url: '/images/CTE.gif', name: "Concussion", tags: ['brain', "head", 'skull'] });
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return; // Additional check to ensure canvas is not null
        const ctx = canvas.getContext('2d');

        canvas.width = 512;
        canvas.height = 512;

        let image = images.find(image => image.id === parseInt(id, 10));
        setImageData(image)

        let img = new Image();
        // Construct the path based on the id, assuming images are named like "image-1.jpg", "image-2.jpg", etc.
        img.src = image.url; // Adjust path as needed

        let canvasPos = { x: 0, y: 0, scale: 1 };
        let mouseDown = false;
        let startPos = { x: 0, y: 0 };

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.save();
            ctx.translate(canvasPos.x, canvasPos.y);
            ctx.scale(canvasPos.scale, canvasPos.scale);
            ctx.drawImage(img, 0, 0, img.width, img.height);
            ctx.restore();
        };

        img.onload = draw;

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
            }
        };

        const handleWheel = (e) => {
            e.preventDefault();
            const zoom = e.deltaY * -0.002;
            const newScale = canvasPos.scale + zoom;
            if (newScale > 0.1 && newScale < 10) { // Limit zoom level
                canvasPos.scale = newScale;
                draw();
            }
        };

        canvas.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('mouseup', handleMouseUp);
        canvas.addEventListener('mousemove', handleMouseMove);
        canvas.addEventListener('wheel', handleWheel);

        setLoaded(true);

        // Cleanup function to remove event listeners
        return () => {
            canvas.removeEventListener('mousedown', handleMouseDown);
            window.removeEventListener('mouseup', handleMouseUp);
            canvas.removeEventListener('mousemove', handleMouseMove);
            canvas.removeEventListener('wheel', handleWheel);
        };



    }, [id]); // Dependency array, re-run the effect if `id` changes

    return (
        <div>
            <div style={{ textAlign: 'center', margin: "auto" }}>
                <div>
                    <h1>Image Viewer:</h1>
                    {imageData.name && loaded &&
                        <strong>Title: {imageData.name}</strong>
                    }
                </div>

                <canvas style={{ border: "3px solid", borderRadius: 10, borderColor: "black" }} ref={canvasRef}></canvas>
                {/* download image */}
                {/* <div>Download Image
                    <img src={imageData.url} alt="Download" style={{ width: 386, height: 386, filter: 'blur(5px)' }} />
                </div> */}
                <div>
                    <h4>Download Image</h4>
                    <a style={{ marginRight: 200 }} href={"http://localhost:3000/" + imageData.url} download>Download</a>
                    <button onClick={() => window.history.back()}>Back</button>
                </div>
                {/* Space for advertisements */}
                {/* <br> </br> */}
                <div style={{ margin: 20, padding: 50 }}> Advertisement Space</div>
            </div>
        </div>
    );
}

export default ImageViewer;
