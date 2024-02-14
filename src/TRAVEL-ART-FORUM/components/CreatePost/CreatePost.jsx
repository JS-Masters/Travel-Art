import { useContext, useState } from "react";
import { addPost, getAllPosts, getPostById, likePost, dislikePost } from "../../services/posts.service";
import { AppContext } from "../../providers/AppContext";


const CreatePost = () => {

  const { userData } = useContext(AppContext);
  const [posts, setPosts] = useState({
    title: '',
    content: '',
  });

  const updatePost = (value, key) => {
    setPost({
      ...post,
      [key]: value,
    });
  };
  const createPost = async () => {
    if (posts.title.length < 16 || posts.title.length > 64) {
      return alert('Title must be between 16 and 64 characters long');
    }
    if(posts.content.length < 32 || posts.content.length > 8192) {
      return alert('Content must be between 32 and 8192 characters long');
    }

    await addPost(userData.handle, posts.title, posts.content);

    setPosts({
      title: '',
      content: '',
    });
  };

  return (
    <>
      {userData && !userData.isBanned ? (
        <div className="create-post-form">
          <h1>Create Posts</h1>
          <label htmlFor="input-title">Title:</label>
          <input value={posts.title} onChange={e => setPosts({ ...posts, title: e.target.value })} type="text" name="input-title" id="input-title" /><br />
          <label htmlFor="input-content">Content:</label><br />
          <textarea value={posts.content} onChange={e => setPosts({ ...posts, content: e.target.value })} name="input-content" id="input-content" cols="30" rows="10"></textarea><br /><br />
          <button onClick={createPost}>Create</button>
        </div>
      ) : (
        <h1>BANNED USERS DO NOT HAVE ACCESS TO THIS!</h1>
      )
      }
    </>


  );
};

export default CreatePost;