import React, { useState, useEffect } from 'react';
import { getQuestions, setQuestion, updateForm, getForm } from '../firebase/firebase';
import Page from '../components/page';
import Loading from '../components/loading';
import Table from '../components/table';
import { useLocation } from 'react-router-dom';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import toast, { Toaster } from 'react-hot-toast';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';

const EditFormPage = () => {

    const { search } = useLocation();
    const queryParams = new URLSearchParams(search);
    const id = queryParams.get('id');
    const [questions, setQuestions] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showModalEdit, setShowModalEdit] = useState(false);
    const [formData, setFormData] = useState({ title: '', description: '', type: '0', options: [] });
    const [change, setChange] = useState(false);
    const [option, setOption] = useState('');
    const [loading, setLoading] = useState(false);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [form, setForm] = useState(null);

    const columnsNames = ["Title", "Description", "Options", "Last update on"];


    useEffect(() => {
        setLoading(true)
        const fetchQuestions = async () => {
            try {
                const fetchedQuestions = await getQuestions(id);
                const form = await getForm(id);
                setQuestions(fetchedQuestions);
                setForm(form);
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
        setFormData({ title: '', description: '', type: '0', options: [] });
        setOption('');
    };

    const handleOpenModalEdit = () => {
        setShowModalEdit(true);

    };

    const handleCloseModalEdit = () => {
        setShowModalEdit(false);
        setTitle('');
        setDescription('');
    };

    const handleSubmit = async () => {
        if (!formData.title || !formData.type || ((formData.type === '1' || formData.type === '2') && formData.options.length === 0)){
            toast.error('Please fill the title field');
            console.error('Preencher campos');
            return;
        }

        try {
            console.log('Form data:', formData);
            await setQuestion(formData, id);
            handleCloseModal();
            setChange(!change);
            toast.success('Question added successfully');

        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    const handleSubmitEdit = async () => {
        if (!title || !description) {
            toast.error('Please fill the required fields');
            console.error('Preencher campos');
            return;
        }
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
            <Toaster />
            <div>
                <Row>
                    <Col sm={5} ></Col>
                    <Col sm={1}  >
                        <Button variant="primary" onClick={handleOpenModal}>
                            Add Question
                        </Button>
                    </Col>
                    <Col sm={1}>
                        <Button variant="primary" onClick={handleOpenModalEdit}>
                            Edit Form
                        </Button>
                    </Col>
                    <Col sm={5}></Col>
                </Row>
                <div style={{ padding: "20px 200px" }}>
                    {questions.length !== 0 ? <Table rows={questions} columns={columnsNames} editable={false} respondable={false} /> : <h1>Form has no questions. Create new questions.</h1>}

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
                                    <label htmlFor="description" className="form-label">Description (Optional)</label>
                                    <textarea type="text" className="form-control" id="description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
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
                                        <Button variant="primary" style={{ marginTop: "20px", marginBottom: "20px" }} onClick={handleAddOption}>Add Option</Button>
                                        <ul>

                                            {formData.options.map((opt, index) => (
                                                <div>
                                                    {index === 0 && <u>Adding options:</u>}
                                                    <li key={index}>{opt}</li>
                                                </div>
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
                            <Form>
                                <Form.Group className="mb-3" controlId="Name">
                                    <Form.Label>Form Name</Form.Label>
                                    <Form.Control type="text" placeholder={form && form.title} onChange={(e) => setTitle(e.target.value)} />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="Description">
                                    <Form.Label>Form Description</Form.Label>
                                    <Form.Control as="textarea" rows={3} onChange={(e) => setDescription(e.target.value)}/>
                                </Form.Group>
                            </Form>
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
