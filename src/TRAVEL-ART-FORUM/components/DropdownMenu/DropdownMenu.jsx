import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { logoutUser } from "../../services/auth.service";

const DropdownMenu = ({
  username = null,
  avatarUrl = null,
  setContext = () => {},
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();

  console.log(avatarUrl);
  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  const signOut = async () => {
    await logoutUser();
    setContext({ user: null, userData: null });
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
            marginTop: "19px",
          }}
        >
          {username}
        </span>
        {avatarUrl && (
          <img
            style={{
              height: "50px",
              width: "50px",
              borderRadius: "50%",
              margin: "10px",
            }}
            src={avatarUrl}
          />
        )}
      </button>
      {showMenu && (
        <ul style={{ listStyle: "none" }} className="menu">
          <li onClick={() => navigate("/upload-form")}>Change Avatar</li>
          <li onClick={() => navigate("/edit-profile")}>Edit profile</li>
          <li onClick={signOut}>Sign out</li>
        </ul>
      )}
    </div>
  );
};

DropdownMenu.propTypes = {
  username: PropTypes.string,
  avatarUrl: PropTypes.string,
  setContext: PropTypes.func.isRequired,
};

export default DropdownMenu;
