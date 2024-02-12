import { NavLink } from "react-router-dom";
import { AppContext } from "../../providers/AppContext";
import { useContext } from "react";
import { logoutUser } from "../../services/auth.service";

const NavBar = () => {
  const { user, userData, city, setContext } = useContext(AppContext);

  const signOut = async () => {
    await logoutUser();
    setContext({ user: null, userData: null });
  };

  return user ? (
    <>
      <span>Welcome, {userData?.handle}</span>
      <button onClick={signOut}>Sign Out</button><br />
      {city && <NavLink to="/hotels-by-city">See Hotels in {city}</NavLink>}
    </>
  ) : (
    <nav>
      <NavLink to="/sign-in">Sign in</NavLink>
      <NavLink to="/sign-up">Sign up</NavLink>
    </nav>
  );
};

export default NavBar;
