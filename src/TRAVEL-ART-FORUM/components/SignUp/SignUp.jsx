import { useContext, useState } from "react";
import { AppContext } from "../../providers/AppContext";
import "./SignUp.css";
import { useNavigate } from "react-router-dom";
import {
  createUserHandle,
  getUserByHandle,
} from "../../services/users.service";
import { registerUser } from "../../services/auth.service";

const SignUp = () => {
  const { setContext } = useContext(AppContext);
  const [form, setForm] = useState({
    handle: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const updateForm = (prop) => (event) => {
    setForm({ ...form, [prop]: event.target.value });
  };

  const register = async () => {
    if (form.firstName.length < 4 || form.firstName.length > 32) {
      alert("First name must be between 4 and 32 symbols!");
      return;
    }

    if (form.lastName.length < 4 || form.lastName.length > 32) {
      alert("Last name must be between 4 and 32 symbols!");
      return;
    }

    // TODO: Validate if email exist in the system and is valid!

    try {
      const user = await getUserByHandle(form.handle);
      if (user.exists()) {
        return console.log(`Handle @${form.handle} already exists`);
      }

      const credentials = await registerUser(form.email, form.password);
      await createUserHandle(
        credentials.user.uid,
        form.handle,
        form.firstName,
        form.lastName,
        form.email
      );

      setContext({ user, userData: null });
      navigate("/");
    } catch (error) {
      console.log(error.message);
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
        <br />
        <button onClick={register}>Sign up</button>
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
