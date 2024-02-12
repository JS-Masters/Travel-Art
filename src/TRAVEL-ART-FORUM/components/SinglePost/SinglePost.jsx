import Button from "../../components/Button/Button";
import { dislikePost, likePost } from '../../services/posts.service';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AppContext } from "../../providers/AppContext";

const SinglePost = ({ post, togglePostLike }) => {
    const navigate = useNavigate();
    const { userData } = useContext(AppContext);

    const toggleLike = async () => {
        if (userData && userData.handle) {
            if (post.likedBy.includes(userData.handle)) {
                dislikePost(userData.handle, post.id);
            } else {
                likePost(userData.handle, post.id);
            }
            togglePostLike(userData.handle, post.id);
        }
    };

    return (
        <div className="post">
            <Button onClick={toggleLike}>
                {userData && userData.handle && post.likedBy.includes(userData.handle) ? 'Dislike' : 'Like'}
            </Button>
            <p>{post.content}</p>
            <p>{new Date(post.createdOn).toLocaleDateString('bg-BG')}</p>
        </div>
    );
};

export default SinglePost;