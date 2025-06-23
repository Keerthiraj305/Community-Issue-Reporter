import React, { useState } from 'react';
import { issueApi } from '../api';

function TodoForm({ onIssueAdded }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await issueApi.post('/', { title, description, location });
      onIssueAdded();
      setTitle('');
      setDescription('');
      setLocation('');
    } catch (error) {
      console.error('Error adding issue:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        placeholder="Title"
        value={title}
        onChange={e => setTitle(e.target.value)}
        required
      />
      <input
        placeholder="Description"
        value={description}
        onChange={e => setDescription(e.target.value)}
        required
      />
      <input
        placeholder="Location"
        value={location}
        onChange={e => setLocation(e.target.value)}
        required
      />
      <button type="submit">Report Issue</button>
    </form>
  );
}

export default TodoForm;