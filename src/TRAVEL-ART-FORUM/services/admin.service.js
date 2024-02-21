import { get, ref, update } from "firebase/database"
import { db } from "../config/firebase-config"

export const getAllUsers = async () => {

  try {
    const snapshot = await get(ref(db, 'users'));
    if (!snapshot.exists()) {
      throw new Error('No posts found.');
    }
    return usersDocument(snapshot);
  } catch (error) {
    console.log(error.message)
  }
}

export const usersDocument = (snapshot) => {
  const usersDocument = snapshot.val();

  const users = Object.keys(usersDocument).map(key => {
    const user = usersDocument[key];
    return {
      ...user
    };
  })
  console.log(users)
  return users;
}

export const findUserByUID = async (handle) => {
  try {
    const snapshot = await get(ref(db, `users/${handle}`));
    if (!snapshot.exists()) {
      throw new Error('No posts found.');
    }
    const userDocument = snapshot.val();
    const user = Object.keys(userDocument).map(key => {
      const userFound = userDocument[key];
      return {
        ...userFound
      }
    })
    return user;
  } catch (error) {
    console.log(error.message);
  }
}

export const updateUserProperty = async (dbPath, value) => {
  try {
    await update(ref(db), { [dbPath]: value });

  } catch (error) {
    console.log(error.message);
  }

}

export const renderUsersBySearch = (searchTerm, users) => {
  if (!searchTerm) {
    return users;
  }
  return users.filter((u) => 
    u.handle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.lastName.toLowerCase().includes(searchTerm.toLowerCase())
  );
}