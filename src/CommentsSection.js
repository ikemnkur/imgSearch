import React, { useState, useEffect } from 'react';
import './CommentsSection.css';

const CommentsSection = ({ id }) => {
  const [nickname, setNickname] = useState('');
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);

  useEffect(() => {
    fetch(`https://json-server-db-d8c4c14f5f95.herokuapp.com/comments?imageId=${id}`)
      .then((response) => response.json())
      .then((data) => setComments(data));
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (nickname && comment) {
      const newComment = {
        imageId: id,
        nickname,
        comment,
        timestamp: new Date().toUTCString(),
      };

      // POST the new comment to the JSON server
      const response = await fetch('https://json-server-db-d8c4c14f5f95.herokuapp.com/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newComment),
      });

      if (response.ok) {
        const savedComment = await response.json();
        setComments([...comments, savedComment]);
        setNickname('');
        setComment('');
      }
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
