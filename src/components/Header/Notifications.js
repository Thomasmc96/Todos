import React from "react";
import listIcon from "../../assets/img/small-list.svg";
import doneIcon from "../../assets/img/done.svg";
import notDoneIcon from "../../assets/img/not-done.svg";
import personIcon from "../../assets/img/shared-list.svg";

const Notifications = (props) => {
  return (
    <div className="notifications">
      {/* <h2>Notifikationer</h2> */}
      {Array.isArray(props.notifications) &&
        props.notifications.length > 0 &&
        props.notifications.map((notification, i) => {
          const {
            type,
            seen_by_user,
            created_date,
            products_name,
            created_by,
            lists_name,
          } = notification;
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
    </div>
  );
};
export default Notifications;
