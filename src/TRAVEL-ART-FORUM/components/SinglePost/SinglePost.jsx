import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../providers/AppContext";
import { useParams } from "react-router-dom";
import { dislikePost, getPostById, likePost } from "../../services/posts.service";

const SinglePost = () => {

  const { userData } = useContext(AppContext);

  const [post, setPost] = useState(null);
  const [commentsArr, setCommentsArr] = useState(null);
  const [likedByCurrentUser, setLikedByCurrentUser] = useState(false);

  const { id } = useParams();

  useEffect(() => {
    updatePost();
  }, [])


  const updatePost = async () => {
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
    if(filteredArr.length) {
      return true;
    } else {
      return false;
    }
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
          <br />
          <br />
          <h2>Comments</h2>
          {/* {renderComments(comments)} */}
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
export default SinglePost;