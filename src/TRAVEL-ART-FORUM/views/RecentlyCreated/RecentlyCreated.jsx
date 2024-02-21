import PropTypes from "prop-types";
import { useEffect, useState, useContext } from "react";
import { NavLink } from "react-router-dom";
import { AppContext } from "../../providers/AppContext";
import "./RecentlyCreated.css";

const RecentlyCreated = ({ totalPosts = [] }) => {
  const [recentlyCreated, setRecentlyCreated] = useState([]);
  const { userData } = useContext(AppContext);

  useEffect(() => {
    const sortedPosts = totalPosts.sort((a, b) => b.createdOn - a.createdOn);
    setRecentlyCreated(sortedPosts.slice(0, 10));
  }, [totalPosts]);

  return (
    <div className="recently-created-posts">
      <h1>Recently Created Posts</h1>
      <div>
        {recentlyCreated.map((post) => (
          <div key={post.id} className="single-post">
            <NavLink to={userData ? `/single-post/${post.id}` : "/sign-in"}>
              <h2 className="recently-created-title">- {post.title}</h2>
            </NavLink>
          </div>
        ))}
      </div>
    </div>
  );
};

RecentlyCreated.propTypes = {
  totalPosts: PropTypes.array.isRequired,
};

export default RecentlyCreated;
