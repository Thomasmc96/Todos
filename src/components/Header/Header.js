import React from "react";
import "./Header.css";
import todo from "../../assets/img/todo.svg";
import settings from "../../assets/img/settings.svg";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="header">
      {localStorage.getItem("token") !== null ? (
        <Link to={"/"}>
          <img className="logo" src={todo} alt="To do ikon" />
        </Link>
      ) : (
        <img className="logo" src={todo} alt="To do ikon" />
      )}
      <img id="settingsIcon" src={settings} alt="Instillinger ikon" />
    </header>
  );
};

export default Header;
