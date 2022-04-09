import React from "react";
import "./Login.css";

const Login = () => {
  const submitLogin = () => {
    console.log("Login");
  };
  return (
    <div className="loginSection">
      <h1>Login for at komme igang</h1>
      <form className="loginForm" onSubmit={submitLogin}>
        <label className="labels" htmlFor="email">Email</label>
        <input className="inputBoxLogin" type="email" name="email" required />
        <label className="labels" htmlFor="password">Password</label>
        <input className="inputBoxLogin" type="password" name="password" required />
        <a href=""><p>Ikke allerede bruger? Så opret dig her.</p></a>
        <button type="Submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
