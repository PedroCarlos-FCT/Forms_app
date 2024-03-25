import React,  { useEffect, useState }  from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import './App.css';
import { onAuthStateChanged, getAuth } from "firebase/auth";
import HomePage from './pages/HomePage';
import CreateFormPage from './pages/CreateFormPage';
import SignInSignUp from './pages/SignIn-SignUpPage';
import ComplexNavbar from './components/navbar';

function App() {

  const [authUser, setAuthUser] = useState(null);
  const auth = getAuth();

  useEffect(() => {
    const listen = onAuthStateChanged(auth, (user) => {
      if (user) {
        setAuthUser(user);
      } else {
        setAuthUser(null);
      }
    });

    return () => {
      listen();
    };
  }, [auth]);
  return (
    <div className="App">
     {  authUser && <ComplexNavbar></ComplexNavbar>}
       <BrowserRouter>
          <Routes>

            <Route
              path="/"
              element={
                    authUser ? (
                      <HomePage />
                    ) : (
                      <SignInSignUp />
                    )
              }
            />
            <Route path="/create-form" element={authUser ? <CreateFormPage /> : <Navigate to="/" replace={true} />} />
            {/* Redirect any unauthenticated user trying to access protected routes */}
            <Route
              path="*"
              element={
                    !authUser ? (
                      <Navigate to="/" replace={true} />
                    ) : (
                      <Navigate to="/home" replace={true} /> // Optional: redirect to /home if a protected route is accessed
                    )

              }
            />
          </Routes>
        </BrowserRouter>
    </div>
  );
}


export default App;
