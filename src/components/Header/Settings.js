import React, { useState, useEffect, useCallback } from "react";
import environment from "../../environment";
import InstallPWAButton from "../Utilities/InstallPWAButton";
import cross from "../../assets/img/icons_v2/cross.svg";

const Settings = (props) => {
  const [useDarkMode, setUseDarkMode] = useState(
    localStorage.getItem("theme") === "dark" ? true : false
  );

  const handleDarkMode = () => {
    setUseDarkMode(!useDarkMode);

    localStorage.setItem("theme", !useDarkMode ? "dark" : "light");
  };

  const logout = () => {
    localStorage.setItem("theme", "light");
    localStorage.removeItem("users_id");
    localStorage.removeItem("name");
    localStorage.removeItem("token");
    window.location.replace("/login");
  };

  const hidePopup = useCallback(
    (event) => {
      const box = document.querySelector(".popup");

      if (
        event.target.id !== "settingsIcon" &&
        !event.target.classList.contains("cross")
      ) {
        if (!box.contains(event.target)) {
          props.showSettings(false);
        }
      }
    },
    [props]
  );

  useEffect(() => {
    let theme = localStorage.getItem("theme");
    if (theme !== null) {
      document.body.className = theme;
    }

    window.addEventListener("click", hidePopup);

    return () => {
      window.removeEventListener("click", hidePopup);
    };
  }, [hidePopup, useDarkMode]);

  const version = environment[1];

  return (
    <div className="settings popup">
      <img
        src={cross}
        alt="lukned-knap"
        className="cross"
        onClick={props.showSettings}
      />
      <h2>Indstillinger</h2>
      <div className="darkModeToggleContainer">
        <label className="switch">
          <input
            type="checkbox"
            name="switch"
            checked={useDarkMode}
            onChange={handleDarkMode}
          />
          <span className="slider round"></span>
        </label>
      </div>
      <div>
        <InstallPWAButton />
        <button
          className="profileBtn"
          type="button"
          onClick={props.handleProfile}
        >
          Min profil
        </button>
        <button id="logOut" className="danger" type="button" onClick={logout}>
          Log ud
        </button>
      </div>
      <p className="version">v. {version}</p>
    </div>
  );
};
export default Settings;
