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

export default function AllPosts() {

  const { user, userData } = useContext(AppContext);

  const [posts, setPosts] = useState([]);
  const [oldPosts, setOldPosts] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [clickTrigger, setClickTrigger] = useState(false);
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

  const singlePostBox = (post) => {
    return (
      <div key={post.id} className="post-box">
        <h2 className="post-title-all-posts">
          <Link to={`/single-post/${post.id}`}>{post.title}</Link>
        </h2>
        <span><Authenticated><DeletePostButton postID={post.id} rerenderAfterClick={rerenderAfterClick} /></Authenticated></span>
        {post.tags && <p>{showHashtagOnTags(post.tags)}</p>}
        <span id="post-author"><img src={post.userAvatarUrl}
          alt="user-avatar"
          style={{ width: '50px', height: '50px', borderRadius: '50%'}} /> {post.authorHandle}</span>

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
        <div id="search-bar">
          <label htmlFor="search">Search </label>
          <input value={search} onChange={e => setSearch(e.target.value)} type="text" name="search" id="search" />
        </div><br />
        <div className="sort-posts-box">
          <span>Sort by Most Commented <input
            type="checkbox"
            checked={isCheckedSortByComments}
            onChange={handleCommentsCheckboxChange}
          /></span>

          <span>Sort by Most Liked <input
            type="checkbox"
            checked={isCheckedSortByLikes}
            onChange={handleLikesCheckboxChange}
          /></span>

          <span>Sort by Most Recent <input
            type="checkbox"
            checked={isCheckedSortByDate}
            onChange={handleDateCheckboxChange}
          /></span>

        </div>
        {posts && <SearchMenu oldPosts={oldPosts} setPosts={setPosts} />}
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