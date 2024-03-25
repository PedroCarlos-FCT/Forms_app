import React from 'react';
import {

  Navigate,
} from 'react-router-dom';
import ComplexNavbar from './navbar';
import { useAuth } from '../contexts/AuthContext';

function Page({children}) {

  const { authUser } = useAuth();

  return (
    <div style={{padding: "20px", background: "#FCF7E7", height: "100vh"}}>
        {authUser ? 
        <><ComplexNavbar/>
        <div style={{padding: "20px"}}>{children}</div></> 
        : <Navigate to="/" />}
    </div>
  );
}


export default Page;
