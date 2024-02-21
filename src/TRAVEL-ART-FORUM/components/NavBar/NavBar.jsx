import { NavLink, useNavigate } from "react-router-dom";
import { AppContext } from "../../providers/AppContext";
import { useContext } from "react";
import DropdownMenu from "../DropdownMenu/DropdownMenu";
import "./NavBar.css";
import Button from "../Button/Button";

const NavBar = () => {
  const { user, userData, setContext } =
    useContext(AppContext);

  const navigate = useNavigate();

  return (

    <nav className="navbar">
      <NavLink id="forum-button" className='nav-buttons' to={userData ? "/all-posts" : "/sign-in"}>FORUM</NavLink>
      <NavLink className='home-page-logo' to="/"><span>Travel</span><span>Art</span></NavLink>
      <NavLink id="our-community" className='nav-buttons' to="/about">Our Community</NavLink>
      {userData ? (
        <DropdownMenu
          username={userData.handle}
          avatarUrl={userData.avatarUrl}
          setContext={setContext}
        />
      ) : (
        <span>
          <Button handleClick={() => navigate("/sign-in")}> Sign in</Button>
          <Button handleClick={() => navigate("/sign-up")}> Sign up</Button>
        </span>
      )}
    </nav>
  );
};

export default NavBar;
