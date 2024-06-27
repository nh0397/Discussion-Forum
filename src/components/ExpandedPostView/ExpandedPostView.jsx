import React, { useState, useEffect } from 'react';
import './ExpandedPostView.css';
import { faTimes, faEdit, faTrash, faThumbsUp, faThumbsDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import apiServices from '../../services/apiServices';

const calculateTimeDifference = (createdAt) => {
    const postDate = new Date(createdAt).getTime();
    const currentTime = new Date().getTime();
    const timeDifference = currentTime - postDate;

    if (timeDifference < 0) {
        return 'Invalid timestamp';
    }

    const minutes = Math.floor(timeDifference / 60000);
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

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

const ExpandedPostView = ({ post, onClose, onEdit, onDelete }) => {
    const [likes, setLikes] = useState(0);
    const [dislikes, setDislikes] = useState(0);
    const [userVote, setUserVote] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const userId = sessionStorage.getItem('userId');

    useEffect(() => {
        fetchVotes();
        fetchComments();
    }, []);

    const fetchVotes = async () => {
        const { data: postVotes, error: votesError } = await apiServices.getPostVotes(post.id);
        if (votesError) {
            console.error('Error fetching votes:', votesError.message);
        } else {
            setLikes(postVotes.likes);
            setDislikes(postVotes.dislikes);
        }

        const { data: userVoteData, error: userVoteError } = await apiServices.getUserVote(post.id, userId);
        if (userVoteError) {
            console.error('Error fetching user vote:', userVoteError.message);
        } else {
            setUserVote(userVoteData ? userVoteData.vote_type : null);
        }
    };

    const fetchComments = async () => {
        const { data, error } = await apiServices.getComments(post.id);
        if (error) {
            console.error('Error fetching comments:', error.message);
        } else {
            setComments(data);
        }
    };

    const handleAddComment = async () => {
        const { data, error } = await apiServices.addComment(post.id, userId, newComment);
        if (error) {
            console.error('Error adding comment:', error.message);
        } else {
            setNewComment('');
            fetchComments();
        }
    };

    const handleVote = async (voteType) => {
        const { error } = await apiServices.addOrUpdateVote(post.id, userId, voteType);
        if (!error) {
            if (voteType === 'upvote') {
                if (userVote === 'downvote') {
                    setDislikes(dislikes - 1);
                }
                setLikes(likes + 1);
                setUserVote('upvote');
            } else if (voteType === 'downvote') {
                if (userVote === 'upvote') {
                    setLikes(likes - 1);
                }
                setDislikes(dislikes + 1);
                setUserVote('downvote');
            }
        }
    };

    return (
        <div className="expanded-post-view">
            <div className='close-div'>
                <button className="edit-btn" onClick={onEdit} disabled={userId !== post.users.id} title={userId !== post.users.id ? "Only authors can edit" : ""}>
                    <FontAwesomeIcon icon={faEdit} />
                </button>
                <button className="delete-btn" onClick={onDelete} disabled={userId !== post.users.id} title={userId !== post.users.id ? "Only authors can delete" : ""}>
                    <FontAwesomeIcon icon={faTrash} />
                </button>
                <button className="close-btn" onClick={onClose}>
                    <FontAwesomeIcon icon={faTimes} />
                </button>
            </div>
            <div className="post-header">
                <h3>{post.title}</h3>
            </div>
            <div className='info-row-parent'>
                <div className="info-row">
                    <span className="label">Asked by:</span>
                    <span className="value">{post.users.first_name}</span>
                </div>
                <div className="info-row">
                    <span className="label">Time:</span>
                    <span className="value">{calculateTimeDifference(post.createdat)}</span>
                </div>
            </div>
            <div className="post-details">
                <div>
                    <img className="expand-image" src={post.imageurl} alt="Post Image" />
                </div>
            </div>
            <div className="info-row">
                <span className="value">{post.description}</span>
            </div>
            <div className="like-dislike-buttons">
                <button className="like-btn" onClick={() => handleVote('upvote')}>
                    <FontAwesomeIcon icon={faThumbsUp} />
                    {likes}
                </button>
                <button className="dislike-btn" onClick={() => handleVote('downvote')}>
                    <FontAwesomeIcon icon={faThumbsDown} />
                    {dislikes}
                </button>
            </div>
            <div className="comments-section">
                <h4>Comments</h4>
                <div className="comments-list">
                    {comments.map((comment) => (
                        <div key={comment.id} className="comment">
                            <p><strong>{comment.users.first_name}:</strong> {comment.comment}</p>
                            <p className="comment-timestamp">{calculateTimeDifference(comment.createdat)}</p>
                        </div>
                    ))}
                </div>
                <div className="comment-input">
                    <input 
                        type="text" 
                        value={newComment} 
                        onChange={(e) => setNewComment(e.target.value)} 
                        placeholder="Add a comment" 
                    />
                    <button onClick={handleAddComment}>Submit</button>
                </div>
            </div>
        </div>
    );
};

export default ExpandedPostView;
