import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getForms } from '../firebase/firebase';
import ComplexNavbar from '../components/navbar';

const HomePage = () => {
  const [forms, setForms] = useState([]);

  useEffect(() => {
    const fetchForms = async () => {
      try {
        const fetchedForms = await getForms();
        console.log('Fetched forms:', fetchedForms);
        setForms(fetchedForms);
      } catch (error) {
        console.error('Error fetching forms:', error);
      }
    };

    fetchForms();
  }, []); // Run once when the component mounts

  return (
    <div>
      <h1>Existing Forms</h1>
      <ul>
        {forms.map(form => (
          <li key={form.id}>
            {form.title} - {form.description}
          </li>
        ))}
      </ul>
      <Link to="/create-form">Create New Form</Link>
    </div>
  );
};

export default HomePage;
