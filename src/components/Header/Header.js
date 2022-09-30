import React, { useState } from "react";
import "./Header.css";
import todo from "../../assets/img/todos.svg";
import settings from "../../assets/img/settings.svg";
import { Link } from "react-router-dom";
import Settings from "./Settings.js";
import Notifications from './Notifications.js';
import InstallPWAButton from "../Utilities/InstallPWAButton";
import DeleteProfile from "./DeleteProfile";

const Header = () => {
  const [toggleSettings, setToggleSettings] = useState(false);
  const [toggleNotifications, setToggleNotifications] = useState(false);
  const [showDeleteProfile, setShowDeleteProfile] = useState(false);

  const showNotifications = () => {
    setToggleNotifications(!toggleNotifications);
  };
  const showSettings = () => {
    setToggleSettings(!toggleSettings);
  };
  const handleDeleteProfile = () => {
    setShowDeleteProfile(!showDeleteProfile);
  }


  return (
    <header className="header">
      {localStorage.getItem("token") !== null ? (
        <Link to={"/"}>
          <img className="logo" src={todo} alt="To do ikon" />
        </Link>
      ) : (
        <Link to={"/login"}>
          <img className="logo" src={todo} alt="To do ikon" />
        </Link>
      )}
      {localStorage.getItem("users_id") !== null ? (
        <div className="headerIcons">
          <div className="notificationContainer">

            <img
              onClick={showNotifications}
              class="icon"
              src={settings}
              alt="Notifikationer ikon"
            />
            {toggleNotifications && (
              <Notifications
                showNotifications={showNotifications}
              />
            )}
          </div>
          <img
            onClick={showSettings}
            class="icon"
            src={settings}
            alt="Instillinger ikon"
          />
        </div>

      ) : (
        <InstallPWAButton />
      )}
      {toggleSettings && (
        <Settings
          showSettings={showSettings}
          InstallPWAButton={InstallPWAButton}
          handleDeleteProfile={handleDeleteProfile}
        />
      )}
      {showDeleteProfile && <DeleteProfile handleDeleteProfile={handleDeleteProfile} />}

    </header>
  );
};

export default Header;
