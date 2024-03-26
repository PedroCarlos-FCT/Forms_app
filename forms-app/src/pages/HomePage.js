import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getForms } from '../firebase/firebase';
import Page from '../components/page';
import Loading from '../components/loading';
import Table from '../components/table';
import { useAuth } from '../contexts/AuthContext';
import Button from 'react-bootstrap/Button';

const HomePage = () => {
  const [forms, setForms] = useState([]);
  const auth = useAuth();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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

  const handleRedirect = () => {
    navigate('/create-form');
  }



  return (
    <Page>
      <div>
        <Button variant="primary" onClick={handleRedirect}>
          Create New Form
        </Button>
        <div style={{ padding: "20px" }}>
          {forms.lenght !== 0 && <Table rows={forms} />} {/* Corrected prop name */}
        </div>
      </div>
      <Loading isOpen={loading} />
    </Page>
  );
};

export default HomePage;
