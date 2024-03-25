import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {
  BrowserRouter,
  Routes,
  Route,
} from 'react-router-dom';
import './App.css';
import HomePage from './pages/HomePage';
import CreateFormPage from './pages/CreateFormPage';
import SignInSignUp from './pages/SignIn-SignUpPage';
import EditFormPage from './pages/EditFormPage';
import { AuthProvider } from './contexts/AuthContext';
import RespondToQuestionsPage from './pages/RespondToFormPage';

function App() {

  return (
    <AuthProvider ><div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/home" element={<HomePage />} />
          <Route path="/create-form" element={<CreateFormPage />} />
          <Route path="/" element={<SignInSignUp />} />
          <Route path="/edit-form" element={<EditFormPage />} />
          <Route path="/respond-form" element={<RespondToQuestionsPage />} />
        </Routes>
      </BrowserRouter>
    </div>
    </AuthProvider>
  );
}


export default App;
