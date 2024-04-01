import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function SearchPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/gallery?search=${searchTerm}`);
  };

  return (
    <div>
        <div style={{ margin: "auto", textAlign: 'center' }}>
            <h1>Search for Images</h1>
            <form onSubmit={handleSearch}>
                <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Enter tags..."
                />
                <button style={{ marginLeft: 5 }} type="submit">Search</button>
            </form>
            {/* Space for advertisements */}
            <br></br>   
            <div>Advertisement Space</div>
        </div>
    </div>
  );
}

export default SearchPage;
