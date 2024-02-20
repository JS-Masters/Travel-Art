import React, { useEffect, useState, useContext } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getPostsByTag } from "../../services/posts.service";
import SinglePost from '../../components/SinglePost/SinglePost';

const PostByTag = () => {
    const { tag } = useParams();
    const [postsByTag, setPostsByTag] = useState([]);
    useEffect(() => {
        getPostsByTag(tag).then((posts) => {
            setPostsByTag(posts);
        });
    }, [tag]);
    
    return (
        <div>
            <h1>Posts with tag {tag}</h1>
            <ul>
                {postsByTag.map((post) => (
                    <li key={post.id}>
                        <Link to={`/single-post/${post.id}`}>{post.title}</Link>
                    </li>
                ))}
            </ul>
            <hr />
         
        </div>
    );
};

export default PostByTag;

