// Navbar.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';
import logo from '../../assets/logo.webp';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

function Navbar(props) {
    const navigate = useNavigate();
    const userFirstName = sessionStorage.getItem('firstName') || 'First';
    const userLastName = sessionStorage.getItem('lastName') || 'Last';
    const userRole = sessionStorage.getItem('role');

    const getInitials = (firstName, lastName) => {
        return `${firstName[0]}${lastName[0]}`;
    };

    const handleAddPost = () => {
        props.toggleModal(); // Toggle modal state
    };

    const handleLogout = () => {
        sessionStorage.clear();
        navigate('/');
    };

    return (
        <div className="navbar-container">
            <div className="navbar-left">
                <Link to="/home" className="home-link">
                    <img src={logo} alt="App Logo" className="app-logo" />
                    <div className='app-name'>Discussion Forum</div>
                </Link>
            </div>
            <div className="navbar-right">
                <button className="logout-button addPost" onClick={handleAddPost}>
                    <FontAwesomeIcon icon={faPlus} /> Add Post
                </button>
                <div className="user-info">
                    <div className="initials-icon">{getInitials(userFirstName, userLastName)}</div>
                    <span className="username">{userFirstName}</span>
                    <span className="role">{userRole}</span>
                </div>
                <button onClick={handleLogout} className="logout-button">Logout</button>
            </div>
        </div>
    );
}

export default Navbar;
