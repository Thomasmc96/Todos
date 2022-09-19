import React, { useState } from "react";
import environment from "../../environment";
import InstallPWAButton from "../Utilities/InstallPWAButton";
import DeleteProfile from "./DeleteProfile";

const Settings = (props) => {

  const [showDeleteProfile, setShowDeleteProfile] = useState(false);

  const logout = () => {
    localStorage.removeItem("users_id");
    localStorage.removeItem("name");
    localStorage.removeItem("token");
    window.location.replace("/login");
  };

  const handleDeleteProfile = () => {
    setShowDeleteProfile(!showDeleteProfile);
  }

  const version = environment[1];

  return (
    <div className="settings">
      <span className="cross" onClick={props.showSettings}>x</span>
      <h2>Indstillinger</h2>
      <div>
        <InstallPWAButton />
        {/* <button type="button" onClick={props.showSettings}>
          Tilbage
        </button> */}
        <button id="logOut" type="submit" onClick={logout}>
          Log ud
        </button>
        <button id="deleteProfile" type="button" onClick={handleDeleteProfile}>
          Slet profil
        </button>
      </div>
      <p className="version">v. {version}</p>

      {showDeleteProfile && <DeleteProfile handleDeleteProfile={handleDeleteProfile} />}
    </div>
  );
};
export default Settings;
