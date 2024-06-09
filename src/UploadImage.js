import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const UploadImage = () => {
  const [name, setName] = useState('');
  const [nickname, setNickname] = useState('');
  const [tags, setTags] = useState('');
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setPreviewUrl(URL.createObjectURL(selectedFile));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', name);
    formData.append('nickname', nickname);
    formData.append('tags', tags);
    formData.append('image', file);

    const response = await fetch('http://localhost:5001/upload', {
      method: 'POST',
      body: formData
    });

    if (response.ok) {
      const data = await response.json();
      console.log('Uploaded Image Info:', data);

      await fetch('http://localhost:5000/images', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      setName('');
      setNickname('');
      setTags('');
      setFile(null);
      setPreviewUrl(null);
      navigate(`/gallery?search=${data.name}`);
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
        <button type="submit" style={{ background: 'green' }}>Upload Image</button>
        <button type="button" onClick={() => window.history.back()}>Back</button>
      </form>
    </div>
  );
};

export default UploadImage;
