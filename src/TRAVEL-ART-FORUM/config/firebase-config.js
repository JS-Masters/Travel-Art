import {initializeApp} from "firebase/app"
import {getAuth} from "firebase/auth"
import {getDatabase} from "firebase/database"

const firebaseConfig = {
  apiKey: "AIzaSyBImzGVEojoR5hmZgVIm2uY2vSDQOBBQWU",
  authDomain: "travel-art-daec3.firebaseapp.com",
  projectId: "travel-art-daec3",
  storageBucket: "travel-art-daec3.appspot.com",
  messagingSenderId: "140854462310",
  appId: "1:140854462310:web:d82df451704eeb8ec92aa7",
  measurementId: "G-YRRHQP3H38",
  databaseURL: "https://travel-art-daec3-default-rtdb.europe-west1.firebasedatabase.app/"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);