import React, { useEffect, useCallback } from "react";
import environment from "../../environment";
import InstallPWAButton from "../Utilities/InstallPWAButton";

const Settings = (props) => {
  const logout = () => {
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
    window.addEventListener("click", hidePopup);

    return () => {
      window.removeEventListener("click", hidePopup);
    };
  }, [hidePopup]);

  const version = environment[1];

  return (
    <div className="settings popup">
      <span className="cross" onClick={props.showSettings}>
        x
      </span>
      <h2>Indstillinger</h2>
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
        {/* <button
          id="deleteProfile"
          type="button"
          onClick={props.handleDeleteProfile}
        >
          Slet profil
        </button> */}
      </div>
      <p className="version">v. {version}</p>
    </div>
  );
};
export default Settings;
