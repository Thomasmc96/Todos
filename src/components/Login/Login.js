import React, { useState } from "react";
import "./Login.css";
import axios from "axios";
import { Redirect } from "react-router-dom";

const Login = () => {
  // State variables
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleEmail = (e) => {
    setEmail(e.target.value);
  };

  const handlePassword = (e) => {
    setPassword(e.target.value);
  };

  const submitLogin = (e) => {
    e.preventDefault();

    // API call
    axios
      .post("http://localhost:8000/server/users/login.php", {
        email: email,
        password: password,
      })
      .then(function (response) {
        console.log(response);
        // If response if good
        if (response.data.code === 200) {
          localStorage.setItem("token", response.data.jwt);
          localStorage.setItem("name", response.data.name);
          localStorage.setItem("users_id", response.data.id);
          window.location.replace("/");
        } else {
          // Show error message
          console.log("error");
        }
      })
      .catch(function (error) {
        // Another error message
        console.log(error);
      });
  };
  return (
    <div className="loginSection">
      <h1>Login for at komme igang</h1>
      <form className="loginForm" onSubmit={submitLogin} autoComplete="off">
        <label className="labels" htmlFor="email">
          Email
        </label>
        <input
          className="inputBoxLogin"
          type="email"
          name="email"
          value={email}
          onChange={handleEmail}
          required
        />
        <label className="labels" htmlFor="password">
          Adgangskode
        </label>
        <input
          className="inputBoxLogin"
          type="password"
          name="password"
          value={password}
          onChange={handlePassword}
          required
        />
        <a href="">
          <p>Ikke allerede bruger? Så opret dig her.</p>
        </a>
        <button type="Submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
