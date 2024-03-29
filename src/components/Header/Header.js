import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Header.css";
import axios from "axios";
import environment from "../../environment";
import todo from "../../assets/img/todos.svg";
import settingsIcon from "../../assets/img/icons_v2/settings.svg";
import notificationsIcon from "../../assets/img/icons_v2/notification.svg";
import Settings from "./Settings.js";
import Notifications from "./Notifications.js";
import InstallPWAButton from "../Utilities/InstallPWAButton";
import DeleteProfile from "./DeleteProfile";
import Profile from "./Profile";
import newLogo from "../../assets/img/round-logo.svg";

const Header = () => {
  const [toggleSettings, setToggleSettings] = useState(false);
  const [toggleNotifications, setToggleNotifications] = useState(false);
  const [showDeleteProfile, setShowDeleteProfile] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [notificationsNotSeen, setNotificationsNotSeen] = useState(0);

  const users_id = localStorage.getItem("users_id");

  useEffect(() => {
    const getNotifications = () => {
      if (users_id !== null) {
        axios(
          `${environment[0]}/server/Notifications/Read.php?users_id=${users_id}`
        )
          .then((result) => {
            if (result.data.code === 200) {
              // Save data to state
              setNotifications(result.data.notifications);
              let notSeenAmount = 0;
              for (let i = 0; i < result.data.notifications.length; i++) {
                if (result.data.notifications[i].seen_by_user === "0") {
                  notSeenAmount++;
                }
                setNotificationsNotSeen(notSeenAmount);
              }
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }
    };

    // Call when mounting
    getNotifications();

    // Get notifications live
    const interval = setInterval(() => {
      getNotifications();
    }, 5000); // 5 sec

    return () => clearInterval(interval);
  }, [users_id]);

  const showNotifications = () => {
    setToggleNotifications(!toggleNotifications);

    if (notificationsNotSeen > 0) {
      axios(
        `${environment[0]}/server/Notifications/Update.php?users_id=${users_id}`
      )
        .then((result) => {
          if (result.data.code === 200) {
            // Save data to state
            setNotificationsNotSeen(0);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const showSettings = () => {
    setToggleSettings(!toggleSettings);
  };

  const handleDeleteProfile = () => {
    setShowDeleteProfile(!showDeleteProfile);
    setShowProfile(!showProfile);
  };

  const handleProfile = () => {
    setShowProfile(!showProfile);
    showSettings();
  };

  return (
    <header className="header">
      {localStorage.getItem("token") !== null ? (
        <Link to={"/"}>
          <img className="logo" src={newLogo} alt="To do ikon" />
        </Link>
      ) : (
        <Link to={"/login"}>
          <img className="logo" src={newLogo} alt="To do ikon" />
        </Link>
      )}
      {localStorage.getItem("users_id") !== null ? (
        <div className="headerIcons">
          <div className="iconContainer">
            <img
              onClick={showNotifications}
              className="icon"
              id="notificationsIcon"
              src={notificationsIcon}
              alt="Notifikationer ikon"
            />
            {notificationsNotSeen > 0 && (
              <span className="badge">{notificationsNotSeen}</span>
            )}
          </div>
          {toggleNotifications && (
            <Notifications
              showNotifications={showNotifications}
              notifications={notifications}
            />
          )}
          <div className="iconContainer">
            <img
              onClick={showSettings}
              className="icon"
              id="settingsIcon"
              src={settingsIcon}
              alt="Instillinger ikon"
            />
          </div>
        </div>
      ) : (
        <InstallPWAButton />
      )}
      {toggleSettings && (
        <Settings
          showSettings={showSettings}
          InstallPWAButton={InstallPWAButton}
          handleProfile={handleProfile}
        />
      )}
      {showDeleteProfile && (
        <DeleteProfile handleDeleteProfile={handleDeleteProfile} />
      )}
      {showProfile && (
        <Profile
          handleProfile={handleProfile}
          handleDeleteProfile={handleDeleteProfile}
        />
      )}
    </header>
  );
};

export default Header;
