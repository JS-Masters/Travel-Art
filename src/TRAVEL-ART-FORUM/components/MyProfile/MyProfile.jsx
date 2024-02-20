import React, { useEffect, useState, useContext } from 'react';
import { getUserData } from '../../services/users.service';
import { getPostByAuthor, getCommentedPostsByUser } from '../../services/posts.service';
import { AppContext } from "../../providers/AppContext";
import SinglePost from '../../components/SinglePost/SinglePost';
import { Link } from 'react-router-dom'
import { getAllAvatars, getUserAvatar } from '../../services/users.service';
import './MyProfile.css';

const MyProfile = () => {
  const { user, userData, setContext } = useContext(AppContext);
  const [posts, setPosts] = useState([]);
  const [avatar, setAvatar] = useState('');
  const [commentedPosts, setCommentedPosts] = useState([]);

  useEffect(() => {
    if (user) {
      getUserData(user.uid).then((snapshot) => {
        if (snapshot.exists()) {
          setContext({
            user,
            userData: snapshot.val()[Object.keys(snapshot.val())[0]],
          });
        }
      });
    }
  }, [user]);

  useEffect(() => {
    if (Object.keys(userData).length > 0) {
      getPostByAuthor(userData.handle).then((posts) => {
        setPosts(posts);
      });
    }
  }, [userData]);

  useEffect(() => {
    if (userData.handle) {
      getUserAvatar(userData.handle).then((avatar) => {
        setAvatar(avatar);
      });
    }
  }, [userData]);

  useEffect(() => {
    if (userData.handle) {
      getCommentedPostsByUser(userData.handle).then((posts) => {
        setCommentedPosts(posts);
        console.log(posts);
      });
    }
  }, [userData]);

  return (
    <div className="profile-container">
      <div className="user-info-container">
        <div className="user-avatar">
          <img src={userData.avatarUrl} alt="avatar" />
        </div>
        <div className="user-handle">
          <h1>{userData.handle}</h1>
        </div>
      </div>

      <div className="posts-and-comments">
        <div className="posts-container">
          <div className="section-title-posts">
            <h2 class='handle'>About {userData.handle}'s travels</h2>
          </div>
          <ul className="post-list">
            {posts.map((post) => (
              <li key={post.id} className="post-item">
                <div className='post-container'>
                  <div className='post-title'>
                    <Link to={`/single-post/${post.id}`}>{post.title}</Link>
                  </div>
                  <div className='post-content'>
                    {post.content}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="commented-posts-container">
          <div className="section-title">
            <h2 class='handle'>Commented posts</h2>
          </div>
          <ul className="comment-list">
            {commentedPosts.map((post) => (
              <li key={post.id} className="comment-item">
                <div className='comment-container'>
                  <div className='comment-title'>
                    <Link to={`/single-post/${post.id}`}>{post.title}</Link>
                  </div>
                
                  <div className='comment-content'>
                    
                    {Object.values(post.comments)
                      .filter(comment => comment.authorHandle === userData.handle)
                      .map((comment) => (
                        <p key={comment.id}> Comment:{comment.content}</p>
                      ))}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default MyProfile;