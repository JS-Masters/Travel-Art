import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../providers/AppContext";
import { useParams } from "react-router-dom";
import { deleteComment, editComment, getCommentByID, getRepliesByCommentID, getReplyByID, toggleCommentDisike, toggleCommentLike } from "../../services/posts.service";
import {push, ref, update } from "firebase/database";
import { db } from "../../config/firebase-config";
import Replies from "../Replies/Replies";
import './SingleComment.css';

const SingleComment = ({ comment, commentsArr, setCommentsArr, setIsCommentLiked, setReload }) => {

  const { userData } = useContext(AppContext);
  const { id } = useParams();
  const [currentComment, setCurrentComment] = useState(null);
  const [commentContentEdit, setCommentContentEdit] = useState('');
  const [currentReply, setCurrentReply] = useState({
    content: "",
    author: userData.handle,
    createdOn: ""
  });
  const [showRepliesClicked, setShowRepliesClicked] = useState({
    clicked: false,
    commentID: ""
  });
  const [repliesToShow, setRepliesToShow] = useState({
    commentID: "",
    replies: []
  });

  useEffect(() => {
    setCurrentComment(comment);
  }, []);

  const replyToComment = async (commentID) => {
    try {
      if (currentReply.content) {
        const comment = await getCommentByID(id, commentID);
        if (!('replies' in comment)) {

          const result = { ...comment, replies: null };
          await update(ref(db), { [`posts/${id}/comments/${commentID}`]: result });

          const newReplyRef = await push(ref(db, `posts/${id}/comments/${commentID}/replies`), currentReply);
          const newReplyID = newReplyRef.key;
          const reply = await getReplyByID(id, commentID, newReplyID);
          const resultReply = { ...reply, id: newReplyID };
          await update(ref(db), { [`posts/${id}/comments/${commentID}/replies/${newReplyID}`]: resultReply });

        } else {
          const newReplyRef = await push(ref(db, `posts/${id}/comments/${commentID}/replies`), currentReply);
          const newReplyID = newReplyRef.key;
          const reply = await getReplyByID(id, commentID, newReplyID);
          const resultReply = { ...reply, id: newReplyID };
          await update(ref(db), { [`posts/${id}/comments/${commentID}/replies/${newReplyID}`]: resultReply });
        }
      } else {
        alert('You must write a reply first!')
      }
      const updatedComment = await getCommentByID(id, commentID);
      return updatedComment;
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <>
      {currentComment && <div key={comment.id} className="comment-info">
        <p id="comment-content-title">{comment.content}</p>
        <p>
          Author: {comment.authorHandle} | Created on: {comment.createdOn}
        </p>
        <p>{comment.likes} Likes</p>
        {!('likedBy' in comment) && <button className="like-comment-button" onClick={() => {
          toggleCommentLike(comment.id, id, userData).then((result) => {
            const updatedCommentsArr = [...commentsArr];
            const index = updatedCommentsArr.findIndex((c) => c.id === comment.id);
            updatedCommentsArr.splice(index, 1, result);
            setCommentsArr(updatedCommentsArr);
          })
        }}>Like</button>}
        {('likedBy' in comment) && (!Object.keys(comment.likedBy).includes(userData.handle)) && <button className="like-comment-button"  onClick={() => {
          toggleCommentLike(comment.id, id, userData).then((result) => {
            const updatedCommentsArr = [...commentsArr];
            const index = updatedCommentsArr.findIndex((c) => c.id === comment.id);
            updatedCommentsArr.splice(index, 1, result);
            setCommentsArr(updatedCommentsArr);
          })
        }}>Like</button>}
        {'likedBy' in comment && Object.keys(comment.likedBy).includes(userData.handle) && <button className="like-comment-button"  onClick={() => {
          toggleCommentDisike(comment.id, id, userData).then((result) => {
            const updatedCommentsArr = [...commentsArr];
            const index = updatedCommentsArr.findIndex((c) => c.id === comment.id);
            updatedCommentsArr.splice(index, 1, result);
            setCommentsArr(updatedCommentsArr);
          })
        }}>Disike</button>}
        <br />
        {(userData.handle === comment.authorHandle || userData.isAdmin === true) && (
          <div>
            <button className="delete-comment-button" onClick={() => {
              deleteComment(comment.id, id).then(() => {
                const commentsFiltered = commentsArr.filter((c) => c.id !== comment.id);
                setCommentsArr(commentsFiltered);
              });
            }}>Delete Comment</button>
          </div>
        )}
        {userData.handle === comment.authorHandle &&
          <div>
            <input
              value={commentContentEdit}
              onChange={(e) => setCommentContentEdit(e.target.value)}
              type="text"
              name="edit-comment"
              id="edit-comment"
            />
            <button id="edit-comment-btn"
            onClick={() => {commentContentEdit &&
              editComment(comment.id, id, commentContentEdit).then((result) => {
                const updatedCommentsArr = [...commentsArr];
                const index = updatedCommentsArr.findIndex((c) => c.id === comment.id);
                updatedCommentsArr.splice(index, 1, result);
          
                setCommentsArr(updatedCommentsArr);
              }).then(() =>  setCommentContentEdit(''))
             
            }}>Edit</button>
          </div>}
        <br />
        {!userData.isBanned &&
          <div className="add-reply">
            <input
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
              replyToComment(comment.id).then(
                setCurrentReply({
                  content: "",
                  author: userData.handle,
                  createdOn: ""
                })
              ).then(() => setReload((prev) => !prev))
            }}>Reply</button>
          </div>}
        {'replies' in comment && !showRepliesClicked.clicked && <button onClick={() => {
          getRepliesByCommentID(comment.id, id).then((repliesArr) => setRepliesToShow({
            commentID: comment.id,
            replies: repliesArr
          }))
          setShowRepliesClicked({ clicked: true, commentID: comment.id });
        }}>View {Object.keys(comment.replies).length} Replies</button>}

        {'replies' in comment && showRepliesClicked.clicked && showRepliesClicked.commentID !== comment.id && <button onClick={() => {
          getRepliesByCommentID(comment.id, id).then((repliesArr) => setRepliesToShow({
            commentID: comment.id,
            replies: repliesArr
          }))
          setShowRepliesClicked({ clicked: true, commentID: comment.id });
        }}>View {Object.keys(comment.replies).length} Replies</button>}

        {'replies' in comment && showRepliesClicked.clicked && showRepliesClicked.commentID === comment.id && <button onClick={() => {
          setShowRepliesClicked({ clicked: false, commentID: comment.id });
          setRepliesToShow({
            commentID: "",
            replies: []
          })
        }}>Hide Replies</button>}

        {repliesToShow && repliesToShow.commentID === comment.id && showRepliesClicked.clicked && showRepliesClicked.commentID === comment.id &&
          <Replies repliesToShow={repliesToShow} commentID={comment.id} setRepliesToShow={setRepliesToShow} postID={id} setReload={setReload} commentsArr={commentsArr} setCommentsArr={setCommentsArr}/>}
        <br />
      </div>}
    </>
  );
};

export default SingleComment;