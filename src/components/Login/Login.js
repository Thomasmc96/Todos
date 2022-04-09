import React from "react";
import "./Login.css";

const Login = () => {
  const submitLogin = () => {
    console.log("Login");
  };
  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={submitLogin}>
        <label htmlFor="email">Email</label>
        <input type="email" name="email" required />
        <label htmlFor="password">Password</label>
        <input type="password" name="password" required />
        <button type="Submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
