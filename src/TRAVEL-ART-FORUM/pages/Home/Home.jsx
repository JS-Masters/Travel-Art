import PropTypes from "prop-types";
import { getAllUsers } from "../../services/users.service";
import { useContext, useEffect, useState } from "react";
import { getAllPostsValues } from "../../services/posts.service";
import MostCommented from "../../views/MostCommented/MostCommented";
import RecentlyCreated from "../../views/RecentlyCreated/RecentlyCreated";
import "./Home.css"
import { AppContext } from "../../providers/AppContext";
import { NavLink } from "react-router-dom";

const Home = (props) => {

  const { user, citySearch, cityClick } = useContext(AppContext);
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
      <div className="general-info">
        <h2>Total posts created: {totalPosts.length}</h2>
        <h2>Our Travelers: {users}</h2>
      </div>

      <div className="most-commented-posts">
        <MostCommented totalPosts={totalPosts} />
      </div>
      <div className="recently-created-posts">
        <RecentlyCreated totalPosts={totalPosts} />
      </div>
      {user && <div className="globe-results">
        {(citySearch || cityClick) && (
          <NavLink to="/hotels-by-city">
            See Hotels in {citySearch || cityClick}
          </NavLink>
        )}
        {(citySearch || cityClick) && (
          <NavLink to="/restaurants-by-city">
            See Restaurants in {citySearch || cityClick}
          </NavLink>
        )}
        {(citySearch || cityClick) && (
          <NavLink to="/things-to-do-by-city">
            Things to do in {citySearch || cityClick}
          </NavLink>
        )}
      </div>}

    </div>
  );
};

Home.propTypes = {};

export default Home;
