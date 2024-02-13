import { get, set, ref, query, equalTo, orderByChild } from 'firebase/database';
import { db } from '../config/firebase-config';

export const getUserByHandle = (handle) => {

  return get(ref(db, `users/${handle}`));
};

export const createUserHandle = (uid, handle, firstName, lastName, email, isAdmin) => {

  return set(ref(db, `users/${handle}`), { uid, handle, firstName, lastName, email, createdOn: new Date(), createdPosts: {}, createdComments: {}, likedPosts: {} })
};

export const getUserData = (uid) => {

  return get(query(ref(db, 'users'), orderByChild('uid'), equalTo(uid)));
};

/**
 * Updates a user's property by handle.
 *
 * @param {string} handle - The user's handle.
 * @param {string} prop - The property to update.
 * @param {any} value - The new value for the property.
 * @returns {Promise<void>} A promise that resolves when the update is complete.
 */
export const updateUserByHandle = (handle, prop, value) => {

  return set(ref(db, `users/${handle}/${prop}`), value);
};