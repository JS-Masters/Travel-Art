import PropTypes from "prop-types";
import { CloseIcon, PlusSquareIcon } from "@chakra-ui/icons";
import { IconButton } from "@chakra-ui/react";
import { useState } from "react";
import { v4 } from "uuid";
import "./PostTags.css";

const PostTags = ({ allTags, selectedTags, addTag, removeTag }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [searchField, setSearchField] = useState("");

  const updateSearchField = (event) => {
    setSearchField(event.target.value);
  };

  const formattedSelection =
    selectedTags.length > 0
      ? selectedTags.join(", ")
      : "select at least 1 tag…";

  const menu = () => {
    const foundTags = Object.keys(allTags).filter(
      (key) => key.includes(searchField) && !selectedTags.includes(key)
    );

    return (
      <div className="drop-down-menu">
        <input
          type="search"
          value={searchField}
          onChange={updateSearchField}
          placeholder="Search or create..."
        />
        <div className="selected-content">
          {selectedTags.map((tag) => (
            <button
              key={v4()}
              onClick={removeTag}
              style={{
                margin: "1px 2px",
                padding: "0 3px",
                border: "1px solid white",
              }}
            >
              {tag} <CloseIcon style={{ width: "10px" }} />
            </button>
          ))}
        </div>
        <ul>
          {foundTags.length
            ? foundTags.map((key) => (
                <li key={v4()} style={{ cursor: "pointer" }} onClick={addTag}>
                  {key} x{allTags[key]}
                </li>
              ))
            : searchField && (
                <li style={{ cursor: "pointer" }} onClick={addTag}>
                  {"Create " + searchField}
                </li>
              )}
        </ul>
      </div>
    );
  };

  return (
    <div className="tags-menu">
      <summary
        data-name=""
        data-value=""
        role="listbox"
        id="ember253-header"
        className="select-kit-header"
      >
        <div className="select-kit-header-wrapper">
          <span className="formatted-selection">{formattedSelection}</span>
          <IconButton
            aria-label="Add tag"
            icon={<PlusSquareIcon />}
            onClick={() => setShowMenu(!showMenu)}
          />
        </div>
      </summary>

      {showMenu && menu()}
    </div>
  );
};

PostTags.propTypes = {
  // allTags: PropTypes.object.isRequired,
  selectedTags: PropTypes.array.isRequired,
  addTag: PropTypes.func.isRequired,
  removeTag: PropTypes.func.isRequired,
};

export default PostTags;
