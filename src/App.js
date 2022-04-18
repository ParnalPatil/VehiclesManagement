import React, { useState, useEffect } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import './App.css';
import SignUp from './Authentication/SignUp';
import Login from './Authentication/Login';
import Table1 from './Table/Table1';
import Navbar from './Table/Navbar';
import { LoginContext } from './Context/LoginContext';



function App() {
  const [token, setToken] = useState("");
  const [email, setEmail] = useState("");



  return (
    <LoginContext.Provider value={{ token, setToken, email, setEmail }}>
      <BrowserRouter>
        <Routes>
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/navbar" element={<Navbar />} />
          <Route path="/" element={<Table1 />} />
        </Routes>
      </BrowserRouter>
    </LoginContext.Provider>
  );
}

export default App;
