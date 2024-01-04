import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "../components/Login.css";

 // Email validation function
 const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Password validation function
const validatePassword = (password) => {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  if (!passwordRegex.test(password)) {
    return "Password must be at least 8 characters long, including one uppercase letter, one lowercase letter, one numeric digit, and one special character.";
  }

  return "valid";
};


function Login() {
    //useNavigate navigates between pages in react-router
  const history = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  async function submit(e) {
    e.preventDefault();

    // Validate email
    if (!isValidEmail(email)) {
      setEmailError("Please enter a valid email");
      return;
    }

        // Validate password
    const passwordValidationResult = validatePassword(password);
    if (passwordValidationResult !== "valid") {
      setPasswordError(passwordValidationResult);
      return;
    }

    try {
      await axios.post("http://localhost:5000/", {
        email,
        password,
      });

      history("/profile", { state: { id: email } });
    } catch (error) {
      alert("Something went wrong");
      console.error(error);
    }

  }
  
  
  return (
    <div className="login">
      <h1>Login</h1>

      <form action="POST">
        <input
          type="email"
          name="email"
          onChange={(e) => {
            setEmail(e.target.value);
            setEmailError("");
          }}
          placeholder="Email"
        />
        {emailError && <p className="error">{emailError}</p>}
        <br />
        <input
          type="password"
          name="password"
          onChange={(e) => {
            setPassword(e.target.value);
            setPasswordError("");
          }}
          placeholder="Password"
        />
        {passwordError && <p className="error">{passwordError}</p>}
        <br />
        <p id="forgotpass">Forgot password?</p>
        <input value="Login" type="submit" onClick={submit} />
        <p id="noaccount">Dont have an account?</p>
        <Link to="/signup">Signup</Link>
      </form>
    </div>
  );
}

export default Login;
