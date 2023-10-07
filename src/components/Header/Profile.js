import React, { useState, useEffect, useCallback } from "react";
import { TailSpin } from "react-loader-spinner";
import axios from "axios";
import environment from "../../environment";
import cross from "../../assets/img/icons_v2/cross.svg";

const Profile = (props) => {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(false);

  const users_id = localStorage.getItem("users_id");

  useEffect(() => {
    setLoading(true);

    axios
      .get(`${environment[0]}/server/Users/Read.php?users_id=${users_id}`)
      .then((response) => {
        setUser(response.data.user);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
      });
  }, []);

  const hidePopup = useCallback(
    (event) => {
      const box = document.querySelector(".popup");

      if (
        event.target.id !== "settingsIcon" &&
        !event.target.classList.contains("cross") &&
        event.target.id !== "deleteProfile"
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
      <img
        src={cross}
        alt="lukned-knap"
        className="cross"
        onClick={props.handleProfile}
      />
      <h2>Profil</h2>
      {loading ? (
        <>
          <TailSpin color="#000000" height={40} width={40} />
        </>
      ) : (
        <>
          <div className="profileName infoContainer">
            <p>Navn</p>
            <p>{user.name}</p>
          </div>
          <div className="profileEmail infoContainer">
            <p>Email</p>
            <p>{user.email}</p>
          </div>
          <button
            id="deleteProfile"
            type="button"
            onClick={props.handleDeleteProfile}
          >
            Slet profil
          </button>
        </>
      )}
    </div>
  );
};
export default Profile;
