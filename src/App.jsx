// App.jsx
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login/Login";
import Signup from "./components/Signup/Signup";
import ForgotPassword from "./components/ForgotPassword/ForgotPassword";
import HomePage from "./components/HomePage/HomePage";
import ProtectedRoute from "./services/ProtectedRoute";
import Navbar from "./components/Navbar/Navbar";
import './App.css';

function App() {
    const [modalOpen, setModalOpen] = useState(false); // Initialize modal state

    const toggleModal = () => {
        setModalOpen(!modalOpen); // Toggle modal state
    };

    return (
        <Router>
            <div className="app">
                <Routes>
                    <Route path="/" element={<Navigate replace to="/home" />} />
                    <Route path="/home" element={
                        <ProtectedRoute>
                            <Navbar toggleModal={toggleModal} />
                            <HomePage modalOpen={modalOpen} toggleModal={toggleModal} />
                        </ProtectedRoute>
                    }/>
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
