import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function SearchPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [thumbnails, setThumbnails] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchThumbnails = async () => {
      try {
        const response = await fetch('https://json-server-db-d8c4c14f5f95.herokuapp.com/thumbnails');
        const data = await response.json();
        setThumbnails(data);
      } catch (error) {
        console.error('Error fetching thumbnails:', error);
      }
    };

    fetchThumbnails();
  }, []);

  const getRandomThumbnails = () => {
    const shuffled = [...thumbnails].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 6);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/gallery?search=${searchTerm}`);
  };

  const handleUpload = (e) => {
    e.preventDefault();
    navigate(`/upload`);
  };

  return (
    <div>
      <div style={{ margin: "auto", textAlign: 'center' }}>
        <h1>Search for Images</h1>
        <div style={{ alignContent: 'center', margin: "auto" }}>
          <form onSubmit={handleSearch}>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Enter tags..."
            />
            <button style={{ marginLeft: 0 }} type="submit">Search</button>
          </form>
        </div>
        {/* Space for advertisements */}
        <br></br>
        <div>Advertisement Space</div>
        <br></br>
        <br></br>
        <div>
          <strong>Have your own image to share?</strong>
        </div>

        <button style={{ width: 150, background: "green" }} onClick={handleUpload}>Upload</button>
        <h1>Random Pics</h1>
        <p>Click to Reveal</p>
        <div style={{ width: "90%", background: "#FFDDEE", margin: "auto", gap: "10px", borderRadius: 5}}>
          {/* <table style={{ width: "90%", background: "#FFDDEE", margin: "auto" }}>
            <tbody> */}
              {getRandomThumbnails().map((thumbnail, index) => (
                // <tr key={index}>
                  // <td colSpan={2}>
                    <img src={thumbnail.url} alt={thumbnail.name} style={{ filter: 'blur(10px)', maxWidth: '100px', maxHieght: '100px', margin: "auto", padding: 5, borderRadius: 5}} 
                      onClick={() => navigate(`/image/${thumbnail.id}`)}
                    />
                //   </td>
                // </tr> 
              ))}
            {/* </tbody>
          </table> */}
        </div>
        <button style={{ width: 100, marginTop: 15, background: "purple" }} onClick={() => navigate(`/image/${Math.floor(Math.random() * localStorage.getItem('imagesLength') + 1)}`)}> Random</button>
        
      </div>
    </div>
  );
}

export default SearchPage;
