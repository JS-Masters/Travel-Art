import PropTypes from "prop-types";
import { useContext, useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { AppContext } from "../../providers/AppContext";

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
    <>
      <h2>MostCommented</h2>
      <ul>
        {mostCommented.map((post) => (
          <li key={post.id} className="single-post">
            <NavLink to={userData ? `/single-post/${post.id}` : "/sign-in"}>
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
