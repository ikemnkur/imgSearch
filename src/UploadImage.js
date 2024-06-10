import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const UploadImage = () => {
  const [name, setName] = useState('');
  const [nickname, setNickname] = useState('');
  const [tags, setTags] = useState('');
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setPreviewUrl(URL.createObjectURL(selectedFile));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'qusohlag'); // Replace with your upload preset

    try {
      const response = await axios.post(
        'https://api.cloudinary.com/v1_1/dfquan1h5/image/upload', // Replace 'your_cloud_name'
        formData
      );

      const imageUrl = response.data.secure_url;

      const imageData = {
        name,
        nickname,
        tags: tags.split(',').map(tag => tag.trim()),
        url: imageUrl,
      };

      // Optionally, POST the image data to your JSON server
      await fetch('http://localhost:5000/images', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(imageData),
      });

      // Reset form fields
      setName('');
      setNickname('');
      setTags('');
      setFile(null);
      setPreviewUrl(null);
      setLoading(false);

      // Navigate to the gallery page with the search query
      fetch('http://localhost:5000/images?name=' + imageData.name)
            .then((response) => response.json())
            .then((data) => navigate(`/image/${data.id}`));
      
      // navigate(`/gallery?search=${imageData.name}`);
    } catch (error) {
      console.error('Error uploading image to Cloudinary:', error);
      setLoading(false);
    }
  };

  return (
    <div className="upload-image">
      <h1>Upload an Image:</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter image name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Enter your nickname"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Enter tags (comma separated)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          required
        />
        <input
          type="file"
          onChange={handleFileChange}
          required
        />
        {previewUrl && (
          <div>
            <h2>Image Preview:</h2>
            <img src={previewUrl} alt="Preview" style={{ width: '300px', margin: '10px 0' }} />
          </div>
        )}
        <button type="submit" style={{ background: 'green' }} disabled={loading}>
          {loading ? 'Uploading...' : 'Upload Image'}
        </button>
        <button type="button" onClick={() => window.history.back()}>
          Back
        </button>
      </form>
    </div>
  );
};

export default UploadImage;