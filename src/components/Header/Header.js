import React, { useState, useEffect } from "react";
import "./Header.css";
import axios from "axios";
import environment from "../../environment";
import { Link } from "react-router-dom";
import todo from "../../assets/img/todos.svg";
import settings from "../../assets/img/settings.svg";
import Settings from "./Settings.js";
import Notifications from "./Notifications.js";
import InstallPWAButton from "../Utilities/InstallPWAButton";
import DeleteProfile from "./DeleteProfile";

const Header = () => {
  const [toggleSettings, setToggleSettings] = useState(false);
  const [toggleNotifications, setToggleNotifications] = useState(false);
  const [showDeleteProfile, setShowDeleteProfile] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [notificationsNotSeen, setNotificationsNotSeen] = useState(0);

  const users_id = localStorage.getItem("users_id");

  useEffect(() => {
    axios(
      `${environment[0]}/server/Notifications/Read.php?users_id=${users_id}`
    )
      .then((result) => {
        if (result.data.code === 200) {
          // Save data to state
          setNotifications(result.data.notifications);
          let notSeenAmount = 0;
          for (let i = 0; i < result.data.notifications.length; i++) {
            if (result.data.notifications[i].seen_by_user == "0") {
              notSeenAmount++;
            }
            setNotificationsNotSeen(notSeenAmount);
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

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
  };

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
          {/* <div className="notificationContainer"> */}

          <div className="iconContainer">
            <img
              onClick={showNotifications}
              className="icon"
              id="notificationsIcon"
              src={settings}
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
          {/* </div> */}
          <div className="iconContainer">
            <img
              onClick={showSettings}
              className="icon"
              src={settings}
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
          handleDeleteProfile={handleDeleteProfile}
        />
      )}
      {showDeleteProfile && (
        <DeleteProfile handleDeleteProfile={handleDeleteProfile} />
      )}
    </header>
  );
};

export default Header;
