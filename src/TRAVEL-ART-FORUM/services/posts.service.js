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
    .filter(p => p.title.toLowerCase().includes(searchTerm.toLowerCase()))
  return posts;
}

 

export const addPost = async (authorId, title, content) => {
  const newPostRef = push(ref(db, 'posts'), {
    title,
    content,
    createdOn: Date.now(),
    authorId,
    likes: 0,
    likedBy: [],
    comments: [] 
  });

  return newPostRef.key; // Връщаме ключа на новия пост
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
      post.likedBy = post.likedBy !== undefined ? post.likedBy : [];

      return post;
    });
};

export const getPostsByAuthor = (handle) => {
  return get(query(ref(db, 'posts'), orderByChild('author'), equalTo(handle)))
    .then(snapshot => {
      if (!snapshot.exists()) return [];

      return fromPostsDocument(snapshot);
    });
};

export const getAllPosts = async (searchTerm, currentUserId) => {
  const snapshot = await get(ref(db, 'posts'));

  if (!snapshot.exists()) {
    throw new Error('No posts found.');
  }

  return fromPostsDocument(snapshot, searchTerm, currentUserId);
};



export const likePost = async (handle, postId) => {
  const postRef = ref(db, `posts/${postId}`);
  const postSnapshot = await get(postRef);

  if (postSnapshot.exists()) {
    const post = postSnapshot.val();

    // Проверка дали post.likedBy е дефинирано
    if (!post.likedBy || !post.likedBy.includes(handle)) {
      const updatedLikedBy = [...(post.likedBy || []), handle];

      // Обнови брояча на харесванията във Firebase
      await update(ref(db, `posts/${postId}`), {
        likes: updatedLikedBy.length,
        likedBy: updatedLikedBy,
      });
    }
  }
};

export const dislikePost = async (handle, postId) => {
  // При дислайк също трябва да обновим брояча
  const postRef = ref(db, `posts/${postId}`);
  const postSnapshot = await get(postRef);

  if (postSnapshot.exists()) {
    const post = postSnapshot.val();
    const updatedLikedBy = post.likedBy.slice(0, -1);

    // Обнови брояча на харесванията и likedBy във Firebase
    await update(ref(db, `posts/${postId}`), {
      likes: updatedLikedBy.length,
      likedBy: updatedLikedBy,
    });
  }
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

export const getPostLikesWithUsernames = async (postId) => {
  return get(ref(db, `posts/${postId}/likedBy`))
    .then(async (snapshot) => {
      if (!snapshot.exists()) return [];

      const userIds = Object.keys(snapshot.val());

      // Запазваме информацията за потребителите в масив
      const userPromises = userIds.map(userId => getUserById(userId));

      // Изчакваме всички заявки за информация за потребителите да завършат
      const users = await Promise.all(userPromises);

      // Създаваме масив с хендълите на потребителите
      const handles = users.map(user => user.handle);

      return handles;
    });
}



export const getPostLikes = async (postId) => {
  return get(ref(db, `posts/${postId}/likedBy`))
    .then(snapshot => {
      if (!snapshot.exists()) return [];

      return Object.keys(snapshot.val());
    });
}

const getUserById = async (id) => {
  return get(ref(db, `users/${id}`))
    .then(snapshot => {
      if (!snapshot.exists()) {
        throw new Error(`User with id ${id} does not exist!`);
      }

      const user = snapshot.val();
      user.id = id; // Добави идентификатора на потребителя в обекта
      return user;
    });
};
export const getUserByHandle = async (handle) => {
  return get(query(ref(db, 'users'), orderByChild('handle'), equalTo(handle)))
    .then(snapshot => {
      if (!snapshot.exists()) {
        throw new Error(`User with handle @${handle} does not exist!`);
      }

      const user = snapshot.val();
      return user;
    });
};

export const addComment = async (postId, authorId, content) => {

  if (content === undefined) {
      throw new Error("Content is undefined");
  }

  const newCommentRef = push(ref(db, `posts/${postId}/comments`), {
      content: content,
      authorId: authorId,
      createdOn: Date.now(),
      replays:[]
  });

  return newCommentRef.key; // Връщаме ключа на новия коментар
};

export const readComments = async (postId) => {
  return get(ref(db, `posts/${postId}/comments`))
    .then(async snapshot => {
      if (!snapshot.exists()) return [];

      const comments = snapshot.val();
      const commentKeys = Object.keys(comments);


      const commentPromises = commentKeys.map(async key => {
        const comment = comments[key];
      
        // Проверка дали потребителят съществува
        try {
          const user = await getUserById(comment.authorId);
      
          return {
            ...comment,
            id: key,
            createdOn: new Date(comment.createdOn),
            authorName: user.displayName || user.email || 'Unknown',
          };
        } catch (error) {
          console.error(`Error fetching user with id ${comment.authorId}:`, error);
          // Обработка на случай, когато потребителят не съществува
          return {
            ...comment,
            id: key,
            createdOn: new Date(comment.createdOn),
            authorName: 'Unknown',
          };
        }
      });
      
      //  всички коментари да бъдат заредени
      const loadedComments = await Promise.all(commentPromises);
      
      return loadedComments;
    });
};

export const addReply = async (postId, parentCommentId, authorId, content) => {
  if (content === undefined) {
    throw new Error("Content is undefined");
  }

  const newReplyRef = push(ref(db, `posts/${postId}/comments/${parentCommentId}/replies`), {
    content,
    authorId,
    createdOn: Date.now(),
  });

  return newReplyRef.key; // Връщаме ключа на новия отговор
};

export const readReplies = async (postId, parentCommentId) => {
  return get(ref(db, `posts/${postId}/comments/${parentCommentId}/replies`))
    .then(snapshot => {
      if (!snapshot.exists()) return [];

      const replies = snapshot.val();
      const replyKeys = Object.keys(replies);

      return replyKeys.map(key => {
        const reply = replies[key];
        return {
          ...reply,
          id: key,
          createdOn: new Date(reply.createdOn),
        };
      });
    });
}