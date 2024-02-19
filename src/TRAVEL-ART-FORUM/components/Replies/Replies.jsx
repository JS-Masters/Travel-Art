import { useContext, useState } from "react";
import { AppContext } from "../../providers/AppContext";
import { deleteReply, editReply } from "../../services/posts.service";
import "./Replies.css"

const Replies = ({ repliesToShow, commentID, setRepliesToShow, postID, setReload, commentsArr, setCommentsArr }) => {

  const { userData } = useContext(AppContext);
  const [replyContentEdit, setReplyContentEdit] = useState('');

  return (
    <div className="replies-to-comment">
      {repliesToShow.replies.map((reply) => (
        <div key={reply.id} className="single-reply">
          <p>Author: {reply.author}</p>
          <p>Content: {reply.content}</p>
          <p>Created On: {reply.createdOn}</p>
          {/* <p>Likes: {reply.likes}</p> */}
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
            <div className="edit-reply-form">
              <input
                value={replyContentEdit}
                onChange={(e) => setReplyContentEdit(e.target.value)}
                type="text"
                name="edit-reply"
                id="edit-reply"
              />
              <button onClick={() => {
                replyContentEdit && editReply(postID, commentID, reply.id, replyContentEdit).then((reply) => {
                  const updatedReplies = [...repliesToShow.replies];
                  const index = updatedReplies.findIndex((r) => r.id === reply.id);
                  updatedReplies.splice(index, 1, reply);
                  setRepliesToShow({ ...repliesToShow, replies: updatedReplies });
                }).then(() => setReplyContentEdit(''));
              }}>Edit Reply</button>
            </div>
          )}
        </div>
      ))}
    </div>
  );

};

export default Replies;