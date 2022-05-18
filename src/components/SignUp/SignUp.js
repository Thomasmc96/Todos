import React, { useState } from "react";
import "./SignUp.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import environment from "../../environment";
import { TailSpin } from "react-loader-spinner";

const SignUp = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswordError, setShowPasswordError] = useState(false);
  const [checkboxValue, setCheckboxValue] = useState(false);
  const [showCheckboxError, setShowCheckboxError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleName = (e) => {
    setName(e.target.value);
  };

  const handleEmail = (e) => {
    setEmail(e.target.value);
  };

  const handlePassword = (e) => {
    setPassword(e.target.value);
    setShowPasswordError(false);
  };

  const handleConfirmPassword = (e) => {
    setConfirmPassword(e.target.value);
    setShowPasswordError(false);
  };

  const handleCheckboxValue = (e) => {
    setCheckboxValue(!checkboxValue);
    setShowCheckboxError(false);
  };

  const redirect = (path) => {
    navigate(path);
  };

  const submitLogin = (e) => {
    e.preventDefault();

    // Make sure password are identical
    if (password !== confirmPassword) {
      setShowPasswordError(true);
      return;
    }
    // Make sure checkbox is checked
    if (!checkboxValue) {
      setShowCheckboxError(true);
      return;
    }

    setLoading(true);
    // API call
    axios
      .post(`${environment[0]}/server/Users/Create.php`, {
        name: name,
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
        }
      })
      .catch(function (error) {
        // Another error message
        console.log(error);
        setLoading(false);
      });
  };
  return (
    <div className="signUpSection">
      <h1>Opret dig her</h1>
      <form className="signUpForm" onSubmit={submitLogin} autoComplete="off">
        <label className="labels" htmlFor="name">
          Navn
        </label>
        <input
          onChange={handleName}
          className="inputBoxSignUp"
          type="name"
          name="name"
          required
        />
        <label className="labels" htmlFor="email">
          Email
        </label>
        <input
          onChange={handleEmail}
          className="inputBoxSignUp"
          type="email"
          name="email"
          required
        />
        <label className="labels" htmlFor="password">
          Adgangskode
        </label>
        <input
          onChange={handlePassword}
          className="inputBoxSignUp"
          type="password"
          name="password"
          required
        />
        <label className="labels" htmlFor="password">
          Gentag adgangskode
        </label>
        <input
          onChange={handleConfirmPassword}
          className="inputBoxSignUp"
          type="password"
          name="password"
          required
        />
        {showPasswordError && (
          <p id="passwordError">Adgangskoderne er ikke ens - prøv igen!</p>
        )}
        <div id="checkboxContainer">
          <input
            id="checkbox"
            type="checkbox"
            name="acceptCheckbox"
            value={checkboxValue}
            onChange={handleCheckboxValue}
          />
          <label htmlFor="acceptChechbox">
            Klik her for at acceptere vores <a href="">vilkår</a>{" "}
          </label>
        </div>
        {showCheckboxError && (
          <p id="checkboxError">Husk at acceptere vilkårene - prøv igen!</p>
        )}

        <div id="btnContainer">
          {loading ? (
            <div className="loading">
              <TailSpin color="#000000" height={40} width={40} />
            </div>
          ) : (
            <React.Fragment>
              <button type="button" onClick={() => redirect("/login")}>
                Tilbage
              </button>
              <button type="Submit">Opret</button>
            </React.Fragment>
          )}
        </div>
      </form>
    </div>
  );
};

export default SignUp;
