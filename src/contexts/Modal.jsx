// Modal.jsx
import React, { useState } from 'react';
import './Modal.css';

function Modal({ onClose, onSubmit }) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [imageError, setImageError] = useState(false);

    const handleTitleChange = (event) => {
        const value = event.target.value;
        setTitle(value);
    };

    const handleDescriptionChange = (event) => {
        const value = event.target.value;
        setDescription(value);
    };

    const handleImageUrlChange = (event) => {
        const url = event.target.value;
        setImageUrl(url);
        // Check if the URL is valid
        const img = new Image();
        img.onload = () => setImageError(false);
        img.onerror = () => setImageError(true);
        img.src = url;
    };

    const handleSubmit = () => {
        onSubmit(sessionStorage.getItem('userId'),title, description, imageUrl);
    };

    const isSubmitDisabled = title.length < 30 || description.length < 250 || !imageUrl || imageError;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h2>Add Post</h2>
                <div className="input-group">
                    <label htmlFor="title">Title:</label>
                    <input type="text" id="title" value={title} onChange={handleTitleChange} />
                    <span className="character-count">{title.length}/30</span>
                </div>
                <div className="input-group">
                    <label htmlFor="description">Description:</label>
                    <textarea id="description" value={description} onChange={handleDescriptionChange} />
                    <span className="character-count">{description.length}/250</span>
                </div>
                <div className="input-group">
                    <label htmlFor="imageUrl">Image URL:</label>
                    <input type="text" id="imageUrl" value={imageUrl} onChange={handleImageUrlChange} />
                    {imageError && <span className="image-error">Invalid URL</span>}
                </div>
                {imageUrl && !imageError && (
                    <div>
                        <img className="image-preview" src={imageUrl} alt="Preview" />
                    </div>
                )}
                <div className='buttonDiv'>
                    <button className="modal-button" onClick={handleSubmit} disabled={isSubmitDisabled}>Submit</button>
                    <button className="modal-button" onClick={onClose}>Cancel</button>
                </div>
            </div>
        </div>
    );
}

export default Modal;
