import React, { useState, useEffect } from 'react';
import { getQuestions, setResponse, getResponses } from '../firebase/firebase';
import Page from '../components/page';
import Loading from '../components/loading';
import { useLocation, useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import { Card } from '@material-tailwind/react';
import toast from 'react-hot-toast';
import Table from '../components/table';
import Modal from 'react-bootstrap/Modal';


const RespondToQuestionsPage = () => {
    const navigate = useNavigate();
    const { search } = useLocation();
    const queryParams = new URLSearchParams(search);
    const id = queryParams.get('id');
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [responses, setResponses] = useState({});
    const [fetchedResponses, setFetchedResponses] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [change, setChange] = useState(false);
    const columnsNames = ["Question Title", "Response", "Last update on"];


    useEffect(() => {
        setLoading(true);
        const fetchQuestions = async () => {
            try {
                const fetchedQuestions = await getQuestions(id);
                setQuestions(fetchedQuestions);
                setLoading(false);
                console.log('Fetched questions:', fetchedQuestions.length);
            } catch (error) {
                console.error('Error fetching forms:', error);
                setLoading(false);
            }
        };

        fetchQuestions();
    }, [id]);

    useEffect(() => {
        setLoading(true);
        const fetchResponses = async () => {
            try {
                const fetchedResponses = await getResponses(id);
                setFetchedResponses(fetchedResponses);
                console.log('Fetched responses:', fetchedResponses);
                setLoading(false);
            } catch (error) {
                setLoading(false);
            }
        };

        fetchResponses();
    }, [id, change]);

    const handleResponseChange = (questionId, response) => {
        setResponses(prevState => ({
            ...prevState,
            [questionId]: response
        }));
    };

    const handleSubmitResponses = async () => {
        try {
            setLoading(true);
            const responseIds = [];
            for (const questionId in responses) {
                const response = responses[questionId];
                const question = questions.find(q => q.id === questionId); // Find the question corresponding to the questionId
                const responseData = {
                    questionId,
                    question_title: question.title, // Include the question title in the response data
                    response,
                };
                const responseId = await setResponse(responseData, id);
                responseIds.push(responseId);
            }
            setLoading(false);
            setShowModal(false);
            setChange(!change);
            toast.success('Responses submitted successfully');
            console.log('Responses submitted successfully:', responseIds);
            // Optionally, you can reset responses state if needed
            //setResponses({});
        } catch (error) {
            console.error('Error submitting responses:', error);
            toast.error('Error submitting responses');
            setLoading(false);
        }
    };

    const handleEdit = (id) => {
        navigate(`/edit-form?id=${id}`);
    };

    const handleOpenModal = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    return (


        <Page>
            <div>
                {questions.length !== 0 && !loading && <h1>Respond to Questions</h1>}
                {questions.length === 0 && !loading &&
                    <><h1>Form has no questions. Create new questions.</h1><Button onClick={() => handleEdit(id)}>
                        Edit Form
                    </Button></>}
                {questions.length !== 0 && <div>


                </div>}
            </div>
            <div>
                <Button variant="primary" onClick={handleOpenModal}>
                    Respond
                </Button>
                <div style={{ padding: "20px 200px" }}>
                    {fetchedResponses && <Table rows={fetchedResponses} columns={columnsNames} editable={false} respondable={false}/>}

                    <Modal show={showModal} onHide={handleCloseModal}>
                        <Modal.Header closeButton>
                            <Modal.Title>Add New Question</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            {questions.length !== 0 && questions.map(question => (
                                <Card style={{ marginBottom: "20px" }}>
                                    <div key={question.id}>
                                        <h3>{question.title}</h3>
                                        <p>{question.description}</p>
                                        {question.type === '0' && (
                                            <input
                                                type="text"
                                                value={responses[question.id] || ''}
                                                onChange={e => handleResponseChange(question.id, e.target.value)}
                                            />
                                        )}
                                        {(question.type === '1' || question.type === '2') && (
                                            <select
                                                value={responses[question.id] || ''}
                                                onChange={e => handleResponseChange(question.id, e.target.value)}
                                            >
                                                <option value="">Select an option</option>
                                                {question.options.map(option => (
                                                    <option key={option} value={option}>{option}</option>
                                                ))}
                                            </select>
                                        )}
                                    </div>
                                </Card>
                            ))}
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleCloseModal}>
                                Close
                            </Button>
                            <Button variant="primary" onClick={handleSubmitResponses}>
                                Submit Responses
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </div>
            </div>
            <Loading isOpen={loading} />
        </Page>
    );
};

export default RespondToQuestionsPage;
