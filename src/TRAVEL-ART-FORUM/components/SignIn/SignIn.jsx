import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../providers/AppContext";
import { useLocation, useNavigate } from "react-router-dom";
import { loginUser } from "../../services/auth.service";
import "./SignIn.css";

const SignIn = () => {
  const { user, setContext } = useContext(AppContext);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const location = useLocation();

  const updateForm = (prop) => (event) => {
    setForm({ ...form, [prop]: event.target.value });
  };

  useEffect(() => {
    if (user) {
      navigate(location.state?.from.pathname || "/");
    }
  }, [user]);

  const login = async () => {
    try {
      const credentials = await loginUser(form.email, form.password);
      setContext({ user: credentials.user, userData: null });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="container">
      <div className="form">
        <h2>Welcome</h2>
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
        <button onClick={login}>Sign in</button>
        <br />
        <a href="#">Forgot Password?</a>
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

export default SignIn;
