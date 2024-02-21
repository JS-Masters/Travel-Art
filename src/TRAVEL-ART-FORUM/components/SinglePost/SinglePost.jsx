import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../providers/AppContext";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  addComment,
  deletePost,
  dislikePost,
  getPostById,
  likePost,
} from "../../services/posts.service";
import { ref, update } from "firebase/database";
import { db } from "../../config/firebase-config";
import "./SinglePost.css";
import SingleComment from "../SingleComment/SingleComment";
import PostTags from "../PostTags/PostTags";
import {
  getAllTags,
  showHashtagOnTags,
  updateAllTags,
} from "../../services/tag.service";
import { EditIcon } from "@chakra-ui/icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsDown, faThumbsUp } from "@fortawesome/free-solid-svg-icons";

const SinglePost = ({ setReload }) => {
  const { userData } = useContext(AppContext);
  const [post, setPost] = useState(null);
  const [commentsArr, setCommentsArr] = useState([]);
  const [currentComment, setCurrentComment] = useState({
    content: "",
    authorHandle: userData.handle,
    createdOn: "",
    likes: 0,
    likedBy: {},
  });

  const [replyMade, setReplyMade] = useState(false);
  const [likedByCurrentUser, setLikedByCurrentUser] = useState(false);
  const [isCommentLiked, setIsCommentLiked] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const [editingPost, setEditingPost] = useState(false);
  const [editedPostContent, setEditedPostContent] = useState("");
  const [isCheckedSortByLikes, setIsCheckedSortByLikes] = useState(false);
  const [editingTags, setEditingTags] = useState(false);
  const [currentTags, setCurrentTags] = useState("");
  const [allTags, setAllTags] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    updatePost(id);
  }, [replyMade]);

  useEffect(() => {
    getCurrentPostComments(id, searchTerm);
  }, [searchTerm]);

  useEffect(() => {
    getAllTags()
      .then((snapshot) => {
        setAllTags(snapshot.val());
      })
      .catch((err) => { });
  }, []);

  const getCurrentPostComments = async (id, searchTerm) => {
    const currentPost = await getPostById(id);
    if ("comments" in currentPost) {
      if (searchTerm) {
        const commentsSortedBySearchTerm = Object.values(
          currentPost.comments
        ).filter(
          (c) =>
            c.content.toLowerCase().startsWith(searchTerm.toLowerCase()) ||
            c.authorHandle.toLowerCase().startsWith(searchTerm.toLowerCase())
        );
        setCommentsArr(commentsSortedBySearchTerm);
      } else {
        setCommentsArr(Object.values(currentPost.comments));
      }
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
      tags: post.tags ? post.tags + ` ${tag}` : tag,
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

    setPost((prevPost) => {
      return {
        ...prevPost,
        tags: prevPost.tags
          .split(" ")
          .filter((t) => t !== tag)
          .join(" "),
      };
    });
  };

  const editTags = async () => {
    try {
      await updateTagsInDatabase(post.tags);
      await updatePostWithNewTags();
    } catch (error) {
      throw new Error("Error updating tags:", error.message);
    }
  };

  const updateTagsInDatabase = async (updatedTags) => {
    try {
      await updateAllTags(updatedTags.split(" "));
      return updatedTags;
    } catch (error) {
      console.error("Error updating tags:", error);
    }
  };

  const updatePostWithNewTags = async () => {
    try {
      await update(ref(db, `posts/${id}`), { tags: post.tags });
    } catch (error) {
      console.error("Error updating post:", error.message);
    }
  };

  const editTagsMenu = () =>
    (userData.handle === post.authorHandle || userData.isAdmin === true) && (
      <>
        {editingTags && (
          <div className="edit-tags-menu">
            <button id="save-tags-button"
              onClick={() => {
                editTags()
                  .then(() => setEditingTags(false))
                  .catch((err) => { });
              }}
            >
              Save Tags
            </button>
            <button id="close-tags-button" onClick={() => setEditingTags(false)}>Close</button>
            <PostTags
              allTags={allTags}
              selectedTags={post.tags.split(" ")}
              addTag={addTag}
              removeTag={removeTag}
            />
          </div>
        )}
      </>
    );

  const renderPost = () => {
    return (
      <div>
        {userData.handle === post.authorHandle && (
          <div>
            {editingPost ? (
              <>
                <button
                  className="save-edit-button"
                  onClick={() => {
                    editPost().then(() => {
                      setEditingPost(false);
                      setReload((prev) => !prev);
                    });
                  }}
                >
                  Save
                </button>
                <button
                  className="cancel-edit-button"
                  onClick={() => setEditingPost(false)}
                >
                  Cancel
                </button>
                <input
                  value={editedPostContent}
                  onChange={(e) => setEditedPostContent(e.target.value)}
                  type="text"
                  name="edit-post"
                  id="edit-post"
                />
              </>
            ) : (
              <button
                className="edit-button"
                onClick={() => {
                  setEditedPostContent(post.content);
                  setEditingPost(true);
                }}
              >
                Edit Post
              </button>
            )}
          </div>
        )}
      </div>
    );
  };

  const sortCommentsByLikes = (postsToSort) => {
    return postsToSort.slice().sort((a, b) => {
      const numCommentsA = Object.keys(a.likedBy || {}).length;
      const numCommentsB = Object.keys(b.likedBy || {}).length;
      return numCommentsB - numCommentsA;
    });
  };

  const editPost = async () => {
    await update(ref(db, `posts/${id}`), { content: editedPostContent });
    updatePost();
  };

  const renderComments = (comment) => {
    return (
      <SingleComment
        key={comment.id}
        comment={comment}
        commentsArr={commentsArr}
        setCommentsArr={setCommentsArr}
        setIsCommentLiked={setIsCommentLiked}
        setReload={setReload}
      />
    );
  };

  return (
    <div>
      {post && (
        <div className="single-post-view">
          <div className="post-info">
            <div>
              <h1 id="single-post-title">{post.title}</h1>
              {(userData.handle === post.authorHandle ||
                userData.isAdmin === true) && (
                  <button
                    className="delete-post-button"
                    onClick={() => {
                      deletePost(post.id).then(() => navigate("/all-posts"));
                    }}
                  >
                    DELETE POST
                  </button>
                )}
            </div>

            <span>
              {post.tags.length > 0
                ? post.tags.split(" ").map((tag, index) => (
                  <span key={index} className="single-tag-span">
                    <Link to={`/posts-by-tag/:${tag}`}>
                      {showHashtagOnTags(tag)}
                    </Link>{" "}
                  </span>
                ))
                : "No tags yet"}{" "}
              <EditIcon
                className="edit-tags-icon"
                style={{ cursor: "pointer", fontSize: "23px", marginLeft: "8px" }}
                onClick={() => setEditingTags(true)}
              />
            </span>

            {editTagsMenu()}
            {renderPost()}
            <p id="post-content">{post.content}</p>
            <span id="post-author">
              <img
                src={post.userAvatarUrl}
                alt="user-avatar"
                style={{ width: "50px", height: "50px", borderRadius: "50%" }}
              />{" "}
              {post.authorHandle}{" "}
              <span id="creted-on">
                <span>Created on: </span>
                {new Date(post.createdOn).toLocaleDateString()}
              </span>
            </span>
            <span id="liked-by">
              <span>Liked by:</span>{" "}
              <br />
              {isPostLikedBy()
                ? post.likedBy.filter((u) => u !== 1).join(", ")
                : "No likes yet"}
            </span>
            <div className="likes-info">
              <button className="like-button" onClick={togglePostLike}>
                <FontAwesomeIcon icon={likedByCurrentUser ? faThumbsDown : faThumbsUp} />
                <span>{likedByCurrentUser ? " Dislike" : " Like"}</span>
              </button>
              <p>{post.likes} Likes</p>
            </div>
          </div>

          {userData && !userData.isBanned ? (
            <div className="create-comment-form">
              <input
                value={currentComment.content}
                placeholder="Write your comment here..."
                className="comment-input"
                onChange={(e) =>
                  setCurrentComment({
                    ...currentComment,
                    content: e.target.value,
                    createdOn: new Date().toLocaleDateString(),
                  })
                }
                type="text"
                name="input-title"
                id="input-title"
              />
              <button className="add-comment-button"
                onClick={() => {
                  addComment(currentComment, id).then((newComment) =>
                    setCommentsArr([...commentsArr, newComment])
                  );
                  setCurrentComment({
                    content: "",
                    authorHandle: userData.handle,
                    createdOn: "",
                    likes: 0,
                    likedBy: {}
                  });
                }}
              >Add Comment</button>
            </div>
          ) : (
            <h1 className="ban-message">BANNED USERS CANNOT ADD COMMENTS!</h1>
          )}
          <div className="search-comments-div">
            <span id="search-comments-input">
              <span  className="search-comments">Search in comments: </span>
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                type="text"
                name="search-comments"
              className="search-comments-input-box"
              />
            </span>
    
            <span>
              <span className="sort-comments">Sort by Most Liked</span>
              <input
                className="sort-comments-checkbox"
                type="checkbox"
                checked={isCheckedSortByLikes}
                onChange={() => setIsCheckedSortByLikes((prevState) => !prevState)}
              />
            </span>
          </div>

          {isCheckedSortByLikes
            ? sortCommentsByLikes(commentsArr).map(renderComments)
            : commentsArr.map(renderComments)}
        </div>
      )}
    </div>
  );
};

export default SinglePost;
