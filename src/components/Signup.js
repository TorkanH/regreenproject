import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "../components/Signup.css";

function Signup() {
  const history = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmPassword] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);
  const [usernameError, setUsernameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  async function submit(e) {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("username", username);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("confirmpassword", confirmpassword); 
      formData.append("profilePicture", profilePicture);

      // Send POST request to the server (replace 'http://localhost:5000/signup' with your server endpoint)
      const response = await axios.post(
        "http://localhost:5000/signup",
        formData
      );

      // Check the response from the server
      if (response.status === 201) {
        // Redirect to the profile page after successful signup
        history("/profile");
      } else {
        // Handle other cases, such as existing user or signup failure
        alert(response.data.error || "Signup failed");
      }
    } catch (error) {
      if (error.response && error.response.status === 409) {
        setEmailError("User with this email already exists");
      } else if (error.response && error.response.status === 400) {
        // Handle other validation errors, if needed
      } else {
        alert("Something went wrong");
        console.error(error);
      }
    }
  }

  return (
    <div className="signup">
      <h1>Signup</h1>

      <form action="/signup" method="post" enctype="multipart/form-data">
        <input
          type="text"
          name="username"
          onChange={(e) => {
            setUsername(e.target.value);
            setUsernameError("");
          }}
          placeholder="Username"
        />
        {/* ... (username error handling) */}
        <br />
        <input
          type="email"
          name="email"
          onChange={(e) => {
            setEmail(e.target.value);
            setEmailError("");
          }}
          placeholder="Email"
        />
        {/* ... (email error handling) */}
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
        {/* ... (password error handling) */}
        <br />
        <input
          type="password"
          name="confirmpassword"
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm Password"
        />
        <br />
        
        <input
          type="file"
          name="profilePicture"
          onChange={(e) => setProfilePicture(e.target.files[0])}
        />
        <br />
        <input value="Signup" type="submit" onClick={submit} />
        <p id="haveAccount">Already have an account?</p>
        <Link to="/login">Login</Link>
      </form>
    </div>
  );
}

export default Signup;