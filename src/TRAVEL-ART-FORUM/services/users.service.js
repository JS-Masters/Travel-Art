import { get, set, ref, query, equalTo, orderByChild } from 'firebase/database';
import { db } from '../config/firebase-config';

export const getUserByHandle = (handle) => {

  return get(ref(db, `users/${handle}`));
};

export const createUserHandle = (uid, handle, firstName, lastName, email, isAdmin) => {

  return set(ref(db, `users/${handle}`), { uid, handle, firstName, lastName, email, isAdmin, createdOn: new Date(), createdPosts: {}, createdComments: {}, likedPosts: {}})
};

export const getUserData = (uid) => {

  return get(query(ref(db, 'users'), orderByChild('uid'), equalTo(uid)));
};