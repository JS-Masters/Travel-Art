import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

const MostCommented = ({ totalPosts = [] }) => {
  const [mostCommented, setMostCommented] = useState([]);

  useEffect(() => {
    const sortedPosts = totalPosts.sort(
      (a, b) => b.comments?.length - a.comments?.length
    );
    setMostCommented(sortedPosts.slice(0, 10));
  }, [totalPosts]);

  return (
    <>
      <h2>MostCommented</h2>
      <ul>
        {mostCommented.map((post) => (
          <li key={post.id} className="single-post">
            <NavLink to={`/single-post/${post.id}`}>
              <h2>{post.title}</h2>
            </NavLink>
            <p>{post?.tags}</p>
          </li>
        ))}
      </ul>
    </>
  );
};

MostCommented.propTypes = {
  totalPosts: PropTypes.array.isRequired,
};

export default MostCommented;
