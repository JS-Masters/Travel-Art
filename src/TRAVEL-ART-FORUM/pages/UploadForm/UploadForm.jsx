import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../providers/AppContext";
import { storage } from "../../config/firebase-config";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 } from "uuid";
import { updateUserByHandle } from "../../services/users.service";

const UploadForm = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const { userData } = useContext(AppContext);
  const navigate = useNavigate();

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = () => {
    if (selectedFile === null) {
      return;
    }

    const fileRef = ref(
      storage,
      `${userData?.handle}/${selectedFile.name + v4()}`
    );

    uploadBytes(fileRef, selectedFile).then((snapshot) => {
      alert("Image uploaded!");
      getDownloadURL(snapshot.ref).then((url) => {
        updateUserByHandle(userData.handle, "avatarUrl", url);
      });
    });
  };

  return (
    <div className="upload-form">
      <h2>Upload a Photo</h2>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
      <button onClick={() => navigate(-1)}>Cancel</button>
    </div>
  );
};

export default UploadForm;
