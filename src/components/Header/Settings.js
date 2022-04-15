import React, { useState } from "react";

const Settings = (props) => {
  const logout = () => {
    localStorage.removeItem("users_id");
    localStorage.removeItem("name");
    localStorage.removeItem("token");
    window.location.replace("/login");
  };

  return (
    <div className="settings">
      <h2>Vil du logge ud?</h2>
      <div>
        <button type="button" onClick={props.showSettings}>
          Tilbage
        </button>
        <button id="logOut" type="submit" onClick={logout}>
          Log ud
        </button>
      </div>
    </div>
  );
};
export default Settings;
