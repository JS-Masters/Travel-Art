import PropTypes from "prop-types";
import { useContext, useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { AppContext } from "../../providers/AppContext";
import "./MostCommented.css";

const MostCommented = ({ totalPosts = [] }) => {
  const [mostCommented, setMostCommented] = useState([]);
  const { userData } = useContext(AppContext);

  useEffect(() => {
    const sortedPosts = totalPosts.sort(
      (a, b) => b.comments?.length - a.comments?.length
    );
    setMostCommented(sortedPosts.slice(0, 10));
  }, [totalPosts]);

  return (
    <div className="most-commented-box">
      <h1>Most Commented Posts</h1>
      <div>
        {mostCommented.map((post) => (
          <div key={post.id} className="single-post">
            <NavLink to={userData ? `/single-post/${post.id}` : "/sign-in"}>
              <h2 className="title-most-commented">{post.title}</h2>
            </NavLink>
          </div>
        ))}
      </div>
    </div>
  );
};

MostCommented.propTypes = {
  totalPosts: PropTypes.array.isRequired,
};

export default MostCommented;
