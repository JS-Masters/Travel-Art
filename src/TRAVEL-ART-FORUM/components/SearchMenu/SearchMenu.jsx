import PropTypes from "prop-types";

import "./SearchMenu.css";
import { ChevronRightIcon, SearchIcon } from "@chakra-ui/icons";
import { useEffect, useState } from "react";
import { getAllTags } from "../../services/tag.service";
import { v4 } from "uuid";

const SearchMenu = ({ oldPosts = [], setPosts = () => {} }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [tags, setTags] = useState([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    getAllTags()
      .then((snapshot) => {
        const res = Object.keys(snapshot.val())
          .sort((a, b) => snapshot.val()[b] - snapshot.val()[a])
          .slice(0, 5);

        setTags(res);
      })
      .catch((err) => {
        setError(err.message);
      });
  }, []);

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  const filterByTag = (tag) => {
    const filteredPosts = oldPosts.filter((post) =>
      post.tags.includes(tag.trim())
    );

    setPosts([...filteredPosts]);
  };

  if (error) {
    return <h2>{error}</h2>;
  }

  return (
    <ul className="search-tags-menu">
      <h3 onClick={toggleMenu}>Tags {<ChevronRightIcon />}</h3>
      {showMenu &&
        tags.map((tag) => (
          <li
            key={v4()}
            onClick={(event) => filterByTag(event.target.innerText)}
          >
            <SearchIcon /> {tag}
          </li>
        ))}
    </ul>
  );
};

SearchMenu.propTypes = {
  oldPosts: PropTypes.array.isRequired,
  setPosts: PropTypes.func.isRequired,
};

export default SearchMenu;
