import { BrowserRouter, Routes } from "react-router-dom";
import { AppContext } from "./providers/AppContext";
import { useState } from "react";
import "./App.css";

function App() {
  const [context, setContext] = useState({
    user: null,
    userData: null,
  });

  return (
    <>
      <AppContext.Provider value={{...context, setContext}}>
      <BrowserRouter>
      <div className="App">
     <Routes>

     </Routes>
      </div>
      </BrowserRouter>
      </AppContext.Provider>
    </>
  );
}

export default App;
