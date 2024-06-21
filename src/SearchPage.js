import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function SearchPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [thumbnails, setThumbnails] = useState([]);
  const [randomThumbnails, setRandomThumbnails] = useState([]);
  const navigate = useNavigate();
  const db_url = process.env.REACT_APP_JSON_DB_API_BASE_URL;

  useEffect(() => {
    const fetchThumbnails = async () => {
      try {
        const response = await fetch(`${db_url}/thumbnails`);
        const data = await response.json();
        setThumbnails(data);
        setRandomThumbnails(generateRandomThumbnails(data));
      } catch (error) {
        console.error('Error fetching thumbnails:', error);
      }
    };

    fetchThumbnails();


  }, [db_url]);

  useEffect(() => {
    const interval = setInterval(() => {
      setRandomThumbnails(generateRandomThumbnails(thumbnails));
    }, 10000);

    return () => clearInterval(interval);
  }, [thumbnails]);


  const generateRandomThumbnails = (thumbnails) => {
    const shuffled = [...thumbnails].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3);
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
      <meta name="juicyads-site-verification" content="bbe5a33bc5b03f01ab140107439da909"></meta>
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
        {/* <br></br> */}
        {/* <div style={{ margin: 20, padding: 50 }}>
          Advertisement Space */}
          {/* <div dangerouslySetInnerHTML={{
            __html: `
                <!-- JuicyAds v3.0 -->
                <script type="text/javascript" data-cfasync="false" async src="https://poweredby.jads.co/js/jads.js"></script>
                <ins id="1059978" data-width="300" data-height="112"></ins>
                <script type="text/javascript" data-cfasync="false" async>(adsbyjuicy = window.adsbyjuicy || []).push({'adzone':1059978});</script>
                <!--JuicyAds END-->
              ` }}></div> */}
        {/* </div> */}
        <br></br>
        <br></br>
        <div>
          <strong>Have your own image to share?</strong>
        </div> 
        <button style={{ width: 150, background: "green" }} onClick={handleUpload}>Upload</button>
        <br></br>
        <h3>Random Pics</h3>
        <p>Click to Reveal</p>
        <div style={{ width: "90%", background: "#FFDDEE", margin: "auto", gap: "10px", borderRadius: 5 }}>
          {randomThumbnails.map((thumbnail, index) => (
            <img
              key={index}
              src={thumbnail.url}
              alt={thumbnail.name}
              style={{ filter: 'blur(10px)', maxWidth: '100px', maxHeight: '100px', margin: "auto", padding: 5, borderRadius: 5 }}
              onClick={() => navigate(`/image/${thumbnail.id}`)}
            />
          ))}
        </div>
        <button style={{ width: 100, marginTop: 15, background: "purple" }} onClick={() => navigate(`/image/${Math.floor(Math.random() * localStorage.getItem('imagesLength') + 1)}`)}> Random</button>
      </div> 
      <div style={{ margin: "auto", padding: 50 }}>
          <strong style={{}}>Advertisement Space </strong>
          <br></br>
          <iframe
              width="95%"
              height="95%"
              src="https://www.youtube.com/embed/ov0_ehE5t2A?autoplay=1&mute=1" 
              frameBorder="0"
              allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title="Sponsor Video"
            ></iframe>
        </div>
    </div>
  );
}

export default SearchPage;
