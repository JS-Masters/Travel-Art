import { ref, remove } from "firebase/database";
import { db } from "../../../config/firebase-config";
import "./DeletePostButton.css";

const DeletePostButton = ({postID, rerenderAfterClick}) => {

  const handleDeleteClick = async (postID) => {
    const docRef = ref(db, `posts/${postID}`);
   await remove(docRef)
    .then(() => {
      console.log('Document successfully deleted!');
      rerenderAfterClick();

    })
    .catch((error) => {
      console.error('Error removing document: ', error);
    });
  }
return (
  <button className="delete-post-button" onClick={() => handleDeleteClick(postID)}>DELETE</button>
)


}
export default DeletePostButton;