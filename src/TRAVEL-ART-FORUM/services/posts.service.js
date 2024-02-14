import { ref, push, get, query, equalTo, orderByChild, update } from 'firebase/database';
import { db } from '../config/firebase-config';

const fromPostsDocument = (snapshot, searchTerm) => {
  const postsDocument = snapshot.val();

  const posts = Object.keys(postsDocument).map(key => {
    const post = postsDocument[key];

    return {
      ...post,
      id: key,
      createdOn: new Date(post.createdOn),
      likedBy: post.likedBy ? Object.keys(post.likedBy) : [],
    };
  })
    .filter(p => {
      return p.title.toLowerCase().includes(searchTerm.toLowerCase()) 
      ||
      p.author.toLowerCase().includes(searchTerm.toLowerCase()) 
      ||
      p.content.toLowerCase().includes(searchTerm.toLowerCase())
    })
  return posts;
}

export const addPost = async (author, title, content) => {
  return push(ref(db, 'posts'), {
    author,
    title,
    content,
    createdOn: Date.now(),
  });
};

export const getPostById = (id) => {
  return get(ref(db, `posts/${id}`))
    .then(result => {
      if (!result.exists()) {
        throw new Error(`Post with id ${id} does not exist!`);
      }

      const post = result.val();
      post.id = id;
      post.createdOn = new Date(post.createdOn);
      if (!post.likedBy) post.likedBy = [];

      return post;
    });
};

export const getLikedPosts = (handle) => {
  return get(ref(db, `users/${handle}`))
    .then(snapshot => {
      if (!snapshot.val()) {
        throw new Error(`User with handle @${handle} does not exist!`);
      }

      const user = snapshot.val();
      if (!user.likedPosts) return [];

      return Promise.all(Object.keys(user.likedPosts).map(key => {
        return get(ref(db, `posts/${key}`))
          .then(snapshot => {
            const post = snapshot.val();

            return {
              ...post,
              createdOn: new Date(post.createdOn),
              id: key,
              likedBy: post.likedBy ? Object.keys(post.likedBy) : [],
            };
          });
      }));
    });
};

export const getPostsByAuthor = (handle) => {
  return get(query(ref(db, 'posts'), orderByChild('author'), equalTo(handle)))
    .then(snapshot => {
      if (!snapshot.exists()) return [];

      return fromPostsDocument(snapshot);
    });
};

export const getAllPosts = async (searchTerm) => {
  const snapshot = await get(ref(db, 'posts'));

  if (!snapshot.exists()) {
    throw new Error('No posts found.');
  }

  return fromPostsDocument(snapshot, searchTerm);
};

export const likePost = (handle, postId) => {
  const updateLikes = {};
  updateLikes[`/posts/${postId}/likedBy/${handle}`] = true;
  updateLikes[`/users/${handle}/likedPosts/${postId}`] = true;

  return update(ref(db), updateLikes);
};

export const dislikePost = (handle, postId) => {
  const updateLikes = {};
  updateLikes[`/posts/${postId}/likedBy/${handle}`] = null;
  updateLikes[`/users/${handle}/likedPosts/${postId}`] = null;

  return update(ref(db), updateLikes);
};
