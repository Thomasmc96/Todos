import "./App.css";
import React, { useEffect, useState } from "react";
import axios from "axios";

// Import routing components
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Import own components
import Frontpage from "./components/Frontpage/Frontpage";
import Header from "./components/Header/Header";
import List from "./components/List/List";
import Login from "./components/Login/Login";
import SignUp from "./components/SignUp/SignUp";

const App = () => {
  const [validToken, setValidToken] = useState(false);

  useEffect(() => {
    var token = localStorage.getItem("token");

    if (token === null) {
      if (window.location.pathname !== "/login") {
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
          console.log(response);
          // If response if good
          if (response.data.code === 200) {
            setValidToken(true);
            console.log("success");
          } else {
            if (window.location.pathname !== "/login") {
              window.location.replace("/login");
            }
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
