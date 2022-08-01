import React, { useState } from "react";
import "./SignUp.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const SignUp = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswordError, setShowPasswordError] = useState(false);
  const [checkboxValue, setCheckboxValue] = useState(false);
  const [showCheckboxError, setShowCheckboxError] = useState(false);
  const [showEmailError, setShowEmailError] = useState(false);

  const handleName = (e) => {
    setName(e.target.value);
  };

  const handleEmail = (e) => {
    setEmail(e.target.value);
    setShowEmailError(false)
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

  const redirect = (e) => {
    navigate("/login");
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

    // API call
    axios
      .post("http://localhost:8000/server/users/create.php", {
        name: name,
        email: email,
        password: password,
      })
      .then(function (response) {
        console.log(response);
        // If response is good
        if (response.data.code === 200) {
          localStorage.setItem("token", response.data.jwt);
          localStorage.setItem("name", response.data.name);
          localStorage.setItem("users_id", response.data.id);
          window.location.replace("/");
        } else if (response.data.message.errorInfo[0] == "23000"){
          // Show error message
         setShowEmailError(true)
        }
      })
      .catch(function (error) {
        // Another error message
        console.log(error);
      });
  };
  return (
    <div className="signUpSection">
      <h1>Opret dig her</h1>
      <form className="signUpForm" onSubmit={submitLogin} autoComplete="off">
        <label className="labels" htmlFor="name">Navn</label>
        <input placeholder="Navn" onChange={handleName} className="inputBoxSignUp" type="name" name="name" required />
        <label className="labels" htmlFor="email">Email</label>
        <input placeholder="Email" onChange={handleEmail} className="inputBoxSignUp" type="email" name="email" required />
        {showEmailError && (
          <p id="
          ">Emailen er allerede i brug - prøv igen!</p>
        )}
        <label className="labels" htmlFor="password">Adgangskode</label>
        <input placeholder="Adgangskode" onChange={handlePassword} className="inputBoxSignUp" type="password" name="password" required />
        <label className="labels" htmlFor="password">Gentag adgangskode</label>
        <input placeholder="Gentag adgangskode" onChange={handleConfirmPassword} className="inputBoxSignUp" type="password" name="password" required />
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
          <a>  Klik her for at acceptere vores vilkår</a>{" "}
          </label>
        </div>
        {showCheckboxError && (
          <p id="checkboxError">Husk at acceptere vilkårene - prøv igen!</p>
        )}
        <div id="btnContainer">
          <button type="button" onClick={redirect}>
            Tilbage
          </button>
          <button type="Submit">Opret</button>
        </div>
      </form>
    </div>
  );
};

export default SignUp;
