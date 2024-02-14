import { NavLink } from "react-router-dom";
import { AppContext } from "../../providers/AppContext";
import { useContext } from "react";
import Authenticated from "../hoc/Authenticated";

const NavBar = () => {
  const { user, citySearch, cityClick } = useContext(AppContext);


  return user ? (
    <nav>
      {(citySearch || cityClick) && <NavLink to="/hotels-by-city">See Hotels in {citySearch || cityClick}</NavLink>}
      {(citySearch || cityClick) && <NavLink to="/restaurants-by-city">See Restaurants in {citySearch || cityClick}</NavLink>}
      {(citySearch || cityClick) && <NavLink to="/things-to-do-by-city">Things to do in {citySearch || cityClick}</NavLink>}
      <NavLink to="/create-post">Create post</NavLink>
      <NavLink to="/all-posts">All posts</NavLink>
      {<Authenticated><NavLink to="/manage-users">Manage Users</NavLink></Authenticated>}
    </nav>
  ) : (
    <nav>
      <NavLink to="/sign-in">Sign in</NavLink>
      <NavLink to="/sign-up">Sign up</NavLink>
    </nav>
  );
};

export default NavBar;
