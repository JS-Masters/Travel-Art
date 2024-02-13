import { useState } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

const DropdownMenu = ({
  username = null,
  userData = null,
  signOut = () => {},
}) => {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setMenuOpen(!isMenuOpen);
  };

  return (
    <div style={{ float: "right" }} className="dropdown">
      <button
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
        }}
        onClick={toggleMenu}
      >
        <span
          style={{
            fontFamily: "monospace",
            fontSize: "20px",
            margin: "10px 5px 0 0",
          }}
        >
          {username}
        </span>
        {userData?.avatarUrl && (
          <img
            style={{ height: "50px", width: "50px", borderRadius: "50%" }}
            src={userData.avatarUrl}
          />
        )}
      </button>
      {isMenuOpen && (
        <ul style={{ listStyle: "none" }} className="menu">
          <li onClick={() => navigate("/upload-form")}>Change Avatar</li>
          <li>Edit profile</li>
          <li onClick={signOut}>Sign out</li>
        </ul>
      )}
    </div>
  );
};

DropdownMenu.propTypes = {
  username: PropTypes.string,
  userData: PropTypes.object,
  signOut: PropTypes.func.isRequired,
};

export default DropdownMenu;
