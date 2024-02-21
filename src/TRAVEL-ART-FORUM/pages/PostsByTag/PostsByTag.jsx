import React, { useEffect, useState, useContext } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getPostsByTag } from "../../services/posts.service";
import SinglePost from '../../components/SinglePost/SinglePost';
import DeletePostButton from '../../components/Buttons/DeletePostButton/DeletePostButton';
import { AppContext } from "../../providers/AppContext"; 
import './PostsByTag.css';

const PostByTag = () => {
  const { tag } = useParams();
  const [postsByTag, setPostsByTag] = useState([]);
  const { user, userData } = useContext(AppContext); 
  const [clickTrigger, setClickTrigger] = useState(false);

  useEffect(() => {
    getPostsByTag(tag).then((posts) => {
      setPostsByTag(posts);
    });
  }, [tag, clickTrigger]);

  const rerenderAfterClick = () => {
    setClickTrigger(prevState => !prevState);
  };

  return (
    <div>
      <div className='all-posts-form-tag'>
        <h1 class='page-name-tag'>
          Posts with tag {tag}
          </h1>
        <ul>
          {postsByTag.map((post) => (
            <li key={post.id} className='post-box-tag'>
              <h2 className='post-title-all-posts-tag'>
                <Link to={`/single-post/${post.id}`}>{post.title}</Link>
              </h2>
              <span id="post-author-tag">
                <img src={post.userAvatarUrl} alt="user-avatar" style={{ width: '50px', height: '50px', borderRadius: '50%' }} />
                {post.authorHandle}
              </span>
              <DeletePostButton postID={post.id}  rerenderAfterClick={rerenderAfterClick} />
              <div id="comments-and-likes-tag">
                <span id="comments-number-tag">{post?.comments ? `${Object.keys(post.comments).length} Comments` : '0 Comments'}</span>
                <span id="likes-number-tag">{post.likes} Likes</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <hr />
    </div>
  );
};

export default PostByTag;