import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../providers/AppContext";
import { updateUserByHandle } from "../../services/users.service";
import Button from "../../components/Button/Button";

const UpdateProfile = () => {
  const { userData, setContext } = useContext(AppContext);
  const [form, setForm] = useState({
    handle: userData.handle,
    firstName: userData.firstName,
    lastName: userData.lastName,
    email: userData.email,
  });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const updateForm = (prop) => (event) => {
    setForm({ ...form, [prop]: event.target.value });
  };

  const update = async () => {
    if (form.firstName.length < 4 || form.firstName.length > 32) {
      setMessage("First name must be between 4 and 32 symbols!");
      return;
    }

    if (form.lastName.length < 4 || form.lastName.length > 32) {
      setMessage("Last name must be between 4 and 32 symbols!");
      return;
    }

    if (form.firstName !== userData.firstName) {
      updateUserByHandle(userData.handle, "firstName", form.firstName)
        .then(setMessage("Profile updated!"))
        .catch(setMessage);

      setContext((prevContext) => {
        return {
          ...prevContext,
          userData: {
            ...prevContext.userData,
            firstName: form.firstName,
          },
        };
      });
    }

    if (form.lastName !== userData.lastName) {
      updateUserByHandle(userData.handle, "lastName", form.lastName)
        .then(setMessage("Profile updated!"))
        .catch(setMessage);

      setContext((prevContext) => {
        return {
          ...prevContext,
          userData: {
            ...prevContext.userData,
            lastName: form.lastName,
          },
        };
      });
    }
  };

  return (
    <div className="container">
      <div className="form">
        <h2>Update Profile</h2>
        <input type="text" value={form.handle} readOnly={true} />
        <br />
        <input type="email" value={form.email} readOnly={true} />
        <br />
        <input
          type="text"
          placeholder="First name"
          value={form.firstName}
          onChange={updateForm("firstName")}
        />
        <br />
        <input
          type="text"
          placeholder="Last name"
          value={form.lastName}
          onChange={updateForm("lastName")}
        />
        <p>{message}</p>
        <br />
        <Button handleClick={update}>Update</Button>
        <br />
        <Button handleClick={() => navigate("/")}>Go back</Button>
      </div>

      <div className="drops">
        <div className="drop drop-1"></div>
        <div className="drop drop-2"></div>
        <div className="drop drop-3"></div>
        <div className="drop drop-4"></div>
      </div>
    </div>
  );
};

export default UpdateProfile;
