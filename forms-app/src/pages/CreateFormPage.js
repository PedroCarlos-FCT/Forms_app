import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CreateFormPage = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Submit form data to backend API to create a new form
    try {
      // Your API call to create a new form
      // After successful creation, redirect to home page
      navigate.push('/');
    } catch (error) {
      console.error('Error creating form:', error);
    }
  };

  return (
    <div>
      <h1>Create New Form</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        <label>
          Description:
          <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} />
        </label>
        <button type="submit">Create Form</button>
      </form>
    </div>
  );
};

export default CreateFormPage;
