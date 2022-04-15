import "./App.css";
import React, { useEffect, useState } from "react";
import axios from "axios";

// Import routing components
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

// Import own components
import Frontpage from "./components/Frontpage/Frontpage";
import Header from "./components/Header/Header";
import List from "./components/List/List";
import Login from "./components/Login/Login";
import SignUp from "./components/SignUp/SignUp";

const App = () => {
  // Paths where we don't want to redirect if user isn't logged in
  const nonAuthPaths = ["/login", "/signup"];

  useEffect(() => {
    var token = localStorage.getItem("token");

    if (token === null) {
      if (!nonAuthPaths.includes(window.location.pathname)) {
        localStorage.removeItem("users_id");
        localStorage.removeItem("name");
        localStorage.removeItem("token");
        window.location.replace("/login");
      }
    } else {
      const headers = {
        "Content-Type": "application/json",
        Authorization: token,
      };
      // API call
      axios
        .post(
          "http://localhost:8000/server/users/verify.php",
          {},
          {
            headers: headers,
          }
        )
        .then(function (response) {
          // If response is good
          if (
            !response.data.code === 200 &&
            !nonAuthPaths.includes(window.location.pathname)
          ) {
            localStorage.removeItem("users_id");
            localStorage.removeItem("name");
            localStorage.removeItem("token");
            window.location.replace("/login");
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  }, []);

  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Frontpage />} />
        <Route path="/list/:id" element={<List />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </Router>
  );
};

export default App;
