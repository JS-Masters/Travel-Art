import { NavLink, useNavigate } from "react-router-dom";
import { AppContext } from "../../providers/AppContext";
import { useContext } from "react";
import DropdownMenu from "../DropdownMenu/DropdownMenu";
import "./NavBar.css";
import Button from "../Button/Button";

const NavBar = () => {
  const { user, userData, citySearch, cityClick, setContext } =
    useContext(AppContext);

  const navigate = useNavigate();

  return (
    <nav className="navbar">
      {/* {(citySearch || cityClick) && (
        <NavLink to="/hotels-by-city">
          See Hotels in {citySearch || cityClick}
        </NavLink>
      )}
      {(citySearch || cityClick) && (
        <NavLink to="/restaurants-by-city">
          See Restaurants in {citySearch || cityClick}
        </NavLink>
      )}
      {(citySearch || cityClick) && (
        <NavLink to="/things-to-do-by-city">
          Things to do in {citySearch || cityClick}
        </NavLink>
      )} */}

      <NavLink to="/about">Our Community</NavLink>
      <NavLink to="/all-posts">FORUM</NavLink>
      <NavLink className='home-page-logo' to="/">Travel-Art</NavLink>

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
