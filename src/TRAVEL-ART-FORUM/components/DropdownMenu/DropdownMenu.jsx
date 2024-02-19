import PropTypes from "prop-types";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../../services/auth.service";
import Authenticated from "../hoc/Authenticated";

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
        <span
          style={{
            fontFamily: "monospace",
            fontStyle: "italic",
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
          <li
            style={{ cursor: "pointer", fontStyle: "italic" }}
            onClick={() => navigate("/upload-form")}
          >
            Change Avatar
          </li>
          <li
            style={{ cursor: "pointer", fontStyle: "italic" }}
            onClick={() => navigate("/edit-profile")}
          >
            Edit profile
          </li>

          <Authenticated>
            <li
              style={{ cursor: "pointer", fontStyle: "italic" }}
              onClick={() => navigate("/manage-users")}
            >
              Manage Users
            </li>
          </Authenticated>

          <li
            style={{ cursor: "pointer", fontStyle: "italic" }}
            onClick={signOut}
          >
            Sign out
          </li>
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
