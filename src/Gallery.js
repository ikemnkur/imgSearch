import React, { useState, useEffect } from 'react';
// import ImagesList from './ImagesList';
import { useSearchParams, useNavigate } from 'react-router-dom';


function Gallery() {

    const [images, setImages] = useState([]);

    useEffect(() => { 
        
        if (images.length > 0) {
            localStorage.setItem('imagesLength', images.length);
            return;
        }
       
        fetch('http://localhost:5000/images')
            .then((response) => response.json())
            .then((data) => setImages(data));
        // localStorage.setItem('imagesLength', images.length);
    }, []);

    let [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const searchTerm = searchParams.get('search');
    const filteredImages = images.filter(image => image.tags.includes(searchTerm.toLocaleLowerCase()) || image.name.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase()));

    return (

        <div style={{ textAlign: 'center' }}>
            <h1>Search Results:</h1>
            <h3>Search Term: "{searchTerm}"</h3>
            {/* <div style={{ display: "grid", gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '10px', border: 3, width: 512, margin: "auto", justifyContent: 'center' }}> */}

            {filteredImages.length !== 0 && (<div style={{ height: 700, overflowY: "scroll", overflow: "hidden", display: "grid", gap: '10px', border: 3, width: 512, margin: "auto", justifyContent: 'center' }}>
                {filteredImages.map(image => (
                    <img
                        key={image.id}
                        src={image.url}
                        alt={image.name}
                        style={{ width: '300px', filter: 'blur(5px)', margin: 'auto', padding: 5, cursor: 'pointer' }}
                        onClick={() => navigate(`/image/${image.id}`, { state: { image } })}
                    />
                ))}
            </div>)}
            {filteredImages.length === 0 && <div style={{ height: 400, margin: "auto", maxwidth: 600, display: "flex", background: "#FFEEEE" }}> <h2 style={{ margin: "auto" }}>No images found</h2> </div>}
            <div style={{ margin: 20 }}>
                <div>
                    <h4>Search for New Image?</h4>
                    <button style={{ marginRight:20, width: 100, background: "purple" }} onClick={() => navigate(`/image/${Math.floor(Math.random() * localStorage.getItem('imagesLength')+1)}`)}> Random</button>
                    <button style={{  width: 100,  }} onClick={() => window.history.back()}>Back</button>
                    <button style={{ marginLeft:20, width: 100, background: '#FF3333', }} onClick={() => navigate(`/`)}>Main</button>
                </div>
            </div>
            {/* Space for advertisements */}
            <br></br>
            <div>Advertisement Space</div>
        </div>
    );
}

export default Gallery;
