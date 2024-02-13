import { useEffect, useState } from "react";
import { getAllPosts } from "../../services/posts.service";
import SinglePost from "../../components/SinglePost/SinglePost";
import { useSearchParams, Link, useNavigate } from "react-router-dom";



export default function AllPosts() {
  const [posts, setPosts] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const search = searchParams.get('search') || '';

  const setSearch = (value) => {
    setSearchParams({ search: value });
  };

  useEffect(() => {
    getAllPosts(search).then(setPosts);
  }, [search]);

  return (
    <div>
      <h1>All posts</h1>
      <label htmlFor="search">Search </label>
      <input value={search} onChange={e => setSearch(e.target.value)} type="text" name="search" id="search" /><br />

      {posts.map((post) => (
  <div key={post.id}>
    <h3>
    <Link to={`/single-post/${post.id}`}>{post.title || "No Title"}</Link>
    </h3>
    <p>{new Date(post.createdOn).toLocaleString()}</p>
    
  </div>
))}
    </div>
  );
}