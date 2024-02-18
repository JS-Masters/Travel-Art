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
};

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

  return newPostRef.key;
};

export const deletePost = async (postID) => {
  try {
    const docRef = ref(db, `posts/${postID}`);
    await remove(docRef);
  } catch (error) {
    console.log(error.message);
  }
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