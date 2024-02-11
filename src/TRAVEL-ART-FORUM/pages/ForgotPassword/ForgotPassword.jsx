import { useState } from "react";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button/Button";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleCancel = () => navigate(-1);

  const handleResetPassword = async () => {
    if (!email) {
      setMessage("Please enter valid email address!");
      return;
    }

    const auth = getAuth();

    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("Check your email to reset your password");
    } catch (error) {
      setMessage(error.message);
    }
  };

  const updateEmail = (event) => {
    setEmail(event.target.value);
  };

  return (
    <div className="container">
      <div className="form">
        <h2>Reset Password</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={updateEmail}
        />
        <br />
        <Button handleClick={handleResetPassword}>Reset Password</Button>
        <br />
        <Button handleClick={handleCancel}>Cancel</Button>
        <p>{message}</p>
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

export default ForgotPassword;
