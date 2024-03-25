import React, { useState, useEffect } from 'react';
import { getQuestions, setQuestion, updateForm } from '../firebase/firebase';
import Page from '../components/page';
import Loading from '../components/loading';
import Table from '../components/table';
import { useLocation } from 'react-router-dom';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import toast from 'react-hot-toast';

const EditFormPage = () => {

    const { search } = useLocation();
    const queryParams = new URLSearchParams(search);
    const id = queryParams.get('id');
    const [questions, setQuestions] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showModalEdit, setShowModalEdit] = useState(false);
    const [formData, setFormData] = useState({ title: '', description: '', type: '0', options: [] });
    const [change, setChange] = useState(false);
    const [option, setOption] = useState(''); // State for handling individual option
    const [loading, setLoading] = useState(false);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    const columnsNames = ["Title", "Description", "Options", "Last update on"];


    useEffect(() => {
        setLoading(true)
        const fetchQuestions = async () => {
            try {
                const fetchedForms = await getQuestions(id);
                console.log('Fetched questions:', fetchedForms);
                setQuestions(fetchedForms);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching forms:', error);
                setLoading(false);
            }
        };

        fetchQuestions();
    }, [id, change]);

    const handleOpenModal = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleOpenModalEdit = () => {
        setShowModalEdit(true);
    };

    const handleCloseModalEdit = () => {
        setShowModalEdit(false);
    };

    const handleSubmit = async () => {
        try {
            console.log('Form data:', formData);
            // setQuestion(formId, questionId, data, user) 
            await setQuestion(formData, id);
            handleCloseModal();
            setChange(!change);

        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    const handleSubmitEdit = async () => {
        try {
            console.log('Form data:', formData);
            updateForm(id, { title, description });
            handleCloseModalEdit();
            toast.success('Formulário atualizado com sucesso');
        } catch (error) {
            console.error('Error submitting form:', error);
            toast.error('Erro ao atualizar formulário');
        }
    };
    // Function to handle adding options for type 1 or 2
    const handleAddOption = () => {
        setFormData(prevState => ({
            ...prevState,
            options: [...prevState.options, option],
        }));
        setOption(''); // Clear input after adding option
    };

    return (
        <Page>
            <div>
                <Button variant="primary" onClick={handleOpenModal}>
                    Add Question
                </Button>
                <Button variant="primary" onClick={handleOpenModalEdit}>
                    Edit Form
                </Button>
                <div style={{ padding: "20px 200px" }}>
                    {questions && <Table rows={questions} columns={columnsNames} editable={false} respondable={false} />}

                    <Modal show={showModal} onHide={handleCloseModal}>
                        <Modal.Header closeButton>
                            <Modal.Title>Add New Question</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <form>
                                <div className="mb-3">
                                    <label htmlFor="title" className="form-label">Title</label>
                                    <input type="text" className="form-control" id="title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="description" className="form-label">Description</label>
                                    <input type="text" className="form-control" id="description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="type" className="form-label">Type</label>
                                    <select className="form-control" id="type" value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })}>
                                        <option value="0">0</option>
                                        <option value="1">1</option>
                                        <option value="2">2</option>
                                    </select>
                                </div>
                                {(formData.type === '1' || formData.type === '2') && (
                                    <div className="mb-3">
                                        <label htmlFor="options" className="form-label">Options</label>
                                        <input type="text" className="form-control" id="options" value={option} onChange={(e) => setOption(e.target.value)} />
                                        <Button variant="primary" onClick={handleAddOption}>Add Option</Button>
                                        <ul>
                                            {formData.options.map((opt, index) => (
                                                <li key={index}>{opt}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </form>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleCloseModal}>
                                Close
                            </Button>
                            <Button variant="primary" onClick={handleSubmit}>
                                Save Question
                            </Button>
                        </Modal.Footer>
                    </Modal>

                    <Modal show={showModalEdit} onHide={handleCloseModalEdit}>
                        <Modal.Header closeButton>
                            <Modal.Title>Edit Form</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <form >
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
                            </form>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleCloseModalEdit}>
                                Close
                            </Button>
                            <Button variant="primary" onClick={handleSubmitEdit}>
                                Save Form
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </div>
            </div>
            <Loading isOpen={loading} />
        </Page>
    );
};

export default EditFormPage;
