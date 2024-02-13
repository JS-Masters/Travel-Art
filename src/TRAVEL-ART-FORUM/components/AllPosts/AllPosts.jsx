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
  const {user, userData} = useContext(AppContext);
  const navigate = useNavigate();

  const search = searchParams.get('search') || '';


  const setSearch = (value) => {
    setSearchParams({ search: value });
  };

  useEffect(() => {
    getAllPosts(search).then(setPosts);
  }, [search, clickTrigger]);



  const rerenderAfterClick = () => {
    setClickTrigger(prevState => !prevState);
  }


  return (
    <div>
      <h1>All posts</h1>
      <label htmlFor="search">Search </label>
      <input value={search} onChange={e => setSearch(e.target.value)} type="text" name="search" id="search" /><br />

      {posts.map((post) => {
        // console.log(post)
        return (
          <div key={post.id}>
            <h3>
              <Link to={`/single-post/${post.id}`}>{post.title}</Link>
            </h3>
            <p>{new Date(post.createdOn).toLocaleString()}</p>
            {<Authenticated><DeletePostButton postID={post.id} rerenderAfterClick={rerenderAfterClick} /></Authenticated>}
            {user && userData.handle === post.author && !userData.isAdmin && <DeletePostButton postID={post.id} rerenderAfterClick={rerenderAfterClick} />}

          </div>
        );
      })}
    </div>
  );
}