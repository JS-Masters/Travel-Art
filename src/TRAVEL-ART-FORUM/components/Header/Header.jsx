import { useContext } from "react"
import { AppContext } from "../../providers/AppContext"
import { NavLink } from "react-router-dom";


const Header = () => {
  const { city } = useContext(AppContext);
  

  return (
    <header>
      {city && <NavLink to="/hotels-by-city">SEE HOTELS IN {city}</NavLink>}
    </header>
  )
}

export default Header;

