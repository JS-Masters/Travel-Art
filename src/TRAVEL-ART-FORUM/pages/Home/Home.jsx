import PropTypes from "prop-types";
import { getAllUsers } from "../../services/users.service";
import { useEffect, useState } from "react";
import { getAllPostsValues } from "../../services/posts.service";
import MostCommented from "../../views/MostCommented/MostCommented";
import RecentlyCreated from "../../views/RecentlyCreated/RecentlyCreated";

const Home = (props) => {
  const [users, setUsers] = useState(0);
  const [totalPosts, setTotalPosts] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    getAllUsers().then((snapshot) => {
      if (snapshot.exists()) {
        setUsers(Object.keys(snapshot.val()).length);
      }
    });

    getAllPostsValues()
      .then((res) => setTotalPosts(Object.values(res)))
      .catch((err) => setError(err.message));
  }, []);

  if (error) {
    return <h1>{error}</h1>;
  }

  return (
    <div className="home-page">
      <h1>Home</h1>
      <div className="about-forum">
        <h3>Total posts created: {totalPosts.length}</h3>
        <h3>Users: {users}</h3>
      </div>
      <div className="most-commented-posts">
        <MostCommented totalPosts={totalPosts} />
      </div>
      <div className="recently-created-posts">
        <RecentlyCreated totalPosts={totalPosts} />
      </div>
    </div>
  );
};

Home.propTypes = {};

export default Home;
