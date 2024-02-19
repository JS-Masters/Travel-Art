import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../providers/AppContext";
import { storage } from "../../config/firebase-config";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 } from "uuid";
import { updateUserByHandle } from "../../services/users.service";
import Button from "../../components/Button/Button";

const UploadForm = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [message, setMessage] = useState("");
  const { userData } = useContext(AppContext);
  const navigate = useNavigate();

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = () => {
    if (selectedFile === null) {
      setMessage("Please select a file!");
      return;
    }

    const fileRef = ref(
      storage,
      `${userData?.handle}/${selectedFile.name + v4()}`
    );

    uploadBytes(fileRef, selectedFile)
      .then((snapshot) => {
        getDownloadURL(snapshot.ref)
          .then((url) => {
            updateUserByHandle(userData.handle, "avatarUrl", url);
            setMessage("Image uploaded!");
          })
          .catch((error) => setMessage(error.message));
      })
      .catch((error) => setMessage(error.message));
  };

  return (
    <div className="container">
      <div className="form">
        <h2>Upload a Photo</h2>
        <input type="file" onChange={handleFileChange} />
        <br />
        <h3>{message}</h3>
        <br />
        <Button handleClick={handleUpload}>Upload</Button>
        <br />
        <Button handleClick={() => navigate(-1)}>Cancel</Button>
      </div>

      <div className="drops">
        <div className="drop drop-1"></div>
        <div className="drop drop-2"></div>
        <div className="drop drop-3"></div>
        <div className="drop drop-4"></div>
        <div className="drop drop-5"></div>
      </div>
    </div>
  );
};

export default UploadForm;
