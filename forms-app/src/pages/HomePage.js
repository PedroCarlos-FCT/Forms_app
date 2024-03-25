import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getForms } from '../firebase/firebase';
import Page from '../components/page';
import Loading from '../components/loading';
import Table from '../components/table';
import { useAuth } from '../contexts/AuthContext';

const HomePage = () => {
  const [forms, setForms] = useState(null);
  const auth  = useAuth();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchForms = async () => {
      setLoading(true);
      try {
        const fetchedForms = await getForms(auth.authUser.uid);
        console.log('Fetched forms:', fetchedForms);
        setForms(fetchedForms);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching forms:', error);
        setLoading(false);
      }
    };

    fetchForms();
  }, [auth]); // Run once when the component mounts



  return (
    <Page>
      <div>
      {/* <Link to={`/edit-form?id=${id}`}>Respond to form</Link> */}

        <div style={{padding: "20px 200px"}}>
        {forms && <Table rows={forms} />} {/* Corrected prop name */}
        </div>
        <Link to="/create-form">Create New Form</Link>
      </div>
      <Loading isOpen={loading} />
    </Page>
  );
};

export default HomePage;
