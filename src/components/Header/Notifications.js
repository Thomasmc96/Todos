import React, { useEffect, useCallback } from "react";
import listIcon from "../../assets/img/small-list.svg";
import doneIcon from "../../assets/img/done.svg";
import notDoneIcon from "../../assets/img/not-done.svg";
import personIcon from "../../assets/img/shared-list.svg";

const Notifications = (props) => {
  const hideNotifications = useCallback(
    (event) => {
      const box = document.getElementById("notifications");

      if (event.target.id !== "notificationsIcon")
        if (!box.contains(event.target)) {
          props.showNotifications(false);
        }
    },
    [props]
  );

  useEffect(() => {
    window.addEventListener("click", hideNotifications);

    return () => {
      window.removeEventListener("click", hideNotifications);
    };
  }, [hideNotifications]);

  const acceptListInvitation = (lists_id) => {
    window.location.replace(
      `/join-list?users_id=${localStorage.getItem(
        "users_id"
      )}&lists_id=${lists_id}`
    );
  };

  return (
    <div className="notifications" id="notifications">
      {Array.isArray(props.notifications) &&
        props.notifications.length > 0 &&
        props.notifications.map((notification, i) => {
          const {
            type,
            created_date,
            products_name,
            created_by,
            lists_name,
            lists_id,
          } = notification;

          if (type === "list_invitation") {
            return (
              <div className="notification" key={i}>
                <h3>Invitation</h3>
                <span className="backgroundInfo statusDot"></span>
                <p className="created_date">{created_date}</p>
                <p className="invitationInfo">
                  {created_by} inviterede dig til listen: <b>{lists_name}</b>
                </p>
                <button
                  className="button acceptBtn"
                  onClick={() => acceptListInvitation(lists_id)}
                >
                  Acceptér
                </button>
              </div>
            );
          }
          return (
            <div className="notification" key={i}>
              {type === "complete" && (
                <React.Fragment>
                  <h3>Udført opgave</h3>
                  <span className="backgroundSuccess statusDot"></span>
                </React.Fragment>
              )}
              {type === "create" && (
                <React.Fragment>
                  <h3>Ny opgave</h3>
                  <span className="backgroundInfo statusDot"></span>
                </React.Fragment>
              )}
              {type === "update" && (
                <React.Fragment>
                  <h3>Rettet opgave</h3>
                  <span className="backgroundInfo statusDot"></span>
                </React.Fragment>
              )}
              <p className="created_date">{created_date}</p>
              <div className="item">
                <img src={listIcon} alt="Liste ikon"></img>
                <p>{lists_name}</p>
              </div>
              <div className="item">
                {type === "complete" && (
                  <img src={doneIcon} alt="Opgave ikon"></img>
                )}
                {type === "create" && (
                  <img src={notDoneIcon} alt="Opgave ikon"></img>
                )}
                {type === "update" && (
                  <img src={notDoneIcon} alt="Opgave ikon"></img>
                )}
                <p>{products_name}</p>
              </div>
              <div className="item">
                <img src={personIcon} alt="Person ikon"></img>
                <p>{created_by}</p>
              </div>
            </div>
          );
        })}
      {Array.isArray(props.notifications) &&
        props.notifications.length === 0 && (
          <p className="emptyMessage">Ingen notifikationer</p>
        )}
    </div>
  );
};
export default Notifications;
