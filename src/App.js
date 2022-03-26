import "./App.css";
import React from "react";

// Import routing components
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Import own components
import Frontpage from "./components/Frontpage/Frontpage";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";

//test

const App = () => {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Frontpage />} />
      </Routes>
      <Footer />
    </Router>
  );
};

export default App;
