import PropTypes from "prop-types";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../../services/auth.service";
import Authenticated from "../hoc/Authenticated";
import "./DropdownMenu.css";

const DropdownMenu = ({
  username = null,
  avatarUrl = null,
  setContext = () => {},
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  const signOut = async () => {
    await logoutUser();
    setContext({ user: null, userData: null });
    navigate("/");
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
        <span>{username}</span>
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
        <ul
          style={{ listStyle: "none", position: "absolute" }}
          className="profile-menu"
        >
          <li onClick={() => navigate("/my-profile")}>My Profile</li>
          <li onClick={() => navigate("/upload-form")}>Change Avatar</li>
          <li onClick={() => navigate("/edit-profile")}>Edit profile</li>
          <Authenticated>
            <li onClick={() => navigate("/manage-users")}>Manage Users</li>
          </Authenticated>
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
