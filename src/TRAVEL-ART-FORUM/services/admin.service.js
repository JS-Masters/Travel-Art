import { get, ref } from "firebase/database"
import { db } from "../config/firebase-config"

export const getUsers = async () => {

try {
  const snapshot = await get(ref(db, 'users'));
  if (!snapshot.exists()) {
    throw new Error('No posts found.');
  }
  return usersDocument(snapshot);
} catch(error) {
  console.log(error.message)
}

}

const usersDocument = (snapshot) => {
  const usersDocument = snapshot.val();

  const users = Object.keys(usersDocument).map(key => {
    const user = usersDocument[key];
    return {
      ...user 
    };
  })
    .filter(u => u.isAdmin !== true)
  return users;
}