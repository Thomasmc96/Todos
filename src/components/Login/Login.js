import React, { useState } from "react";
import "./Login.css";
import axios from "axios";
import { Link } from "react-router-dom";
import environment from "../../environment";
import { TailSpin } from "react-loader-spinner";

const Login = () => {
  // State variables
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showLoginError, setShowLoginError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleEmail = (e) => {
    setEmail(e.target.value);
    setShowLoginError(false);
  };

  const handlePassword = (e) => {
    setPassword(e.target.value);
    setShowLoginError(false);
  };

  const submitLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    // API call
    axios
      .post(`${environment[0]}/server/Users/Login.php`, {
        email: email,
        password: password,
      })
      .then(function (response) {
        setLoading(false);

        console.log(response);
        // If response if good
        if (response.data.code === 200) {
          localStorage.setItem("token", response.data.jwt);
          localStorage.setItem("name", response.data.name);
          localStorage.setItem("users_id", response.data.id);
          window.location.replace("/");
        } else {
          // Show error message
          setShowLoginError(true);
        }
      })
      .catch(function (error) {
        // Another error message
        console.log(error);
        setLoading(false);
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
        <Link to={"/signup"}>
          <p className="pTags">Ikke allerede bruger? Så opret dig her.</p>
        </Link>
        {showLoginError && (
          <p className="pTags" id="loginError">
            En af de indtastede værdier er forkerte - prøv igen!
          </p>
        )}
        {loading ? (
          <div className="loading">
            <TailSpin color="#000000" height={40} width={40} />
          </div>
        ) : (
          <button type="Submit">Login</button>
        )}
      </form>
    </div>
  );
};

export default Login;
