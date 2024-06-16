import React, { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import './CommentsSection.css';

const CommentsSection = ({ id }) => {
  const [nickname, setNickname] = useState('');
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const db_url = process.env.REACT_APP_JSON_DB_API_BASE_URL;


  useEffect(() => {
    fetch(`${db_url}/comments?imageId=${id}`)
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
        timestamp: new Date().toISOString(),
      };

      // POST the new comment to the JSON server
      const response = await fetch(`${db_url}/comments`, {
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
            <p><strong>{c.nickname}</strong> ({formatDistanceToNow(new Date(c.timestamp), { addSuffix: true })}):</p>
            <p>{c.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentsSection;
