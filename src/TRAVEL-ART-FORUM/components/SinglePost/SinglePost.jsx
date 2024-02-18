import { useContext, useEffect, useRef, useState } from "react";
import { AppContext } from "../../providers/AppContext";
import { useParams } from "react-router-dom";
import { dislikePost, getPostById, likePost } from "../../services/posts.service";
import { get, push, ref, remove, set, update } from "firebase/database";
import { db } from "../../config/firebase-config";
import "./SinglePost.css"


const SinglePost = ({ reload, setReload }) => {

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
  const [currentReply, setCurrentReply] = useState({
    content: "",
    author: userData.handle,
    createdOn: "",
    likes: 0
  });

  const [repliesToShow, setRepliesToShow] = useState({
    commentID: "",
    replies: []
  });

  const [showRepliesClicked, setShowRepliesClicked] = useState({
    clicked: false,
    commentID: ""
  });
  const [replyMade, setReplyMade] = useState(false);
  const [likedByCurrentUser, setLikedByCurrentUser] = useState(false);
  const [commentContentEdit, setCommentContentEdit] = useState('');
  const inputRef = useRef();
  const { id } = useParams();

  // от Цвети нови състояния: 
  const [editingPost, setEditingPost] = useState(false);
  const [editedPostContent, setEditedPostContent] = useState('');


  useEffect(() => {
    updatePost();
    getCurrentPostComments()
  }, [replyMade, reload])


  const updatePost = async () => {
    const currentPost = await getPostById(id);

    if (currentPost.likedBy.includes(userData.handle)) {
      setLikedByCurrentUser(true);
    }

    setPost(currentPost);
  };

  const getCurrentPostComments = async () => {
    const currentPost = await getPostById(id);
    if ('comments' in currentPost) {
      setCommentsArr(Object.values(currentPost.comments));
    }


  }

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

  const replyToComment = async (commentID) => {
    try {
      if (currentReply.content) {
        const comment = await get(ref(db, `posts/${id}/comments/${commentID}`))
        if (!comment.exists()) {
          throw new Error('WRONG PROCCESS !!!')
        }

        if (!('replies' in comment.val())) {

          const commentVal = comment.val();
          const result = { ...commentVal, replies: null };
          await update(ref(db), { [`posts/${id}/comments/${commentID}`]: result });
          await push(ref(db, `posts/${id}/comments/${commentID}/replies`), currentReply);

        } else {
          await push(ref(db, `posts/${id}/comments/${commentID}/replies`), currentReply);
        }

      } else {
        alert('You must write a reply first!')
      }

      setReload(prev => !prev);

    } catch (error) {
      console.log(error.message);
    }
  };

  const renderReplies = async (commentID) => {

    const repliesRef = await get(ref(db, `posts/${id}/comments/${commentID}/replies`));
    const repliesVal = repliesRef.val();
    const repliesArr = Object.values(repliesVal);
    setRepliesToShow({
      commentID: commentID,
      replies: repliesArr
    });
  };

  const toggleCommentLike = async (commentID) => {

    try {
      const commentRef = await get(ref(db, `posts/${id}/comments/${commentID}`))
      const commentVal = commentRef.val();
      if (!commentRef.exists()) {
        throw new Error('WRONG PROCCESS !!!')
      }

      if (!(Object.keys(commentVal).includes('likedBy'))) {

        const result = { ...commentVal, likedBy: { [userData.handle]: true }, likes: commentVal.likes + 1 };
        await update(ref(db), { [`posts/${id}/comments/${commentID}`]: result });

      } else {

        const likedByVal = commentVal.likedBy;
        await update(ref(db), { [`posts/${id}/comments/${commentID}`]: { ...commentVal, likedBy: { ...likedByVal, [userData.handle]: true }, likes: commentVal.likes + 1 } });
      }
      setReload((prev) => !prev)
    } catch (error) {
      console.log(error.message);
    }
  };

  const toggleCommentDisike = async (commentID) => {
    try {
      const commentRef = await get(ref(db, `posts/${id}/comments/${commentID}`))
      const commentVal = commentRef.val();
      if (!commentRef.exists()) {
        throw new Error('WRONG PROCCESS !!!')
      }
      const likedByVal = commentVal.likedBy;
      delete likedByVal[userData.handle];
      await update(ref(db), { [`posts/${id}/comments/${commentID}`]: { ...commentVal, likedBy: { ...likedByVal }, likes: commentVal.likes - 1 } });

      setReload((prev) => !prev)
    } catch (error) {
      console.log(error.message);
    }
  };

  const renderComments = (comments) => {

    return (
      <>
        {comments.map((comment) => (
          <div key={comment.id} className="comment-info">
            <p>{comment.content}</p>
            <p>
              Author: {comment.authorHandle} | Created on: {comment.createdOn}
            </p>
            <p>{comment.likes} Likes</p>
            {!('likedBy' in comment) && <button onClick={() => {
              toggleCommentLike(comment.id);
            }}>Like</button>}
            {('likedBy' in comment) && (!Object.keys(comment.likedBy).includes(userData.handle)) && <button onClick={() => {
              toggleCommentLike(comment.id);

            }}>Like</button>}
            {'likedBy' in comment && Object.keys(comment.likedBy).includes(userData.handle) && <button onClick={() => toggleCommentDisike(comment.id)}>Disike</button>}
            <br />
            {(userData.handle === comment.authorHandle || userData.isAdmin === true) && (
              <div>
                <input
                  value={commentContentEdit}
                  onChange={(e) => setCommentContentEdit(e.target.value)}
                  type="text"
                  name="edit-comment"
                  id="edit-comment"
                />
                <button onClick={() => {
                  editComment(comment.id).then(() => setReload(prev => !prev));
                }}>Edit</button>

                <button onClick={() => {
                  deleteComment(comment.id).then(() => setReload(prev => !prev));
                }}>Delete</button>


              </div>
            )}

            <br />
            <input
              ref={inputRef}
              onChange={(e) => setCurrentReply({
                ...currentReply,
                content: e.target.value,
                createdOn: new Date().toLocaleDateString(),
              })}
              type="text"
              name="input-reply"
              id="input-reply"
            />

            <button onClick={() => {
              replyToComment(comment.id).then(() => inputRef.current.value = '').then(setReload(prev => !prev));
              setCurrentReply({
                ...currentReply,
              });

            }}>REPLY</button>
            <br />
            {'replies' in comment && !showRepliesClicked.clicked && <button onClick={() => {
              renderReplies(comment.id);
              setShowRepliesClicked({ clicked: true, commentID: comment.id });
            }}>View {Object.keys(comment.replies).length} Replies</button>}
            {'replies' in comment && showRepliesClicked.clicked && showRepliesClicked.commentID !== comment.id && <button onClick={() => {
              renderReplies(comment.id);
              setShowRepliesClicked({ clicked: true, commentID: comment.id });
            }}>View {Object.keys(comment.replies).length} Replies</button>}
            {'replies' in comment && showRepliesClicked.clicked && showRepliesClicked.commentID === comment.id && <button onClick={() => setShowRepliesClicked({ clicked: false, commentID: comment.id })}>Hide Replies</button>}

            {repliesToShow && repliesToShow.commentID === comment.id && showRepliesClicked.clicked && showRepliesClicked.commentID === comment.id && (
              <div className="replies-to-comment">
                {repliesToShow.replies.map((reply) => (
                  <>
                    <p>Author: {reply.author}</p>
                    <p>Content: {reply.content}</p>
                    <p>Created On: {reply.createdOn}</p>
                    <p>Likes: {reply.likes}</p>
                  </>
                ))}
              </div>
            )}
            <br />

            {/* <button onClick={() => replyToComment(comment.id)}>Reply</button> */}
          </div >
        ))}
      </>
    );
  }

  const updateCommentDatabase = async (comment) => {

    if (comment.content) {

      const newCommentRef = await push(ref(db, `posts/${id}/comments/`), {
        ...comment
      });
      const newCommentId = newCommentRef.key;
      const newComment = {
        ...comment,
        id: newCommentId
      };
      await set(ref(db, `posts/${id}/comments/${newCommentId}`), newComment)
      setCommentsArr([...commentsArr, newComment]);
    } else {
      alert('You must write a content to add a comment!')
    }
  }

  const deleteComment = async (commentID) => {
    try {
      await remove(ref(db, `posts/${id}/comments/${commentID}`));

    } catch (error) {
      console.error('Error while deleting comment:', error);
    }
  };

  const editComment = async (commentID) => {
    const commentRef = await get(ref(db, `posts/${id}/comments/${commentID}`))

    if (!commentRef.exists()) {
      throw new Error('WRONG PROCCESS !!!')
    }
    const commentVal = commentRef.val();

    await update(ref(db), { [`posts/${id}/comments/${commentID}`]: { ...commentVal, content: commentContentEdit } });
  };


  const deletePost = async (postID) => {
    try {
      const docRef = ref(db, `posts/${postID}`);
      console.log(docRef);
      await remove(docRef);
    } catch (error) {
      console.log(error.message);
    }

    // От Цвети
    window.location.href = "http://localhost:3001/all-posts/";
  };
  // console.log(post.id); 

  // Цвети - нова функция за рендериране на поста
  const renderPost = () => {
    return (
      <>
        <div>
          
          {(userData.handle === post.authorHandle || userData.isAdmin === true) && (
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

  // Цвети - метод за редакция на пост
  const editPost = async () => {
    await update(ref(db, `posts/${id}`), { content: editedPostContent });
    // Обновете постовете след редакция
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
            deletePost(post.id).then(() => setReload(prev => !prev));
          }}>Delete Post</button>}
          {renderPost()}
          <br />
          <br />
          <h2>Comments:</h2>
          {renderComments(commentsArr)}
          <>
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
                  updateCommentDatabase(currentComment);
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
          </>
        </div>
      )}
    </div>
  );


}
export default SinglePost;