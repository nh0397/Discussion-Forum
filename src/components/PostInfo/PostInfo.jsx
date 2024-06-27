import React from 'react';
import './PostInfo.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faThumbsDown } from '@fortawesome/free-solid-svg-icons';

const PostInfo = ({ firstName, createdAt, title, description, likes, dislikes }) => {
    const calculateTimeDifference = (createdAt) => {
        const postDate = new Date(createdAt).getTime(); // Convert createdAt to milliseconds
        const currentTime = new Date().getTime(); // Get current time in milliseconds
        const timeDifference = currentTime - postDate; // Calculate time difference in milliseconds

        // Check if time difference is negative
        if (timeDifference < 0) {
            return 'Invalid timestamp'; // Return an error message
        }

        const minutes = Math.floor(timeDifference / 60000); // Convert milliseconds to minutes
        const hours = Math.floor(minutes / 60); // Convert minutes to hours
        const remainingMinutes = minutes % 60; // Get remaining minutes after subtracting hours

        // Format the post date
        const formattedPostDate = new Date(createdAt).toLocaleString('en-US', {
            hour12: true,
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });

        if (hours > 0) {
            return `Posted at ${formattedPostDate}`;
        } else {
            return `Posted ${minutes} minute${minutes > 1 ? 's' : ''} ago`;
        }
    };

    return (
        <div className="post-info">
            <div className="post-title" title={title}>{title}</div>
            <div className="post-description" title={description}>{description}</div>
            <div className="post-meta">
                <div className="author-name" title={firstName}>Asked By: {firstName}</div>
            </div>
            <div className="post-meta">
                <div className="created-at" title={calculateTimeDifference(createdAt)}>{calculateTimeDifference(createdAt)}</div>
            </div>
            <div className="like-dislike">
                <FontAwesomeIcon icon={faThumbsUp} className="like-icon" />
                <span className="like-count">{likes}</span>
                <FontAwesomeIcon icon={faThumbsDown} className="dislike-icon" />
                <span className="dislike-count">{dislikes}</span>
            </div>
        </div>
    );
};

export default PostInfo;
