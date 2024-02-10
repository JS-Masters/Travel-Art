import { NavLink } from "react-router-dom";
import { AppContext } from "../../providers/AppContext";
import { useContext } from "react";

const NavBar = () => {
  const { user } = useContext(AppContext);

  return user ? (
    <h1>Welcome, {user.firstName}</h1>
  ) : (
    <nav>
      <NavLink to="/sign-in">Sign in</NavLink>
      <NavLink to="/sign-up">Sign up</NavLink>
    </nav>
  );
};

export default NavBar;
