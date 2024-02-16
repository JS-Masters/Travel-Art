import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPostById, likePost, dislikePost, addComment, readComments, getPostLikes, addReply, readReplies } from "../../../TRAVEL-ART-FORUM/services/posts.service";
import { auth, db } from '../../../TRAVEL-ART-FORUM/config/firebase-config';
import { update, ref, remove } from 'firebase/database';

export default function SinglePost() {
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [likes, setLikes] = useState([]);
  const [currentUser, setCurrentUser] = useState(auth.currentUser);
  const [editCommentId, setEditCommentId] = useState(null);
  const [editCommentContent, setEditCommentContent] = useState('');
  const [replyToCommentId, setReplyToCommentId] = useState(null);
  const [replyContent, setReplyContent] = useState('');


  const { id } = useParams();

  const fetchPostData = async (userId) => {
    try {
      const post = await getPostById(id);
      const postComments = await readComments(id, userId);
      const postLikes = await getPostLikes(id);

      setPost(post);
      setComments(postComments);
      setLikes(postLikes);
      if (userId) {
        setLikedByCurrentUser(post.likedBy && post.likedBy.includes(userId));
      }
    } catch (error) {
      console.error("Error fetching post data:", error);
    }
  };

  const togglePostLike = async () => {
    try {
      let updatedLikedBy;

      if (!post.likedBy || (Array.isArray(post.likedBy) && !post.likedBy.includes(currentUser.uid))) {
        await likePost(currentUser.uid, post.id);
        updatedLikedBy = [...(post.likedBy || []), currentUser.uid];
      } else {
        await dislikePost(currentUser.uid, post.id);
        updatedLikedBy = post.likedBy.filter((userId) => userId !== currentUser.uid);
      }

      setPost((prevPost) => ({
        ...prevPost,
        likedBy: updatedLikedBy,
        likedByCurrentUser: !prevPost.likedByCurrentUser,
      }));

      const updatedHandles = await getPostLikes(post.id);
      setLikes(updatedHandles);
    } catch (error) {
      console.error("Error while updating like status:", error);
    }
  };

  const togglePostComment = async (comment, parentCommentId = null) => {
    try {
      if (comment !== undefined) {
        const newComment = {
          content: comment,
          authorId: currentUser.uid,
          authorName: currentUser.displayName,
          createdOn: Date.now(),
        };

        if (parentCommentId) {
          await addReply(post.id, parentCommentId, currentUser.uid, comment);

          setComments((prevComments) => {
            const updatedComments = prevComments.map((c) =>
              c.id === parentCommentId
                ? { ...c, replies: (Array.isArray(c.replies) ? c.replies : []).concat(newComment) }
                : c
            );
            return updatedComments;
          });
        } else {
          await addComment(post.id, currentUser.uid, comment);

          setComments((prevComments) => [...prevComments, newComment]);
        }
      } else {
        console.error("Error: Content is undefined");
      }
    } catch (error) {
      console.error("Error while adding comment:", error);
    }
  };


  const editComment = (commentId) => {
    const commentToEdit = comments.find((comment) => comment.id === commentId);
    setEditCommentId(commentId);
    setEditCommentContent(commentToEdit.content);
  };

  const saveEditedComment = async () => {
    try {
      await updateComment(editCommentId, editCommentContent);
      setEditCommentId(null);
      setEditCommentContent('');
      await fetchPostData(currentUser.uid);
    } catch (error) {
      console.error('Error while saving edited comment:', error);
    }
  };

  const updateComment = async (commentId, newContent) => {
    if (newContent !== undefined) {
      await updateCommentInDatabase(commentId, newContent);
    } else {
      console.error('Error: Content is undefined');
    }
  };

  const updateCommentInDatabase = async (commentId, newContent) => {
    await update(ref(db, `posts/${post.id}/comments/${commentId}`), {
      content: newContent,
    });
  };

  const deleteComment = async (commentId) => {
    try {
      await deleteCommentFromDatabase(commentId);
      await fetchPostData(currentUser.uid);
    } catch (error) {
      console.error('Error while deleting comment:', error);
    }
  };

  const deleteCommentFromDatabase = async (commentId) => {
    await remove(ref(db, `posts/${post.id}/comments/${commentId}`));
  };

  const replyToComment = (commentId) => {
    setReplyToCommentId(commentId);
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      fetchPostData(user ? user.uid : null);
    });

    return () => unsubscribe();
  }, [id]);

  const renderComments = (comments) => (
    <ul>
      {(Array.isArray(comments) ? comments : []).map((comment) => (
        <li key={comment.id}>
          <p>{comment.content}</p>
          <p>
            Author: {comment.authorName} | Created on: {new Date(comment.createdOn).toLocaleString()}
          </p>
          {currentUser && (
            <div>
              <button onClick={() => editComment(comment.id)}>Edit</button>
              <br />
              <button onClick={() => deleteComment(comment.id)}>Delete</button>
              <br />
              <button onClick={() => replyToComment(comment.id)}>Reply</button>
            </div>
          )}
          {replyToCommentId === comment.id && (
            <div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const reply = e.target.replyContent.value;
                  togglePostComment(reply, comment.id);
                  setReplyToCommentId(null);
                }}
              >
                <input type="text" name="replyContent" />
                <button type="submit">Add Reply</button>
                <button type="button" onClick={() => setReplyToCommentId(null)}>Cancel</button>
              </form>
            </div>
          )}
          {editCommentId === comment.id && (
            <div>
              <input
                type="text"
                value={editCommentContent}
                onChange={(e) => setEditCommentContent(e.target.value)}
              />
              <button onClick={saveEditedComment}>Save</button>
              <button onClick={() => setEditCommentId(null)}>Cancel</button>
            </div>
          )}
          {comment.replies && renderComments(comment.replies, comment.id)}
        </li>
      ))}
    </ul>
  );

  return (
    <div>
      {post && (
        <div>
          <h1>{post.title}</h1>
          <p>{post.content}</p>
          <p>Author: {post.authorId}</p>
          <p>Created on: {post.createdOn.toLocaleString()}</p>
          <p>Likes: {likes.length}</p>
          <p>Likes by: {post.likedBy.length > 0 ? post.likedBy.join(", ") : "No likes yet"}</p>
          <button onClick={togglePostLike}>
            {post.likedByCurrentUser ? 'Dislike' : 'Like'}
          </button>
          <br />
          <br />
          <h2>Comments</h2>
          {renderComments(comments)}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const comment = e.target.comment.value;
              togglePostComment(comment);
              e.target.reset();
            }}
          >
            <input type="text" name="comment" />
            <button type="submit">Add comment</button>
          </form>
        </div>
      )}
    </div>
  );
}