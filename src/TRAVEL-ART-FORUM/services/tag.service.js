import { get, ref, set } from "firebase/database";
import { db } from "../config/firebase-config";


export const getAllTags = () => {
    return get(ref(db, `tags/`));
};

export const updateAllTags = () => {
    set(ref(db, 'tags'), null);

    get(ref(db, `posts/`))
        .then((snapshot) => {
            const allPosts = snapshot.val();
            Object.keys(allPosts).forEach((postID) => {
                const post = allPosts[postID];
                const tags = post.tags;

                if (!tags) {
                    return;
                }

                tags.split(' ').forEach((tag) => {
                    get(ref(db, `tags/${tag}`))
                        .then((tagSnapshot) => {
                            if (tagSnapshot.exists()) {
                                const count = tagSnapshot.val() + 1;
                                set(ref(db, `tags/${tag}`), count);
                            } else {
                                set(ref(db, `tags/${tag}`), 1);
                            }
                        })
                })
            })
        });


};

