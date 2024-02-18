import PropTypes from "prop-types";
import { useEffect, useState } from "react";

const RecentlyCreated = ({ totalPosts = [] }) => {
  const [recentlyCreated, setRecentlyCreated] = useState([]);

  useEffect(() => {
    const sortedPosts = totalPosts.sort((a, b) => b.createdOn - a.createdOn);
    setRecentlyCreated(sortedPosts.slice(0, 10));
  }, [totalPosts]);

  return (
    <>
      <h2>RecentlyCreated</h2>
      <ul>
        {recentlyCreated.map((post) => (
          <li key={post.id} className="single-post">
            <h3>{post.title}</h3>
            <p>{post?.tags}</p>
          </li>
        ))}
      </ul>
    </>
  );
};

RecentlyCreated.propTypes = {
    totalPosts: PropTypes.array.isRequired,
};

export default RecentlyCreated;
