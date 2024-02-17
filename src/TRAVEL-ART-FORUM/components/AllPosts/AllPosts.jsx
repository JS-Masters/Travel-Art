import { useContext, useEffect, useState } from "react";
import { getAllPosts } from "../../services/posts.service";
import SinglePost from "../../components/SinglePost/SinglePost";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import Authenticated from "../hoc/Authenticated";
import DeletePostButton from "../Buttons/DeletePostButton/DeletePostButton";
import { AppContext } from "../../providers/AppContext";



export default function AllPosts() {

  const [posts, setPosts] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [clickTrigger, setClickTrigger] = useState(false);
  const { user, userData } = useContext(AppContext);
  const [isCheckedSortByComments, setIsCheckedSortByComments] = useState(false);
  const [isCheckedSortByLikes, setIsCheckedSortByLikes] = useState(false);
  const [isCheckedSortByDate, setIsCheckedSortByDate] = useState(false);
  const navigate = useNavigate();

  const search = searchParams.get('search') || '';


  const setSearch = (value) => {
    setSearchParams({ search: value });
  };

  useEffect(() => {
    getAllPosts(search).then(setPosts);
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
  }

  const rerenderAfterClick = () => {
    setClickTrigger(prevState => !prevState);
  }

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
  }

  const sortPostsByDate = (postsToSort) => {
    return postsToSort.slice().sort((a, b) => {
      const dateA = new Date(a.createdOn);
      const dateB = new Date(b.createdOn);
      return dateB - dateA;
    });
  }

  return (
    <div>
      <h1>All posts</h1>
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
      {isCheckedSortByComments ? sortPostsByComments(posts).map((post) => (
        <div key={post.id}>
          <h3>
            <Link to={`/single-post/${post.id}`}>{post.title}</Link>
          </h3>
          <p>{new Date(post.createdOn).toLocaleString()}</p>
          <p>Posted by: {post.authorHandle}</p>
          {post.tags && <p>Tags: {post.tags}</p>}
          <Authenticated><DeletePostButton postID={post.id} rerenderAfterClick={rerenderAfterClick} /></Authenticated>
          {user && userData.handle === post.authorHandle && !userData.isAdmin && <DeletePostButton postID={post.id} rerenderAfterClick={rerenderAfterClick} />}
        </div>
      )) : isCheckedSortByLikes ? sortPostsByLikes(posts).map((post) => (
        <div key={post.id}>
          <h3>
            <Link to={`/single-post/${post.id}`}>{post.title}</Link>
          </h3>
          <p>{new Date(post.createdOn).toLocaleString()}</p>
          <p>Posted by: {post.authorHandle}</p>
          {post.tags && <p>Tags: {post.tags}</p>}
          <Authenticated><DeletePostButton postID={post.id} rerenderAfterClick={rerenderAfterClick} /></Authenticated>
          {user && userData.handle === post.authorHandle && !userData.isAdmin && <DeletePostButton postID={post.id} rerenderAfterClick={rerenderAfterClick} />}
        </div>
      )) : isCheckedSortByDate ? sortPostsByDate(posts).map((post) => (
        <div key={post.id}>
          <h3>
            <Link to={`/single-post/${post.id}`}>{post.title}</Link>
          </h3>
          <p>{new Date(post.createdOn).toLocaleString()}</p>
          <p>Posted by: {post.authorHandle}</p>
          {post.tags && <p>Tags: {post.tags}</p>}
          <Authenticated><DeletePostButton postID={post.id} rerenderAfterClick={rerenderAfterClick} /></Authenticated>
          {user && userData.handle === post.authorHandle && !userData.isAdmin && <DeletePostButton postID={post.id} rerenderAfterClick={rerenderAfterClick} />}
        </div>
      )) : posts.map((post) => (
        <div key={post.id}>
          <h3>
            <Link to={`/single-post/${post.id}`}>{post.title}</Link>
          </h3>
          <p>{new Date(post.createdOn).toLocaleString()}</p>
          <p>Posted by: {post.authorHandle}</p>
          {post.tags && <p>Tags: {post.tags}</p>}
          <Authenticated><DeletePostButton postID={post.id} rerenderAfterClick={rerenderAfterClick} /></Authenticated>
          {user && userData.handle === post.authorHandle && !userData.isAdmin && <DeletePostButton postID={post.id} rerenderAfterClick={rerenderAfterClick} />}
        </div>
      ))}
    </div>
  );

}