import React, { useState, useEffect, useCallback } from "react";
import { TailSpin } from "react-loader-spinner";

const Profile = (props) => {
  const [loading, setLoading] = useState(false);

  const hidePopup = useCallback(
    (event) => {
      const box = document.querySelector(".popup");

      if (
        event.target.id !== "settingsIcon" &&
        !event.target.classList.contains("cross")
      ) {
        if (!box.contains(event.target)) {
          props.handleProfile();
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

  return (
    <div className="profile popup">
      <span className="cross" onClick={props.handleProfile}>
        x
      </span>
      <h2>Profil</h2>
      <div className="profileName infoContainer">
        <p>Navn</p>
        <p>Thomas Marcu Christensen</p>
      </div>
      <div className="profileEmail infoContainer">
        <p>Email</p>
        <p>admin@admind.dk</p>
      </div>
    </div>
  );
};
export default Profile;
