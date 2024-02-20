import { useContext, useEffect, useState } from "react";
import {
  addPost
} from "../../services/posts.service";
import { AppContext } from "../../providers/AppContext";
import PostTags from "../PostTags/PostTags";
import { getAllTags, updateAllTags } from "../../services/tag.service";
import { get, ref, update } from "firebase/database";
import { db } from "../../config/firebase-config";
import { useNavigate } from "react-router-dom";
import "./CreatePost.css"


const CreatePost = () => {

  const { userData } = useContext(AppContext);
  const [post, setPost] = useState({
    title: "",
    tags: [],
    content: "",
  });

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
    };
    if (post.tags.includes(tag)) {
      return;
    };

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


  const createPost = async () => {
    if (post.title.length < 10 || post.title.length > 32) {
      return alert("Title must be between 16 and 64 characters long");
    }
    if (post.content.length < 32 || post.content.length > 8192) {
      return alert("Content must be between 32 and 8192 characters long");
    }
const userAvatarUrl = userData.avatarUrl ? userData.avatarUrl : 'https://previews.123rf.com/images/triken/triken1608/triken160800029/61320775-male-avatar-profile-picture-default-user-avatar-guest-avatar-simply-human-head-vector-illustration.jpg';
    const postID = await addPost(
      userData.handle,
      post.title,
      post.tags.join(" "),
      post.content,
      {},
      {},
      userAvatarUrl
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
  };

  return (
    <div className="create-post-form">
      {userData && !userData.isBanned ? (
        <div >
          <h1 id="new-post">New Post</h1>
          <label className="create-form-labels" htmlFor="input-title">Title</label><br/>
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
          <label className="create-form-labels" htmlFor="input-content">Content</label>
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
          <button className="create-post-button"onClick={createPost}>Create</button>
        </div>
      ) : (
        userData && <h1>BANNED USERS DO NOT HAVE ACCESS TO THIS!</h1>
        
      )}
    </div>
  );
};

export default CreatePost;
