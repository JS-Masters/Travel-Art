import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../providers/AppContext";

const Loaded = ({ children, setReload }) => {
  const { userData } = useContext(AppContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userData) {
      setLoading(false);
    }
  }, [userData]);

  if (loading) {
    return <h1>LOADING...</h1>;
  }

  return <div>{React.cloneElement(children, { setReload })}</div>;
};

export default Loaded;
