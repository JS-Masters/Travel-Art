import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../providers/AppContext";
import { Navigate } from "react-router-dom";

const Authenticated = ({ children }) => {
  const { userData } = useContext(AppContext);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userData) {
      setIsAdmin(userData.isAdmin);
      setLoading(false);
    }
  }, [userData]);

  if (loading) {
    return <h1>LOADING...</h1>
  }

  if (!isAdmin) {
    return <Navigate replace to="/" />
  }

  return <>{children}</>;
};

export default Authenticated;

