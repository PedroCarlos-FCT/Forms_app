import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { setForm} from "../firebase/firebase";
import { toast, Toaster } from 'react-hot-toast';
import Page from '../components/page';
import Loading from '../components/loading';
import { useAuth } from '../contexts/AuthContext';

const CreateFormPage = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const auth = useAuth();

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    if (!title || !description) {
      toast.error('Por favor, preencha todos os campos');
      console.error('Preencher campos');
      setLoading(false);
      return;
    }
    try {
      const id = await setForm({ title, description }, auth.authUser.uid);
      console.log('Form created with id:', id);
      toast.success('Formulário criado com sucesso');
      navigate(`/edit-form?id=${id}`);


    } catch (error) {
      console.error('Error creating form:', error);
    }
    setLoading(false);
  };


  return (
    <Page>
      <Toaster />
      <div style={{padding: "100px 100px"}}>
      <h1 className="text-3xl font-bold mb-4">Create New Form</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-lg mb-1">Name:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-lg mb-1">Description:</label>
          <textarea
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
        >
          Create Form
        </button>
      </form>
      </div>
      <Loading isOpen={loading} />
    </Page>
  );
};
export default CreateFormPage;
