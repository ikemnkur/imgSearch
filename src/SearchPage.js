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
    return shuffled.slice(0, 4);
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
        <div>
          <table style={{ width: "90%", background: "#FFDDEE", margin: "auto" }}>
            <tbody>
              {getRandomThumbnails().map((thumbnail, index) => (
                <tr key={index}>
                  <td colSpan={2}>
                    <img src={thumbnail.url} alt={thumbnail.name} style={{ width: '100%', height: 'auto' }} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button style={{ marginRight: 20, width: 100, background: "purple" }} onClick={() => navigate(`/image/${Math.floor(Math.random() * localStorage.getItem('imagesLength') + 1)}`)}> Random</button>
      </div>
    </div>
  );
}

export default SearchPage;
