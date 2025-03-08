import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const UploadMedia = () => {
  const [name, setName] = useState('');
  const [nickname, setNickname] = useState('');
  const [tags, setTags] = useState('');
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  // const db_url = process.env.REACT_APP_JSON_DB_API_BASE_URL;
  // const db_url = process.env.REACT_APP_GCS_DB_API_BASE_URL;
  const db_url = "https://console.cloud.google.com/storage/browser/phind_bucket"
  const navigate = useNavigate();

  // Handle file input change and set preview
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  // Simple image resize function for thumbnails.
  const resizeImage = (imageFile, callback) => {
    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    img.onload = () => {
      const scaleFactor = 1 / 4; // For example, shrink to 25%
      canvas.width = img.width * scaleFactor;
      canvas.height = img.height * scaleFactor;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(callback, 'image/jpeg');
    };
    img.src = URL.createObjectURL(imageFile);
  };

  // Helper to request a signed URL from your server.
  const getSignedUrl = async (fileName, contentType) => {
    const response = await axios.post(`${db_url}/sign-url`, {
      fileName,
      contentType,
    });
    // Expect your server to return an object like: { signedUrl, bucketName }
    return response.data;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!file) {
      alert("Please select a file to upload.");
      setLoading(false);
      return;
    }

    const fileSize = file.size;
    const fileType = file.type; // e.g., image/jpeg, image/png, image/gif, video/mp4, audio/mpeg, etc.

    // Enforce size limits based on file type:
    if (fileType.startsWith("image/") && fileType !== "image/gif") {
      if (fileSize > 1 * 1024 * 1024) {
        alert("Images must be under 1MB");
        setLoading(false);
        return;
      }
    } else if (fileType === "image/gif") {
      if (fileSize > 20 * 1024 * 1024) {
        alert("GIFs must be under 20MB");
        setLoading(false);
        return;
      }
    } else if (fileType.startsWith("video/")) {
      if (fileSize > 50 * 1024 * 1024) {
        alert("Videos must be under 50MB");
        setLoading(false);
        return;
      }
    } else if (fileType.startsWith("audio/")) {
      if (fileSize > 5 * 1024 * 1024) {
        alert("Audio files must be under 5MB");
        setLoading(false);
        return;
      }
    } else {
      alert("Unsupported file type.");
      setLoading(false);
      return;
    }

    // Generate a unique file name to avoid collisions.
    const uniqueFileName = `${Date.now()}-${file.name}`;

    // Get a signed URL for the main file
    let signedData;
    try {
      signedData = await getSignedUrl(uniqueFileName, fileType);
    } catch (err) {
      console.error("Error obtaining signed URL:", err);
      setLoading(false);
      return;
    }
    const { signedUrl, bucketName } = signedData;
    // Construct the public URL (assuming your bucket is public)
    const publicUrl = `https://storage.googleapis.com/${bucketName}/${uniqueFileName}`;

    // For non-gif images, generate and upload a thumbnail.
    let thumbnailUrl = null;
    if (fileType.startsWith("image/") && fileType !== "image/gif") {
      try {
        const thumbnailBlob = await new Promise((resolve) => {
          resizeImage(file, resolve);
        });
        const thumbnailFileName = `thumb-${uniqueFileName}`;
        const thumbSignedData = await getSignedUrl(thumbnailFileName, 'image/jpeg');
        const { signedUrl: thumbSignedUrl, bucketName: thumbBucketName } = thumbSignedData;
        thumbnailUrl = `https://storage.googleapis.com/${thumbBucketName}/${thumbnailFileName}`;

        await axios.put(thumbSignedUrl, thumbnailBlob, {
          headers: {
            'Content-Type': 'image/jpeg'
          }
        });
      } catch (err) {
        console.error("Error uploading thumbnail:", err);
        // If thumbnail upload fails, you can continue without it.
      }
    }

    // Upload the main file using the signed URL.
    try {
      await axios.put(signedUrl, file, {
        headers: {
          'Content-Type': fileType,
        },
      });
    } catch (err) {
      console.error("Error uploading file to GCS:", err);
      setLoading(false);
      return;
    }

    // Prepare the media data with metadata.
    const timestamp = new Date().toUTCString();
    const mediaData = {
      name,
      nickname,
      tags: tags.split(',').map(tag => tag.trim()),
      url: publicUrl,
      timestamp,
      thumbnailUrl,
    };

    // Save the metadata to your server.
    try {
      const uploadResponse = await fetch(`${db_url}/upload`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(mediaData),
      });
      const result = await uploadResponse.json();

      // Reset form fields.
      setName('');
      setNickname('');
      setTags('');
      setFile(null);
      setPreviewUrl(null);
      setLoading(false);

      // Navigate to the media view page (adjust as needed)
      navigate(`/image/${result.imageId}`);
    } catch (err) {
      console.error("Error saving media metadata:", err);
      setLoading(false);
    }
  };

  return (
    <div className="upload-image">
      <strong>Have your own media to share?</strong>
      <h1>Upload Media:</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter media name"
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
            <h2>Preview:</h2>
            {file && file.type.startsWith('image/') ? (
              <img src={previewUrl} alt="Preview" style={{ width: '300px', margin: '10px 0' }} />
            ) : (
              <video width="300" controls style={{ margin: '10px 0' }}>
                <source src={previewUrl} type={file.type} />
                Your browser does not support the video tag.
              </video>
            )}
          </div>
        )}
        <button type="submit" style={{ background: 'green' }} disabled={loading}>
          {loading ? 'Uploading...' : 'Upload Media'}
        </button>
        <button type="button" onClick={() => window.history.back()}>
          Back
        </button>
        <br />
        <div>
          <h3>Sponsor Video</h3>
          <iframe
            width="95%"
            src="https://www.youtube.com/embed/ov0_ehE5t2A?autoplay=1&mute=1"
            frameBorder="0"
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title="Sponsor Video"
          ></iframe>
        </div>
      </form>
    </div>
  );
};

export default UploadMedia;
