import React, { useState, useEffect } from 'react';
import { formatDistanceToNow, parseISO } from 'date-fns';
import './CommentsSection.css';

const CommentsSection = ({ id }) => {
  const [nickname, setNickname] = useState('');
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const db_url = process.env.REACT_APP_JSON_DB_API_BASE_URL;

  useEffect(() => {
    fetch(`${db_url}/comments?imageId=${id}`)
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setComments(data);
        }
      })
      .catch((error) => console.error('Error fetching comments:', error));
  }, [id, db_url, comments]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (nickname && comment) {
      const newComment = {
        imageId: id,
        nickname,
        comment,
        timestamp: new Date().toISOString(),
      };

      console.log('Submitting comment:', newComment);

      const response = await fetch(`${db_url}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newComment),
      });

      if (response.ok) {
        const savedComment = await response.json();
        console.log('Saved comment:', savedComment);
        setComments([...comments, savedComment]);
        setNickname('');
        setComment('');
      } else {
        console.error('Error submitting comment:', response.statusText);
      }
    }
  };

  return (
    <div className="comments-section">
      <form onSubmit={handleSubmit}>
        <h2>Comments</h2>
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
      <div className="comments-list" style={{ overflowY: 'scroll' }}>
        {comments.map((c, index) => (
          <div key={index} className="comment">
            <p>
              <strong>{c.nickname}</strong>
              {c.timestamp ? ` (${formatDistanceToNow(parseISO(c.timestamp))} ago)` : ''}
            </p>
            <p>{c.comment}</p>
          </div>
        ))}
        {comments.length === 0 && <p>No comments yet. Be the first to comment!</p>}
      </div>
    </div>
  );
};

export default CommentsSection;
