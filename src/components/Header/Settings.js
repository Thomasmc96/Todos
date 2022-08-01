import React from "react";
import environment from "../../environment";

const Settings = (props) => {
  const logout = () => {
    localStorage.removeItem("users_id");
    localStorage.removeItem("name");
    localStorage.removeItem("token");
    window.location.replace("/login");
  };

  const version = environment[1];

  return (
    <div className="settings">
      <props.InstallPWAButton />
      <h2>Vil du logge ud?</h2>
      <div>
        <button type="button" onClick={props.showSettings}>
          Tilbage
        </button>
        <button id="logOut" type="submit" onClick={logout}>
          Log ud
        </button>
      </div>
      <p className="version">v. {version}</p>
    </div>
  );
};
export default Settings;
