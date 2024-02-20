import { useContext, useEffect, useState } from "react";
import { getAllPosts } from "../../services/posts.service";
import { useSearchParams, Link } from "react-router-dom";
import Authenticated from "../hoc/Authenticated";
import DeletePostButton from "../Buttons/DeletePostButton/DeletePostButton";
import { AppContext } from "../../providers/AppContext";
import SearchMenu from "../SearchMenu/SearchMenu";
import "./AllPosts.css"
import CreatePost from "../CreatePost/CreatePost";
import { showHashtagOnTags } from "../../services/tag.service";
import { getUserByHandle } from "../../services/users.service";
import { auth } from "../../config/firebase-config";


export default function AllPosts() {

  const { user, userData } = useContext(AppContext);

  const [posts, setPosts] = useState([]);
  const [oldPosts, setOldPosts] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [clickTrigger, setClickTrigger] = useState(false);

  const [postAuthorAvatar, setPostAuthorAvatar] = useState('../../../../images/anonymous-avatar.jpg');

  const [isCheckedSortByComments, setIsCheckedSortByComments] = useState(false);
  const [isCheckedSortByLikes, setIsCheckedSortByLikes] = useState(false);
  const [isCheckedSortByDate, setIsCheckedSortByDate] = useState(false);

  const search = searchParams.get('search') || '';

  const setSearch = (value) => {
    setSearchParams({ search: value });
  };

  useEffect(() => {
    getAllPosts(search).then((res) => {
      setPosts(res);
      setOldPosts(res);
    });
  }, [search, clickTrigger]);

  const handleCommentsCheckboxChange = () => {
    setIsCheckedSortByComments(prevState => !prevState);
    if (isCheckedSortByLikes || isCheckedSortByDate) {
      setIsCheckedSortByLikes(false);
      setIsCheckedSortByDate(false);
    }
  };

  const handleLikesCheckboxChange = () => {
    setIsCheckedSortByLikes(prevState => !prevState);
    if (isCheckedSortByComments || isCheckedSortByDate) {
      setIsCheckedSortByComments(false);
      setIsCheckedSortByDate(false);
    }
  };

  const handleDateCheckboxChange = () => {
    setIsCheckedSortByDate(prevState => !prevState);
    if (isCheckedSortByComments || isCheckedSortByLikes) {
      setIsCheckedSortByComments(false);
      setIsCheckedSortByLikes(false);
    }
  };

  const rerenderAfterClick = () => {
    setClickTrigger(prevState => !prevState);
  };

  const sortPostsByComments = (postsToSort) => {
    return postsToSort.slice().sort((a, b) => {
      const numCommentsA = Object.keys(a.comments || {}).length;
      const numCommentsB = Object.keys(b.comments || {}).length;
      return numCommentsB - numCommentsA;
    });
  };

  const sortPostsByLikes = (postsToSort) => {
    return postsToSort.slice().sort((a, b) => {
      const numCommentsA = Object.keys(a.likedBy || {}).length;
      const numCommentsB = Object.keys(b.likedBy || {}).length;
      return numCommentsB - numCommentsA;
    });
  };

  const sortPostsByDate = (postsToSort) => {
    return postsToSort.slice().sort((a, b) => {
      const dateA = new Date(a.createdOn);
      const dateB = new Date(b.createdOn);
      return dateB - dateA;
    });
  };
  // const getAvatar = async (authorHandle) => {
  //   try {
  //     const authorSnapshot = await getUserByHandle(authorHandle);
  //     const author = authorSnapshot.val();
  //     const avatarURL = author.avatarUrl;
  //     setPostAuthorAvatar(avatarURL);
  //   } catch (error) {
  //     console.log(error.message);
  //   }

  // };





  const singlePostBox = (post) => {
    // getAvatar(post.authorHandle);
    // console.log(postAuthorAvatar);
    return (
      <div key={post.id} className="post-box">

        <h2>
          <Link to={`/single-post/${post.id}`}>{post.title}</Link>
        </h2>
        <span><Authenticated><DeletePostButton postID={post.id} rerenderAfterClick={rerenderAfterClick} /></Authenticated></span>

        {post.tags && <p>{showHashtagOnTags(post.tags)}</p>}
        {/* <p>{new Date(post.createdOn).toLocaleString()}</p> */}
        {/* <img src={postAuthorAvatar} /> */}
        <span id="post-author">Posted by: {post.authorHandle}</span>

        <div id="comments-and-likes">
          <span id="comments-number">{post?.comments ? `${Object.keys(post.comments).length} Comments` : '0 Comments'}</span>
          <span id="likes-number">{post.likes} Likes</span>
        </div>


        {user && userData.handle === post.authorHandle && !userData.isAdmin && <DeletePostButton postID={post.id} rerenderAfterClick={rerenderAfterClick} />}
      </div>
    );
  };

  return (
    <>
      <div className="all-posts-form">
        <div className="search-posts-box">
          <br />
          <label htmlFor="search">Search </label>
          <input value={search} onChange={e => setSearch(e.target.value)} type="text" name="search" id="search" /><br />
          <span>Sort by Most Commented</span>
          <input
            type="checkbox"
            checked={isCheckedSortByComments}
            onChange={handleCommentsCheckboxChange}
          /><br />
          <span>Sort by Most Liked</span>
          <input
            type="checkbox"
            checked={isCheckedSortByLikes}
            onChange={handleLikesCheckboxChange}
          /><br />
          <span>Sort by Most Recent</span>
          <input
            type="checkbox"
            checked={isCheckedSortByDate}
            onChange={handleDateCheckboxChange}
          />
          <br />
          {posts && <SearchMenu oldPosts={oldPosts} setPosts={setPosts} />}
        </div>
        <div className="all-posts-box">
          {isCheckedSortByComments ? sortPostsByComments(posts).map(singlePostBox)
            : isCheckedSortByLikes ? sortPostsByLikes(posts).map(singlePostBox)
              : isCheckedSortByDate ? sortPostsByDate(posts).map(singlePostBox)
                : posts.map(singlePostBox)}
        </div>

      </div>
      <CreatePost />
    </>
  );
};