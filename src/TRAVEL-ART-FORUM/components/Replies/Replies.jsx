import { useContext } from "react";
import { AppContext } from "../../providers/AppContext";
import { deleteReply } from "../../services/posts.service";




const Replies = ({repliesToShow, commentID, setRepliesToShow, postID, setReload}) => {

  const {userData} = useContext(AppContext);


  return (
    <div className="replies-to-comment">
      {repliesToShow.replies.map((reply) => (
        <div key={reply.id}>
          <p>Author: {reply.author}</p>
          <p>Content: {reply.content}</p>
          <p>Created On: {reply.createdOn}</p>
          {/* <p>Likes: {reply.likes}</p> */}
          {userData.handle === reply.author && <button onClick={() => {
            deleteReply(commentID, reply.id, postID).then(() => {
              const repliesFiltered = repliesToShow.replies.filter((r) => r.id !== reply.id);
              {!repliesFiltered.length && setReload((prev) => !prev)}
              setRepliesToShow({
                commentID: commentID,
                replies: repliesFiltered
              })
            });
          }}>Delete Reply</button>}
        </div>
      ))}
    </div>
  )

};

export default Replies;