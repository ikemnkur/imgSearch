import React, { useState, useEffect } from 'react';
import './CommentsSection.css';

const CommentsSection = ({id}) => {


  const db_url = process.env.JSON_DB_API_BASE_URL || "https://json-server-db-d8c4c14f5f95.herokuapp.com";
  const [nickname, setNickname] = useState('');
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  console.log("comments", comments);

//   const [comments, setImages] = useState([]);

  useEffect(() => {
    fetch(`${db_url}/comments?imageId='+id`)
      .then((response) => response.json())
      .then((data) => setComments(data));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (nickname && comment) {
      const newComment = {
        nickname,
        comment,
        timestamp: new Date().toUTCString(),
      };
      setComments([...comments, newComment]);
      setNickname('');
      setComment('');
    }
  };

  return (
    <div className="comments-section">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter your nickname"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
        />
        <textarea
          placeholder="Leave a comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        ></textarea>
        <button type="submit">Submit</button>
      </form>
      <div className="comments-list">
        {comments.map((c, index) => (
          <div key={index} className="comment">
            <p><strong>{c.nickname}</strong> ({c.timestamp}):</p>
            <p>{c.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentsSection;
