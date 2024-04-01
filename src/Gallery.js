import React from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

const images = [
    { id: 1, url: '/images/landscape.jpeg', name: "Tree", tags: ['nature', 'landscape'] },
    { id: 2, url: '/images/bird.jpg', name: "crow", tags: ['fly', "bird", 'animal'] },
    { id: 3, url: '/images/mine.jpg', name: "Mine", tags: ['war', 'sea', 'mine', "explosion"] },
    { id: 4, url: '/images/CTE.gif', name: "Concussion", tags: ['brain', "head", 'skull'] },
    // Add more images as needed
];


function Gallery() {
    let [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const searchTerm = searchParams.get('search');
    const filteredImages = images.filter(image => image.tags.includes(searchTerm.toLocaleLowerCase()) || image.name.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase()));

    return (

        <div style={{ textAlign: 'center' }}>
            <h1>Search Results:</h1>
            {/* <div style={{ display: "grid", gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '10px', border: 3, width: 512, margin: "auto", justifyContent: 'center' }}> */}
            <div style={{ height: 700, overflowY:"scroll", display: "grid", gap: '10px', border: 3, width: 512, margin: "auto", justifyContent: 'center' }}>
                {filteredImages.map(image => (
                    <img
                        key={image.id}
                        src={image.url}
                        alt=""
                        style={{ width: '300px', filter: 'blur(5px)', margin: 'auto', padding: 5, cursor: 'pointer' }}
                        onClick={() => navigate(`/image/${image.id}`)}
                    />
                ))}
            </div>
            <div style={{ margin: 20 }}>
                {/* <h4>Download Image</h4>
                <a style={{ marginRight: 200 }} href={"http://localhost:3000/" + imageData.url} download>Download</a> */}
                <button onClick={() => window.history.back()}>Back</button>
            </div>
            {/* Space for advertisements */}
            <br></br>
            <div>Advertisement Space</div>
        </div>
    );
}

export default Gallery;
