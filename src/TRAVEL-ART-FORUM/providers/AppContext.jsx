
import { createContext } from 'react';

export const AppContext = createContext({
  user: null,
  userData: null,
  citySearch: null,
  cityClick:null,
  setContext() {
    // real implementation comes from App.jsx
  },
});



