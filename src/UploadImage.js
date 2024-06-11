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

  const resizeImage = (imageFile, callback) => {
    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    img.onload = () => {
      const scaleFactor = 1 / 8;
      canvas.width = img.width * scaleFactor;
      canvas.height = img.height * scaleFactor;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      canvas.toBlob(callback, 'image/jpeg');
    };

    img.src = URL.createObjectURL(imageFile);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'qusohlag'); // Replace with your upload preset

    try {
      // Upload original image
      const response = await axios.post(
        'https://api.cloudinary.com/v1_1/dfquan1h5/image/upload',
        formData
      );
      const imageUrl = response.data.secure_url;

      // Create and upload thumbnail
      resizeImage(file, async (thumbnailBlob) => {
        const thumbnailFormData = new FormData();
        thumbnailFormData.append('file', thumbnailBlob);
        thumbnailFormData.append('upload_preset', 'qusohlag'); // Replace with your upload preset

        const thumbnailResponse = await axios.post(
          'https://api.cloudinary.com/v1_1/dfquan1h5/image/upload',
          thumbnailFormData
        );
        const thumbnailUrl = thumbnailResponse.data.secure_url;

        const timestamp = new Date().toUTCString();

        const imageData = {
          name,
          nickname,
          tags: tags.split(',').map(tag => tag.trim()),
          url: imageUrl,
          timestamp,
        };

        const thumbnailData = {
          ...imageData,
          url: thumbnailUrl,
        };

        // POST the image data to your JSON server
        await fetch('https://json-server-db-d8c4c14f5f95.herokuapp.com/images', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(imageData),
        });

        // POST the thumbnail data to your JSON server
        await fetch('https://json-server-db-d8c4c14f5f95.herokuapp.com/thumbnails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(thumbnailData),
        });

        // Reset form fields
        setName('');
        setNickname('');
        setTags('');
        setFile(null);
        setPreviewUrl(null);
        setLoading(false);

        // Navigate to the gallery page with the search query
        fetch('https://json-server-db-d8c4c14f5f95.herokuapp.com/images?name=' + imageData.name)
              .then((response) => response.json())
              .then((data) => navigate(`/image/${data[0].id}`));
      });
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
