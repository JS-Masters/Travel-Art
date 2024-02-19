import { useContext, useEffect, useState } from "react";
import {
  addPost,
  getAllPosts,
  getPostById,
  likePost,
  dislikePost,
} from "../../services/posts.service";
import { AppContext } from "../../providers/AppContext";
import PostTags from "../PostTags/PostTags";
import { getAllTags, updateAllTags } from "../../services/tag.service";
import { get, ref, update } from "firebase/database";
import { db } from "../../config/firebase-config";
import { useNavigate } from "react-router-dom";

const CreatePost = () => {
  const { userData } = useContext(AppContext);
  const [post, setPost] = useState({
    title: "",
    tags: [],
    content: "",
  });

  // -------------------------------------- //
  const [allTags, setAllTags] = useState({});
  const navigate = useNavigate();
  useEffect(() => {
    getAllTags().then((snapshot) => {
      setAllTags(snapshot.val());
    });
  }, []);

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
      tags: [...post.tags, tag],
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

    setPost({
      ...post,
      tags: post.tags.filter((t) => t !== tag),
    });
  };

  // Implemented by Memo
  // -------------------------------------- //

  // const updatePost = (value, key) => {
  //   setPost({
  //     ...post,
  //     [key]: value,
  //   });
  // };

  const createPost = async () => {
    if (post.title.length < 16 || post.title.length > 64) {
      return alert("Title must be between 16 and 64 characters long");
    }
    if (post.content.length < 32 || post.content.length > 8192) {
      return alert("Content must be between 32 and 8192 characters long");
    }

    const postID = await addPost(
      userData.handle,
      post.title,
      post.tags.join(" "),
      post.content,
      {},
      {}
    );

    const newPost = await get(ref(db, `posts/${postID}`));
    const postVal = newPost.val();
    const result = { ...postVal, id: postID };
    await update(ref(db), { [`posts/${postID}`]: result });

    updateAllTags(post.tags);

    setPost({
      title: "",
      tags: [],
      content: "",
    });
    navigate('/');
    // От Цвети - ползвам началния линк //
    // window.location.href = "http://localhost:3001/";
  };

  return (
    <>
      {userData && !userData.isBanned ? (
        <div className="create-post-form">
          <h1>Create Posts</h1>
          <label htmlFor="input-title">Title:</label>
          <input
            value={post.title}
            onChange={(e) => setPost({ ...post, title: e.target.value })}
            type="text"
            name="input-title"
            id="input-title"
          />
          <PostTags
            allTags={allTags}
            selectedTags={post.tags}
            addTag={addTag}
            removeTag={removeTag}
          />
          <br />
          <label htmlFor="input-content">Content:</label>
          <br />
          <textarea
            value={post.content}
            onChange={(e) => setPost({ ...post, content: e.target.value })}
            name="input-content"
            id="input-content"
            cols="30"
            rows="10"
          ></textarea>
          <br />
          <button onClick={createPost}>Create</button>
        </div>
      ) : (
        <h1>BANNED USERS DO NOT HAVE ACCESS TO THIS!</h1>
      )}
    </>
  );
};

export default CreatePost;
