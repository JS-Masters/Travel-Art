import { useContext, useState } from "react";
import { addPost,getAllPosts,getPostById,likePost,dislikePost } from "../../services/posts.service";
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
    if (posts.title.length < 3 || posts.content.length < 5) {
      return alert('Title must be at least 3 characters long, and content must be at least 5 characters long');
    }

    await addPost(userData.handle, posts.title, posts.content);

    setPosts({
      title: '',
      content: '',
    });
  };

  return (
    <div>
      <h1>Create Posts</h1>
      <label htmlFor="input-title">Title:</label>
      <input value={posts.title} onChange={e => setPosts({ ...posts, title: e.target.value })} type="text" name="input-title" id="input-title" /><br/>
      <label htmlFor="input-content">Content:</label><br/>
      <textarea value={posts.content} onChange={e => setPosts({ ...posts, content: e.target.value })} name="input-content" id="input-content" cols="30" rows="10"></textarea><br/><br/>
      <button onClick={createPost}>Create</button>
    </div>
  );
};

export default CreatePost;