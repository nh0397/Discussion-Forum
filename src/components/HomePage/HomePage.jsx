import React, { useEffect, useState } from 'react';
import './HomePage.css';
import Modal from '../../contexts/Modal';
import apiServices from '../../services/apiServices';
import PostInfo from '../PostInfo/PostInfo';
import ExpandedPostView from '../ExpandedPostView/ExpandedPostView';

function HomePage(props) {
    const { modalOpen, toggleModal } = props;
    const [posts, setPosts] = useState([]);
    const [selectedPost, setSelectedPost] = useState(null); // Track the selected post
    const [sortBy, setSortBy] = useState('latest'); // Default sorting option

    useEffect(() => {
        // Fetch posts data when the component mounts or sortBy changes
        fetchPosts();
    }, [sortBy]);

    const fetchPosts = async () => {
        try {
            const { data, error } = await apiServices.getPosts(sortBy);
            if (error) {
                console.error('Error fetching posts:', error.message);
                return;
            }
            setPosts(data);
        } catch (error) {
            console.error('Error fetching posts:', error.message);
        }
    };

    const openModal = () => {
        toggleModal(true);
    };

    const closeModal = () => {
        toggleModal(false);
    };

    const handlePostClick = (post) => {
        setSelectedPost(post);
    };

    const handleSubmit = async (userId, title, description, imageUrl) => {
        const { error } = await apiServices.addPost(userId, title, description, imageUrl);
        if (error) {
            console.error('Error adding post:', error.message);
            // Handle error, display message to user, etc.
        } else {
            // Reset form fields or update state as needed
            closeModal();
            fetchPosts(); // Refresh posts after adding a new one
        }
    };

    const handleSortChange = (event) => {
        setSortBy(event.target.value);
    };

    return (
        <div className="home-page">
            {modalOpen && (
                <Modal onSubmit={handleSubmit} onClose={closeModal}>
                </Modal>
            )}
            {selectedPost && (
                <ExpandedPostView
                    post={selectedPost}
                    onClose={() => {
                        setSelectedPost(null);
                        fetchPosts(); // Refetch posts when the expanded view is closed
                    }}
                />
            )}
            {!selectedPost && (
                <div className="sort-by-container">
                    <label htmlFor="sort-by">Sort by:</label>
                    <select id="sort-by" value={sortBy} onChange={handleSortChange}>
                        <option value="latest">Latest to Oldest</option>
                        <option value="oldest">Oldest to Latest</option>
                    </select>
                </div>
            )}
            {!selectedPost && (
                <div className="post-container">
                    {posts.map(post => (
                        <div key={post.id} onClick={() => handlePostClick(post)}>
                            <PostInfo
                                title={post.title}
                                description={post.description}
                                firstName={post.users.first_name}
                                createdAt={post.createdat}
                                likes={post.likes}
                                dislikes={post.dislikes}
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default HomePage;