import React, { useState, useEffect, useCallback } from "react";
import { TailSpin } from "react-loader-spinner";
import axios from "axios";
import environment from "../../environment";

const Profile = (props) => {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(false);

  const users_id = localStorage.getItem('users_id')

  useEffect(() => {
    setLoading(true);

    axios.get(`${environment[0]}/server/Users/Read.php?users_id=${users_id}`)
    .then((response) => {
      console.log(response)
    }).catch((error) => {
      console.log(error)
    })
  }, [])

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
