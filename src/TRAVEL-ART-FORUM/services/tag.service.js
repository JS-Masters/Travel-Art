import { get, ref, set } from "firebase/database";
import { db } from "../config/firebase-config";


export const getAllTags = () => {
    return get(ref(db, `tags/`));
};

export const updateAllTags = (tags = []) => {
    tags.forEach((tag) => {
        get(ref(db, `tags/${tag}`))
            .then((tagSnapshot) => {
                if (tagSnapshot.exists()) {
                    const count = tagSnapshot.val() + 1;
                    set(ref(db, `tags/${tag}`), count);
                } else {
                    set(ref(db, `tags/${tag}`), 1);
                }
            })
    });
};