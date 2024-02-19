import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../providers/AppContext";
import { useNavigate, useParams } from "react-router-dom";
import { addComment, deletePost, dislikePost, getPostById, likePost } from "../../services/posts.service";
import { ref, update } from "firebase/database";
import { db } from "../../config/firebase-config";
import "./SinglePost.css"
import SingleComment from "../SingleComment/SingleComment";

const SinglePost = ({ setReload }) => {

  const { userData } = useContext(AppContext);
  const [post, setPost] = useState(null);
  const [commentsArr, setCommentsArr] = useState([]);
  const [currentComment, setCurrentComment] = useState({
    content: "",
    authorHandle: userData.handle,
    createdOn: "",
    likes: 0,
    likedBy: {}
  });

  const [replyMade, setReplyMade] = useState(false);
  const [likedByCurrentUser, setLikedByCurrentUser] = useState(false);
  const [isCommentLiked, setIsCommentLiked] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const [editingPost, setEditingPost] = useState(false);
  const [editedPostContent, setEditedPostContent] = useState('');

  useEffect(() => {
    updatePost(id);
  }, [replyMade]);

  useEffect(() => {
    getCurrentPostComments(id);
  }, []);

  const getCurrentPostComments = async (id) => {
    const currentPost = await getPostById(id);
    if ('comments' in currentPost) {
      setCommentsArr(Object.values(currentPost.comments));
    }
  };

  const updatePost = async (id) => {
    const currentPost = await getPostById(id);

    if (currentPost.likedBy.includes(userData.handle)) {
      setLikedByCurrentUser(true);
    }
    setPost(currentPost);
  };

  const togglePostLike = async () => {

    if (!likedByCurrentUser) {
      await likePost(userData.handle, id);
      const post = await getPostById(id);
      setPost({ ...post });
      setLikedByCurrentUser(true);

    } else {
      await dislikePost(userData.handle, id);
      const post = await getPostById(id);
      setPost({ ...post });
      setLikedByCurrentUser(false);
    }

  };

  const isPostLikedBy = () => {
    const filteredArr = post.likedBy.filter((u) => u !== 1);
    if (filteredArr.length) {
      return true;
    } else {
      return false;
    }
  };

  const renderPost = () => {
    return (
      <>
        <div>

          {(userData.handle === post.authorHandle) && (
            <div>
              {editingPost ? (
                <>
                  <input
                    value={editedPostContent}
                    onChange={(e) => setEditedPostContent(e.target.value)}
                    type="text"
                    name="edit-post"
                    id="edit-post"
                  />
                  <button onClick={() => {
                    editPost().then(() => {
                      setEditingPost(false);
                      setReload(prev => !prev);
                    });
                  }}>Save</button>
                  <button onClick={() => setEditingPost(false)}>Cancel</button>
                </>
              ) : (
                <button onClick={() => {
                  setEditedPostContent(post.content);
                  setEditingPost(true);
                }}>Edit Post</button>
              )}
            </div>
          )}
        </div>
      </>
    );
  };

  const editPost = async () => {
    await update(ref(db, `posts/${id}`), { content: editedPostContent });
    updatePost();
  };

  return (
    <div>
      {post && (
        <div>
          <h1>{post.title}</h1>
          <p>{post.content}</p>
          <p>Author: {post.authorHandle}</p>
          <p>Created on: {post.createdOn.toLocaleString()}</p>
          <p>Likes: {post.likes}</p>
          <p>Liked by: {isPostLikedBy() ? post.likedBy.filter((u) => u !== 1).join(", ") : "No likes yet"}</p>
          <button onClick={togglePostLike}>
            {likedByCurrentUser ? 'Dislike' : 'Like'}
          </button>
          {(userData.handle === post.authorHandle || userData.isAdmin === true) && <button onClick={() => {
            deletePost(post.id).then(() => navigate('/all-posts'));
          }}>Delete Post</button>}
          {renderPost()}
          <br />
          <br />
          <h2>Comments:</h2>
          {commentsArr.map((comment) => (
            <SingleComment key={comment.id} comment={comment} commentsArr={commentsArr} setCommentsArr={setCommentsArr} setIsCommentLiked={setIsCommentLiked} setReload={setReload} />
          ))}
          {userData && !userData.isBanned ? (
            <div className="create-comment-form">
              <br />
              <label htmlFor="input-title">Write Comment:</label>
              <input
                value={currentComment.content}
                onChange={(e) => setCurrentComment({ ...currentComment, content: e.target.value, createdOn: new Date().toLocaleDateString() })}
                type="text"
                name="input-title"
                id="input-title"
              />
              <br />
              <button onClick={() => {
                addComment(currentComment, id).then((newComment) => setCommentsArr([...commentsArr, newComment]))
                setCurrentComment({
                  content: "",
                  authorHandle: "",
                  createdOn: ""
                });
              }}>Add Comment</button>
            </div>
          ) : (
            <h1>BANNED USERS DO NOT HAVE ACCESS TO THIS!</h1>
          )}
        </div>
      )}
    </div>
  );
};
export default SinglePost;