import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../providers/AppContext";
import {
  createUserHandle,
  getUserByHandle,
} from "../../services/users.service";
import { registerUser } from "../../services/auth.service";
import Button from "../../components/Button/Button";
import "./SignUp.css";

// import { db } from "../../config/firebase-config";
// import { getStorage, ref, deleteObject } from "firebase/storage";

const SignUp = () => {
  const { setContext } = useContext(AppContext);
  const [form, setForm] = useState({
    handle: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    isAdmin: false,
    isBanned: false
  });

  // const storage = getStorage();
  // const userDelete = ref(storage, 'users/test');
  // deleteObject(userDelete)
  //   .then(console.log('SUCCESS'))

  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const updateForm = (prop) => (event) => {
    setForm({ ...form, [prop]: event.target.value });
  };

  const register = async () => {
    if (form.firstName.length < 4 || form.firstName.length > 32) {
      setMessage("First name must be between 4 and 32 symbols!");
      return;
    }

    if (form.lastName.length < 4 || form.lastName.length > 32) {
      setMessage("Last name must be between 4 and 32 symbols!");
      return;
    }

    // TODO: Validate if email exist in the system and is valid!

    try {
      const user = await getUserByHandle(form.handle);
      if (user.exists()) {
        setMessage(`Handle @${form.handle} already exists`);
        return;
      }

      const credentials = await registerUser(form.email, form.password);
      await createUserHandle(
        credentials.user.uid,
        form.handle,
        form.firstName,
        form.lastName,
        form.email,
        form.isAdmin,
        form.isBanned
      );

      setContext({ user, userData: null });
      navigate("/");
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <div className="container">
      <div className="form">
        <h2>Sign Up</h2>
        <input
          type="text"
          placeholder="username"
          value={form.handle}
          onChange={updateForm("handle")}
        />
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
        <br />
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={updateForm("email")}
        />
        <br />
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={updateForm("password")}
        />
        <p>{message}</p>
        <br />
        <Button handleClick={register}>Sign up</Button>
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

export default SignUp;
