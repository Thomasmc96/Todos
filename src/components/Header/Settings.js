import React from "react";
import environment from "../../environment";
import InstallPWAButton from "../Utilities/InstallPWAButton";

const Settings = (props) => {

  const logout = () => {
    localStorage.removeItem("users_id");
    localStorage.removeItem("name");
    localStorage.removeItem("token");
    window.location.replace("/login");
  };

  const version = environment[1];

  return (
    <div className="settings popup">
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
        <button id="deleteProfile" type="button" onClick={props.handleDeleteProfile}>
          Slet profil
        </button>
      </div>
      <p className="version">v. {version}</p>

      {/* {showDeleteProfile && <DeleteProfile handleDeleteProfile={handleDeleteProfile} />} */}
    </div>
  );
};
export default Settings;
