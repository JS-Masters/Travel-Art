import { NavLink } from "react-router-dom";
import { AppContext } from "../../providers/AppContext";
import { useContext } from "react";
import { logoutUser } from "../../services/auth.service";
import DropdownMenu from "../DropdownMenu/DropdownMenu";

const NavBar = () => {
  const { user, userData, city, setContext } = useContext(AppContext);

  const signOut = async () => {
    await logoutUser();
    setContext({ user: null, userData: null });
  };

  return user ? (
    <nav>
      <DropdownMenu username={userData?.handle} userData={userData} signOut={signOut} />
      {city && <NavLink to="/hotels-by-city">See Hotels in {city}</NavLink>}
      <NavLink to="/create-post">Create post</NavLink>
      <NavLink to="/all-posts">All posts</NavLink>
    </nav>
  ) : (
    <nav>
      <NavLink to="/sign-in">Sign in</NavLink>
      <NavLink to="/sign-up">Sign up</NavLink>
    </nav>
  );
};

export default NavBar;
