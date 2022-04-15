import React, { useState } from "react";
import "./Header.css";
import todo from "../../assets/img/todo.svg";
import settings from "../../assets/img/settings.svg";
import { Link } from "react-router-dom";
import Settings from "./Settings.js";

const Header = () => {
  const [toggleSettings, setToggleSettings] = useState(false);

  const showSettings = () => {
    setToggleSettings(!toggleSettings);
  };

  return (
    <header className="header">
      {localStorage.getItem("token") !== null ? (
        <Link to={"/"}>
          <img className="logo" src={todo} alt="To do ikon" />
        </Link>
      ) : (
        <img className="logo" src={todo} alt="To do ikon" />
      )}
      {localStorage.getItem("users_id") !== null && (
        <img
          onClick={showSettings}
          id="settingsIcon"
          src={settings}
          alt="Instillinger ikon"
        />
      )}
      {toggleSettings && <Settings showSettings={showSettings} />}
    </header>
  );
};

export default Header;
