import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function SearchPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

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
            <div style={{ alignContent: 'center', marign: "auto"}}>
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
             <strong>  
              Have your own image to share? 
              </strong>
            </div>
            
                <button style={{ width: 150, background: "green" }}  onClick={handleUpload}>Upload</button>
              
        </div>
    </div>
  );
}

export default SearchPage;
