import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../providers/AppContext";
import { useNavigate, useParams } from "react-router-dom";
import { addComment, deletePost, dislikePost, getPostById, likePost } from "../../services/posts.service";
import { ref, update } from "firebase/database";
import { db } from "../../config/firebase-config";
import "./SinglePost.css"
import SingleComment from "../SingleComment/SingleComment";
import PostTags from "../PostTags/PostTags";
import { getAllTags, updateAllTags } from "../../services/tag.service";

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

  const [editingTags, setEditingTags] = useState(false);
  const [currentTags, setCurrentTags] = useState('');
  const [allTags, setAllTags] = useState([]);

  useEffect(() => {
    updatePost(id);
  }, [replyMade]);

  useEffect(() => {
    getCurrentPostComments(id);
  }, []);

  useEffect(() => {
    getAllTags().then((snapshot) => {
      setAllTags(snapshot.val());
    });
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
    return filteredArr.length > 0;
  };

  const addTag = (event) => {
    let tag = event.target.innerText.split(" ")[0];
    if (tag === "Create") {
      tag = event.target.innerText.split(" ")[1];
    }
    if (post.tags.includes(tag)) {
      return;
    }
    setPost({
      ...post,
      tags: [...post.tags, tag],
    });
  };

  const removeTag = (event) => {
    let tag;
    if (event.target.tagName === "svg") {
      const parentElement = event.target.parentNode;
      tag = parentElement.innerText.split(" ")[0];
    } else if (event.target.tagName === "path") {
      const parentElement = event.target.parentNode.parentNode;
      tag = parentElement.innerText.split(" ")[0];
    } else {
      tag = event.target.innerText.split(" ")[0];
    }

    setPost({
      ...post,
      tags: post.tags.filter((t) => t !== tag),
    });
  };

  const editTags = async () => {
    try {
      await updateTagsInDatabase(post.id, post.tags);
      console.log('Tags updated successfully!');
      await updatePostWithNewTags();  
    } catch (error) {
      console.error('Error updating tags:', error);
      throw error;
    }
  };
  
  const updateTagsInDatabase = async (postId, updatedTags) => {
    try {
      await updateAllTags(updatedTags);
      return updatedTags;
    } catch (error) {
      console.error('Error updating tags:', error);
      throw error;
    }
  };

  const updatePostWithNewTags = async () => {
    try {
      await update(ref(db, `posts/${id}`), { tags: post.tags.join(' ') });
    } catch (error) {
      console.error('Error updating post:', error);
      throw error;
    }
  };

  const renderPost = () => {
    return (
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
  
            {(userData.handle === post.authorHandle || userData.isAdmin === true) && (
              <div>
                {console.log("Editing Tags:", editingTags)}
                {editingTags && (
                  <div>
                    {console.log("selectedTags:", post.tags)}
                    <PostTags
                      allTags={allTags}
                      selectedTags={Array.isArray(post.tags) ? post.tags : []}
                      addTag={addTag}
                      removeTag={removeTag}
                    />
                    <button onClick={() => {
                      editTags().then(() => setEditingTags(false));
                    }}>Save Tags</button>
                    <button onClick={() => setEditingTags(false)}>Close</button>
                  </div>
                )}
                {!editingTags && (
                  <button onClick={() => setEditingTags(true)}>Edit Tags</button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
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
          <p>Tags: {post.tags.length > 0 ? post.tags : "No tags yet"}</p>

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