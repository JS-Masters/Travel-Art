import { ref, push, get, query, equalTo, orderByChild, update, set, remove } from 'firebase/database';
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
      // author: 
    };
  })
    .filter(p => p.title.toLowerCase().includes(searchTerm.toLowerCase()))
  return posts;
}


// likedBy and comments has 1 in them in order to keep the property in Firebase(it is not created when set to []).
export const addPost = async (authorHandle, title, tags, content, comments, replies) => {
  const newPostRef = push(ref(db, 'posts'), {
    title,
    tags,
    content,
    createdOn: Date.now(),
    authorHandle,
    likes: 0,
    likedBy: [1],
    comments,
    replies
  });

  return newPostRef.key; // Връщаме ключа на новия пост
};

export const deletePost = async (postID) => {
  try {
    const docRef = ref(db, `posts/${postID}`);
    await remove(docRef);
  } catch (error) {
    console.log(error.message);
  }

  // От Цвети
  window.location.href = "http://localhost:3001/all-posts/";
};

export const getPostById = async (id) => {
  try {
    const post = await get(ref(db, `posts/${id}`));

    if (!post.exists()) {
      throw new Error(`Post with id ${id} does not exist!`);
    }

    return post.val();

  } catch (error) {
    console.log(error.message);
  }
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
    const updatedLikedBy = [...post.likedBy, handle];

    await update(ref(db, `posts/${postId}`), {
      likes: post.likes + 1,
      likedBy: updatedLikedBy
    });
  }
};

export const dislikePost = async (handle, postId) => {
  const postRef = ref(db, `posts/${postId}`);
  const postSnapshot = await get(postRef);

  if (postSnapshot.exists()) {
    const post = postSnapshot.val();
    const updatedLikedBy = post.likedBy.filter((u) => u !== handle);

    await update(ref(db, `posts/${postId}`), {
      likes: post.likes - 1,
      likedBy: updatedLikedBy
    });
  }
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


export const addComment = async (comment, postID) => {

  if (comment.content) {
    const newCommentRef = await push(ref(db, `posts/${postID}/comments/`), {
      ...comment
    });
    const newCommentId = newCommentRef.key;
    const newComment = {
      ...comment,
      id: newCommentId
    };
    await set(ref(db, `posts/${postID}/comments/${newCommentId}`), newComment);
    return newComment;
   
  } else {
    alert('You must write a content to add a comment!')
  }
};


export const deleteComment = async (commentID, postID) => {
  try {
    await remove(ref(db, `posts/${postID}/comments/${commentID}`));

  } catch (error) {
    console.error('Error while deleting comment:', error);
  }
};

export const editComment = async (commentID, postID, commentContentEdit) => {
  const commentRef = await get(ref(db, `posts/${postID}/comments/${commentID}`))

  if (!commentRef.exists()) {
    throw new Error('WRONG PROCCESS !!!')
  }
  const commentVal = commentRef.val();

  await update(ref(db), { [`posts/${postID}/comments/${commentID}`]: { ...commentVal, content: commentContentEdit } });
  const updatedComment = await get(ref(db, `posts/${postID}/comments/${commentID}`));
  const updatedCommentValue = updatedComment.val();
  return updatedCommentValue;
};

export const toggleCommentLike = async (commentID, id, userData) => {
  let updatedComment = {};
  try {
    const commentRef = await get(ref(db, `posts/${id}/comments/${commentID}`))
    const commentVal = commentRef.val();
    if (!commentRef.exists()) {
      throw new Error('WRONG PROCCESS !!!')
    }

    if (!(Object.keys(commentVal).includes('likedBy'))) {

      const result = { ...commentVal, likedBy: { [userData.handle]: true }, likes: commentVal.likes + 1 };
      await update(ref(db), { [`posts/${id}/comments/${commentID}`]: result });

    } else {

      const likedByVal = commentVal.likedBy;
      await update(ref(db), { [`posts/${id}/comments/${commentID}`]: { ...commentVal, likedBy: { ...likedByVal, [userData.handle]: true }, likes: commentVal.likes + 1 } });
    }
    updatedComment = await get(ref(db, `posts/${id}/comments/${commentID}`));
    return updatedComment.val();

  } catch (error) {
    console.log(error.message);
  }
};

export const toggleCommentDisike = async (commentID, postID, userData) => {
  let updatedComment = {};
  try {
    const commentRef = await get(ref(db, `posts/${postID}/comments/${commentID}`))
    const commentVal = commentRef.val();
    if (!commentRef.exists()) {
      throw new Error('WRONG PROCCESS !!!')
    }
    const likedByVal = commentVal.likedBy;
    delete likedByVal[userData.handle];
    await update(ref(db), { [`posts/${postID}/comments/${commentID}`]: { ...commentVal, likedBy: { ...likedByVal }, likes: commentVal.likes - 1 } });
    updatedComment = await get(ref(db, `posts/${postID}/comments/${commentID}`));
    return updatedComment.val();

  } catch (error) {
    console.log(error.message);
  }
};

export const getCommentByID = async (postID, commentID) => {
  try {
    const comment = await get(ref(db, `posts/${postID}/comments/${commentID}`))
    if (!comment.exists()) {
      throw new Error('WRONG PROCCESS !!!')
    }
    const commentVal = comment.val();
    return commentVal;

  } catch (error) {
    console.log(error.message);
  }
};

export const getReplyByID = async (postID, commentID, replyID) => {
  try {
    const reply = await get(ref(db, `posts/${postID}/comments/${commentID}/replies/${replyID}`));
    if (!reply.exists()) {
      throw new Error('WRONG PROCCESS !!!')
    }
    const replyVal = reply.val();
    return replyVal;
  } catch (error) {
    console.log(error.message);
  }
};

export const getRepliesByCommentID = async (commentID, postID) => {

  const repliesRef = await get(ref(db, `posts/${postID}/comments/${commentID}/replies`));
  const repliesVal = repliesRef.val();
  const repliesArr = Object.values(repliesVal);
  return repliesArr;
};

export const deleteReply = async (commentID, replyID, postID) => {
  try {
    await remove(ref(db, `posts/${postID}/comments/${commentID}/replies/${replyID}`));
   const updatedComment =  await get(ref(db, `posts/${postID}/comments/${commentID}/replies`));
   const commentVal = updatedComment.val();
   return commentVal;
  } catch (error) {
    console.error('Error while deleting comment:', error);
  }

};


// export const getPostsByAuthor = (handle) => {
//   return get(query(ref(db, 'posts'), orderByChild('author'), equalTo(handle)))
//     .then(snapshot => {
//       if (!snapshot.exists()) return [];

//       return fromPostsDocument(snapshot);
//     });
// };


// export const getLikedPosts = (handle) => {
//   return get(ref(db, `users/${handle}`))
//     .then(snapshot => {
//       if (!snapshot.val()) {
//         throw new Error(`User with handle @${handle} does not exist!`);
//       }

//       const user = snapshot.val();
//       if (!user.likedPosts) return [];

//       return Promise.all(Object.keys(user.likedPosts).map(key => {
//         return get(ref(db, `posts/${key}`))
//           .then(snapshot => {
//             const post = snapshot.val();

//             return {
//               ...post,
//               createdOn: new Date(post.createdOn),
//               id: key,
//               likedBy: post.likedBy ? Object.keys(post.likedBy) : [],
//             };
//           });
//       }));
//     });
// };


// export const getPostLikesWithUsernames = async (postId) => {
//   return get(ref(db, `posts/${postId}/likedBy`))
//     .then(async (snapshot) => {
//       if (!snapshot.exists()) return [];

//       const userIds = Object.keys(snapshot.val());

//       // Запазваме информацията за потребителите в масив
//       const userPromises = userIds.map(userId => getUserById(userId));

//       // Изчакваме всички заявки за информация за потребителите да завършат
//       const users = await Promise.all(userPromises);

//       // Създаваме масив с хендълите на потребителите
//       const handles = users.map(user => user.handle);

//       return handles;
//     });
// }



// export const getPostLikes = async (postId) => {
//   return get(ref(db, `posts/${postId}/likedBy`))
//     .then(snapshot => {
//       if (!snapshot.exists()) {
//         return ([]);
//       }

//       return Object.values(snapshot.val());
//     });
// }

// const getUserById = async (id) => {
//   return get(ref(db, `users/${id}`))
//     .then(snapshot => {
//       if (!snapshot.exists()) {
//         throw new Error(`User with id ${id} does not exist!`);
//       }

//       const user = snapshot.val();
//       user.id = id; // Добави идентификатора на потребителя в обекта
//       return user;
//     });
// };


// export const addComment = async (postId, authorId, content) => {

//   if (content === undefined) {
//     throw new Error("Content is undefined");
//   }

//   const newCommentRef = push(ref(db, `posts/${postId}/comments`), {
//     content: content,
//     authorId: authorId,
//     createdOn: Date.now(),
//     replays: []
//   });

//   return newCommentRef.key; // Връщаме ключа на новия коментар
// };

// export const readComments = async (postId, userHandle, userEmail) => {
//   return get(ref(db, `posts/${postId}/comments`))
//     .then(async snapshot => {
//       if (!snapshot.exists()) return [];

//       const comments = snapshot.val();
//       const commentKeys = Object.keys(comments);


//       const commentPromises = commentKeys.map(async key => {
//         const comment = comments[key];

//         // Проверка дали потребителят съществува
//         try {
//           // const user = await getUserById(comment.authorId);

//           return {
//             ...comment,
//             id: key,
//             createdOn: new Date(comment.createdOn),
//             authorName: userHandle || userEmail || 'Unknown',
//           };
//         } catch (error) {
//           console.error(`Error fetching user with id ${comment.authorId}:`, error);
//           // Обработка на случай, когато потребителят не съществува
//           return {
//             ...comment,
//             id: key,
//             createdOn: new Date(comment.createdOn),
//             authorName: 'Unknown',
//           };
//         }
//       });

//       //  всички коментари да бъдат заредени
//       const loadedComments = await Promise.all(commentPromises);

//       return loadedComments;
//     });
// };

// export const addReply = async (postId, parentCommentId, authorId, content) => {
//   if (content === undefined) {
//     throw new Error("Content is undefined");
//   }

//   const newReplyRef = push(ref(db, `posts/${postId}/comments/${parentCommentId}/replies`), {
//     content,
//     authorId,
//     createdOn: Date.now(),
//   });

//   return newReplyRef.key; // Връщаме ключа на новия отговор
// };

// export const readReplies = async (postId, parentCommentId) => {
//   return get(ref(db, `posts/${postId}/comments/${parentCommentId}/replies`))
//     .then(snapshot => {
//       if (!snapshot.exists()) return [];

//       const replies = snapshot.val();
//       const replyKeys = Object.keys(replies);

//       return replyKeys.map(key => {
//         const reply = replies[key];
//         return {
//           ...reply,
//           id: key,
//           createdOn: new Date(reply.createdOn),
//         };
//       });
//     });
// }

/**
 * Retrieves the count of all posts.
 * @returns {Promise<number>} all posts.
 * @throws {Error} If no posts are found.
 */
export const getAllPostsValues = async () => {
  const snapshot = await get(ref(db, 'posts'));

  if (!snapshot.exists()) {
    throw new Error('No posts found.');
  }

  return snapshot.val();
};