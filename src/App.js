import "./App.css";
import React, { useEffect } from "react";
import axios from "axios";
import environment from "../src/environment";

// Import routing components
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Import own components
import Frontpage from "./components/Frontpage/Frontpage";
import Header from "./components/Header/Header";
import List from "./components/List/List";
import JoinList from "./components/List/JoinList";
import Login from "./components/Login/Login";
import SignUp from "./components/SignUp/SignUp";
import NotFound from "./components/NotFound/NotFound";
import PrivacyPolicy from "./components/PrivacyPolicy/PrivacyPolicy";
import HideWeb from "./components/Utilities/HideWeb";

const App = () => {
  // Paths where we don't want to redirect if user isn't logged in
  const nonAuthPaths = ["/login", "/signup", "/privatlivspolitik"];

  useEffect(() => {
    let theme = localStorage.getItem("theme");
    if (theme !== null) {
      document.body.className = theme;
    }

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
          `${environment[0]}/server/Users/Verify.php`,
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
        <Route path="/join-list" element={<JoinList />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/privatlivspolitik" element={<PrivacyPolicy />} />
      </Routes>
      <HideWeb />
    </Router>
  );
};

export default App;
