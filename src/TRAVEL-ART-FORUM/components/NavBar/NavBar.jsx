import { NavLink } from "react-router-dom";
import { AppContext } from "../../providers/AppContext";
import { useContext } from "react";
import Authenticated from "../hoc/Authenticated";
import DropdownMenu from "../DropdownMenu/DropdownMenu";

const NavBar = () => {
  const { user, userData, citySearch, cityClick, setContext } =
    useContext(AppContext);

  return user ? (
    <nav>
      {(citySearch || cityClick) && (
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
      )}
      
      <NavLink to="/all-posts">FORUM</NavLink>
      <NavLink to="/about">Our Community</NavLink>
      {
        <Authenticated>
          <NavLink to="/manage-users">Manage Users</NavLink>
        </Authenticated>
      }
      {userData && (
        <DropdownMenu
          username={userData.handle}
          avatarUrl={userData.avatarUrl}
          setContext={setContext}
        />
      )}
    </nav>
  ) : (
    <nav>
      <NavLink to="/sign-in">Sign in</NavLink>
      <NavLink to="/sign-up">Sign up</NavLink>
    </nav>
  );
};

export default NavBar;
