import { useContext } from "react";
import { AppContext } from "../../providers/AppContext";

const Home = () => {

  const {city} = useContext(AppContext);

return (
  <>
  {city ? 
  (<h1>{`WELCOME FINALLY TO ${city}`}</h1>) 
  : (<h1>NO USER</h1>)}
  </>
)


}

export default Home;