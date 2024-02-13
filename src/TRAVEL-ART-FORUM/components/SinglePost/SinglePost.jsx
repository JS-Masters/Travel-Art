import React, { useEffect, useState } from 'react';
import Button from "../../components/Button/Button";
import { dislikePost, likePost, getPostById } from '../../services/posts.service';
import { useNavigate, useParams } from 'react-router-dom';
import { useContext } from 'react';
import { AppContext } from "../../providers/AppContext";


const SinglePost = () => {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const { user } = useContext(AppContext);

    useEffect(() => {
        if (id) {
            getPostById(id).then(setPost);
        }
    }, [id]);

    const handleLike = () => {
        console.log('Handle Like Clicked');
        likePost(user.uid, id).then(() => {
            getPostById(id).then(setPost);
        });
    };
    
    const handleDislike = () => {
        console.log('Handle Dislike Clicked');
        dislikePost(user.uid, id).then(() => {
            getPostById(id).then(setPost);
        });
    };

    return post !== null ? (
        <div>
            <h1>{post.title}</h1>
            <p>{post.content}</p>
            <p>{new Date(post.createdOn).toLocaleString()}</p>
            <p>Author: {post.author}</p>
            <p>Likes: {post.likedBy.length}</p>
            {user && post.likedBy.includes(user.uid) ? (
                <Button onClick={() => handleDislike()}>Dislike</Button>
            ) : (
                <Button onClick={() => handleLike()}>Like</Button>
            )}
        </div>
    ) : (
        <div>Loading...</div>
    );
};

export default SinglePost;