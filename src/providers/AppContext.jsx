
import { createContext } from 'react';

export const AppContext = createContext({
  user: null,
  userData: null,
  city: null,
  latitude:null,
  longitude:null,
  setContext() {
    // real implementation comes from App.jsx
  },
});



