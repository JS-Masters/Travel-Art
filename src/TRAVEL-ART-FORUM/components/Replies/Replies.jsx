import { useContext, useState } from "react";
import { AppContext } from "../../providers/AppContext";
import { deleteReply, editReply } from "../../services/posts.service";
import "./Replies.css"

const Replies = ({ repliesToShow, commentID, setRepliesToShow, postID, setReload, commentsArr, setCommentsArr }) => {

  const { userData } = useContext(AppContext);
  const [replyContentEdits, setReplyContentEdits] = useState({});

  const handleEditInputChange = (e, replyId) => {
    const { value } = e.target;
    setReplyContentEdits({ ...replyContentEdits, [replyId]: value });
  };

  const handleEditReply = (postID, commentID, reply) => {
    const replyContentEdit = replyContentEdits[reply.id] || '';
    if (replyContentEdit.trim() !== '') {
      editReply(postID, commentID, reply.id, replyContentEdit)
        .then((editedReply) => {
          const updatedReplies = repliesToShow.replies.map((r) =>
            r.id === editedReply.id ? editedReply : r
          );
          setRepliesToShow({ ...repliesToShow, replies: updatedReplies });
          setReplyContentEdits((prevState) => {
            const newState = { ...prevState };
            delete newState[reply.id];
            return newState;
          });
        })
        .catch((error) => {
          console.error('Error editing reply:', error);
        });
    }
  };

  return (
    <div className="replies-to-comment">
      {repliesToShow.replies.map((reply) => (
        <div key={reply.id} className="single-reply">
          <p>Content: {reply.content}</p>
          <p>Author: {reply.author}</p>
          <p>Created On: {reply.createdOn}</p>
          {(userData.handle === reply.author || userData.isAdmin) && (
            <button onClick={() => {
              deleteReply(commentID, reply.id, postID).then(() => {
                const repliesFiltered = repliesToShow.replies.filter((r) => r.id !== reply.id);
                !repliesFiltered.length && setReload((prev) => !prev);
                setRepliesToShow({
                  commentID: commentID,
                  replies: repliesFiltered
                });
              });
            }}>Delete Reply</button>
          )}

          {(userData.handle === reply.author || userData.isAdmin) && (
            <div>
              <input
                value={replyContentEdits[reply.id] || ''}
                onChange={(e) => handleEditInputChange(e, reply.id)}
                type="text"
                name={`edit-reply-${reply.id}`}
                id={`edit-reply-${reply.id}`}
              />
              <button onClick={() => handleEditReply(postID, commentID, reply)}>Edit Reply</button>
            </div>
          )}
        </div>
      ))}
    </div>
  );

};

export default Replies;
