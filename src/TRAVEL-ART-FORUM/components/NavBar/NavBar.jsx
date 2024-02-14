import { NavLink } from "react-router-dom";
import { AppContext } from "../../providers/AppContext";
import { useContext } from "react";
import Authenticated from "../hoc/Authenticated";

const NavBar = () => {
  const { user, city } = useContext(AppContext);

 
  return user ? (
    <nav>
      {city && <NavLink to="/hotels-by-city">See Hotels in {city}</NavLink>}
      {city && <NavLink to="/restaurants-by-city">See Restaurants in {city}</NavLink>}
      {city && <NavLink to="/things-to-do-by-city">Things to do in {city}</NavLink>}
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
